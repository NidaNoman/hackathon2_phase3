# packages/types/python/task.py
# T011 [P] Define packages/types/python/task.py based on Task entity

from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field

class TaskStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    status: TaskStatus = Field(TaskStatus.PENDING)

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    pass

class TaskInDB(TaskBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

class TaskPublic(TaskBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True
