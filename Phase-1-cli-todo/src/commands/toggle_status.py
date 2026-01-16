"""Toggle task status command handler."""

from services.task_service import TaskService
from ui.console import (
    display_header,
    display_message,
    get_user_input,
    press_enter_to_continue,
)
from ui.formatters import format_task_status
from utils.validators import validate_positive_int


def toggle_status_command(service: TaskService) -> None:
    """Handle toggle task status workflow.

    Args:
        service: Task service instance.
    """
    display_header("Toggle Task Status")

    try:
        task_id_str = get_user_input("Enter task ID: ")
        task_id = validate_positive_int(task_id_str)

        # Get task and old status
        task = service.get_task(task_id)
        old_status = format_task_status(task.completed)

        # Toggle status
        task = service.toggle_task_status(task_id)
        new_status = format_task_status(task.completed)

        display_message(
            f"Task #{task.id} status changed: {old_status} → {new_status}",
            "success"
        )

    except ValueError as e:
        display_message(f"Error: {e}", "error")

    press_enter_to_continue()
