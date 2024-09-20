"""crud.py

This module contains the all CRUD operations for the logs, including:
- Create a log
- Get all logs
- Get a log by ID
- Update a log by ID
- Delete a log by ID
- Query logs
- Aggregate logs
- Populate logs
- Empty logs
"""

from typing import List
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from sqlalchemy import or_, desc
from sqlalchemy.orm import Session
from typing import List, Optional

from . import models, schemas


def create_log(db: Session, log: schemas.LogCreate):
    """Create a log in the database.

    Args:
        db (Session): SQLAlchemy session.
        log (schemas.LogCreate): Log data.

    Returns:
        models.Log: Created log.
    """
    db_log = models.Log(**log.dict())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


def get_logs(
    db: Session,
    page: int = 1,
    limit: int = 10,
    filter_params: Optional[List[str]] = None,
    sort: str = "date",
    search: Optional[str] = None,
) -> List[models.Log]:
    """
    Get logs from the database with filtering, sorting, searching, and pagination.

    Args:
        db (Session): SQLAlchemy session.
        page (int): Page number for pagination. Defaults to 1.
        limit (int): Number of logs per page. Defaults to 100.
        filter_params (List[str], optional): Example ['start_date:2024-09-02,end_date:2024-09-02,severity:warning,source:web-server']
        sort (str): Field to sort by. Options: 'date', 'source', 'severity'. Defaults to 'date'.
        search (str, optional): Search term to filter logs.

    Returns:
        List[models.Log]: List of logs matching the criteria.
    """
    query = db.query(models.Log)

    # Apply filters
    try:
        if filter_params and filter_params[0] != "":
            filter_params_list = filter_params[0].split(",")
            for param in filter_params_list:
                key, value = param.split(":")
                if key == "start_date" and value != "":
                    query = query.filter(models.Log.timestamp >= value)
                elif key == "end_date" and value != "":
                    query = query.filter(models.Log.timestamp <= value)
                elif key == "severity" and value != "":
                    query = query.filter(models.Log.severity == value)
                elif key == "source" and value != "":
                    query = query.filter(models.Log.source == value)
    except Exception as e:  # pylint: disable=W0703
        print("Error applying filters: ", e, " - Ignoring filters.")

    # Apply search
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                models.Log.message.ilike(search_term),
                models.Log.source.ilike(search_term),
                models.Log.severity.ilike(search_term),
            )
        )

    # Apply sorting
    if sort == "date":
        query = query.order_by(desc(models.Log.timestamp))
    elif sort == "source":
        query = query.order_by(models.Log.source)
    elif sort == "severity":
        query = query.order_by(models.Log.severity)

    # Apply pagination
    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)

    return query.all()


def get_log(db: Session, log_id: int):
    """Get a log by ID from the database.

    Args:
        db (Session): SQLAlchemy session.
        log_id (int): Log ID.

    Returns:
        models.Log: Log with the given ID.
    """
    return db.query(models.Log).filter(models.Log.id == log_id).first()


def update_log(db: Session, log_id: int, log: schemas.LogCreate):
    """Update a log by ID in the database.

    Args:
        db (Session): SQLAlchemy session.
        log_id (int): Log ID.
        log (schemas.LogCreate): Log data.

    Returns:
        models.Log: Updated log.
    """
    db_log = db.query(models.Log).filter(models.Log.id == log_id).first()
    if db_log:
        for key, value in log.dict().items():
            setattr(db_log, key, value)
        db.commit()
        db.refresh(db_log)
    return db_log


def delete_log(db: Session, log_id: int):
    """Delete a log by ID from the database.

    Args:
        db (Session): SQLAlchemy session.
        log_id (int): Log ID.

    Returns:
        models.Log: Deleted log.
    """
    db_log = db.query(models.Log).filter(models.Log.id == log_id).first()
    if db_log:
        db.delete(db_log)
        db.commit()
    return db_log


def query_logs(db: Session, query: schemas.LogQuery):
    """Query logs from the database.

    Args:
        db (Session): SQLAlchemy session.
        query (schemas.LogQuery): Query parameters.

    Returns:
        List[models.Log]: List of logs.
    """
    q = db.query(models.Log)
    if query.start_date:
        q = q.filter(models.Log.timestamp >= query.start_date)
    if query.end_date:
        q = q.filter(models.Log.timestamp <= query.end_date)
    if query.severity:
        q = q.filter(models.Log.severity == query.severity)
    if query.source:
        q = q.filter(models.Log.source == query.source)
    return q.all()


def aggregate_logs(
    db: Session, query: schemas.LogQuery
) -> List[schemas.LogAggregation]:
    """Aggregate logs from the database.

    Args:
        db (Session): SQLAlchemy session.
        query (schemas.LogQuery): Query parameters.

    Returns:
        List[schemas.LogAggregation]: List of log aggregations.
    """
    assert query.group_by in ["full_date", "month", "year"], "Invalid group_by value"
    fa = {
        "full_date": func.date(models.Log.timestamp),
        "month": func.date_trunc("month", models.Log.timestamp),
        "year": func.date_trunc("year", models.Log.timestamp),
    }
    q = db.query(
        models.Log.severity,
        fa[query.group_by].label(query.group_by),
        func.count(models.Log.id).label("count"),  # pylint: disable=E1102
    ).group_by(models.Log.severity, fa[query.group_by])

    if query.start_date:
        q = q.filter(models.Log.timestamp >= query.start_date)
    if query.end_date:
        q = q.filter(models.Log.timestamp <= query.end_date)
    if query.severity and query.severity != "all":
        q = q.filter(models.Log.severity == query.severity)
    if query.source and query.source != "all":
        q = q.filter(models.Log.source == query.source)
    print(q.column_descriptions)
    q = q.order_by(query.group_by, models.Log.severity)
    results = q.all()

    aggByDate = {}
    for row in results:
        r = ""
        if query.group_by == "full_date":
            r = row.full_date
        elif query.group_by == "month":
            r = row.month
        elif query.group_by == "year":
            r = row.year
        if r not in aggByDate:
            aggByDate[r] = {}
        aggByDate[r][row.severity] = row.count
    return [
        schemas.LogAggregation(period=str(key), **value)
        for key, value in aggByDate.items()
    ]


def populate_log(db: Session):
    """Populate the database with logs.

    Args:
        db (Session): SQLAlchemy session.

    Returns:
        List[models.Log]: List of logs
    """

    possible_timestamps = [datetime.now() - timedelta(days=i) for i in range(1000)]
    possible_severities = ["info", "warning", "error"]
    possible_sources = ["app", "db", "web"]

    for i in range(10000):
        db_log = models.Log(
            timestamp=random.choice(possible_timestamps),
            message=f"Message Test {i}",
            severity=random.choice(possible_severities),
            source=random.choice(possible_sources),
        )
        db.add(db_log)
    db.commit()
    return db.query(models.Log).all()


def empty_logs(db: Session):
    """Empty all logs from the database.

    Args:
        db (Session): SQLAlchemy session.

    Returns:
        List[models.Log]: List of logs
    """
    db.query(models.Log).delete()
    db.commit()
    return db.query(models.Log).all()
