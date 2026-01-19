"""
API Dependencies
"""
from typing import Generator, Optional, Any, cast

from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError

from app.db.database import get_db
from app.core.security import decode_token
from app.models.user import User, UserRole
from app.services.auth_service import AuthService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme),
    x_session_token: Optional[str] = Header(None, alias="X-Session-Token")
) -> User:
    """Get current authenticated user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Priority: X-Session-Token > Authorization Bearer
    final_token = x_session_token if x_session_token else token
    
    if not final_token:
        raise credentials_exception

    payload = decode_token(final_token)
    if payload is None:
        raise credentials_exception
    
    user_id = cast(Any, payload.get("sub"))
    if user_id is None:
        raise credentials_exception
    
    # Convert to int since DB expects integer
    try:
        user_id = int(user_id)
    except (ValueError, TypeError):
        raise credentials_exception
    
    auth_service = AuthService(db)
    user = await auth_service.get_user_by_id(user_id)
    
    if user is None:
        raise credentials_exception
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current active user"""
    if not cast(Any, current_user.is_active):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user


async def get_current_admin_user(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """Get current admin user"""
    if cast(Any, current_user.role) != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user
