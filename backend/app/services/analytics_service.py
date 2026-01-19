"""
Analytics Service
"""
from typing import Optional, List
from datetime import date, datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

from app.models.expense import Expense
from app.models.category import Category
from app.schemas.analytics import (
    SpendingSummary,
    CategoryBreakdown,
    TrendData,
    AnalyticsResponse,
    ForecastResponse,
)


class AnalyticsService:
    """Analytics and insights service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_summary(
        self,
        user_id: int,
        period: str = "monthly",
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> AnalyticsResponse:
        """Get comprehensive analytics summary"""
        now = datetime.utcnow()
        
        # Determine date range
        if not end_date:
            end_date = now.date()
        
        if not start_date:
            if period == "daily":
                start_date = end_date
            elif period == "weekly":
                start_date = end_date - timedelta(days=7)
            else:  # monthly
                start_date = end_date.replace(day=1)
        
        start_datetime = datetime.combine(start_date, datetime.min.time())
        end_datetime = datetime.combine(end_date, datetime.max.time())
        
        # Get total and average
        result = await self.db.execute(
            select(
                func.sum(Expense.amount).label("total"),
                func.avg(Expense.amount).label("average"),
                func.count(Expense.id).label("count_val")
            ).where(
                and_(
                    Expense.user_id == user_id,
                    Expense.date >= start_datetime,
                    Expense.date <= end_datetime
                )
            )
        )
        row = result.one()
        
        summary = SpendingSummary(
            period=period,
            total=float(row[0]) if row[0] else 0.0,
            average=float(row[1]) if row[1] else 0.0,
            count=int(row[2]) if row[2] else 0,
            start_date=start_date,
            end_date=end_date
        )
        
        # Get category breakdown
        category_breakdown = await self._get_category_breakdown(
            user_id, start_datetime, end_datetime, summary.total
        )
        
        # Get daily trend
        daily_trend = await self._get_daily_trend(
            user_id, start_datetime, end_datetime
        )
        
        # Calculate month-over-month change
        mom_change = await self._calculate_mom_change(user_id)
        
        return AnalyticsResponse(
            summary=summary,
            category_breakdown=category_breakdown,
            daily_trend=daily_trend,
            month_over_month=mom_change
        )
    
    async def _get_category_breakdown(
        self,
        user_id: int,
        start_datetime: datetime,
        end_datetime: datetime,
        total: float
    ) -> List[CategoryBreakdown]:
        """Get spending breakdown by category"""
        result = await self.db.execute(
            select(
                Expense.category_id,
                func.sum(Expense.amount).label("total"),
                func.count(Expense.id).label("count_val")
            ).where(
                and_(
                    Expense.user_id == user_id,
                    Expense.date >= start_datetime,
                    Expense.date <= end_datetime
                )
            ).group_by(Expense.category_id)
        )
        
        breakdowns = []
        for row in result:
            if row.category_id:
                cat_result = await self.db.execute(
                    select(Category).where(Category.id == row.category_id)
                )
                category = cat_result.scalar_one_or_none()
                if category:
                    breakdowns.append(CategoryBreakdown(
                        category_id=int(category.id), # type: ignore
                        category_name=str(category.name),
                        category_icon=str(category.icon) if getattr(category, 'icon') else None,
                        category_color=str(category.color) if getattr(category, 'color') else None,
                        total=float(row[1]),
                        percentage=(float(row[1]) / total * 100) if total > 0 else 0,
                        count=int(row[2])
                    ))
        
        return sorted(breakdowns, key=lambda x: x.total, reverse=True)
    
    async def _get_daily_trend(
        self,
        user_id: int,
        start_datetime: datetime,
        end_datetime: datetime
    ) -> List[TrendData]:
        """Get daily spending trend"""
        result = await self.db.execute(
            select(
                func.date(Expense.date).label("day"),
                func.sum(Expense.amount).label("amount")
            ).where(
                and_(
                    Expense.user_id == user_id,
                    Expense.date >= start_datetime,
                    Expense.date <= end_datetime
                )
            ).group_by(func.date(Expense.date))
            .order_by(func.date(Expense.date))
        )
        
        return [
            TrendData(date=row.day, amount=row.amount)
            for row in result
        ]
    
    async def _calculate_mom_change(self, user_id: int) -> Optional[float]:
        """Calculate month-over-month spending change"""
        now = datetime.utcnow()
        
        # Current month
        current_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        current_result = await self.db.execute(
            select(func.sum(Expense.amount)).where(
                and_(
                    Expense.user_id == user_id,
                    Expense.date >= current_start
                )
            )
        )
        current_total = current_result.scalar() or 0
        
        # Previous month
        prev_end = current_start - timedelta(days=1)
        prev_start = prev_end.replace(day=1)
        prev_result = await self.db.execute(
            select(func.sum(Expense.amount)).where(
                and_(
                    Expense.user_id == user_id,
                    Expense.date >= prev_start,
                    Expense.date <= prev_end
                )
            )
        )
        prev_total = prev_result.scalar() or 0
        
        if prev_total > 0:
            return ((current_total - prev_total) / prev_total) * 100
        return None
    
    async def get_forecast(self, user_id: int) -> ForecastResponse:
        """Get spending forecast based on historical data"""
        # Get last 3 months average
        now = datetime.utcnow()
        three_months_ago = now - timedelta(days=90)
        
        result = await self.db.execute(
            select(func.avg(Expense.amount).label("avg")).where(
                and_(
                    Expense.user_id == user_id,
                    Expense.date >= three_months_ago
                )
            )
        )
        avg_expense = result.scalar() or 0
        
        # Estimate monthly based on average daily spending
        result = await self.db.execute(
            select(func.count(Expense.id)).where(
                and_(
                    Expense.user_id == user_id,
                    Expense.date >= three_months_ago
                )
            )
        )
        expense_count = result.scalar() or 0
        
        # Calculate predicted monthly
        days_in_period = 90
        daily_avg = (avg_expense * expense_count) / days_in_period if expense_count > 0 else 0
        predicted_monthly = daily_avg * 30
        
        return ForecastResponse(
            predicted_amount=predicted_monthly,
            confidence=0.7 if expense_count > 30 else 0.5,
            based_on_months=3
        )
    
    async def get_trends(self, user_id: int, months: int = 6) -> List[dict]:
        """Get monthly spending trends"""
        now = datetime.utcnow()
        trends = []
        
        for i in range(months):
            month_start = (now - timedelta(days=30 * i)).replace(
                day=1, hour=0, minute=0, second=0, microsecond=0
            )
            if i > 0:
                month_end = (now - timedelta(days=30 * (i - 1))).replace(
                    day=1, hour=0, minute=0, second=0, microsecond=0
                ) - timedelta(days=1)
            else:
                month_end = now
            
            result = await self.db.execute(
                select(func.sum(Expense.amount)).where(
                    and_(
                        Expense.user_id == user_id,
                        Expense.date >= month_start,
                        Expense.date <= month_end
                    )
                )
            )
            total = result.scalar() or 0
            
            trends.append({
                "month": month_start.strftime("%B %Y"),
                "total": total
            })
        
        return list(reversed(trends))
