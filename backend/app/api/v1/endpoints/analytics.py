"""
Analytics Endpoints
"""
from typing import Optional, Any, cast
from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.schemas.analytics import AnalyticsResponse, ForecastResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter()


@router.get("/summary", response_model=AnalyticsResponse)
async def get_analytics_summary(
    period: str = Query("monthly", regex="^(daily|weekly|monthly)$"),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get spending analytics summary"""
    analytics_service = AnalyticsService(db)
    analytics = await analytics_service.get_summary(
        user_id=cast(Any, current_user.id),
        period=period,
        start_date=start_date,
        end_date=end_date
    )
    return analytics


@router.get("/forecast", response_model=ForecastResponse)
async def get_spending_forecast(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get spending forecast for next month"""
    analytics_service = AnalyticsService(db)
    forecast = await analytics_service.get_forecast(cast(Any, current_user.id))
    return forecast


@router.get("/trends")
async def get_spending_trends(
    months: int = Query(6, ge=1, le=12),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get spending trends over time"""
    analytics_service = AnalyticsService(db)
    trends = await analytics_service.get_trends(cast(Any, current_user.id), months)
    return trends

@router.get("/export")
async def export_data(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Export expenses as CSV"""
    from fastapi.responses import Response
    from app.services.export_service import export_service
    from sqlalchemy import select
    from app.models.expense import Expense
    from sqlalchemy.orm import selectinload
    
    # Get all expenses with category info
    result = await db.execute(
        select(Expense)
        .where(Expense.user_id == current_user.id)
        .options(selectinload(Expense.category))
        .order_by(Expense.date.desc())
    )
    expenses = result.scalars().all()
    
    csv_content = export_service.export_expenses_csv(list(expenses))
    
    filename = f"hisabkitab_export_{date.today().isoformat()}.csv"
    
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
