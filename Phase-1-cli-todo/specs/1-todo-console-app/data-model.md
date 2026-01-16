# Data Model: Phase 1 Todo Console App

**Feature**: Phase 1 Todo Console App
**Date**: 2025-12-31
**Purpose**: Define entities, their attributes, relationships, and validation rules

## Overview

This document specifies the data model for the Phase 1 Todo Console App. The model is intentionally simple, consisting of a single primary entity (Task) with no complex relationships, foreign keys, or normalization requirements due to the in-memory storage constraint.

---

## Entity: Task

**Purpose**: Represents a single todo item with all necessary attributes for task management.

**Storage**: In-memory dictionary with integer keys mapping to Task instances.

### Fields

| Field | Type | Required | Default | Immutable | Description |
|-------|------|----------|---------|-----------|-------------|
| id | int | Yes | Auto-assigned | Yes | Unique identifier, starts at 1, auto-increments |
| title | str | Yes | N/A | No | Short task title (1-100 chars) |
| description | str | Yes | N/A | No | Detailed task description (1-500 chars) |
| completed | bool | Yes | False | No | Completion status (False = pending, True = complete) |
| created_at | datetime | Yes | Auto-assigned | Yes | Timestamp of task creation (UTC) |

### Field Specifications

#### id: int

**Purpose**: Unique identifier for each task.

**Constraints**:
- Positive integer (≥1)
- Unique across all active tasks
- Sequential (1, 2, 3, ...) within a session
- Never reused, even after task deletion

**Assignment**:
- Auto-assigned by repository on task creation
- User never provides ID (system-generated)
- Immutable after assignment

**Validation**: N/A (system-generated, always valid)

**Examples**:
- Valid: 1, 2, 3, 100, 999999
- Invalid: 0, -1, 1.5 (but system never generates these)

---

#### title: str

**Purpose**: Short, concise task title displayed in lists and summaries.

**Constraints**:
- Minimum length: 1 character (non-empty)
- Maximum length: 100 characters
- No leading or trailing whitespace (stripped on input)
- Can contain any printable characters (letters, numbers, symbols, emojis)

**Validation Rules**:
1. Not empty after stripping whitespace
2. Length ≤ 100 characters after stripping
3. Must be string type (not None, not int)

**Validation Function** (`validators.py`):
```python
def validate_title(title: str) -> None:
    """Validate task title.

    Raises:
        ValueError: If title is empty or exceeds 100 characters.
    """
    title_stripped = title.strip()
    if not title_stripped:
        raise ValueError("Title cannot be empty")
    if len(title_stripped) > 100:
        raise ValueError(f"Title too long ({len(title_stripped)} chars, max 100)")
```

**Examples**:
- Valid: "Buy groceries", "Finish homework", "Call mom 📞", "Meeting @ 3pm"
- Invalid: "" (empty), "   " (whitespace only), "A" * 101 (too long)

---

#### description: str

**Purpose**: Detailed task description with additional context or instructions.

**Constraints**:
- Minimum length: 1 character (non-empty)
- Maximum length: 500 characters
- No leading or trailing whitespace (stripped on input)
- Can contain any printable characters including newlines (displayed truncated in lists)

**Validation Rules**:
1. Not empty after stripping whitespace
2. Length ≤ 500 characters after stripping
3. Must be string type (not None, not int)

**Validation Function** (`validators.py`):
```python
def validate_description(description: str) -> None:
    """Validate task description.

    Raises:
        ValueError: If description is empty or exceeds 500 characters.
    """
    desc_stripped = description.strip()
    if not desc_stripped:
        raise ValueError("Description cannot be empty")
    if len(desc_stripped) > 500:
        raise ValueError(f"Description too long ({len(desc_stripped)} chars, max 500)")
```

**Display Behavior**:
- Full text stored in task
- Truncated to ~50 chars with ellipsis in list view
- Full text shown in detail view (future enhancement)

**Examples**:
- Valid: "Get milk, eggs, and bread from grocery store", "Complete math homework problems 1-20"
- Invalid: "" (empty), "   " (whitespace only), "A" * 501 (too long)

---

#### completed: bool

**Purpose**: Indicates whether the task has been completed.

**Constraints**:
- Must be boolean type (True or False only)
- Defaults to False on task creation (new tasks are pending)
- Can be toggled between True and False any number of times

**Validation**: Type-enforced by Python (bool type), no additional validation needed.

**States**:
- `False` → PENDING status → Displayed as "○ Pending" or similar
- `True` → COMPLETE status → Displayed as "✓ Complete" or similar

**Operations**:
- Set to True: Mark task as complete
- Set to False: Mark task as incomplete (re-open)
- Toggle: Switch between True and False

**Examples**:
- Valid: True, False
- Invalid: "true" (string), 1 (int), None (null) - type system prevents these

---

#### created_at: datetime

**Purpose**: Records when the task was created for auditing and sorting.

**Constraints**:
- Must be timezone-aware datetime (UTC)
- Auto-assigned on task creation (user never provides)
- Immutable after assignment (never updated)
- Uses Python datetime.datetime type

**Assignment**:
```python
from datetime import datetime, timezone
task.created_at = datetime.now(timezone.utc)
```

**Format**:
- Internal: Python datetime object
- Display: ISO 8601 format (e.g., "2025-12-31T10:30:00Z")
- Optional: Human-readable (e.g., "Created 5 minutes ago")

**Usage** (Phase 1):
- Stored but not displayed in UI (future enhancement)
- Used for testing and debugging
- Available for future sorting/filtering features

**Examples**:
- Valid: datetime(2025, 12, 31, 10, 30, 0, tzinfo=timezone.utc)
- Invalid: N/A (system-generated, always valid)

---

### Python Implementation

**Dataclass Definition** (src/models/task.py):

```python
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import ClassVar

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
        status = "✓" if self.completed else "○"
        return f"[{self.id}] {status} {self.title}"

    def __repr__(self) -> str:
        """Developer-friendly string representation."""
        return (f"Task(id={self.id}, title={self.title!r}, "
                f"completed={self.completed}, created_at={self.created_at})")
```

**Notes**:
- `@dataclass` decorator auto-generates `__init__`, `__eq__`, `__hash__`
- `field(default_factory=...)` ensures each task gets unique datetime
- Type hints enable mypy strict mode type checking
- `__str__` for user-facing display, `__repr__` for debugging

---

## Enum: TaskStatus

**Purpose**: Explicit enumeration of task status values (alternative to boolean).

**Definition** (src/models/task.py):

```python
from enum import Enum

class TaskStatus(Enum):
    """Task completion status."""
    PENDING = "pending"
    COMPLETE = "complete"
```

**Usage** (Phase 1):
- Defined but not directly used in Task dataclass
- Available for future enhancements (more status types)
- Currently, `completed: bool` field serves same purpose

**Future Extensions** (Phase 2+):
- ARCHIVED = "archived"
- IN_PROGRESS = "in_progress"
- BLOCKED = "blocked"

**Note**: In Phase 1, use `task.completed` bool for simplicity. Enum exists for future extensibility.

---

## Repository Model: TaskRepository

**Purpose**: Abstract interface for task storage operations.

**Definition** (src/repositories/task_repository.py):

```python
from abc import ABC, abstractmethod
from typing import Protocol

class TaskRepository(ABC):
    """Abstract interface for task storage operations."""

    @abstractmethod
    def add(self, task: Task) -> Task:
        """Add new task, assign ID, return task with ID."""
        ...

    @abstractmethod
    def get_by_id(self, task_id: int) -> Task | None:
        """Get task by ID, return None if not found."""
        ...

    @abstractmethod
    def get_all(self) -> list[Task]:
        """Get all tasks, return empty list if none."""
        ...

    @abstractmethod
    def update(self, task: Task) -> Task:
        """Update existing task, raise ValueError if not found."""
        ...

    @abstractmethod
    def delete(self, task_id: int) -> bool:
        """Delete task by ID, return True if deleted, False if not found."""
        ...

    @abstractmethod
    def exists(self, task_id: int) -> bool:
        """Check if task with ID exists."""
        ...
```

---

## Repository Implementation: InMemoryTaskRepository

**Purpose**: Concrete in-memory implementation using dictionary storage.

**Internal State**:
```python
_tasks: dict[int, Task]  # Maps task ID to Task instance
_next_id: int            # Counter for auto-increment IDs (starts at 1)
```

**Storage Characteristics**:
- O(1) lookup, insert, delete by ID (dictionary)
- Insertion order preserved (Python 3.7+ guarantee)
- No persistence (data lost on app restart)
- Thread-safe not required (single-user, single-thread)

**ID Assignment Algorithm**:
1. New task created (id field unset or 0)
2. Assign `task.id = self._next_id`
3. Increment `self._next_id += 1`
4. Store `self._tasks[task.id] = task`
5. Return task with assigned ID

**ID Reuse Policy**: Never reuse IDs within session
- IDs: 1, 2, 3, 4, 5
- Delete task 3
- Next new task gets ID 6 (NOT 3)
- Rationale: Simpler logic, predictable behavior, no user confusion

**get_all() Ordering**: Tasks returned in insertion order (dict order)
- No explicit sorting required (Python 3.7+ dicts maintain insertion order)
- Future enhancement: sort by created_at, completed status, or ID

---

## Data Validation

### Input Validation (Entry Points)

**Where**: Command handlers (src/commands/*.py)

**What**: Validate user input before passing to service layer

**Validators** (src/utils/validators.py):

1. **validate_title(title: str) -> None**
   - Strips whitespace
   - Checks non-empty
   - Checks length ≤ 100
   - Raises ValueError with message if invalid

2. **validate_description(description: str) -> None**
   - Strips whitespace
   - Checks non-empty
   - Checks length ≤ 500
   - Raises ValueError with message if invalid

3. **validate_positive_int(value: str) -> int**
   - Parses string to int
   - Checks value ≥ 1
   - Raises ValueError if invalid format or value

**Error Messages**:
- "Title cannot be empty"
- "Title too long (150 chars, max 100)"
- "Description cannot be empty"
- "Description too long (600 chars, max 500)"
- "Please enter a valid number"
- "ID must be a positive number"

---

### Business Logic Validation (Service Layer)

**Where**: TaskService (src/services/task_service.py)

**What**: Validate business rules and data consistency

**Validations**:

1. **Task ID exists** (before update, delete, toggle):
   - Check `repository.exists(task_id)`
   - Raise ValueError("Task not found with ID {task_id}") if False

2. **Task ID valid** (positive integer):
   - Type-enforced by Python type hints
   - Additional check: `task_id >= 1`

3. **No duplicate IDs** (on add):
   - Handled by repository (auto-increment guarantees uniqueness)
   - No explicit check needed

---

## Data Flow

### Create Task Flow

```
User Input (title, description)
    ↓
Command: add_task.py
    ↓ validate_title(), validate_description()
Service: TaskService.create_task()
    ↓ Create Task instance (id=0, completed=False, created_at=now)
Repository: InMemoryTaskRepository.add()
    ↓ Assign id=_next_id, increment counter, store in dict
Return Task with assigned ID
    ↓
Command: Display confirmation "Task #5 created successfully!"
```

### Update Task Flow

```
User Input (task_id, new_title, new_description)
    ↓
Command: update_task.py
    ↓ validate_positive_int(task_id), validate_title(), validate_description()
Service: TaskService.update_task()
    ↓ Check exists(task_id), raise if not found
    ↓ Get existing task, modify title and description
Repository: InMemoryTaskRepository.update()
    ↓ Store modified task back in dict
Return updated Task
    ↓
Command: Display confirmation "Task #5 updated successfully!"
```

### Toggle Status Flow

```
User Input (task_id)
    ↓
Command: toggle_status.py
    ↓ validate_positive_int(task_id)
Service: TaskService.toggle_task_status()
    ↓ Check exists(task_id), raise if not found
    ↓ Get existing task, toggle completed field (True ↔ False)
Repository: InMemoryTaskRepository.update()
    ↓ Store modified task back in dict
Return updated Task
    ↓
Command: Display confirmation "Task #5: Pending → Complete"
```

---

## Relationships

**Current**: No relationships (single entity model)

**Future** (Phase 2+ considerations):
- Task → Category (many-to-one): Tasks belong to categories
- Task → Tag (many-to-many): Tasks can have multiple tags
- Task → Subtask (one-to-many): Tasks can have child tasks
- Task → User (many-to-one): Tasks assigned to users (multi-user support)

**Phase 1 Decision**: Keep simple, single entity only. Relationships add complexity without value for MVP.

---

## Data Lifecycle

### Creation
1. User enters title and description via CLI
2. Command validates inputs
3. Service creates Task instance (id unset, completed=False, created_at=now)
4. Repository assigns ID and stores in dict
5. Task becomes active

### Read
1. User requests task list or specific task
2. Service calls repository.get_all() or get_by_id()
3. Repository returns tasks from dict
4. Command formats and displays tasks

### Update
1. User provides task ID and new values (title, description, or status toggle)
2. Command validates inputs
3. Service retrieves task, modifies fields
4. Repository updates dict entry
5. Task remains active with modified values

### Delete
1. User provides task ID
2. Command validates ID, confirms deletion
3. Service calls repository.delete()
4. Repository removes entry from dict
5. Task no longer active (ID not reused)

### Persistence
- Phase 1: No persistence - all data lost on app exit
- Memory cleared when Python process terminates
- Fresh empty state on each app restart

---

## Data Constraints Summary

| Constraint | Enforcement | Validation Point |
|------------|-------------|------------------|
| ID uniqueness | Repository (auto-increment) | System-guaranteed |
| ID immutability | Python (no setter) | System-guaranteed |
| Title non-empty | Validator function | Command layer |
| Title length ≤100 | Validator function | Command layer |
| Description non-empty | Validator function | Command layer |
| Description length ≤500 | Validator function | Command layer |
| Completed is bool | Python type system | Type-guaranteed |
| created_at immutability | Python (no setter) | System-guaranteed |
| Task ID exists (update/delete) | Service business logic | Service layer |

---

## Testing Data

### Valid Test Cases

**Minimal Task**:
```python
Task(id=1, title="A", description="B", completed=False)
```

**Typical Task**:
```python
Task(id=5, title="Buy groceries", description="Get milk, eggs, and bread", completed=False)
```

**Completed Task**:
```python
Task(id=10, title="Finish homework", description="Math problems 1-20", completed=True)
```

**Edge Case - Long Title** (100 chars exactly):
```python
Task(id=20, title="A" * 100, description="Test", completed=False)
```

**Edge Case - Long Description** (500 chars exactly):
```python
Task(id=30, title="Test", description="A" * 500, completed=False)
```

### Invalid Test Cases (Should Raise ValueError)

**Empty Title**:
```python
Task(id=1, title="", description="Test")  # ValueError in validator
```

**Title Too Long** (101 chars):
```python
Task(id=1, title="A" * 101, description="Test")  # ValueError in validator
```

**Empty Description**:
```python
Task(id=1, title="Test", description="")  # ValueError in validator
```

**Description Too Long** (501 chars):
```python
Task(id=1, title="Test", description="A" * 501)  # ValueError in validator
```

**Invalid ID** (0 or negative):
```python
Task(id=0, ...)  # Never created by system
Task(id=-1, ...)  # Never created by system
```

---

## Schema Diagram

```
┌─────────────────────────────────────────┐
│              Task                        │
├─────────────────────────────────────────┤
│ id: int (PK, auto-increment, immutable) │
│ title: str (1-100 chars, required)      │
│ description: str (1-500 chars, required)│
│ completed: bool (default: False)        │
│ created_at: datetime (auto, immutable)  │
└─────────────────────────────────────────┘
              ↕
┌─────────────────────────────────────────┐
│   InMemoryTaskRepository                │
├─────────────────────────────────────────┤
│ _tasks: dict[int, Task]                 │
│ _next_id: int (starts at 1)             │
└─────────────────────────────────────────┘
```

**Storage**: Dictionary mapping int → Task
**Relationships**: None (single entity)
**Indexes**: None (dict provides O(1) key access)

---

**Status**: ✅ Data model complete - Ready for implementation
**Next Step**: Create quickstart.md with usage examples and test scenarios
