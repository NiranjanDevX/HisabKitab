import time
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import collections

class RateLimiterMiddleware(BaseHTTPMiddleware):
    """
    Simple in-memory rate limiter for AI endpoints.
    In production, use Redis for distributed rate limiting.
    """
    def __init__(self, app, requests_per_minute: int = 10):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.user_requests = collections.defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        # Only rate limit AI endpoints
        if "/api/v1/ai/" in request.url.path:
            # Simple IP-based (or could use user ID if available in request state)
            user_id = request.client.host
            now = time.time()
            
            # Clean old requests
            self.user_requests[user_id] = [t for t in self.user_requests[user_id] if now - t < 60]
            
            if len(self.user_requests[user_id]) >= self.requests_per_minute:
                raise HTTPException(status_code=429, detail="Too many requests. Please wait a minute.")
            
            self.user_requests[user_id].append(now)
            
        return await call_next(request)
