"""
Category Model
"""
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base, TimestampMixin


class Category(Base, TimestampMixin):
    """Category database model"""
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    name = Column(String(50), nullable=False)
    icon = Column(String(50), nullable=True)  # Emoji or icon name
    color = Column(String(20), nullable=True)  # Hex color
    is_default = Column(Boolean, default=False)  # System default category
    
    # Relationships
    user = relationship("User", back_populates="categories")
    expenses = relationship("Expense", back_populates="category")
    budgets = relationship("Budget", back_populates="category")
    
    def __repr__(self):
        return f"<Category(id={self.id}, name={self.name})>"


# Default categories to create for new users
DEFAULT_CATEGORIES = [
    {"name": "Food", "icon": "🍽️", "color": "#FF6B6B"},
    {"name": "Transport", "icon": "🚗", "color": "#4ECDC4"},
    {"name": "Shopping", "icon": "🛍️", "color": "#45B7D1"},
    {"name": "Entertainment", "icon": "🎬", "color": "#96CEB4"},
    {"name": "Bills", "icon": "📄", "color": "#FFEAA7"},
    {"name": "Health", "icon": "💊", "color": "#DDA0DD"},
    {"name": "Education", "icon": "📚", "color": "#98D8C8"},
    {"name": "Rent", "icon": "🏠", "color": "#F7DC6F"},
    {"name": "Travel", "icon": "✈️", "color": "#85C1E9"},
    {"name": "Other", "icon": "📦", "color": "#ABB2B9"},
]
