"""
Event Tracking Service
"""
import json
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.event import Event, EventType


class EventService:
    """Event tracking service for activity logs"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def log_event(
        self,
        user_id: int,
        event_type: EventType,
        description: Optional[str] = None,
        event_metadata: Optional[dict] = None
    ) -> Event:
        """Log an event"""
        event = Event(
            user_id=user_id,
            event_type=event_type,
            description=description,
            event_metadata=json.dumps(event_metadata) if event_metadata else None
        )
        self.db.add(event)
        await self.db.commit()
        return event
