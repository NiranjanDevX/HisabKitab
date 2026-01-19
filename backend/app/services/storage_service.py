"""
Storage Service for S3 with Local Fallback
"""
import os
import uuid
import boto3
from botocore.exceptions import ClientError
from app.core.config import settings
from app.utils import logger

class StorageService:
    """Service to handle file storage (S3 with local fallback)"""
    
    def __init__(self):
        self.s3_client = None
        if all([
            settings.AWS_ACCESS_KEY_ID,
            settings.AWS_SECRET_ACCESS_KEY,
            settings.S3_BUCKET_NAME
        ]):
            try:
                self.s3_client = boto3.client(
                    's3',
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                    region_name=settings.AWS_REGION
                )
                logger.info(f"S3 Storage initialized for bucket: {settings.S3_BUCKET_NAME}")
            except Exception as e:
                logger.error(f"Failed to initialize S3 client: {str(e)}")
        
        # Local fallback directory
        self.local_dir = "static/uploads"
        if not os.path.exists(self.local_dir):
            os.makedirs(self.local_dir, exist_ok=True)

    async def upload_file(self, file_content: bytes, filename: str, content_type: str = "image/jpeg") -> str:
        """Upload a file and return the public URL"""
        ext = os.path.splitext(filename)[1]
        unique_filename = f"{uuid.uuid4()}{ext}"
        
        # Try S3 first
        if self.s3_client and settings.S3_BUCKET_NAME:
            try:
                self.s3_client.put_object(
                    Bucket=settings.S3_BUCKET_NAME,
                    Key=f"profile_pics/{unique_filename}",
                    Body=file_content,
                    ContentType=content_type,
                    ACL='public-read'
                )
                url = f"https://{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/profile_pics/{unique_filename}"
                logger.info(f"File uploaded to S3: {url}")
                return url
            except ClientError as e:
                logger.error(f"S3 upload failed: {str(e)}. Falling back to local.")
        
        # Local Fallback
        local_path = os.path.join(self.local_dir, unique_filename)
        with open(local_path, "wb") as f:
            f.write(file_content)
        
        # Assuming static files are served at /static
        url = f"/static/uploads/{unique_filename}"
        logger.info(f"File saved locally: {url}")
        return url

storage_service = StorageService()
