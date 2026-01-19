"""
Notification Schemas
"""
from pydantic import BaseModel
from typing import List
from datetime import datetime

from app.models.notification import NotificationType


class NotificationResponse(BaseModel):
    """Schema for notification response"""
    id: int
    type: NotificationType
    title: str
    message: str
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class NotificationListResponse(BaseModel):
    """Schema for notification list response"""
    items: List[NotificationResponse]
    unread_count: int
