"""
Schemas module initialization
"""
from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserInDB
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetResponse
from app.schemas.auth import Token, TokenPayload, LoginRequest
from app.schemas.analytics import (
    SpendingSummary,
    CategoryBreakdown,
    TrendData,
)
from app.schemas.notification import NotificationResponse

__all__ = [
    "UserCreate", "UserUpdate", "UserResponse", "UserInDB",
    "ExpenseCreate", "ExpenseUpdate", "ExpenseResponse",
    "CategoryCreate", "CategoryUpdate", "CategoryResponse",
    "BudgetCreate", "BudgetUpdate", "BudgetResponse",
    "Token", "TokenPayload", "LoginRequest",
    "SpendingSummary", "CategoryBreakdown", "TrendData",
    "NotificationResponse",
]
