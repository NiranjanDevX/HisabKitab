"""
Email Service using Resend
"""
import resend
import os
from jinja2 import Environment, FileSystemLoader
from app.core.config import settings
from app.utils.logger import logger

class EmailService:
    """Service to handle email Sending using Resend"""
    
    def __init__(self):
        if settings.RESEND_API_KEY:
            resend.api_key = settings.RESEND_API_KEY
            
        # Initialize Jinja2 environment
        template_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates", "emails")
        self.env = Environment(loader=FileSystemLoader(template_dir))
    
    def render_template(self, template_name: str, **context) -> str:
        """Render an HTML email template"""
        template = self.env.get_template(template_name)
        return template.render(**context)

    async def send_email(self, to: str, subject: str, html_content: str):
        """Send an email using Resend"""
        if not settings.RESEND_API_KEY:
            logger.warning("RESEND_API_KEY not set. Email not sent.")
            return None
            
        try:
            from typing import cast, Dict, Any
            params = {
                "from": f"{settings.APP_NAME} <noreply@resend.dev>", # Default resend domain
                "to": [to],
                "subject": subject,
                "html": html_content,
            }
            
            email = resend.Emails.send(cast(Any, params))
            logger.info(f"Email sent successfully to {to}")
            return email
        except Exception as e:
            logger.error(f"Failed to send email to {to}: {str(e)}")
            return None

email_service = EmailService()
