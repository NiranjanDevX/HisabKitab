"""
Firebase Authentication Service
"""
import firebase_admin
from firebase_admin import auth, credentials
from typing import Dict, Any, Optional
from app.core.config import settings
from app.utils.logger import logger

class FirebaseService:
    """Service to handle Firebase operations"""
    
    _initialized = False

    @classmethod
    def initialize(cls):
        """Initialize Firebase Admin SDK using environment variables"""
        if cls._initialized:
            return
            
        try:
            # Check if we have individual fields
            if all([
                settings.FIREBASE_PROJECT_ID,
                settings.FIREBASE_CLIENT_EMAIL,
                settings.FIREBASE_PRIVATE_KEY
            ]):
                # Construct service account info from env vars
                cert_info = {
                    "type": "service_account",
                    "project_id": settings.FIREBASE_PROJECT_ID,
                    "private_key_id": settings.FIREBASE_PRIVATE_KEY_ID,
                    "private_key": settings.FIREBASE_PRIVATE_KEY.replace('\\n', '\n') if settings.FIREBASE_PRIVATE_KEY else None,
                    "client_email": settings.FIREBASE_CLIENT_EMAIL,
                    "client_id": settings.FIREBASE_CLIENT_ID,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                    "client_x509_cert_url": settings.FIREBASE_CLIENT_X509_CERT_URL
                }
                cred = credentials.Certificate(cert_info)
                firebase_admin.initialize_app(cred)
                cls._initialized = True
                logger.info("Firebase Admin SDK initialized successfully via env vars.")
            else:
                logger.warning("Firebase credentials not fully configured in environment.")
        except Exception as e:
            logger.error(f"Failed to initialize Firebase Admin SDK: {str(e)}")

    @staticmethod
    async def verify_token(token: str) -> Optional[Dict[str, Any]]:
        """
        Verify a Firebase ID token.
        Supports Google, Facebook, Apple etc. (all handled by Firebase)
        """
        try:
            decoded_token = auth.verify_id_token(token)
            return decoded_token
        except Exception as e:
            logger.error(f"Firebase token verification failed: {str(e)}")
            return None

# Initialize on module load if possible
FirebaseService.initialize()
