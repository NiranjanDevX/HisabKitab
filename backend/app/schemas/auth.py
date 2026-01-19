"""
Authentication Schemas
"""
from pydantic import BaseModel, EmailStr
from typing import Optional


class Token(BaseModel):
    """JWT Token response schema"""
    access_token: str
    refresh_token: str
    session_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """JWT Token payload schema"""
    sub: int  # User ID
    exp: int
    type: str  # "access" or "refresh"


class LoginRequest(BaseModel):
    """Login request schema"""
    email: EmailStr
    password: str


class RefreshTokenRequest(BaseModel):
    """Refresh token request schema"""
    refresh_token: str


class PasswordResetRequest(BaseModel):
    """Password reset request schema"""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Password reset confirmation schema"""
    token: str
    new_password: str
