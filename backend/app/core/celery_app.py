"""
Celery Configuration
"""
from celery import Celery
from app.core.config import settings

celery_app = Celery("worker", broker=settings.CELERY_BROKER_URL)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_always_eager=True, # Run tasks locally (sync) for dev/testing without worker
    task_routes={
        "app.tasks.*": {"queue": "default"},
    },
)
