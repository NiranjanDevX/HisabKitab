"""
Global Error Handler Middleware
"""
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.utils.logger import logger


class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    """Middleware for handling unhandled exceptions"""
    
    async def dispatch(self, request: Request, call_next):
        try:
            return await call_next(request)
        except Exception as exc:
            logger.error(f"Unhandled exception: {str(exc)}")
            
            return JSONResponse(
                status_code=500,
                content={
                    "detail": "Internal server error"
                }
            )
