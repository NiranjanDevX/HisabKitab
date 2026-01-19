"""
Rate Limiter Configuration using SlowAPI
"""
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from app.core.config import settings

# Initialize limiter with Redis backend if available, otherwise memory
# For now using memory fallback for simplicity in dev, or Redis if configured
# SlowAPI defaults to memory if storage_uri is not set explicitly to a redis url
# We can set storage_uri=settings.CELERY_BROKER_URL

limiter = Limiter(
    key_func=get_remote_address, # Identification by IP
    default_limits=["100/minute"], # Global limit
    storage_uri="memory://" # Explicitly memory for now to avoid async redis issues with slowapi
)
