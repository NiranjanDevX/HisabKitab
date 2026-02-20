"""
Authentication Service
"""
from typing import Optional, Any, cast
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.user import User
from app.models.category import Category, DEFAULT_CATEGORIES
from app.schemas.user import UserCreate, UserUpdate
from app.schemas.auth import Token
from app.services.firebase_service import FirebaseService
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.core.exceptions import ConflictException, NotFoundException


class AuthService:
    """Authentication service for user management"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def register(self, user_data: UserCreate) -> User:
        """Register a new user"""
        # Check if email already exists
        existing_user = await self.get_user_by_email(user_data.email)
        if existing_user:
            raise ConflictException("Email already registered")
        
        # Create user
        user = User(
            email=user_data.email,
            hashed_password=get_password_hash(user_data.password),
            full_name=user_data.full_name,
            occupation=user_data.occupation,
            date_of_birth=user_data.date_of_birth,
            phone_number=user_data.phone_number,
            profile_pic=user_data.profile_pic,
        )
        self.db.add(user)
        await self.db.flush()
        
        # Create default categories for the user
        for cat_data in DEFAULT_CATEGORIES:
            category = Category(
                user_id=user.id,
                name=cat_data["name"],
                icon=cat_data["icon"],
                color=cat_data["color"],
                is_default=True,
            )
            self.db.add(category)
        
        await self.db.commit()
        await self.db.refresh(user)
        return user
    
    async def firebase_login(self, token: str) -> Optional[User]:
        """Login or register using Firebase ID token"""
        decoded_token = await FirebaseService.verify_token(token)
        if not decoded_token:
            return None
            
        email = decoded_token.get("email")
        if not email:
            return None
            
        user = await self.get_user_by_email(email)
        
        if user:
            # Update existing user details from Firebase token
            full_name = decoded_token.get("name")
            profile_pic = decoded_token.get("picture")
            
            should_update = False
            if full_name and user.full_name != full_name:
                user.full_name = full_name
                should_update = True
                
            if profile_pic and user.profile_pic != profile_pic:
                user.profile_pic = profile_pic
                should_update = True
            
            if not user.is_verified:
                 user.is_verified = True
                 should_update = True
            
            if should_update:
                await self.db.commit()
                await self.db.refresh(user)
        else:
            # Create new user for social login
            full_name = decoded_token.get("name")
            profile_pic = decoded_token.get("picture")
            
            # Use random password for social users
            import secrets
            user = User(
                email=email,
                hashed_password=get_password_hash(secrets.token_urlsafe(32)),
                full_name=full_name,
                profile_pic=profile_pic,
                is_verified=True
            )
            self.db.add(user)
            await self.db.flush()
            
            # Create default categories
            for cat_data in DEFAULT_CATEGORIES:
                category = Category(
                    user_id=user.id,
                    name=cat_data["name"],
                    icon=cat_data["icon"],
                    color=cat_data["color"],
                    is_default=True,
                )
                self.db.add(category)
            
            await self.db.commit()
            await self.db.refresh(user)
        
        return user

    async def authenticate(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password (with security checks)"""
        from app.services.redis_service import redis_service
        from app.tasks import send_email_task
        from app.services.email_service import email_service
        from app.core.config import settings
        from datetime import timedelta
        # Ensure UserCreate is available if needed, but here we just need User model
        
        # 1. Check Brute Force Lock
        await redis_service.connect()
        if redis_service.client:
            failures = await redis_service.client.get(f"failed_login:{email}")
            if failures and int(failures) >= 3:
                return None

        user = await self.get_user_by_email(email)
        
        # 2. Add fake delay to prevent timing attacks (basic)
        # import asyncio; await asyncio.sleep(0.1) 

        if not user or not getattr(user, "hashed_password", None):
             # Increment failure count
             if redis_service.client:
                 await redis_service.client.incr(f"failed_login:{email}")
                 await redis_service.client.expire(f"failed_login:{email}", 900)
             return None

        if not verify_password(password, str(user.hashed_password)):
            # Increment failure count
            if redis_service.client:
                 val = await redis_service.client.incr(f"failed_login:{email}")
                 await redis_service.client.expire(f"failed_login:{email}", 900)
                 
                 # If hit limit, send auto-reset email
                 if int(val) == 3:
                      # Generate reset token
                      reset_token = create_access_token(data={"sub": str(user.email), "type": "reset"}, expires_delta=timedelta(minutes=15))
                      # Use settings.FRONTEND_URL directly (type checker might flag if not updated, but it's there)
                      reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
                      
                      # Render template
                      html = email_service.render_template("forgot_password.html", link=reset_link, name=user.full_name or "User")
                      send_email_task.delay(user.email, "Security Alert: Login Attempts Exceeded", html)
            
            return None

        # 3. Check Verification Status
        # Use simple boolean check, assuming mapped value
        if not user.is_verified: # type: ignore
             # Trigger verification email
             token = create_access_token(data={"sub": str(user.email), "type": "verification"})
             verify_link = f"{settings.FRONTEND_URL}/verify?token={token}"
             html = email_service.render_template("verification.html", link=verify_link, name=user.full_name or "User")
             send_email_task.delay(user.email, "Verify your account", html) # type: ignore
             
             # Return User (Controller handles masking)
             pass 

        # Login Success: Clear failures
        if redis_service.client:
            await redis_service.client.delete(f"failed_login:{email}")

        return user
    
    
    def create_tokens(self, user_id: int) -> Token:
        """Create access and refresh tokens"""
        access_token = create_access_token(data={"sub": str(user_id)})
        refresh_token = create_refresh_token(data={"sub": str(user_id)})
        # Using access_token as session_token for now for parity
        session_token = access_token 
        
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            session_token=session_token,
        )
    
    async def refresh_tokens(self, refresh_token: str) -> Optional[Token]:
        """Refresh access token using refresh token"""
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            return None
        
        sub = payload.get("sub")
        user_id = int(cast(Any, sub)) if sub else None
        if user_id is None:
            return None
            
        user = await self.get_user_by_id(user_id)
        if not user:
            return None
        
        return self.create_tokens(user_id)
    
    async def update_user(self, user_id: int, user_data: UserUpdate) -> User:
        """Update user information"""
        user = await self.get_user_by_id(user_id)
        if not user:
            raise NotFoundException("User not found")
        
        update_data = user_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        
        await self.db.commit()
        await self.db.refresh(user)
        return user
    
    async def delete_user(self, user_id: int) -> bool:
        """Delete user and all related data"""
        user = await self.get_user_by_id(user_id)
        if not user:
            raise NotFoundException("User not found")
        
        await self.db.delete(user)
        await self.db.commit()
        return True
