"""Main application entry point."""

from commands.add_task import add_task_command
from commands.delete_task import delete_task_command
from commands.exit_app import exit_app_command
from commands.toggle_status import toggle_status_command
from commands.update_task import update_task_command
from commands.view_tasks import view_tasks_command
from repositories.in_memory_repository import InMemoryTaskRepository
from services.task_service import TaskService
from ui.console import clear_screen, display_menu, get_user_choice


def main() -> None:
    """Main application loop."""
    # Initialize repository and service
    repository = InMemoryTaskRepository()
    service = TaskService(repository)

    # Main loop
    while True:
        clear_screen()
        display_menu()

        choice = get_user_choice("Select option (1-6): ", 1, 6)

        match choice:
            case 1:
                add_task_command(service)
            case 2:
                view_tasks_command(service)
            case 3:
                update_task_command(service)
            case 4:
                delete_task_command(service)
            case 5:
                toggle_status_command(service)
            case 6:
                if exit_app_command():
                    break


if __name__ == "__main__":
    main()
