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
handler.setFormatter(logging.Formatter(
    "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
))
logger.addHandler(handler)
