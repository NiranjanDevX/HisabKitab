"""
Expense Schemas
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from app.models.expense import ExpenseSource


class ExpenseBase(BaseModel):
    """Base expense schema"""
    amount: float
    description: Optional[str] = None
    notes: Optional[str] = None
    category_id: Optional[int] = None
    date: Optional[datetime] = None
    tags: Optional[str] = None


class ExpenseCreate(ExpenseBase):
    """Schema for creating an expense"""
    source: Optional[ExpenseSource] = ExpenseSource.MANUAL


class ExpenseUpdate(BaseModel):
    """Schema for updating an expense"""
    amount: Optional[float] = None
    description: Optional[str] = None
    notes: Optional[str] = None
    category_id: Optional[int] = None
    date: Optional[datetime] = None
    tags: Optional[str] = None


class ExpenseResponse(ExpenseBase):
    """Schema for expense response"""
    id: int
    user_id: int
    source: ExpenseSource
    created_at: datetime
    updated_at: datetime
    category_name: Optional[str] = None
    
    class Config:
        from_attributes = True


class ExpenseListResponse(BaseModel):
    """Schema for expense list response"""
    items: List[ExpenseResponse]
    total: int
    page: int
    page_size: int
