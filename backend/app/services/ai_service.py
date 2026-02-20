from typing import Optional, List, Any, Sequence, Dict
import json
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from openai import AsyncOpenAI
from huggingface_hub import InferenceClient

from app.core.config import settings
from app.models.category import Category
from app.services.analytics_service import AnalyticsService
from app.services.event_service import EventService
from app.models.event import EventType
from typing import cast, TypedDict, Union


class AIService:
    """
    AI-powered features using LongCat (via OpenAI-compatible API) and Hugging Face.
    """
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.analytics_service = AnalyticsService(db)
        self.event_service = EventService(db)
        
        # Configure LongCat (Primary)
        self.longcat_client = None
        if settings.LONGCAT_API_KEY:
            # LongCat uses OpenAI-compatible API
            # Base URL for LongCat is typically https://api.longcat.chat/v1 (Verify if different)
            # Using a generic OpenAI client structure which works with any compatible provider
            self.longcat_client = AsyncOpenAI(
                api_key=settings.LONGCAT_API_KEY,
                base_url="https://api.longcat.chat/openai/v1" 
            )

        # Configure Hugging Face (Secondary/Fallback)
        self.hf_client = None
        if settings.HF_API_KEY:
            self.hf_client = InferenceClient(token=settings.HF_API_KEY)

    async def suggest_category(
        self,
        description: str,
        amount: float,
        user_id: int
    ) -> dict:
        """
        AI-powered expense categorization.
        Routing: Rule-based -> Hugging Face Zero-shot -> LongCat
        """
        try:
            # Get user's category names
            result = await self.db.execute(
                select(Category).where(Category.user_id == user_id)
            )
            categories = result.scalars().all()
            category_names: List[str] = [str(c.name) for c in categories]
            valid_names = [str(name) for name in category_names]
            
            # 1. Rule-based (Fastest)
            rule_suggestion = self._rule_based_categorization(description, valid_names)
            if rule_suggestion:
                return {
                    "suggested_category": rule_suggestion,
                    "confidence": 0.95,
                    "source": "rule-based",
                    "alternatives": []
                }

            suggested_category = None
            confidence = 0.0
            source = "none"

            # 2. Hugging Face Zero-shot (Secondary)
            if not suggested_category and self.hf_client and valid_names:
                try:
                    # Corrected parameter name for InferenceClient: candidate_labels
                    output = self.hf_client.zero_shot_classification(
                        text=description,
                        candidate_labels=valid_names,
                        model="facebook/bart-large-mnli"
                    )
                    # Output format: {'labels': [...], 'scores': [...], 'sequence': '...'}
                    if output and isinstance(output, dict):
                        labels = output.get('labels')
                        scores = output.get('scores')
                        if labels and isinstance(labels, list) and len(labels) > 0:
                            suggested_category = str(labels[0])
                            if scores and isinstance(scores, list) and len(scores) > 0:
                                confidence = float(scores[0])
                            source = "huggingface/bart-large-mnli"
                except Exception as e:
                    print(f"HF Categorization failed: {e}")

            # 3. LongCat (Primary Fallback for complex cases)
            if (not suggested_category or confidence < 0.4) and self.longcat_client:
                try:
                    prompt = f"""
                    Role: Financial Category Expert
                    Task: Categorize the following expense description into EXACTLY one of the provided categories.
                    
                    Input:
                    - Description: "{description}"
                    - Amount: {amount}
                    - User's Categories: {', '.join(valid_names)}
                    
                    Instructions:
                    1. Return ONLY the category name from the list. 
                    2. No explanations, no markdown, no punctuation.
                    3. If multiple categories fit, choose the most specific one.
                    """
                    response = await self.longcat_client.chat.completions.create(
                        model="LongCat-Flash-Chat", 
                        messages=[{"role": "user", "content": prompt}],
                        temperature=0.1
                    )
                    ai_cat_raw = response.choices[0].message.content
                    ai_cat = ai_cat_raw.strip() if ai_cat_raw else ""
                    
                    # Basic cleanup
                    for v in valid_names:
                        if v.lower() in ai_cat.lower():
                            suggested_category = v
                            confidence = 0.95
                            source = "longcat"
                            break
                except Exception as e:
                    print(f"LongCat Categorization failed: {e}")

            # Default fallback if all else fails
            if not suggested_category and valid_names:
                 suggested_category = valid_names[0]
                 source = "fallback-default"
            
            # Log event
            await self.event_service.log_event(
                user_id=user_id,
                event_type=EventType.AI_FEATURE_USED,
                description=f"Category suggestion ({source})"
            )
            
            return {
                "suggested_category": suggested_category,
                "confidence": confidence,
                "source": source,
                "alternatives": [c for c in valid_names if c != suggested_category][:2]
            }

        except Exception as e:
            return {
                "suggested_category": None,
                "error": str(e),
                "fallback": True
            }

    def _rule_based_categorization(self, description: str, categories: Sequence[str]) -> Optional[str]:
        """Rule-based fallback for categorization"""
        description_lower = description.lower()
        
        keyword_map = {
            "food": ["food", "restaurant", "cafe", "grocery", "lunch", "dinner", "swiggy", "zomato", "burger", "pizza"],
            "transport": ["uber", "taxi", "fuel", "bus", "train", "petrol", "ola", "rapido", "pathao", "indriver"],
            "shopping": ["amazon", "store", "mall", "buy", "purchase", "flipkart", "myntra", "daraz"],
            "bills": ["electricity", "water", "internet", "phone", "bill", "recharge", "wifi", "broadband"],
            "entertainment": ["movie", "netflix", "spotify", "game", "pvr", "cinema"],
            "health": ["doctor", "medicine", "pharmacy", "hospital", "pharmeasy"],
        }
        
        for category, keywords in keyword_map.items():
            if any(kw in description_lower for kw in keywords):
                for user_cat in categories:
                    if category.lower() in str(user_cat).lower():
                        return str(user_cat)
        return None

    async def generate_insights(self, user_id: int) -> dict:
        """
        Generate AI insights about spending.
        Routing: LongCat -> Hugging Face (Summarization)
        """
        try:
            from app.services.redis_service import redis_service
            
            # Check cache
            cache_key = f"insights:{user_id}"
            cached_result = await redis_service.get_json(cache_key)
            if cached_result:
                return cached_result
                
            analytics = await self.analytics_service.get_summary(user_id)
            if analytics.summary.total == 0:
                 return {"insights": ["No spending data available yet."], "ai_powered": False}

            insights = []
            ai_powered = False
            source = "none"
            
            # Prepare data
            category_data = [f"{c.category_name}: {c.total}" for c in analytics.category_breakdown]
            total = analytics.summary.total or 0.0
            mom = analytics.month_over_month or 0.0
            data_summary = (
                f"Total: {total}. "
                f"Breakdown: {', '.join(category_data)}. "
                f"Trend: {'Up' if mom > 0 else 'Down'} {abs(mom)}%."
            )

            # 1. LongCat (Primary)
            if self.longcat_client:
                try:
                    prompt = f"""
                    Role: Personal Finance Analyst
                    Goal: Provide actionable spending insights.
                    Data: {data_summary}
                    
                    Instructions:
                    - Provide 3 distinct, high-value insights.
                    - Be specific with numbers.
                    - Use a professional yet friendly tone.
                    - Suggest one way to save money based on the top expense.
                    - Keep each insight to one sentence.
                    """
                    response = await self.longcat_client.chat.completions.create(
                        model="LongCat-Flash-Chat",
                        messages=[{"role": "user", "content": prompt}],
                        temperature=0.7
                    )
                    text_raw = response.choices[0].message.content
                    text = text_raw.strip() if text_raw else ""
                    insights = [line.strip().lstrip('-').strip() for line in text.split('\n') if line.strip()][:3]
                    if insights:
                        ai_powered = True
                        source = "longcat"
                except Exception as e:
                    print(f"LongCat Insight generation failed: {e}")

            # 2. Hugging Face Fallback (Summarization: google/pegasus-xsum)
            if not insights and self.hf_client:
                try:
                    # Summarization models expect a longer text to summarize.
                    # We construct a verbose description for it to summarize into "insights".
                    total = analytics.summary.total or 0.0
                    mom = analytics.month_over_month or 0.0
                    input_text = (
                        f"The user spent a total of {total}. "
                        f"The main categories are {', '.join(category_data)}. "
                        f"Spending is running {abs(mom)} percent "
                        f"{'higher' if mom > 0 else 'lower'} than last month. "
                        "The user should consider checking their top expenses."
                    )
                    
                    output = self.hf_client.summarization(
                        input_text,
                        model="google/pegasus-xsum"
                    )
                    # Output is usually a list of dicts or a single dict depending on params
                    # InferenceClient usually returns value directly or a list
                    summary_text = ""
                    if isinstance(output, list) and len(output) > 0:
                        summary_text = output[0].get('summary_text', '')
                    elif isinstance(output, dict):
                         summary_text = output.get('summary_text', '')
                    
                    if summary_text:
                        insights = [summary_text]
                        ai_powered = True
                        source = "huggingface/pegasus-xsum"

                except Exception as e:
                    print(f"HF Insight generation failed: {e}")

            # 3. Last resort fallback
            if not insights:
                insights.append(f"Total spent: {analytics.summary.total}")
                if analytics.category_breakdown:
                    insights.append(f"Top category: {analytics.category_breakdown[0].category_name}")
                source = "fallback-rules"

            result = {
                "insights": insights,
                "ai_powered": ai_powered,
                "source": source,
                "generated_at": datetime.utcnow().isoformat()
            }
            
            await redis_service.set_json(cache_key, result, expire=21600) # 6 hours
            return result
        except Exception as e:
            return {"insights": [], "error": str(e)}

    async def chat(self, message: str, user_id: int) -> dict:
        """
        Conversational assistant with enriched context and caching.
        Routing: LongCat
        """
        try:
            if not self.longcat_client:
                 return {"response": "AI Chat is unavailable (LongCat key missing).", "ai_powered": False}

            from app.services.redis_service import redis_service
            
            # 1. Check Response Cache
            cache_key = f"chat_response:{user_id}:{hash(message)}"
            cached_response = await redis_service.get_json(cache_key)
            if cached_response:
                return cached_response

            # 2. Get Comprehensive Context
            history = await redis_service.get_history(user_id)
            analytics = await self.analytics_service.get_summary(user_id)
            
            # Enrich Context with category breakdown
            category_data = [f"{c.category_name}: ₹{c.total}" for c in analytics.category_breakdown[:5]]
            total = analytics.summary.total or 0
            mom = analytics.month_over_month or 0
            
            context_str = (
                f"[USER FINANCIAL DATA]\n"
                f"- Total Spent this Month: ₹{total}\n"
                f"- Month-over-Month Change: {'+' if mom > 0 else ''}{mom}%\n"
                f"- Top Categories: {', '.join(category_data)}\n"
            )
            
            system_prompt = """You are HisabKitab AI, the user's personal financial brain.
You have DIRECT ACCESS to the user's spending records provided in the [USER FINANCIAL DATA] section.
- NEVER say "I don't have access to your data." 
- ALWAYS use the specific numbers provided in context to answer questions.
- If the user asks about a specific category (e.g., Food), check the 'Top Categories' list.
- If a category isn't listed, assume the user spent ₹0 or it's not a major expense.
- Be proactive, empathetic, and help the user save money.
- Support English, Hindi, and Nepali.

Style: Authoritative on data, friendly in tone."""
            
            messages: List[Dict[str, Any]] = [
                {"role": "system", "content": f"{system_prompt}\n\n{context_str}"}
            ]
            
            # Add history (last 5 messages)
            for msg in history[-5:]:
                 role = "user" if msg['role'] == "User" else "assistant"
                 messages.append({"role": role, "content": msg['content']})
            
            messages.append({"role": "user", "content": message})

            response = await self.longcat_client.chat.completions.create(
                model="LongCat-Flash-Chat",
                messages=cast(Any, messages),
                temperature=0.7
            )
            reply_raw = response.choices[0].message.content
            reply = reply_raw.strip() if reply_raw else "I apologize, but I couldn't generate a response."
            
            result = {"response": reply, "ai_powered": True, "source": "longcat"}

            # 3. Cache & Save
            await redis_service.set_json(cache_key, result, expire=300) # 5 min cache for identical queries
            await redis_service.add_to_history(user_id, message, "User")
            await redis_service.add_to_history(user_id, reply, "Assistant")
            
            return result

        except Exception as e:
            return {"response": f"Error: {str(e)}", "error": str(e)}

    async def generate_saving_tips(self, user_id: int) -> dict:
        """
        Generate saving tips.
        Routing: LongCat
        """
        # Similar logic to insights, simplified for brevity
        return await self.generate_insights(user_id) # Re-using insights logic for now as they are similar

    async def process_voice_expense(self, text: str, user_id: int) -> dict:
        """
        Parse structured expense from text.
        Routing: LongCat (Function calling or JSON mode)
        """
        if not self.longcat_client:
             return {"success": False, "error": "AI unavailable"}

        try:
             # Get categories for context
            result = await self.db.execute(
                select(Category).where(Category.user_id == user_id)
            )
            categories = result.scalars().all()
            cat_list = ", ".join([f"{c.id}:{c.name}" for c in categories])

            prompt = f"""
            Task: Convert natural language expense input into JSON.
            Input: "{text}"
            Available Categories (ID:Name): {cat_list}
            
            JSON Schema:
            {{
                "amount": float,
                "description": "short title",
                "category_id": int (Match the ID correctly),
                "payment_method": "Cash" | "Card" | "Online" | "Other"
            }}
            
            Return ONLY the raw JSON.
            """
            
            response = await self.longcat_client.chat.completions.create(
                model="LongCat-Flash-Chat",
                messages=[{"role": "user", "content": prompt}],
                temperature=0,
                response_format={"type": "json_object"} 
            )
            
            json_str = response.choices[0].message.content
            if not json_str:
                return {"success": False, "error": "Empty response from AI"}

            # Clean if necessary
            if "```json" in json_str: 
                json_str = json_str.split("```json")[1].split("```")[0]
            
            data = json.loads(json_str)
            return {"success": True, "data": data, "source": "longcat"}
            
        except Exception as e:
            return {"success": False, "error": str(e)}

    # Utils / Other models
    async def get_embeddings(self, text: str) -> List[float]:
        """
        Get embeddings using Hugging Face (sentence-transformers/all-MiniLM-L6-v2)
        """
        if self.hf_client:
            try:
                # feature_extraction returns the embeddings
                output = self.hf_client.feature_extraction(
                    text, 
                    model="sentence-transformers/all-MiniLM-L6-v2"
                )
                # Output might be a tensor/array. Ensure we return a flat list of floats.
                # Usually standard HF Inference API returns a list of lists (if batch) or one list.
                if isinstance(output, list):
                     # If nested, take first
                     if len(output) > 0 and isinstance(output[0], list):
                         return output[0]
                     return output
                return []
            except Exception as e:
                print(f"Embedding failed: {e}")
        return []
