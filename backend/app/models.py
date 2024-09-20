"""Database models for the application. """

from sqlalchemy import Column, Integer, String, DateTime
from .database import Base


class Log(Base):
    """Log model for database.

    Args:
        Base (SQLAlchemy declarative base): Base class for declarative base model.

    Returns:
        Log: Log model for database.
            Properties:
                id (int): Log ID. Primary key.
                timestamp (datetime): Log timestamp.
                message (str): Log message.
                severity (str): Log severity.
                source (str): Log source.
    """

    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, index=True)
    message = Column(String)
    severity = Column(String, index=True)
    source = Column(String, index=True)
