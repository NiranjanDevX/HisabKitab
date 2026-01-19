"""
Expense Endpoints
"""
from typing import Optional, Any, cast
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseUpdate,
    ExpenseResponse,
    ExpenseListResponse,
)
from app.services.expense_service import ExpenseService

router = APIRouter()


@router.get("/", response_model=ExpenseListResponse)
async def get_expenses(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category_id: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all expenses for current user with filtering"""
    expense_service = ExpenseService(db)
    expenses, total = await expense_service.get_expenses(
        user_id=cast(Any, current_user.id),
        page=page,
        page_size=page_size,
        category_id=category_id,
        start_date=start_date,
        end_date=end_date,
        search=search
    )
    
    return ExpenseListResponse(
        items=expenses,
        total=total,
        page=page,
        page_size=page_size
    )


@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(
    expense_data: ExpenseCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new expense"""
    expense_service = ExpenseService(db)
    expense = await expense_service.create_expense(cast(Any, current_user.id), expense_data)
    return expense


@router.get("/{expense_id}", response_model=ExpenseResponse)
async def get_expense(
    expense_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific expense"""
    expense_service = ExpenseService(db)
    expense = await expense_service.get_expense(expense_id, cast(Any, current_user.id))
    
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    return expense


@router.put("/{expense_id}", response_model=ExpenseResponse)
async def update_expense(
    expense_id: int,
    expense_data: ExpenseUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Update an expense"""
    expense_service = ExpenseService(db)
    expense = await expense_service.update_expense(
        expense_id,
        cast(Any, current_user.id),
        expense_data
    )
    
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    return expense


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(
    expense_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete an expense"""
    expense_service = ExpenseService(db)
    deleted = await expense_service.delete_expense(expense_id, cast(Any, current_user.id))
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    return None


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def bulk_delete_expenses(
    expense_ids: list[int] = Query(...),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Bulk delete expenses"""
    expense_service = ExpenseService(db)
    await expense_service.bulk_delete_expenses(expense_ids, cast(Any, current_user.id))
    return None

@router.get("/export/csv")
async def export_expenses_csv(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Export expenses as CSV"""
    expense_service = ExpenseService(db)
    return await expense_service.export_csv(cast(Any, current_user.id))


@router.get("/export/pdf")
async def export_expenses_pdf(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Export expenses as PDF"""
    expense_service = ExpenseService(db)
    return await expense_service.export_pdf(cast(Any, current_user.id))
