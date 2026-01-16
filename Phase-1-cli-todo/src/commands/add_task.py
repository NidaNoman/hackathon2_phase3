"""Add task command handler."""

from services.task_service import TaskService
from ui.console import (
    display_header,
    display_message,
    get_user_input,
    press_enter_to_continue,
)


def add_task_command(service: TaskService) -> None:
    """Handle add task workflow.

    Args:
        service: Task service instance.
    """
    display_header("Add Task")

    try:
        title = get_user_input("Enter task title: ")
        description = get_user_input("Enter task description: ")

        task = service.create_task(title, description)
        display_message(
            f"Task #{task.id} created successfully!", "success"
        )
    except ValueError as e:
        display_message(f"Error: {e}", "error")

    press_enter_to_continue()
