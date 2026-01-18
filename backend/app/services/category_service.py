"""
Category Service
"""
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


class CategoryService:
    """Category management service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_categories(self, user_id: int) -> List[Category]:
        """Get all categories for a user"""
        result = await self.db.execute(
            select(Category)
            .where(Category.user_id == user_id)
            .order_by(Category.name)
        )
        return result.scalars().all()
    
    async def get_category(self, category_id: int, user_id: int) -> Optional[Category]:
        """Get a specific category"""
        result = await self.db.execute(
            select(Category).where(
                and_(Category.id == category_id, Category.user_id == user_id)
            )
        )
        return result.scalar_one_or_none()
    
    async def create_category(self, user_id: int, category_data: CategoryCreate) -> Category:
        """Create a new category"""
        category = Category(
            user_id=user_id,
            is_default=False,
            **category_data.model_dump()
        )
        self.db.add(category)
        await self.db.commit()
        await self.db.refresh(category)
        return category
    
    async def update_category(
        self,
        category_id: int,
        user_id: int,
        category_data: CategoryUpdate
    ) -> Optional[Category]:
        """Update a category"""
        category = await self.get_category(category_id, user_id)
        if not category:
            return None
        
        update_data = category_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(category, field, value)
        
        await self.db.commit()
        await self.db.refresh(category)
        return category
    
    async def delete_category(self, category_id: int, user_id: int) -> bool:
        """Delete a category"""
        category = await self.get_category(category_id, user_id)
        if not category:
            return False
        
        await self.db.delete(category)
        await self.db.commit()
        return True
