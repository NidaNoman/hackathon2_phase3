"""Delete task command handler."""

from services.task_service import TaskService
from ui.console import (
    display_header,
    display_message,
    get_confirmation,
    get_user_input,
    press_enter_to_continue,
)
from ui.formatters import display_task_detail
from utils.validators import validate_positive_int


def delete_task_command(service: TaskService) -> None:
    """Handle delete task workflow.

    Args:
        service: Task service instance.
    """
    display_header("Delete Task")

    try:
        task_id_str = get_user_input("Enter task ID: ")
        task_id = validate_positive_int(task_id_str)

        # Show task to delete
        task = service.get_task(task_id)
        print("\nAre you sure you want to delete this task?")
        display_task_detail(task)
        print()

        if get_confirmation("Confirm deletion"):
            service.delete_task(task_id)
            display_message(f"Task #{task_id} deleted successfully!", "success")
        else:
            display_message("Deletion canceled.", "info")

    except ValueError as e:
        display_message(f"Error: {e}", "error")

    press_enter_to_continue()
