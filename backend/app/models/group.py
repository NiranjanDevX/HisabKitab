"""
Group and Expense Split Models
"""
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from app.db.base import Base, TimestampMixin

class Group(Base, TimestampMixin):
    """Group for splitting expenses"""
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    created_by = relationship("User", foreign_keys=[created_by_id])
    members = relationship("GroupMember", back_populates="group", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="group")


class GroupMember(Base, TimestampMixin):
    """Association between User and Group"""
    __tablename__ = "group_members"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Nullable for "dummy" users (unregistered friends)
    name = Column(String, nullable=False) # Display name (fallback if user_id is null)
    
    # Relationships
    group = relationship("Group", back_populates="members")
    user = relationship("User")
    splits = relationship("ExpenseSplit", back_populates="member")


class ExpenseSplit(Base, TimestampMixin):
    """Individual share of a split expense"""
    __tablename__ = "expense_splits"

    id = Column(Integer, primary_key=True, index=True)
    expense_id = Column(Integer, ForeignKey("expenses.id"), nullable=False)
    group_member_id = Column(Integer, ForeignKey("group_members.id"), nullable=False)
    amount = Column(Float, nullable=False) # The amount this person owes
    is_paid = Column(Boolean, default=False)
    
    # Relationships
    expense = relationship("Expense", back_populates="splits")
    member = relationship("GroupMember", back_populates="splits")
