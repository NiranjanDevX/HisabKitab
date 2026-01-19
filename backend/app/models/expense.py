"""
Expense Model
"""
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.db.base import Base, TimestampMixin


class ExpenseSource(str, enum.Enum):
    """Source of expense entry"""
    MANUAL = "manual"
    VOICE = "voice"
    OCR = "ocr"


class Expense(Base, TimestampMixin):
    """Expense database model"""
    __tablename__ = "expenses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True, index=True)
    
    amount = Column(Float, nullable=False)
    description = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    date = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    tags = Column(String(500), nullable=True)  # Comma-separated tags
    source = Column(Enum(ExpenseSource), default=ExpenseSource.MANUAL, nullable=False)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="expenses")
    category = relationship("Category", back_populates="expenses")
    group = relationship("Group", back_populates="expenses")
    splits = relationship("ExpenseSplit", back_populates="expense", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Expense(id={self.id}, amount={self.amount}, user_id={self.user_id})>"
