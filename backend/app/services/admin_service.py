"""
Admin Service
"""
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update

from app.models.user import User
from app.models.expense import Expense
from app.models.event import Event


class AdminService:
    """Admin panel service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_system_stats(self) -> dict:
        """Get system-wide statistics"""
        # Total users
        user_count = await self.db.execute(select(func.count(User.id)))
        
        # Total expenses
        expense_count = await self.db.execute(select(func.count(Expense.id)))
        expense_amount = await self.db.execute(select(func.sum(Expense.amount)))
        
        # Active users (logged in last 30 days)
        from datetime import datetime, timedelta
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        active_users = await self.db.execute(
            select(func.count(User.id)).where(User.updated_at >= thirty_days_ago)
        )
        
        return {
            "total_users": user_count.scalar() or 0,
            "active_users": active_users.scalar() or 0,
            "total_expenses": expense_count.scalar() or 0,
            "total_expense_amount": expense_amount.scalar() or 0,
        }
    
    async def get_users(self, page: int, page_size: int) -> dict:
        """Get all users paginated with basic stats"""
        offset = (page - 1) * page_size
        
        # Subquery for expense count
        expense_count_sub = (
            select(func.count(Expense.id))
            .where(Expense.user_id == User.id)
            .correlate(User)
            .label("expense_count")
        )
        
        # Subquery for total spent
        total_spent_sub = (
            select(func.sum(Expense.amount))
            .where(Expense.user_id == User.id)
            .correlate(User)
            .label("total_spent")
        )
        
        result = await self.db.execute(
            select(User, expense_count_sub, total_spent_sub)
            .order_by(User.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )
        
        users_data = []
        for user, expense_count, total_spent in result:
            user_dict = {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "is_active": user.is_active,
                "is_admin": user.role == "admin",
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "expense_count": expense_count or 0,
                "total_spent": float(total_spent or 0),
                "occupation": user.occupation,
                "phone_number": user.phone_number,
                "profile_pic": user.profile_pic
            }
            users_data.append(user_dict)
        
        total_result = await self.db.execute(select(func.count(User.id)))
        total = total_result.scalar() or 0
        
        return {
            "items": users_data,
            "total": total,
            "page": page,
            "page_size": page_size
        }
    
    async def ban_user(self, user_id: int) -> None:
        """Soft-ban a user"""
        await self.db.execute(
            update(User).where(User.id == user_id).values(is_active=False)
        )
        await self.db.commit()
    
    async def unban_user(self, user_id: int) -> None:
        """Unban a user"""
        await self.db.execute(
            update(User).where(User.id == user_id).values(is_active=True)
        )
        await self.db.commit()
    
    async def get_analytics(self) -> dict:
        """Get admin analytics"""
        from datetime import datetime, timedelta
        
        # Daily signups for last 7 days
        daily_signups = []
        for i in range(7):
            day_start = datetime.utcnow().replace(
                hour=0, minute=0, second=0, microsecond=0
            ) - timedelta(days=i)
            day_end = day_start + timedelta(days=1)
            
            count = await self.db.execute(
                select(func.count(User.id)).where(
                    User.created_at >= day_start,
                    User.created_at < day_end
                )
            )
            daily_signups.append({
                "date": day_start.strftime("%Y-%m-%d"),
                "count": count.scalar() or 0
            })
        
        return {
            "daily_signups": list(reversed(daily_signups))
        }
    
    async def get_logs(self, page: int, page_size: int) -> dict:
        """Get system event logs"""
        offset = (page - 1) * page_size
        
        result = await self.db.execute(
            select(Event)
            .order_by(Event.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )
        events = result.scalars().all()
        
        total_result = await self.db.execute(select(func.count(Event.id)))
        total = total_result.scalar() or 0
        
        return {
            "logs": events,
            "total": total,
            "page": page,
            "page_size": page_size
        }
