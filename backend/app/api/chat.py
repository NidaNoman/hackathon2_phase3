# backend/app/api/chat.py
# Phase 3: AI Chatbot API Endpoint

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
import logging

from app.core.auth import get_current_user
from app.db.models import User
from app.core.config import settings
from sqlmodel import Session
from app.db.engine import get_db_session
from app.schemas.task import TaskCreate, TaskUpdate
from app.crud.task import (
    create_task,
    get_tasks_by_owner,
    get_task_by_id,
    update_task as crud_update_task,
    delete_task as crud_delete_task
)
import google.generativeai as genai

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

def get_ai_response(user_message: str, current_user: User, session: Session) -> str:
    """
    Process the user message with AI and perform appropriate task operations.
    """
    # Check if Gemini API key is available
    if not settings.GEMINI_API_KEY:
        # Fallback to simple logic if no API key
        return simple_task_operations(user_message, current_user, session)

    # Define the system prompt to guide the AI behavior
    system_prompt = """
    You are a helpful task management assistant. You can help users manage their tasks by:
    1. Creating new tasks (keywords: add, create, new, make)
    2. Showing existing tasks (keywords: show, list, view, see, my tasks)
    3. Editing existing tasks (keywords: edit, update, change, modify)
    4. Deleting tasks (keywords: delete, remove, complete, finish)

    Respond in a friendly, helpful way and provide clear feedback about the operations performed.
    """

    try:
        # Configure Gemini
        genai.configure(api_key=settings.GEMINI_API_KEY)

        # Initialize Gemini model
        model = genai.GenerativeModel(
            model_name="gemini-2.0-flash",
            system_instruction=system_prompt
        )

        # Call Gemini API
        response = model.generate_content(user_message)

        ai_response = response.text
        if not ai_response:
            logger.warning("Gemini returned empty response, falling back to simple logic")
            return simple_task_operations(user_message, current_user, session)

        # Check if the AI identified a task operation and perform it
        perform_task_operation(user_message.lower(), current_user, session)

        return ai_response
    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}")
        # Fallback to simple logic
        return simple_task_operations(user_message, current_user, session)

def simple_task_operations(user_message: str, current_user: User, session: Session) -> str:
    """
    Simple keyword-based task operations when AI is not available.
    """
    user_msg_lower = user_message.lower().strip()

    if not user_msg_lower:
        return "Please enter a message."

    # Identify intent based on keywords
    if any(keyword in user_msg_lower for keyword in ["add", "create", "new", "make"]):
        # Extract task title from message (simple extraction)
        task_title = extract_task_title(user_msg_lower)
        if task_title:
            try:
                task_create = TaskCreate(title=task_title, description="", status="pending")
                db_task = create_task(session, task_create, current_user.id)
                return f"I've added the task '{db_task.title}' to your list."
            except Exception as e:
                logger.error(f"Error creating task: {e}")
                return "Sorry, I couldn't create that task. Please try again."
        else:
            return "What task would you like to add?"

    elif any(keyword in user_msg_lower for keyword in ["show", "list", "view", "see", "my tasks"]):
        try:
            tasks = get_tasks_by_owner(session, current_user.id)
            if not tasks:
                return "You don't have any tasks yet. You can add a new task!"

            task_list = "\n".join([f"- {task.title} ({task.status})" for task in tasks])
            return f"Here are your tasks:\n{task_list}"
        except Exception as e:
            logger.error(f"Error retrieving tasks: {e}")
            return "Sorry, I couldn't retrieve your tasks. Please try again."

    elif any(keyword in user_msg_lower for keyword in ["edit", "update", "change", "modify"]):
        # Simple edit - look for task ID or title to update
        task_id = extract_task_id(user_msg_lower)
        if task_id:
            # Find the task
            db_task = get_task_by_id(session, task_id)
            if db_task and db_task.owner_id == current_user.id:
                # For simplicity, we'll just mark as completed if not already
                task_update = TaskUpdate(
                    title=db_task.title,
                    description=db_task.description,
                    status="completed" if db_task.status == "pending" else "pending"
                )
                updated_task = crud_update_task(session, db_task, task_update)
                return f"I've updated the task '{updated_task.title}' to {updated_task.status}."
            else:
                return "I couldn't find that task or you don't have permission to edit it."
        else:
            return "Which task would you like to edit? Please specify the task ID or title."

    elif any(keyword in user_msg_lower for keyword in ["delete", "remove", "complete", "finish"]):
        task_id = extract_task_id(user_msg_lower)
        if task_id:
            # Find the task
            db_task = get_task_by_id(session, task_id)
            if db_task and db_task.owner_id == current_user.id:
                try:
                    crud_delete_task(session, db_task)
                    return f"I've deleted the task '{db_task.title}'."
                except Exception as e:
                    logger.error(f"Error deleting task: {e}")
                    return "Sorry, I couldn't delete that task. Please try again."
            else:
                return "I couldn't find that task or you don't have permission to delete it."
        else:
            return "Which task would you like to delete? Please specify the task ID or title."

    else:
        # Default response for unrecognized commands
        return f"I received your message: '{user_message}'. I can help you manage your tasks - try saying 'add a task', 'show my tasks', 'edit task', or 'delete task'."

def perform_task_operation(user_message: str, current_user: User, session: Session):
    """
    Perform the actual task operation based on the user's message.
    This function is called when we detect a task operation is needed.
    """
    user_msg_lower = user_message.lower().strip()

    if any(keyword in user_msg_lower for keyword in ["add", "create", "new", "make"]):
        task_title = extract_task_title(user_msg_lower)
        if task_title:
            try:
                task_create = TaskCreate(title=task_title, description="", status="pending")
                create_task(session, task_create, current_user.id)
            except Exception as e:
                logger.error(f"Error creating task: {e}")

    elif any(keyword in user_msg_lower for keyword in ["delete", "remove"]):
        task_id = extract_task_id(user_msg_lower)
        if task_id:
            db_task = get_task_by_id(session, task_id)
            if db_task and db_task.owner_id == current_user.id:
                try:
                    crud_delete_task(session, db_task)
                except Exception as e:
                    logger.error(f"Error deleting task: {e}")

def extract_task_title(message: str) -> Optional[str]:
    """
    Simple function to extract task title from user message.
    """
    # Common patterns for adding tasks
    if "add" in message:
        # Look for text after "add" or "add task"
        parts = message.split("add")
        if len(parts) > 1:
            task_part = parts[1].strip()
            # Remove common phrases
            if task_part.startswith("task"):
                task_part = task_part[4:].strip()
            if task_part.startswith("to my list"):
                task_part = task_part[10:].strip()
            if task_part.startswith("a task"):
                task_part = task_part[6:].strip()
            if task_part.startswith("the task"):
                task_part = task_part[8:].strip()
            return task_part or None
    elif "create" in message:
        parts = message.split("create")
        if len(parts) > 1:
            task_part = parts[1].strip()
            if task_part.startswith("task"):
                task_part = task_part[4:].strip()
            return task_part or None
    elif "new" in message:
        parts = message.split("new")
        if len(parts) > 1:
            task_part = parts[1].strip()
            if task_part.startswith("task"):
                task_part = task_part[4:].strip()
            return task_part or None

    return None

def extract_task_id(message: str) -> Optional[int]:
    """
    Simple function to extract task ID from user message.
    """
    import re
    # Look for numbers in the message which could be task IDs
    numbers = re.findall(r'\d+', message)
    if numbers:
        return int(numbers[0])  # Return the first number found
    return None

@router.post("/", response_model=ChatResponse)
def chat_endpoint(
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session)
):
    """
    Chat endpoint that responds to user messages.
    Connects to AI service to interpret natural language and perform task operations.
    """
    user_message = chat_request.message.strip()

    # Log the incoming message
    logger.info(f"User {current_user.id} sent message: {user_message}")

    # Get AI response and perform operations
    response_text = get_ai_response(user_message, current_user, session)

    # Log the response
    logger.info(f"Responding to user {current_user.id} with: {response_text[:50]}...")

    return ChatResponse(response=response_text)

@router.post("/{user_id}/chat", response_model=ChatResponse)
def chat_with_user_id_endpoint(
    user_id: int,
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session)
):
    """
    Chat endpoint that responds to user messages with user_id in the path.
    This endpoint ensures the user_id in the path matches the authenticated user.
    """
    # Verify that the user_id in the path matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's chat"
        )

    user_message = chat_request.message.strip()

    # Log the incoming message
    logger.info(f"User {current_user.id} sent message: {user_message}")

    # Get AI response and perform operations
    response_text = get_ai_response(user_message, current_user, session)

    # Log the response
    logger.info(f"Responding to user {current_user.id} with: {response_text[:50]}...")

    return ChatResponse(response=response_text)