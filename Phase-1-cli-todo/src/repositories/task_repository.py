"""Task repository interface."""

from abc import ABC, abstractmethod
from typing import Optional

from models.task import Task


class TaskRepository(ABC):
    """Abstract interface for task storage operations."""

    @abstractmethod
    def add(self, task: Task) -> Task:
        """Add new task, assign ID, return task with ID.

        Args:
            task: Task instance to add (id will be assigned).

        Returns:
            Task instance with assigned ID.
        """
        ...

    @abstractmethod
    def get_by_id(self, task_id: int) -> Optional[Task]:
        """Get task by ID, return None if not found.

        Args:
            task_id: Unique task identifier.

        Returns:
            Task instance if found, None otherwise.
        """
        ...

    @abstractmethod
    def get_all(self) -> list[Task]:
        """Get all tasks, return empty list if none.

        Returns:
            List of all tasks in insertion order.
        """
        ...

    @abstractmethod
    def update(self, task: Task) -> Task:
        """Update existing task, raise ValueError if not found.

        Args:
            task: Task instance with updated values.

        Returns:
            Updated task instance.

        Raises:
            ValueError: If task ID not found.
        """
        ...

    @abstractmethod
    def delete(self, task_id: int) -> bool:
        """Delete task by ID, return True if deleted, False if not found.

        Args:
            task_id: Unique task identifier.

        Returns:
            True if task was deleted, False if not found.
        """
        ...

    @abstractmethod
    def exists(self, task_id: int) -> bool:
        """Check if task with ID exists.

        Args:
            task_id: Unique task identifier.

        Returns:
            True if task exists, False otherwise.
        """
        ...
