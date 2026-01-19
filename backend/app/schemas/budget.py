"""
Budget Schemas
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BudgetBase(BaseModel):
    """Base budget schema"""
    name: str
    amount: float
    category_id: Optional[int] = None
    period: str = "monthly"


class BudgetCreate(BudgetBase):
    """Schema for creating a budget"""
    pass


class BudgetUpdate(BaseModel):
    """Schema for updating a budget"""
    name: Optional[str] = None
    amount: Optional[float] = None
    category_id: Optional[int] = None
    period: Optional[str] = None


class BudgetResponse(BudgetBase):
    """Schema for budget response"""
    id: int
    user_id: int
    created_at: datetime
    spent: Optional[float] = 0.0  # Calculated field
    remaining: Optional[float] = None  # Calculated field
    percentage_used: Optional[float] = None  # Calculated field
    
    class Config:
        from_attributes = True
