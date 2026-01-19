"""
Notification Service
"""
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, update, func

from typing import List, Any, cast
from app.models.notification import Notification, NotificationType
from app.schemas.notification import NotificationResponse


class NotificationService:
    """Notification management service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_notifications(self, user_id: int) -> List[NotificationResponse]:
        """Get all notifications for a user"""
        result = await self.db.execute(
            select(Notification)
            .where(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc())
            .limit(50)
        )
        notifications = result.scalars().all()
        return [NotificationResponse.model_validate(n) for n in notifications]
    
    async def get_unread_count(self, user_id: int) -> int:
        """Get unread notification count"""
        from sqlalchemy import func
        result = await self.db.execute(
            select(func.count(Notification.id)).where(
                and_(
                    Notification.user_id == user_id,
                    Notification.is_read == False
                )
            )
        )
        return int(result.scalar() or 0)
    
    async def create_notification(
        self,
        user_id: int,
        notification_type: NotificationType,
        title: str,
        message: str
    ) -> Notification:
        """Create a new notification"""
        notification = Notification(
            user_id=user_id,
            type=notification_type,
            title=title,
            message=message
        )
        self.db.add(notification)
        await self.db.commit()
        await self.db.refresh(notification)
        return notification
    
    async def mark_as_read(self, notification_id: int, user_id: int) -> bool:
        """Mark a notification as read"""
        result = await self.db.execute(
            select(Notification).where(
                and_(
                    Notification.id == notification_id,
                    Notification.user_id == user_id
                )
            )
        )
        notification = result.scalar_one_or_none()
        
        if not notification:
            return False
        
        setattr(notification, "is_read", True)
        await self.db.commit()
        return True
    
    async def mark_all_as_read(self, user_id: int) -> None:
        """Mark all notifications as read"""
        await self.db.execute(
            update(Notification)
            .where(Notification.user_id == user_id)
            .values(is_read=True)
        )
        await self.db.commit()
