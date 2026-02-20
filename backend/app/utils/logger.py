"""
Application Logger
"""
import logging
import sys

# Configure logger
logger = logging.getLogger("hisabkitab")
logger.setLevel(logging.INFO)

# Console Handler
handler = logging.StreamHandler(sys.stdout)
# Simple format: [LEVEL] Message
handler.setFormatter(logging.Formatter(
    "[%(levelname)s] %(message)s"
))
logger.addHandler(handler)

# Suppress noisy third-party logs
logging.getLogger("sqlalchemy").setLevel(logging.WARNING)
logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
logging.getLogger("uvicorn.error").setLevel(logging.WARNING)
logging.getLogger("watchfiles").setLevel(logging.WARNING)
logging.getLogger("multipart").setLevel(logging.WARNING)
