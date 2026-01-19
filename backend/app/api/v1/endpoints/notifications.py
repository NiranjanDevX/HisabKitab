"""
Notification Endpoints
"""
from typing import Any, cast
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.schemas.notification import NotificationResponse, NotificationListResponse
from app.services.notification_service import NotificationService

router = APIRouter()


@router.get("/", response_model=NotificationListResponse)
async def get_notifications(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all notifications for current user"""
    notification_service = NotificationService(db)
    notifications = await notification_service.get_notifications(cast(Any, current_user.id))
    unread_count = await notification_service.get_unread_count(cast(Any, current_user.id))
    
    return NotificationListResponse(
        items=notifications,
        unread_count=unread_count
    )


@router.put("/{notification_id}/read")
async def mark_as_read(
    notification_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Mark a notification as read"""
    notification_service = NotificationService(db)
    success = await notification_service.mark_as_read(notification_id, cast(Any, current_user.id))
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    return {"message": "Notification marked as read"}


@router.put("/read-all")
async def mark_all_as_read(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Mark all notifications as read"""
    notification_service = NotificationService(db)
    await notification_service.mark_all_as_read(cast(Any, current_user.id))
    return {"message": "All notifications marked as read"}
