"""Input validation functions."""


def validate_title(title: str) -> None:
    """Validate task title.

    Args:
        title: Task title string.

    Raises:
        ValueError: If title is empty or exceeds 100 characters.
    """
    title_stripped = title.strip()
    if not title_stripped:
        raise ValueError("Title cannot be empty")
    if len(title_stripped) > 100:
        raise ValueError(
            f"Title too long ({len(title_stripped)} chars, max 100)"
        )


def validate_description(description: str) -> None:
    """Validate task description.

    Args:
        description: Task description string.

    Raises:
        ValueError: If description is empty or exceeds 500 characters.
    """
    desc_stripped = description.strip()
    if not desc_stripped:
        raise ValueError("Description cannot be empty")
    if len(desc_stripped) > 500:
        raise ValueError(
            f"Description too long ({len(desc_stripped)} chars, max 500)"
        )


def validate_positive_int(value: str) -> int:
    """Parse and validate positive integer input.

    Args:
        value: String to parse as integer.

    Returns:
        Parsed integer value.

    Raises:
        ValueError: If value is not a valid positive integer.
    """
    try:
        int_value = int(value)
        if int_value < 1:
            raise ValueError("ID must be a positive number")
        return int_value
    except ValueError as e:
        if "ID must be a positive number" in str(e):
            raise
        raise ValueError("Please enter a valid number") from e
