"""
Budget Service
"""
from typing import Optional, List, Any, cast
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func

from app.models.budget import Budget
from app.models.expense import Expense
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetResponse


class BudgetService:
    """Budget management service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_budgets(self, user_id: int) -> List[BudgetResponse]:
        """Get all budgets for a user with spending info"""
        result = await self.db.execute(
            select(Budget).where(Budget.user_id == user_id)
        )
        budgets = result.scalars().all()
        
        budget_responses = []
        for budget in budgets:
            spent = await self._calculate_spent(budget)
            response = BudgetResponse.model_validate(budget)
            response.spent = cast(Any, spent)
            response.remaining = float(max(0, cast(Any, budget.amount) - cast(Any, spent)))
            if cast(Any, budget.amount) > 0:
                response.percentage_used = float(cast(Any, spent) / cast(Any, budget.amount) * 100)
            else:
                response.percentage_used = 0.0
            budget_responses.append(response)
        
        return budget_responses
    
    async def _calculate_spent(self, budget: Budget) -> float:
        """Calculate amount spent for a budget period"""
        now = datetime.utcnow()
        
        # Determine period start date
        if str(budget.period) == "daily":
            start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
        elif str(budget.period) == "weekly":
            start_date = now - timedelta(days=now.weekday())
            start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
        else:  # monthly
            start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # Build query
        query = select(func.sum(Expense.amount)).where(
            and_(
                Expense.user_id == budget.user_id,
                Expense.date >= start_date
            )
        )
        
        if cast(Any, budget).category_id:
            query = query.where(Expense.category_id == budget.category_id)
        
        result = await self.db.execute(query)
        spent = result.scalar() or 0.0
        return spent
    
    async def get_budget(self, budget_id: int, user_id: int) -> Optional[Budget]:
        """Get a specific budget"""
        result = await self.db.execute(
            select(Budget).where(
                and_(Budget.id == budget_id, Budget.user_id == user_id)
            )
        )
        return result.scalar_one_or_none()
    
    async def get_budget_with_spending(self, budget_id: int, user_id: int) -> Optional[BudgetResponse]:
        """Get budget with calculated spending"""
        budget = await self.get_budget(budget_id, user_id)
        if not budget:
            return None
        
        spent = await self._calculate_spent(budget)
        response = BudgetResponse.model_validate(budget)
        response.spent = cast(Any, spent)
        response.remaining = float(max(0, cast(Any, budget.amount) - cast(Any, spent)))
        if cast(Any, budget.amount) > 0:
            response.percentage_used = float(cast(Any, spent) / cast(Any, budget.amount) * 100)
        else:
            response.percentage_used = 0.0
        return response
    
    async def create_budget(self, user_id: int, budget_data: BudgetCreate) -> Budget:
        """Create a new budget"""
        budget = Budget(
            user_id=user_id,
            **budget_data.model_dump()
        )
        self.db.add(budget)
        await self.db.commit()
        await self.db.refresh(budget)
        return budget
    
    async def update_budget(
        self,
        budget_id: int,
        user_id: int,
        budget_data: BudgetUpdate
    ) -> Optional[Budget]:
        """Update a budget"""
        budget = await self.get_budget(budget_id, user_id)
        if not budget:
            return None
        
        update_data = budget_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(budget, field, value)
        
        await self.db.commit()
        await self.db.refresh(budget)
        return budget
    
    async def delete_budget(self, budget_id: int, user_id: int) -> bool:
        """Delete a budget"""
        budget = await self.get_budget(budget_id, user_id)
        if not budget:
            return False
        
        await self.db.delete(budget)
        await self.db.commit()
        return True
