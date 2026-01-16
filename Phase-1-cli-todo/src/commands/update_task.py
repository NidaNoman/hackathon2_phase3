"""Update task command handler."""

from services.task_service import TaskService
from ui.console import (
    display_header,
    display_message,
    get_user_input,
    press_enter_to_continue,
)
from ui.formatters import display_task_detail
from utils.validators import validate_positive_int


def update_task_command(service: TaskService) -> None:
    """Handle update task workflow.

    Args:
        service: Task service instance.
    """
    display_header("Update Task")

    try:
        task_id_str = get_user_input("Enter task ID: ")
        task_id = validate_positive_int(task_id_str)

        # Show current task
        task = service.get_task(task_id)
        print("\nCurrent task:")
        display_task_detail(task)
        print()

        # Get new values
        new_title = get_user_input(
            "Enter new title (or press Enter to keep current): "
        )
        new_description = get_user_input(
            "Enter new description (or press Enter to keep current): "
        )

        # Use current values if empty
        if not new_title.strip():
            new_title = task.title
        if not new_description.strip():
            new_description = task.description

        task = service.update_task(task_id, new_title, new_description)
        display_message(f"Task #{task.id} updated successfully!", "success")

    except ValueError as e:
        display_message(f"Error: {e}", "error")

    press_enter_to_continue()
