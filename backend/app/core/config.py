"""
Application Configuration
"""
import os
import json
from typing import List, Optional
import httpx
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


def fetch_remote_config(url: Optional[str], api_key: Optional[str]) -> dict:
    """
    Fetches configuration from your remote secret manager at application startup.
    """
    if not url or not api_key:
        return {}
    
    headers = {"Authorization": f"Bearer {api_key}"}
    try:
        response = httpx.get(url, headers=headers, timeout=5.0)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"--> [Config] WARNING: Could not fetch remote configuration: {e}")
        return {}


class BootstrapSettings(BaseSettings):
    """Loads variables needed to connect to the remote secret manager."""
    DOTENV_SERVER_URL: Optional[str] = None
    DOTENV_SERVER_KEY: Optional[str] = None
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra='ignore'
    )


class Settings(BaseSettings):
    """Application settings loaded from environment variables or remote server"""
    
    # Bootstrap
    DOTENV_SERVER_URL: Optional[str] = None
    DOTENV_SERVER_KEY: Optional[str] = None
    
    # Application
    APP_NAME: str = "HisabKitab"
    APP_ENV: str = "development"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/hisabkitab"
    
    # JWT Authentication
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"
    
    # Celery Configuration
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    
    # Firebase Admin SDK Configuration
    FIREBASE_PROJECT_ID: Optional[str] = None
    FIREBASE_CLIENT_EMAIL: Optional[str] = None
    FIREBASE_PRIVATE_KEY: Optional[str] = None
    FIREBASE_PRIVATE_KEY_ID: Optional[str] = None
    FIREBASE_CLIENT_ID: Optional[str] = None
    FIREBASE_CLIENT_X509_CERT_URL: Optional[str] = None
    
    # SMTP (Email Service)
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM_EMAIL: Optional[str] = None
    SMTP_TLS: bool = True
    SMTP_SSL: bool = False
    
    # AWS S3 for Profile Pics
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    S3_BUCKET_NAME: Optional[str] = None
    
    # AI Configuration (LongCat & Hugging Face)
    LONGCAT_API_KEY: Optional[str] = None
    HF_API_KEY: Optional[str] = None
    
    # Feature Flags
    ENABLE_AI_FEATURES: bool = True
    ENABLE_VOICE_INPUT: bool = True
    ENABLE_OCR: bool = True
    ENABLE_3D_UI: bool = True
    ENABLE_EMAIL_NOTIFICATIONS: bool = True
    
    # CORS
    CORS_ORIGINS: List[str] = Field(
        default=[
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:5500",
            "http://127.0.0.1:5500"
        ]
    )
    FRONTEND_URL: str = "http://localhost:3000"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


def get_settings() -> Settings:
    """Initializes settings combining local bootstrap and remote config."""
    bootstrap = BootstrapSettings()
    remote_data = fetch_remote_config(
        bootstrap.DOTENV_SERVER_URL, 
        bootstrap.DOTENV_SERVER_KEY
    )
    
    # Merge remote into bootstrap data
    combined = {**bootstrap.model_dump(), **remote_data}
    return Settings.model_validate(combined)


settings = get_settings()
