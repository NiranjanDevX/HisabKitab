"""
Goal Service
"""
from typing import List, Optional, Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalUpdate

class GoalService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_goal(self, goal_in: GoalCreate, user_id: int) -> Goal:
        goal = Goal(
            **goal_in.dict(),
            user_id=user_id
        )
        self.db.add(goal)
        await self.db.commit()
        await self.db.refresh(goal)
        return goal

    async def get_goals(self, user_id: int) -> Sequence[Goal]:
        result = await self.db.execute(select(Goal).where(Goal.user_id == user_id))
        return result.scalars().all()

    async def get_goal(self, goal_id: int, user_id: int) -> Optional[Goal]:
        result = await self.db.execute(select(Goal).where(Goal.id == goal_id, Goal.user_id == user_id))
        return result.scalars().first()

    async def update_goal(self, goal_id: int, goal_in: GoalUpdate, user_id: int) -> Optional[Goal]:
        goal = await self.get_goal(goal_id, user_id)
        if not goal:
            return None
        
        update_data = goal_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(goal, field, value)
            
        await self.db.commit()
        await self.db.refresh(goal)
        return goal

    async def delete_goal(self, goal_id: int, user_id: int) -> bool:
        goal = await self.get_goal(goal_id, user_id)
        if not goal:
            return False
            
        await self.db.delete(goal)
        await self.db.commit()
        return True
