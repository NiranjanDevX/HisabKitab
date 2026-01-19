"""
Admin Panel Endpoints
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.api.deps import get_current_admin_user
from app.models.user import User
from app.services.admin_service import AdminService

router = APIRouter()


@router.get("/stats")
async def get_system_stats(
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get system-wide statistics"""
    admin_service = AdminService(db)
    stats = await admin_service.get_system_stats()
    return stats


@router.get("/users")
async def get_all_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all users (admin only)"""
    admin_service = AdminService(db)
    users = await admin_service.get_users(page, page_size)
    return users


@router.put("/users/{user_id}/ban")
async def ban_user(
    user_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Soft-ban a user"""
    admin_service = AdminService(db)
    await admin_service.ban_user(user_id)
    return {"message": "User banned successfully"}


@router.put("/users/{user_id}/unban")
async def unban_user(
    user_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Unban a user"""
    admin_service = AdminService(db)
    await admin_service.unban_user(user_id)
    return {"message": "User unbanned successfully"}


@router.get("/analytics")
async def get_admin_analytics(
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get admin analytics dashboard data"""
    admin_service = AdminService(db)
    analytics = await admin_service.get_analytics()
    return analytics


@router.get("/logs")
async def get_system_logs(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get system event logs"""
    admin_service = AdminService(db)
    logs = await admin_service.get_logs(page, page_size)
    return logs


@router.get("/feature-flags")
async def get_feature_flags(
    current_user: User = Depends(get_current_admin_user)
):
    """Get current feature flag status"""
    from app.core.feature_flags import feature_flags
    return feature_flags.get_all_flags()
