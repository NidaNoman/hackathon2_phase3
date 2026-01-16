"""In-memory implementation of task repository."""

from typing import Optional

from models.task import Task
from repositories.task_repository import TaskRepository


class InMemoryTaskRepository(TaskRepository):
    """In-memory task repository using dictionary storage.

    Attributes:
        _tasks: Dictionary mapping task ID to Task instance.
        _next_id: Counter for auto-increment IDs (starts at 1).
    """

    def __init__(self) -> None:
        """Initialize empty repository."""
        self._tasks: dict[int, Task] = {}
        self._next_id: int = 1

    def add(self, task: Task) -> Task:
        """Add new task, assign ID, return task with ID.

        Args:
            task: Task instance to add (id will be assigned).

        Returns:
            Task instance with assigned ID.
        """
        task.id = self._next_id
        self._tasks[task.id] = task
        self._next_id += 1
        return task

    def get_by_id(self, task_id: int) -> Optional[Task]:
        """Get task by ID, return None if not found.

        Args:
            task_id: Unique task identifier.

        Returns:
            Task instance if found, None otherwise.
        """
        return self._tasks.get(task_id)

    def get_all(self) -> list[Task]:
        """Get all tasks, return empty list if none.

        Returns:
            List of all tasks in insertion order.
        """
        return list(self._tasks.values())

    def update(self, task: Task) -> Task:
        """Update existing task, raise ValueError if not found.

        Args:
            task: Task instance with updated values.

        Returns:
            Updated task instance.

        Raises:
            ValueError: If task ID not found.
        """
        if task.id not in self._tasks:
            raise ValueError(f"Task not found with ID {task.id}")
        self._tasks[task.id] = task
        return task

    def delete(self, task_id: int) -> bool:
        """Delete task by ID, return True if deleted, False if not found.

        Args:
            task_id: Unique task identifier.

        Returns:
            True if task was deleted, False if not found.
        """
        if task_id in self._tasks:
            del self._tasks[task_id]
            return True
        return False

    def exists(self, task_id: int) -> bool:
        """Check if task with ID exists.

        Args:
            task_id: Unique task identifier.

        Returns:
            True if task exists, False otherwise.
        """
        return task_id in self._tasks
