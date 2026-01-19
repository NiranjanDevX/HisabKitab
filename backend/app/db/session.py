"""
Session Management
"""
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from app.db.database import engine

SessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    autoflush=False,
)
