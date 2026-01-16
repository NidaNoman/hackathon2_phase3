# Phase 1 Todo Console App

A simple console-based todo task manager demonstrating Spec-Driven Development with clean architecture principles.

## Features

- **Add Tasks**: Create new tasks with title and description
- **View Tasks**: Display all tasks in a formatted table
- **Update Tasks**: Modify task title and description
- **Delete Tasks**: Remove tasks with confirmation
- **Toggle Status**: Mark tasks as complete or incomplete
- **Exit**: Gracefully exit with data loss warning

## Requirements

- Python 3.13 or higher
- No external libraries (uses only Python standard library)

## Installation

1. Ensure Python 3.13+ is installed:
   ```bash
   python --version
   ```

2. Clone or download this repository

## Usage

### Run the Application

From the project root directory:

```bash
python src/main.py
```

Or using the Python module syntax:

```bash
python -m src.main
```

### Menu Options

Once the application starts, you'll see a menu with 6 options:

```
Main Menu:
  [1] Add Task
  [2] View Tasks
  [3] Update Task
  [4] Delete Task
  [5] Toggle Task Status
  [6] Exit
```

### Example Workflow

1. **Add a task**: Select option 1, enter title and description
2. **View tasks**: Select option 2 to see all tasks in a table
3. **Toggle status**: Select option 5, enter task ID to mark complete
4. **Update task**: Select option 3, enter task ID and new values
5. **Delete task**: Select option 4, enter task ID and confirm
6. **Exit**: Select option 6 to quit (data will be lost)

## Project Structure

```
src/
├── models/           # Data models (Task, TaskStatus)
├── repositories/     # Storage layer (TaskRepository, InMemoryTaskRepository)
├── services/         # Business logic (TaskService)
├── commands/         # Command handlers (add, view, update, delete, toggle, exit)
├── ui/              # Console UI (console helpers, formatters)
├── utils/           # Utilities (validators)
└── main.py          # Application entry point
```

## Architecture

- **Layered Architecture**: Separation of concerns (models, repositories, services, commands, UI)
- **Repository Pattern**: Abstract storage interface for testability
- **Dependency Injection**: Service receives repository, commands receive service
- **TDD Ready**: Clean separation enables easy unit and integration testing

## Constraints (Phase 1)

- **In-Memory Storage Only**: All data resets when application exits
- **Console UI Only**: Terminal-based interface (no web/GUI)
- **No External Libraries**: Uses only Python 3.13+ standard library
- **Single User**: No concurrent access support

## Validation Rules

### Task Title
- Must not be empty
- Maximum 100 characters
- Leading/trailing whitespace trimmed

### Task Description
- Must not be empty
- Maximum 500 characters
- Leading/trailing whitespace trimmed

### Task ID
- Must be a positive integer
- Auto-assigned starting from 1
- Sequential and unique

## Error Handling

The application handles errors gracefully:
- **Empty input**: "Title cannot be empty"
- **Too long**: "Title too long (X chars, max 100)"
- **Invalid ID**: "Task not found with ID X"
- **Non-numeric ID**: "Please enter a valid number"
- **Invalid menu choice**: "Invalid option. Please select 1-6"

## Data Lifecycle

1. Application starts with empty task list
2. User creates tasks (stored in memory)
3. User performs operations (view, update, toggle, delete)
4. Application exits → **all data lost**
5. Next start → fresh empty state

**Note**: This is expected Phase 1 behavior. Persistence will be added in Phase 2.

## Development

### Code Style
- Python 3.13+ with type hints
- Docstrings (Google style)
- Maximum function length: 50 lines (excluding docstrings)
- Clean, readable code over clever solutions

### Future Enhancements (Phase 2+)
- Persistent storage (files or database)
- Task categories and tags
- Due dates and reminders
- Search and filtering
- Task priority levels
- Multi-user support

## License

This is a demonstration project for educational purposes.

## Acknowledgments

Built following Spec-Driven Development (SDD) methodology with Constitution-driven design principles.
"# hackathon2_phaseone" 
