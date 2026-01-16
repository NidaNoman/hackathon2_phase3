"""Task model and status enumeration."""

from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum


class TaskStatus(Enum):
    """Task completion status."""
    PENDING = "pending"
    COMPLETE = "complete"


@dataclass
class Task:
    """Represents a todo task with title, description, and completion status.

    Attributes:
        id: Unique identifier (auto-assigned, immutable).
        title: Short task title (1-100 chars).
        description: Detailed description (1-500 chars).
        completed: Completion status (default: False).
        created_at: Creation timestamp (auto-assigned, immutable).
    """

    id: int
    title: str
    description: str
    completed: bool = False
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    def __str__(self) -> str:
        """Human-readable string representation."""
        status = "[X]" if self.completed else "[ ]"
        return f"[{self.id}] {status} {self.title}"

    def __repr__(self) -> str:
        """Developer-friendly string representation."""
        return (
            f"Task(id={self.id}, title={self.title!r}, "
            f"completed={self.completed}, created_at={self.created_at})"
        )
