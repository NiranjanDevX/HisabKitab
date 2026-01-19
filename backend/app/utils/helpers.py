"""
Helper Functions
"""
from datetime import datetime, date
from typing import Union


def format_currency(amount: float, currency: str = "₹") -> str:
    """Format amount as currency string"""
    return f"{currency}{amount:,.2f}"


def format_date(dt: Union[datetime, date], format: str = "%d %b %Y") -> str:
    """Format date as string"""
    return dt.strftime(format)


def format_datetime(dt: datetime, format: str = "%d %b %Y, %H:%M") -> str:
    """Format datetime as string"""
    return dt.strftime(format)


def parse_tags(tags_string: str) -> list:
    """Parse comma-separated tags string to list"""
    if not tags_string:
        return []
    return [tag.strip() for tag in tags_string.split(",") if tag.strip()]


def tags_to_string(tags: list) -> str:
    """Convert list of tags to comma-separated string"""
    return ", ".join(tags)
