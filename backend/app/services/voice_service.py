"""
Voice Input Service
"""
from typing import Optional
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.event_service import EventService
from app.models.event import EventType


class VoiceService:
    """Voice input processing service using Whisper"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.event_service = EventService(db)
    
    async def transcribe_and_extract(self, audio: UploadFile, user_id: int) -> dict:
        """Transcribe audio and extract expense data"""
        try:
            # Read audio file
            content = await audio.read()
            
            # TODO: Implement Whisper transcription
            # For now, return placeholder
            transcribed_text = "Placeholder: Implement Whisper integration"
            
            # Extract expense data from text
            expense_data = await self.extract_expense_from_text(transcribed_text, user_id)
            
            # Log event
            await self.event_service.log_event(
                user_id=user_id,
                event_type=EventType.VOICE_INPUT_USED,
                description="Voice input transcribed"
            )
            
            return {
                "transcribed_text": transcribed_text,
                "expense_data": expense_data,
                "success": True
            }
        except Exception as e:
            return {
                "transcribed_text": None,
                "expense_data": None,
                "success": False,
                "error": str(e)
            }
    
    async def extract_expense_from_text(self, text: str, user_id: int) -> Optional[dict]:
        """Extract expense data from natural language text"""
        # Simple rule-based extraction
        # TODO: Use AI for better extraction
        
        import re
        
        # Try to find amount (number followed by optional currency)
        amount_pattern = r'(\d+(?:\.\d{1,2})?)'
        amount_match = re.search(amount_pattern, text)
        
        extracted = {
            "amount": float(amount_match.group(1)) if amount_match else None,
            "description": text,
            "category_suggestion": None,
            "needs_confirmation": True
        }
        
        # Simple category detection
        categories_keywords = {
            "food": ["food", "eat", "restaurant", "lunch", "dinner", "breakfast", "groceries"],
            "transport": ["uber", "taxi", "bus", "train", "fuel", "gas", "petrol"],
            "shopping": ["shopping", "bought", "purchase", "amazon", "store"],
            "bills": ["bill", "electricity", "water", "internet", "phone"],
        }
        
        text_lower = text.lower()
        for category, keywords in categories_keywords.items():
            if any(kw in text_lower for kw in keywords):
                extracted["category_suggestion"] = category
                break
        
        return extracted
