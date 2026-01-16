"""Exit application command handler."""

from ui.console import (
    display_header,
    display_message,
    get_confirmation,
)


def exit_app_command() -> bool:
    """Handle exit application workflow.

    Returns:
        True if user confirms exit, False to continue app.
    """
    display_header("Exit Application")

    print()
    display_message(
        "Warning: All data will be lost when you exit.", "warning"
    )
    display_message(
        "This is expected behavior for Phase 1.", "info"
    )
    print()

    if get_confirmation("Are you sure you want to exit?"):
        print("\nGoodbye! Thank you for using Todo Console App.\n")
        return True

    return False
