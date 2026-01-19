"""
AI Feature Endpoints
"""
from typing import Any, cast
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.db.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.core.feature_flags import feature_flags
from app.services.ai_service import AIService


class ChatRequest(BaseModel):
    message: str


class CategorySuggestionRequest(BaseModel):
    description: str
    amount: float


router = APIRouter()


@router.post("/categorize")
async def suggest_category(
    request: CategorySuggestionRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """AI-powered expense categorization"""
    if not feature_flags.is_ai_enabled():
        raise HTTPException(
            status_code=400,
            detail="AI features are disabled"
        )
    
    ai_service = AIService(db)
    suggestion = await ai_service.suggest_category(
        request.description,
        request.amount,
        cast(Any, current_user.id)
    )
    return suggestion


@router.get("/insights")
async def get_ai_insights(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get AI-generated spending insights"""
    if not feature_flags.is_ai_enabled():
        raise HTTPException(
            status_code=400,
            detail="AI features are disabled"
        )
    
    ai_service = AIService(db)
    insights = await ai_service.generate_insights(cast(Any, current_user.id))
    return insights


@router.post("/chat")
async def chat_with_ai(
    request: ChatRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Conversational finance assistant"""
    if not feature_flags.is_ai_enabled():
        raise HTTPException(
            status_code=400,
            detail="AI features are disabled"
        )
    
    ai_service = AIService(db)
    response = await ai_service.chat(request.message, cast(Any, current_user.id))
    return response


@router.get("/tips")
async def get_saving_tips(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get personalized saving tips"""
    if not feature_flags.is_ai_enabled():
        raise HTTPException(
            status_code=400,
            detail="AI features are disabled"
        )
    
    ai_service = AIService(db)
    tips = await ai_service.generate_saving_tips(cast(Any, current_user.id))
    return tips


@router.post("/parse-voice")
async def parse_voice_command(
    request: ChatRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Parse natural language command into expense data"""
    if not feature_flags.is_ai_enabled():
        raise HTTPException(
            status_code=400,
            detail="AI features are disabled"
        )
    
    ai_service = AIService(db)
    result = await ai_service.process_voice_expense(request.message, cast(Any, current_user.id))
    return result
