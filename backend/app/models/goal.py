"""
Financial Goal Model
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Date
from sqlalchemy.orm import relationship
from datetime import date

from app.db.base import Base, TimestampMixin

class Goal(Base, TimestampMixin):
    """Financial Goal database model"""
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    target_date = Column(Date, nullable=True)
    is_completed = Column(Boolean, default=False)
    color = Column(String, default="#4F46E5") # UI color
    
    # Relationships
    user = relationship("User", back_populates="goals")
