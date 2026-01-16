# backend/app/crud/task.py
# T029 [P] [US3] Implement backend CRUD operations for Task

from typing import List, Optional

from sqlmodel import Session, select

from app.schemas.task import TaskCreate, TaskUpdate
from app.db.models import Task, User


def create_task(session: Session, task_create: TaskCreate, owner_id: int) -> Task:
    """
    Creates a new task in the database for a given owner.
    """
    db_task = Task(**task_create.model_dump(), owner_id=owner_id)
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

def get_task_by_id(session: Session, task_id: int) -> Optional[Task]:
    """
    Retrieves a task by its ID.
    """
    statement = select(Task).where(Task.id == task_id)
    task = session.exec(statement).first()
    return task

def get_tasks_by_owner(session: Session, owner_id: int) -> List[Task]:
    """
    Retrieves all tasks for a given owner.
    """
    statement = select(Task).where(Task.owner_id == owner_id)
    tasks = session.exec(statement).all()
    return tasks

def update_task(session: Session, db_task: Task, task_update: TaskUpdate) -> Task:
    """
    Updates an existing task in the database.
    """
    task_data = task_update.model_dump(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

def delete_task(session: Session, db_task: Task) -> None:
    """
    Deletes a task from the database.
    """
    session.delete(db_task)
    session.commit()
