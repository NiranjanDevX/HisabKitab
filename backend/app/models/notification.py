"""
Notification Model
"""
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
import enum

from app.db.base import Base, TimestampMixin


class NotificationType(str, enum.Enum):
    """Notification type enumeration"""
    BUDGET_WARNING = "budget_warning"
    BUDGET_EXCEEDED = "budget_exceeded"
    MONTHLY_SUMMARY = "monthly_summary"
    UNUSUAL_SPENDING = "unusual_spending"
    SYSTEM = "system"


class Notification(Base, TimestampMixin):
    """Notification database model"""
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    type = Column(Enum(NotificationType), nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", back_populates="notifications")
    
    def __repr__(self):
        return f"<Notification(id={self.id}, type={self.type})>"
