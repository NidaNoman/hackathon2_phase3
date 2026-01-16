"""Console UI helper functions."""

import os
from typing import Optional


def clear_screen() -> None:
    """Clear the console screen."""
    os.system('cls' if os.name == 'nt' else 'clear')


def display_menu() -> None:
    """Display the main menu."""
    print("\n" + "=" * 50)
    print("  TODO CONSOLE APP - PHASE 1")
    print("=" * 50)
    print("\nMain Menu:")
    print("  [1] Add Task")
    print("  [2] View Tasks")
    print("  [3] Update Task")
    print("  [4] Delete Task")
    print("  [5] Toggle Task Status")
    print("  [6] Exit")
    print()


def get_user_input(prompt: str) -> str:
    """Get text input from user.

    Args:
        prompt: Prompt message to display.

    Returns:
        User input as string.
    """
    return input(prompt)


def get_user_choice(prompt: str, min_val: int, max_val: int) -> int:
    """Get validated numeric choice from user.

    Args:
        prompt: Prompt message to display.
        min_val: Minimum valid value.
        max_val: Maximum valid value.

    Returns:
        Valid integer choice.
    """
    while True:
        try:
            choice = int(input(prompt))
            if min_val <= choice <= max_val:
                return choice
            print(f"[ERROR] Invalid option. Please select {min_val}-{max_val}.")
        except ValueError:
            print("[ERROR] Please enter a valid number.")


def display_message(message: str, style: str = "info") -> None:
    """Display styled message to user.

    Args:
        message: Message text.
        style: Message style (info, success, error, warning).
    """
    symbols = {
        "info": "[i]",
        "success": "[OK]",
        "error": "[ERROR]",
        "warning": "[WARN]"
    }
    symbol = symbols.get(style, "[i]")
    print(f"{symbol} {message}")


def display_header(title: str) -> None:
    """Display section header.

    Args:
        title: Header title.
    """
    print("\n" + title)
    print("-" * len(title))


def press_enter_to_continue() -> None:
    """Wait for user to press Enter."""
    input("\nPress Enter to continue...")


def get_confirmation(prompt: str) -> bool:
    """Get yes/no confirmation from user.

    Args:
        prompt: Confirmation prompt.

    Returns:
        True if user confirmed (y/yes), False otherwise.
    """
    while True:
        response = input(f"{prompt} (y/n): ").lower().strip()
        if response in ('y', 'yes'):
            return True
        if response in ('n', 'no'):
            return False
        print("[ERROR] Please enter 'y' for yes or 'n' for no.")
