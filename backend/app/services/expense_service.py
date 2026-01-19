"""
Expense Service
"""
from typing import Optional, List, Tuple, Any, cast
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
        total = int(total_result.scalar() or 0)
        
        # Apply pagination
        offset = (page - 1) * page_size
        query = query.order_by(Expense.date.desc()).offset(offset).limit(page_size)
        
        result = await self.db.execute(query)
        expenses = list(result.scalars().all())
        
        # Convert to response with category name
        expense_responses = []
        for expense in expenses:
            response = ExpenseResponse.model_validate(expense)
            if cast(Any, expense.category_id):
                cat_result = await self.db.execute(
                    select(Category.name).where(Category.id == cast(Any, expense.category_id))
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
        from app.services.budget_service import BudgetService
        from app.services.notification_service import NotificationService
        from app.services.event_service import EventService
        from app.models.event import EventType
        from app.models.notification import NotificationType

        expense = Expense(
            user_id=user_id,
            **expense_data.model_dump()
        )
        
        if not cast(Any, expense).date:
            cast(Any, expense).date = datetime.utcnow()
        
        self.db.add(expense)
        await self.db.flush() # Flush to get expense ID but don't commit yet
        
        # 1. Log Event
        event_service = EventService(self.db)
        await event_service.log_event(
            user_id=user_id,
            event_type=EventType.EXPENSE_CREATED,
            description=f"Expense of {expense.amount} created",
            event_metadata={"expense_id": expense.id, "amount": expense.amount}
        )

        # 2. Check for Budget Breaches
        budget_service = BudgetService(self.db)
        notification_service = NotificationService(self.db)
        
        # Get all budgets for this user (could be general or category-specific)
        budgets = await budget_service.get_budgets(user_id)
        for budget in budgets:
            # Check if this expense affects this budget
            if budget.category_id is None or budget.category_id == expense.category_id:
                # If budget was already exceeded, we might redundant notifications? 
                # For now, just check if NEW total exceeds it.
                spent = budget.spent if budget.spent is not None else 0.0
                limit = budget.amount
                
                if spent > limit:
                    await notification_service.create_notification(
                        user_id=user_id,
                        notification_type=NotificationType.BUDGET_EXCEEDED,
                        title=f"Budget Exceeded: {budget.name}",
                        message=f"Your spending has exceeded the budget limit of {limit}."
                    )
                elif spent > (limit * 0.9): # 90% Warning
                    await notification_service.create_notification(
                        user_id=user_id,
                        notification_type=NotificationType.BUDGET_WARNING,
                        title=f"Budget Warning: {budget.name}",
                        message=f"You have used over 90% of your budget limit for {budget.name}."
                    )

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
        
        # Log Event
        from app.services.event_service import EventService
        from app.models.event import EventType
        event_service = EventService(self.db)
        await event_service.log_event(
            user_id=user_id,
            event_type=EventType.EXPENSE_UPDATED,
            description=f"Expense {expense_id} updated",
            event_metadata={"expense_id": expense_id}
        )

        await self.db.commit()
        await self.db.refresh(expense)
        return expense
    
    async def delete_expense(self, expense_id: int, user_id: int) -> bool:
        """Delete an expense"""
        expense = await self.get_expense(expense_id, user_id)
        if not expense:
            return False
        
        # Log Event
        from app.services.event_service import EventService
        from app.models.event import EventType
        event_service = EventService(self.db)
        await event_service.log_event(
            user_id=user_id,
            event_type=EventType.EXPENSE_DELETED,
            description=f"Expense {expense_id} deleted"
        )

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

    async def export_csv(self, user_id: int):
        """Export expenses as CSV"""
        import csv
        import io
        from fastapi.responses import StreamingResponse
        
        result = await self.db.execute(
            select(Expense, Category.name)
            .outerjoin(Category, Expense.category_id == Category.id)
            .where(Expense.user_id == user_id)
            .order_by(Expense.date.desc())
        )
        data = result.all()
        
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Date", "Description", "Amount", "Category", "Payment Method"])
        
        for expense, category_name in data:
            writer.writerow([
                expense.date.isoformat(),
                expense.description,
                expense.amount,
                category_name or "Uncategorized",
                expense.payment_method
            ])
        
        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=expenses_{datetime.now().strftime('%Y%m%d')}.csv"}
        )

    async def export_pdf(self, user_id: int):
        """Export expenses as PDF (Simple Text/CSV fallback for now)"""
        # For a true PDF, we would need reportlab or similar. 
        # Returning as CSV for now as a functional placeholder to avoid extra dependencies.
        return await self.export_csv(user_id)
