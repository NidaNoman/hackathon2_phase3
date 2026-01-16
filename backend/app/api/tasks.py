# backend/app/api/tasks.py
# T028 [P] [US3] Implement backend endpoint for creating tasks
# T030 [P] [US3] Add authorization logic to ensure task ownership

import logging # Add this import at the top
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.schemas.task import TaskCreate, TaskPublic, TaskUpdate
from app.crud.task import (
    create_task, 
    get_tasks_by_owner, 
    get_task_by_id, 
    update_task as crud_update_task,
    delete_task as crud_delete_task
)
from app.db.engine import get_db_session
from app.core.auth import get_current_user
from app.db.models import User # Import User model to type current_user

# Configure basic logging to stdout
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=TaskPublic, status_code=status.HTTP_201_CREATED)
def create_new_task(
    task_create: TaskCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session)
):
    """
    Create a new task for the current user.
    """
    logger.info(f"Attempting to create task for user {current_user.id} with title: {task_create.title}")
    try:
        db_task = create_task(session, task_create, current_user.id)
        logger.info(f"Task created successfully: {db_task.id}")
        return db_task
    except Exception as e:
        logger.error(f"Error creating task: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error creating task: {e}")

@router.get("/", response_model=List[TaskPublic])
def read_user_tasks(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session)
):
    """
    Retrieve all tasks for the current user.
    """
    logger.info(f"Attempting to read tasks for user {current_user.id}")
    try:
        tasks = get_tasks_by_owner(session, current_user.id)
        logger.info(f"Retrieved {len(tasks)} tasks for user {current_user.id}")
        return tasks
    except Exception as e:
        logger.error(f"Error reading tasks: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading tasks: {e}")

@router.get("/{task_id}/", response_model=TaskPublic)
def read_single_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    """
    Retrieve a single task by its ID for the current user.
    """
    db_task = get_task_by_id(session, task_id)
    if not db_task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if db_task.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this task")
    return db_task

@router.put("/{task_id}/", response_model=TaskPublic)
def update_existing_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    """
    Update a task for the current user.
    """
    db_task = get_task_by_id(session, task_id)
    if not db_task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if db_task.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this task")
    
    return crud_update_task(session, db_task, task_update)

@router.delete("/{task_id}/", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    """
    Delete a task for the current user.
    """
    db_task = get_task_by_id(session, task_id)
    if not db_task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if db_task.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this task")
    
    crud_delete_task(session, db_task)
    return
