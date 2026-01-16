# backend/app/db/engine.py
# T012 [P] Configure backend database connection and session management using SQLModel

from typing import Generator

from sqlmodel import create_engine, Session

from app.core.config import settings

engine = create_engine(settings.DATABASE_URL, echo=True, pool_pre_ping=True)

def get_db_session() -> Generator[Session, None, None]:
    """
    Dependency to provide a database session.
    """
    with Session(engine) as session:
        yield session
