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
    Since celery tasks are synchronous by default, we run the async email service here.
    """
    try:
        # Check if there's a running loop, otherwise create one
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
        loop.run_until_complete(email_service.send_email(to, subject, html_content))
        return f"Email sent to {to}"
    except Exception as e:
        logger.error(f"Failed to send email task: {e}")
        return f"Failed to send email to {to}: {e}"
