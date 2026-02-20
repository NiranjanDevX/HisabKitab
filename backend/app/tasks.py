"""
Celery Background Tasks
"""
import asyncio
from typing import Optional
from app.core.celery_app import celery_app
from app.services.email_service import email_service
from app.utils.logger import logger

@celery_app.task(name="app.tasks.send_email_task")
def send_email_task(to: str, subject: str, html_content: str):
    """
    Background task to send an email using Resend.
    Ensures safe async execution even if an event loop is already running (e.g., in eager mode).
    """
    import threading
    from concurrent.futures import ThreadPoolExecutor

    def run_async(coro):
        """Run a coroutine in a new event loop in a separate thread."""
        new_loop = asyncio.new_event_loop()
        try:
            asyncio.set_event_loop(new_loop)
            return new_loop.run_until_complete(coro)
        finally:
            new_loop.close()

    try:
        # Check if we should even send emails
        from app.core.config import settings
        if not getattr(settings, "ENABLE_EMAIL_NOTIFICATIONS", True):
            logger.info("Email notifications are disabled. Skipping.")
            return "Email notifications disabled"

        # Try to get the current loop
        loop = None
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            pass

        if loop and loop.is_running():
            # If a loop is already running (common in eager mode within FastAPI),
            # run the async work in a separate thread.
            with ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(run_async, email_service.send_email(to, subject, html_content))
                future.result()
        else:
            # No running loop, just create one and run (standard sync context)
            asyncio.run(email_service.send_email(to, subject, html_content))
            
        return f"Email task processed for {to}"
    except Exception as e:
        logger.error(f"Failed to send email task: {e}")
        return f"Failed to send email to {to}: {e}"
