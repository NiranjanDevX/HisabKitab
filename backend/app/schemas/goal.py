from pydantic import BaseModel
from typing import Optional
from datetime import date

class GoalBase(BaseModel):
    name: str
    description: Optional[str] = None
    target_amount: float
    target_date: Optional[date] = None
    color: Optional[str] = "#4F46E5"

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    target_amount: Optional[float] = None
    target_date: Optional[date] = None
    color: Optional[str] = None
    current_amount: Optional[float] = None
    is_completed: Optional[bool] = None

class GoalResponse(GoalBase):
    id: int
    user_id: int
    current_amount: float
    is_completed: bool

    class Config:
        from_attributes = True
