"""
API v1 Router - Combines all endpoint routers
"""
from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    users,
    expenses,
    categories,
    budgets,
    analytics,
    voice,
    ocr,
    ai,
    notifications,
    admin,
)

api_router = APIRouter()

# Authentication routes
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)

# User routes
api_router.include_router(
    users.router,
    prefix="/users",
    tags=["Users"]
)

# Expense routes
api_router.include_router(
    expenses.router,
    prefix="/expenses",
    tags=["Expenses"]
)

# Category routes
api_router.include_router(
    categories.router,
    prefix="/categories",
    tags=["Categories"]
)

# Budget routes
api_router.include_router(
    budgets.router,
    prefix="/budgets",
    tags=["Budgets"]
)

# Analytics routes
api_router.include_router(
    analytics.router,
    prefix="/analytics",
    tags=["Analytics"]
)

# Voice input routes
api_router.include_router(
    voice.router,
    prefix="/voice",
    tags=["Voice Input"]
)

# OCR routes
api_router.include_router(
    ocr.router,
    prefix="/ocr",
    tags=["OCR"]
)

# AI routes
api_router.include_router(
    ai.router,
    prefix="/ai",
    tags=["AI Features"]
)

# Notification routes
api_router.include_router(
    notifications.router,
    prefix="/notifications",
    tags=["Notifications"]
)

# Admin routes
api_router.include_router(
    admin.router,
    prefix="/admin",
    tags=["Admin"]
)

from app.api.v1.endpoints import goals
api_router.include_router(
    goals.router,
    prefix="/goals",
    tags=["Financial Goals"]
)
