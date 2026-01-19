"""
Budget Model
"""
from sqlalchemy import Column, Integer, Float, ForeignKey, String
from sqlalchemy.orm import relationship

from app.db.base import Base, TimestampMixin


class Budget(Base, TimestampMixin):
    """Budget database model"""
    __tablename__ = "budgets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    
    name = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)  # Budget limit
    period = Column(String(20), default="monthly")  # daily, weekly, monthly
    
    # Relationships
    user = relationship("User", back_populates="budgets")
    category = relationship("Category", back_populates="budgets")
    
    def __repr__(self):
        return f"<Budget(id={self.id}, name={self.name}, amount={self.amount})>"
