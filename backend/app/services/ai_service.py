import google.generativeai as genai
from typing import Optional, List, Any, Sequence
import json
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.models.category import Category
from app.models.expense import Expense
from app.services.analytics_service import AnalyticsService
from app.services.event_service import EventService
from app.models.event import EventType


class AIService:
    """AI-powered features using Google Gemini"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.analytics_service = AnalyticsService(db)
        self.event_service = EventService(db)
        
        # Configure Gemini
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your-gemini-api-key":
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        else:
            self.model = None

    async def suggest_category(
        self,
        description: str,
        amount: float,
        user_id: int
    ) -> dict:
        """AI-powered expense categorization"""
        try:
            # Get user's categories
            result = await self.db.execute(
                select(Category).where(Category.user_id == user_id)
            )
            categories = result.scalars().all()
            category_names: List[str] = [str(c.name) for c in categories]
            
            if self.model:
                prompt = f"""
                Given the expense description: "{description}" and amount: {amount}.
                Classify it into one of the following categories: {', '.join([str(name) for name in category_names])}.
                Return only the category name.
                """
                response = await self.model.generate_content_async(prompt)
                suggested_category = response.text.strip()
                
                # Check if the AI returned a valid category
                valid_names = [str(name) for name in category_names]
                if suggested_category not in valid_names:
                    # Try to find best match or fallback
                    suggested_category = self._rule_based_categorization(description, valid_names)
            else:
                suggested_category = self._rule_based_categorization(description, category_names)
            
            # Log event
            await self.event_service.log_event(
                user_id=user_id,
                event_type=EventType.AI_FEATURE_USED,
                description="Category suggestion"
            )
            
            return {
                "suggested_category": suggested_category,
                "confidence": 0.9 if self.model else 0.7,
                "alternatives": [c for c in category_names if c != suggested_category][:2]
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
            "food": ["food", "restaurant", "cafe", "grocery", "lunch", "dinner", "swiggy", "zomato"],
            "transport": ["uber", "taxi", "fuel", "bus", "train", "petrol", "ola", "rapido"],
            "shopping": ["amazon", "store", "mall", "buy", "purchase", "flipkart", "myntra"],
            "bills": ["electricity", "water", "internet", "phone", "bill", "recharge"],
            "entertainment": ["movie", "netflix", "spotify", "game", "pvr"],
            "health": ["doctor", "medicine", "pharmacy", "hospital", "pharmeasy"],
        }
        
        for category, keywords in keyword_map.items():
            if any(kw in description_lower for kw in keywords):
                for user_cat in categories:
                    if category.lower() in str(user_cat).lower():
                        return str(user_cat)
        
        return str(categories[0]) if categories else None

    async def generate_insights(self, user_id: int) -> dict:
        """Generate AI insights about spending"""
        try:
            from app.services.redis_service import redis_service
            
            # Check cache first
            cache_key = f"insights:{user_id}"
            cached_result = await redis_service.get_json(cache_key)
            if cached_result:
                return cached_result
                
            analytics = await self.analytics_service.get_summary(user_id)
            
            insights = []
            ai_powered = False
            
            if self.model:
                # Prepare data for AI
                category_data = [
                    f"{c.category_name}: ₹{c.total}" 
                    for c in analytics.category_breakdown
                ]
                
                prompt = f"""
                Analyze the following spending data for this month:
                Total Spent: ₹{analytics.summary.total}
                Daily Average: ₹{analytics.summary.average}
                Category Breakdown: {', '.join(category_data)}
                Month-over-Month Change: {analytics.month_over_month if analytics.month_over_month else 'N/A'}%
                
                Provide 3 concise, actionable financial insights or observations.
                Keep it friendly and professional.
                """
                response = await self.model.generate_content_async(prompt)
                insights = [line.strip() for line in response.text.split('\n') if line.strip()][:3]
                ai_powered = True
            else:
                # Basic rule-based insights
                if analytics.summary.total > 0:
                    insights.append(f"Total spending: ₹{analytics.summary.total:.2f}")
                if analytics.category_breakdown:
                    top = analytics.category_breakdown[0]
                    insights.append(f"Highest spending in {top.category_name}")
                if analytics.month_over_month:
                    trend = "up" if analytics.month_over_month > 0 else "down"
                    insights.append(f"Spending is {trend} {abs(analytics.month_over_month):.1f}% from last month")

            result = {
                "insights": insights,
                "ai_powered": ai_powered,
                "generated_at": datetime.utcnow().isoformat()
            }
            
            # Cache the result for 6 hours
            await redis_service.set_json(cache_key, result, expire=21600)
            
            return result
        except Exception as e:
            return {"insights": [], "error": str(e)}

    async def chat(self, message: str, user_id: int) -> dict:
        """Conversational finance assistant with memory"""
        try:
            if not self.model:
                return {
                    "response": "Gemini AI is not configured. Please add an API key.",
                    "ai_powered": False
                }
            
            from app.services.redis_service import redis_service
            
            # Get conversation history
            history = await redis_service.get_history(user_id)
            
            # Get user context
            analytics = await self.analytics_service.get_summary(user_id)
            
            context_str = f"""
            User Context:
            - Total Spent This Month: ₹{analytics.summary.total}
            - Top Categories: {', '.join([c.category_name for c in analytics.category_breakdown[:3]])}
            - Previous conversation history is provided below.
            """
            
            # Flatten history for the prompt (Gemini API format might differ, keeping it simple text for now)
            history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history])
            
            prompt = f"""
            You are 'HisabKitab AI', a helpful personal finance assistant.
            {context_str}
            
            Recent Conversation:
            {history_text}
            
            User: {message}
            Assistant:"""
            
            response = await self.model.generate_content_async(prompt)
            reply = response.text.strip()
            
            # Save to history
            await redis_service.add_to_history(user_id, message, "User")
            await redis_service.add_to_history(user_id, reply, "Assistant")
            
            await self.event_service.log_event(
                user_id=user_id,
                event_type=EventType.AI_FEATURE_USED,
                description=f"AI Chat: {message[:30]}..."
            )
            
            return {
                "response": reply,
                "ai_powered": True
            }
        except Exception as e:
            return {"response": f"Sorry, I encountered an error: {str(e)}", "error": str(e)}

    async def generate_saving_tips(self, user_id: int) -> dict:
        """Generate personalized saving tips"""
        try:
            if self.model:
                analytics = await self.analytics_service.get_summary(user_id)
                top_cats = [c.category_name for c in analytics.category_breakdown[:2]]
                
                prompt = f"Based on spending in {', '.join(top_cats)}, give 3 short saving tips."
                response = await self.model.generate_content_async(prompt)
                tips = [t.strip() for t in response.text.split('\n') if t.strip()][:3]
            else:
                tips = [
                    "Track every expense, no matter how small",
                    "Set a monthly budget and stick to it",
                    "Review your spending weekly to stay on track"
                ]
            
            return {"tips": tips, "ai_powered": bool(self.model)}
        except Exception as e:
            return {"tips": ["Save more!"], "error": str(e)}

    async def process_voice_expense(self, text: str, user_id: int) -> dict:
        """Parse natural language into structured expense data"""
        try:
            if not self.model:
                return {"error": "AI not configured", "success": False}
                
            # Get user's categories for classification
            result = await self.db.execute(
                select(Category).where(Category.user_id == user_id)
            )
            categories = result.scalars().all()
            category_list = [f"{c.id}:{c.name}" for c in categories]
            
            prompt = f"""
            Extract expense information from the following text: "{text}"
            Assign it to one of these user categories (Format: ID:Name): {', '.join(category_list)}
            
            Return ONLY a valid JSON object with these keys:
            "amount": float,
            "description": string,
            "category_id": int,
            "date": string (ISO 8601, default to today if not mentioned: {datetime.now().date().isoformat()}),
            "payment_method": string (default to "Cash" if not mentioned)
            
            If information is missing, use best guess or defaults.
            """
            
            response = await self.model.generate_content_async(prompt)
            # Clean response text in case AI adds markdown code blocks
            json_text = response.text.strip()
            if "```json" in json_text:
                json_text = json_text.split("```json")[1].split("```")[0].strip()
            elif "```" in json_text:
                json_text = json_text.split("```")[1].strip()
                
            expense_data = json.loads(json_text)
            
            await self.event_service.log_event(
                user_id=user_id,
                event_type=EventType.AI_FEATURE_USED,
                description=f"Voice Parsing: {text[:30]}..."
            )
            
            return {
                "success": True,
                "data": expense_data,
                "confidence": 0.85
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "fallback_text": text
            }
