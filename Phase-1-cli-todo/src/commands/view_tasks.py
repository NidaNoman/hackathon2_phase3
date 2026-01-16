"""View tasks command handler."""

from services.task_service import TaskService
from ui.console import display_header, press_enter_to_continue
from ui.formatters import format_task_table


def view_tasks_command(service: TaskService) -> None:
    """Handle view tasks workflow.

    Args:
        service: Task service instance.
    """
    display_header("Your Tasks")

    tasks = service.get_all_tasks()
    print()
    print(format_task_table(tasks))

    press_enter_to_continue()
