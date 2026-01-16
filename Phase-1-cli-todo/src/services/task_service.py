"""Task service - business logic layer."""

from models.task import Task
from repositories.task_repository import TaskRepository
from utils.validators import validate_title, validate_description


class TaskService:
    """Business logic for task operations.

    Attributes:
        repository: Task repository for storage operations.
    """

    def __init__(self, repository: TaskRepository) -> None:
        """Initialize service with repository.

        Args:
            repository: Task repository instance.
        """
        self.repository = repository

    def create_task(self, title: str, description: str) -> Task:
        """Create new task with validation.

        Args:
            title: Task title.
            description: Task description.

        Returns:
            Created task with assigned ID.

        Raises:
            ValueError: If validation fails.
        """
        validate_title(title)
        validate_description(description)

        task = Task(id=0, title=title.strip(), description=description.strip())
        return self.repository.add(task)

    def get_task(self, task_id: int) -> Task:
        """Get task by ID.

        Args:
            task_id: Unique task identifier.

        Returns:
            Task instance.

        Raises:
            ValueError: If task not found.
        """
        task = self.repository.get_by_id(task_id)
        if task is None:
            raise ValueError(f"Task not found with ID {task_id}")
        return task

    def get_all_tasks(self) -> list[Task]:
        """Get all tasks.

        Returns:
            List of all tasks.
        """
        return self.repository.get_all()

    def update_task(self, task_id: int, title: str, description: str) -> Task:
        """Update existing task.

        Args:
            task_id: Task ID to update.
            title: New task title.
            description: New task description.

        Returns:
            Updated task.

        Raises:
            ValueError: If task not found or validation fails.
        """
        validate_title(title)
        validate_description(description)

        task = self.get_task(task_id)
        task.title = title.strip()
        task.description = description.strip()
        return self.repository.update(task)

    def toggle_task_status(self, task_id: int) -> Task:
        """Toggle task completion status.

        Args:
            task_id: Task ID to toggle.

        Returns:
            Updated task.

        Raises:
            ValueError: If task not found.
        """
        task = self.get_task(task_id)
        task.completed = not task.completed
        return self.repository.update(task)

    def delete_task(self, task_id: int) -> bool:
        """Delete task by ID.

        Args:
            task_id: Task ID to delete.

        Returns:
            True if deleted, False if not found.
        """
        return self.repository.delete(task_id)
