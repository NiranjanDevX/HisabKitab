"""
User Model
"""
from sqlalchemy import Column, Integer, String, Boolean, Enum
from sqlalchemy.orm import relationship
import enum

from app.db.base import Base, TimestampMixin


class UserRole(str, enum.Enum):
    """User role enumeration"""
    USER = "user"
    ADMIN = "admin"


class Occupation(str, enum.Enum):
    """User occupation enumeration"""
    STUDENT = "student"
    PROFESSIONAL = "professional"
    BUSINESS = "business"
    FREELANCER = "freelancer"
    HOME_MAKER = "home_maker"
    RETIRED = "retired"
    OTHER = "other"


class User(Base, TimestampMixin):
    """User database model"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    occupation = Column(Enum(Occupation), nullable=True)
    date_of_birth = Column(String(50), nullable=True) # Using string for flexibility, or Date
    phone_number = Column(String(20), nullable=True)
    profile_pic = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Relationships
    expenses = relationship("Expense", back_populates="user", cascade="all, delete-orphan")
    categories = relationship("Category", back_populates="user", cascade="all, delete-orphan")
    budgets = relationship("Budget", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    events = relationship("Event", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"
