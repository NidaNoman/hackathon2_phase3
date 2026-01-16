"""Unit tests for Task model."""

import pytest
from datetime import datetime, timezone
from src.models.task import Task, TaskStatus


class TestTask:
    """Test Task dataclass."""

    def test_task_creation(self):
        """Test creating a task with all fields."""
        task = Task(
            id=1,
            title="Test Task",
            description="Test Description",
            completed=False
        )
        assert task.id == 1
        assert task.title == "Test Task"
        assert task.description == "Test Description"
        assert task.completed is False
        assert isinstance(task.created_at, datetime)

    def test_task_default_completed(self):
        """Test task defaults to not completed."""
        task = Task(id=1, title="Test", description="Test")
        assert task.completed is False

    def test_task_created_at_auto_assigned(self):
        """Test created_at is automatically assigned."""
        task = Task(id=1, title="Test", description="Test")
        assert task.created_at is not None
        assert isinstance(task.created_at, datetime)
        assert task.created_at.tzinfo == timezone.utc

    def test_task_str_representation_pending(self):
        """Test string representation for pending task."""
        task = Task(id=1, title="Test Task", description="Test")
        assert str(task) == "[1] [ ] Test Task"

    def test_task_str_representation_complete(self):
        """Test string representation for completed task."""
        task = Task(id=1, title="Test Task", description="Test", completed=True)
        assert str(task) == "[1] [X] Test Task"

    def test_task_repr(self):
        """Test repr includes all key fields."""
        task = Task(id=1, title="Test", description="Test")
        repr_str = repr(task)
        assert "Task(" in repr_str
        assert "id=1" in repr_str
        assert "title='Test'" in repr_str
        assert "completed=False" in repr_str


class TestTaskStatus:
    """Test TaskStatus enum."""

    def test_status_values(self):
        """Test enum values."""
        assert TaskStatus.PENDING.value == "pending"
        assert TaskStatus.COMPLETE.value == "complete"

    def test_status_members(self):
        """Test enum has expected members."""
        assert len(TaskStatus) == 2
        assert TaskStatus.PENDING in TaskStatus
        assert TaskStatus.COMPLETE in TaskStatus
