"""
Event Model for Activity Tracking
"""
from sqlalchemy import Column, Integer, String, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
import enum

from app.db.base import Base, TimestampMixin


class EventType(str, enum.Enum):
    """Event type enumeration"""
    USER_SIGNUP = "user_signup"
    USER_LOGIN = "user_login"
    USER_LOGOUT = "user_logout"
    EXPENSE_CREATED = "expense_created"
    EXPENSE_UPDATED = "expense_updated"
    EXPENSE_DELETED = "expense_deleted"
    CATEGORY_CREATED = "category_created"
    CATEGORY_MODIFIED = "category_modified"
    BUDGET_EXCEEDED = "budget_exceeded"
    VOICE_INPUT_USED = "voice_input_used"
    OCR_USED = "ocr_used"
    AI_FEATURE_USED = "ai_feature_used"


class Event(Base, TimestampMixin):
    """Event database model for activity tracking"""
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    event_type = Column(Enum(EventType), nullable=False)
    description = Column(String(255), nullable=True)
    event_metadata = Column(Text, nullable=True)  # JSON string for additional data
    
    # Relationships
    user = relationship("User", back_populates="events")
    
    def __repr__(self):
        return f"<Event(id={self.id}, type={self.event_type})>"
