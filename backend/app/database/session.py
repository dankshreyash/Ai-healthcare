"""
Database session management.
Provides a dependency-injectable session for FastAPI routes.
"""

from sqlalchemy.orm import sessionmaker, Session
from typing import Generator

from app.database.database import engine

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that yields a database session.
    Automatically closes the session when the request completes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
