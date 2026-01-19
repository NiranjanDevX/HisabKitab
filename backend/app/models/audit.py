"""
Audit Log Model
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Nullable for unauthenticated failures
    action = Column(String(50), nullable=False) # e.g., "LOGIN", "EXPORT", "DELETE_GOAL"
    timestamp = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String(45), nullable=True) # IPv6 support
    details = Column(Text, nullable=True)

    # Relationship (optional, might not always be linked if use deleted)
    user = relationship("User", backref="audit_logs")

    def __repr__(self):
        return f"<AuditLog(action={self.action}, user_id={self.user_id}, time={self.timestamp})>"
