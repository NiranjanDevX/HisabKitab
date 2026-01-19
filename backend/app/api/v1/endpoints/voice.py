"""
Voice Input Endpoints
"""
from typing import Any, cast
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.core.feature_flags import feature_flags
from app.services.voice_service import VoiceService

router = APIRouter()


@router.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Transcribe audio to text and extract expense data"""
    if not feature_flags.is_voice_input_enabled():
        raise HTTPException(
            status_code=400,
            detail="Voice input feature is disabled"
        )
    
    voice_service = VoiceService(db)
    result = await voice_service.transcribe_and_extract(audio, cast(Any, current_user.id))
    return result


@router.post("/process")
async def process_voice_text(
    text: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Process transcribed text to extract expense data"""
    voice_service = VoiceService(db)
    result = await voice_service.extract_expense_from_text(text, cast(Any, current_user.id))
    return result
