"""
Authentication Endpoints
"""
from typing import Any, cast, Dict
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.limiter import limiter
from app.core.config import settings
from app.core.security import create_access_token
from app.tasks import send_email_task
from datetime import timedelta

from app.db.database import get_db
from app.schemas.auth import Token, RefreshTokenRequest
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user"""
    auth_service = AuthService(db)
    user = await auth_service.register(user_data)
    
    # Send verification email
    verification_token = create_access_token(
        data={"sub": str(user.email), "type": "verify"},
        expires_delta=timedelta(hours=24)
    )
    verification_link = f"{settings.FRONTEND_URL}/verify-email?token={verification_token}"
    
    # Trigger async email task
    send_email_task.delay(  # type: ignore
        to=user.email,
        subject="Verify your HisabKitab account",
        html_content=f"""
        <h2>Welcome to HisabKitab!</h2>
        <p>Please verify your email by clicking the link below:</p>
        <a href="{verification_link}">Verify Email</a>
        <p>This link expires in 24 hours.</p>
        """
    )
    
    return user


@router.post("/login", response_model=Token)
@limiter.limit("5/minute")
async def login(
    request: Request,
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    auth_service = AuthService(db)
    user = await auth_service.authenticate(
        email=form_data.username,
        password=form_data.password
    )
    if not user:
        # Standardize error message for security (User Not Found / Bad Password / Brute Force Lock)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    if not user.is_verified:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account not verified. A verification email has been sent.",
        )

    if not getattr(user, "is_active", True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",
        )
    return auth_service.create_tokens(cast(Any, user.id))


@router.post("/firebase-login", response_model=Token)
async def firebase_login(
    *,
    db: AsyncSession = Depends(get_db),
    token_data: Dict[str, str],
) -> Any:
    """
    Login or register using Firebase ID token
    """
    auth_service = AuthService(db)
    user = await auth_service.firebase_login(token_data.get("token", ""))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Firebase token",
        )
    elif not getattr(user, "is_active", True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",
        )
    return auth_service.create_tokens(cast(Any, user.id))


@router.post("/refresh", response_model=Token)
async def refresh_token(
    request: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    """Refresh access token"""
    auth_service = AuthService(db)
    tokens = await auth_service.refresh_tokens(request.refresh_token)
    
    if not tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    
    return tokens


@router.post("/logout")
async def logout():
    """Logout user (client should discard tokens)"""
    return {"message": "Successfully logged out"}
