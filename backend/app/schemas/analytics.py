"""
Analytics Schemas
"""
from pydantic import BaseModel
from typing import List, Optional
from datetime import date


class SpendingSummary(BaseModel):
    """Daily/Weekly/Monthly spending summary"""
    period: str  # "daily", "weekly", "monthly"
    total: float
    average: float
    count: int
    start_date: date
    end_date: date


class CategoryBreakdown(BaseModel):
    """Category-wise spending breakdown"""
    category_id: int
    category_name: str
    category_icon: Optional[str]
    category_color: Optional[str]
    total: float
    percentage: float
    count: int


class TrendData(BaseModel):
    """Spending trend data point"""
    date: date
    amount: float


class AnalyticsResponse(BaseModel):
    """Complete analytics response"""
    summary: SpendingSummary
    category_breakdown: List[CategoryBreakdown]
    daily_trend: List[TrendData]
    month_over_month: Optional[float] = None  # Percentage change


class ForecastResponse(BaseModel):
    """Spending forecast response"""
    predicted_amount: float
    confidence: float
    based_on_months: int
