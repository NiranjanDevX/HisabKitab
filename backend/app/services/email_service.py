"""
Email Service using Resend
"""
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Environment, FileSystemLoader
from app.core.config import settings
from app.utils.logger import logger

class EmailService:
    """Service to handle email Sending using SMTP"""
    
    def __init__(self):
        # Initialize Jinja2 environment
        template_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates", "emails")
        self.env = Environment(loader=FileSystemLoader(template_dir))
    
    def render_template(self, template_name: str, **context) -> str:
        """Render an HTML email template"""
        template = self.env.get_template(template_name)
        return template.render(**context)

    async def send_email(self, to: str, subject: str, html_content: str):
        """Send an email using SMTP"""
        if not settings.SMTP_HOST or not settings.SMTP_USER:
            logger.warning("SMTP configuration not fully set. Email not sent.")
            return None
            
        try:
            # Create message
            msg = MIMEMultipart()
            msg["From"] = f"{settings.APP_NAME} <{settings.SMTP_FROM_EMAIL or settings.SMTP_USER}>"
            msg["To"] = to
            msg["Subject"] = subject
            
            # Attach HTML content
            msg.attach(MIMEText(html_content, "html"))
            
            # Connect to SMTP server
            # Since we are running this in a thread via our task worker, 
            # we can use the synchronous smtplib safely.
            
            if settings.SMTP_SSL:
                server = smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT)
            else:
                server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
                if settings.SMTP_TLS:
                    server.starttls()
            
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            
            server.send_message(msg)
            server.quit()
            
            logger.info(f"Email sent successfully to {to} via SMTP")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {to} via SMTP: {str(e)}")
            return None

email_service = EmailService()
