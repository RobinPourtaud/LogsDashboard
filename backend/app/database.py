"""Database configuration and connection.

"""

import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://user:password@db/logdb"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Get a database session.

    Yields:
        Session: SQLAlchemy session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
