# backend/app/db/models.py
# SQLModel definitions for User and Task entities

from typing import List, Optional
from sqlmodel import Field, Relationship, Session, SQLModel
from app.schemas.task import TaskStatus # Import TaskStatus enum

# Rename SQLModel to Base to avoid confusion with pydantic.BaseModel
class Base(SQLModel):
    pass

class User(Base, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True, min_length=3, max_length=50)
    password_hash: str = Field(min_length=8) # Storing hashed password

    tasks: List["Task"] = Relationship(back_populates="owner")

class Task(Base, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    status: TaskStatus = Field(default=TaskStatus.PENDING)

    owner_id: int = Field(foreign_key="user.id")
    owner: User = Relationship(back_populates="tasks")

# Example for autogenerate detection by Alembic env.py
# All SQLModel classes are automatically part of SQLModel.metadata
# from . import user, task # Import your models here if they are in separate files