"""Task display formatting functions."""

from models.task import Task


def format_task_table(tasks: list[Task]) -> str:
    """Format tasks as a text table.

    Args:
        tasks: List of tasks to format.

    Returns:
        Formatted table string.
    """
    if not tasks:
        return "No tasks found."

    # Column headers and widths
    headers = ["ID", "Title", "Description", "Status"]
    col_widths = [4, 20, 35, 10]

    # Build header row
    header_row = " | ".join(
        headers[i].ljust(col_widths[i]) for i in range(len(headers))
    )
    separator = "-" * len(header_row)

    lines = [header_row, separator]

    # Build data rows
    for task in tasks:
        id_str = str(task.id).ljust(col_widths[0])
        title_str = truncate_text(task.title, col_widths[1])
        desc_str = truncate_text(task.description, col_widths[2])
        status_str = format_task_status(task.completed).ljust(col_widths[3])

        row = f"{id_str} | {title_str} | {desc_str} | {status_str}"
        lines.append(row)

    lines.append(separator)
    lines.append(f"Total: {len(tasks)} task(s)")

    return "\n".join(lines)


def format_task_status(completed: bool) -> str:
    """Format task status with icon.

    Args:
        completed: Task completion status.

    Returns:
        Formatted status string.
    """
    return "[X] Complete" if completed else "[ ] Pending"


def truncate_text(text: str, max_length: int) -> str:
    """Truncate text with ellipsis if too long.

    Args:
        text: Text to truncate.
        max_length: Maximum length before truncation.

    Returns:
        Truncated text with ellipsis if needed.
    """
    if len(text) <= max_length:
        return text.ljust(max_length)
    return (text[: max_length - 3] + "...").ljust(max_length)


def display_task_detail(task: Task) -> None:
    """Display full task details.

    Args:
        task: Task to display.
    """
    print(f"  ID: {task.id}")
    print(f"  Title: {task.title}")
    print(f"  Description: {task.description}")
    print(f"  Status: {format_task_status(task.completed)}")
