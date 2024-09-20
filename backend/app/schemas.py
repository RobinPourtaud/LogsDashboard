"""Pydantic models for the application.

"""

from datetime import datetime
from pydantic import BaseModel  # pylint: disable=E0611


class LogBase(BaseModel):
    """Base log model."""

    timestamp: datetime
    message: str
    severity: str
    source: str


class LogCreate(LogBase):
    """Same as Log but without ID."""


class Log(LogBase):
    """Log model with ID."""

    id: int

    class Config:
        """Pydantic configuration."""

        from_attributes = True


class LogQuery(BaseModel):
    """Log query model."""

    start_date: datetime = None
    end_date: datetime = None
    severity: str = None
    source: str = None
    id: int = None


class LogQueryAggregate(BaseModel):
    """Log query model."""

    start_date: datetime = None
    end_date: datetime = None
    severity: str = None
    source: str = None
    group_by: str = "month"


class LogAggregation(BaseModel):
    """Log aggregation model."""

    period: str
    info: int = None
    warning: int = None
    error: int = None
