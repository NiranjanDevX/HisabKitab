"""
Expense Service
"""
from typing import Optional, List, Tuple
from datetime import date, datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

from app.models.expense import Expense
from app.models.category import Category
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse


class ExpenseService:
    """Expense management service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_expenses(
        self,
        user_id: int,
        page: int = 1,
        page_size: int = 20,
        category_id: Optional[int] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        search: Optional[str] = None
    ) -> Tuple[List[ExpenseResponse], int]:
        """Get expenses with filtering and pagination"""
        query = select(Expense).where(Expense.user_id == user_id)
        count_query = select(func.count(Expense.id)).where(Expense.user_id == user_id)
        
        # Apply filters
        if category_id:
            query = query.where(Expense.category_id == category_id)
            count_query = count_query.where(Expense.category_id == category_id)
        
        if start_date:
            start_datetime = datetime.combine(start_date, datetime.min.time())
            query = query.where(Expense.date >= start_datetime)
            count_query = count_query.where(Expense.date >= start_datetime)
        
        if end_date:
            end_datetime = datetime.combine(end_date, datetime.max.time())
            query = query.where(Expense.date <= end_datetime)
            count_query = count_query.where(Expense.date <= end_datetime)
        
        if search:
            search_filter = Expense.description.ilike(f"%{search}%")
            query = query.where(search_filter)
            count_query = count_query.where(search_filter)
        
        # Get total count
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Apply pagination
        offset = (page - 1) * page_size
        query = query.order_by(Expense.date.desc()).offset(offset).limit(page_size)
        
        result = await self.db.execute(query)
        expenses = result.scalars().all()
        
        # Convert to response with category name
        expense_responses = []
        for expense in expenses:
            response = ExpenseResponse.model_validate(expense)
            if expense.category_id:
                cat_result = await self.db.execute(
                    select(Category.name).where(Category.id == expense.category_id)
                )
                response.category_name = cat_result.scalar_one_or_none()
            expense_responses.append(response)
        
        return expense_responses, total
    
    async def get_expense(self, expense_id: int, user_id: int) -> Optional[Expense]:
        """Get a specific expense"""
        result = await self.db.execute(
            select(Expense).where(
                and_(Expense.id == expense_id, Expense.user_id == user_id)
            )
        )
        return result.scalar_one_or_none()
    
    async def create_expense(self, user_id: int, expense_data: ExpenseCreate) -> Expense:
        """Create a new expense"""
        expense = Expense(
            user_id=user_id,
            **expense_data.model_dump()
        )
        
        if not expense.date:
            expense.date = datetime.utcnow()
        
        self.db.add(expense)
        await self.db.commit()
        await self.db.refresh(expense)
        return expense
    
    async def update_expense(
        self,
        expense_id: int,
        user_id: int,
        expense_data: ExpenseUpdate
    ) -> Optional[Expense]:
        """Update an expense"""
        expense = await self.get_expense(expense_id, user_id)
        if not expense:
            return None
        
        update_data = expense_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(expense, field, value)
        
        await self.db.commit()
        await self.db.refresh(expense)
        return expense
    
    async def delete_expense(self, expense_id: int, user_id: int) -> bool:
        """Delete an expense"""
        expense = await self.get_expense(expense_id, user_id)
        if not expense:
            return False
        
        await self.db.delete(expense)
        await self.db.commit()
        return True
    
    async def bulk_delete_expenses(self, expense_ids: List[int], user_id: int) -> int:
        """Bulk delete expenses"""
        deleted_count = 0
        for expense_id in expense_ids:
            if await self.delete_expense(expense_id, user_id):
                deleted_count += 1
        return deleted_count
