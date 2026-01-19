"""
Goal Endpoints
"""
from typing import List, cast, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_active_user, get_db
from app.models.user import User
from app.schemas.goal import GoalCreate, GoalResponse, GoalUpdate
from app.services.goal_service import GoalService

router = APIRouter()

@router.post("/", response_model=GoalResponse)
async def create_goal(
    goal_in: GoalCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new financial goal"""
    service = GoalService(db)
    # Type cast for static analysis
    user_id = cast(int, current_user.id) 
    return await service.create_goal(goal_in, user_id)

@router.get("/", response_model=List[GoalResponse])
async def read_goals(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all user goals"""
    service = GoalService(db)
    user_id = cast(int, current_user.id)
    return await service.get_goals(user_id)

@router.put("/{goal_id}", response_model=GoalResponse)
async def update_goal(
    goal_id: int,
    goal_in: GoalUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a goal"""
    service = GoalService(db)
    user_id = cast(int, current_user.id)
    goal = await service.update_goal(goal_id, goal_in, user_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal

@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_goal(
    goal_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a goal"""
    service = GoalService(db)
    user_id = cast(int, current_user.id)
    success = await service.delete_goal(goal_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Goal not found")
