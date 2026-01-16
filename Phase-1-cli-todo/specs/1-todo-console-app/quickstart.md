# Quickstart Guide: Phase 1 Todo Console App

**Feature**: Phase 1 Todo Console App
**Date**: 2025-12-31
**Purpose**: Usage guide with examples and test scenarios

## Overview

This quickstart guide provides step-by-step instructions for using the Phase 1 Todo Console App, including example workflows, test scenarios, and expected outputs.

---

## Installation & Setup

### Prerequisites

- Python 3.13 or higher
- pip (Python package manager)

### Install Dependencies

```bash
# Install dependencies from pyproject.toml
pip install -e .

# Or install individually
pip install rich pytest mypy ruff pytest-cov
```

### Verify Installation

```bash
# Check Python version
python --version  # Should show 3.13.0 or higher

# Check installed packages
pip list | grep -E "(rich|pytest|mypy|ruff)"

# Run type checking
mypy src/ --strict

# Run linting
ruff check src/

# Run tests
pytest tests/ -v
```

---

## Running the Application

### Start the App

```bash
python src/main.py
```

### Expected Output (Startup)

```
╔══════════════════════════════════════════════╗
║   Todo Console App - Phase 1                 ║
║   Press Ctrl+C to exit at any time           ║
╚══════════════════════════════════════════════╝

Main Menu:
  [1] Add Task
  [2] View Tasks
  [3] Update Task
  [4] Delete Task
  [5] Toggle Task Status
  [6] Exit

Select option (1-6):
```

---

## Basic Workflows

### Workflow 1: Add Your First Task

**Steps**:
1. Start the app
2. Select option `1` (Add Task)
3. Enter title: `Buy groceries`
4. Enter description: `Get milk, eggs, and bread from the store`
5. Confirm creation

**Expected Output**:
```
Select option (1-6): 1

Add Task
────────
Enter task title: Buy groceries
Enter task description: Get milk, eggs, and bread from the store

✓ Task #1 created successfully!

Press Enter to continue...

[Returns to main menu]
```

---

### Workflow 2: View All Tasks

**Steps**:
1. Add at least one task (see Workflow 1)
2. Select option `2` (View Tasks)

**Expected Output**:
```
Select option (1-6): 2

Your Tasks
──────────

┌────┬───────────────┬──────────────────────────────────┬──────────┐
│ ID │ Title         │ Description                       │ Status   │
├────┼───────────────┼──────────────────────────────────┼──────────┤
│ 1  │ Buy groceries │ Get milk, eggs, and bread fro... │ ○ Pending│
└────┴───────────────┴──────────────────────────────────┴──────────┘

Total: 1 task(s)

Press Enter to continue...

[Returns to main menu]
```

**Empty State** (no tasks):
```
Your Tasks
──────────

No tasks found. Add your first task!

Press Enter to continue...
```

---

### Workflow 3: Mark Task as Complete

**Steps**:
1. Add a task (gets ID 1)
2. Select option `5` (Toggle Task Status)
3. Enter task ID: `1`
4. Confirm toggle

**Expected Output**:
```
Select option (1-6): 5

Toggle Task Status
──────────────────
Enter task ID: 1

✓ Task #1 status changed: ○ Pending → ✓ Complete

Press Enter to continue...
```

**View Tasks After Toggle**:
```
┌────┬───────────────┬──────────────────────────────────┬──────────┐
│ ID │ Title         │ Description                       │ Status   │
├────┼───────────────┼──────────────────────────────────┼──────────┤
│ 1  │ Buy groceries │ Get milk, eggs, and bread fro... │ ✓ Complete│
└────┴───────────────┴──────────────────────────────────┴──────────┘
```

---

### Workflow 4: Update a Task

**Steps**:
1. Add a task (gets ID 1)
2. Select option `3` (Update Task)
3. Enter task ID: `1`
4. Enter new title: `Buy groceries at Whole Foods`
5. Enter new description: `Get milk, eggs, bread, and organic vegetables`
6. Confirm update

**Expected Output**:
```
Select option (1-6): 3

Update Task
───────────
Enter task ID: 1

Current task:
  ID: 1
  Title: Buy groceries
  Description: Get milk, eggs, and bread from the store
  Status: ○ Pending

Enter new title (or press Enter to keep current): Buy groceries at Whole Foods
Enter new description (or press Enter to keep current): Get milk, eggs, bread, and organic vegetables

✓ Task #1 updated successfully!

Press Enter to continue...
```

---

### Workflow 5: Delete a Task

**Steps**:
1. Add a task (gets ID 1)
2. Select option `4` (Delete Task)
3. Enter task ID: `1`
4. Confirm deletion: `y`

**Expected Output**:
```
Select option (1-6): 4

Delete Task
───────────
Enter task ID: 1

Are you sure you want to delete this task?
  ID: 1
  Title: Buy groceries
  Status: ○ Pending

Confirm deletion (y/n): y

✓ Task #1 deleted successfully!

Press Enter to continue...
```

**Canceling Deletion**:
```
Confirm deletion (y/n): n

✗ Deletion canceled.

Press Enter to continue...
```

---

### Workflow 6: Exit the Application

**Steps**:
1. Select option `6` (Exit)
2. Confirm exit: `y`

**Expected Output**:
```
Select option (1-6): 6

Exit Application
────────────────

⚠️  Warning: All data will be lost when you exit.
   This is expected behavior for Phase 1.

Are you sure you want to exit? (y/n): y

Goodbye! Thank you for using Todo Console App.
```

**Canceling Exit**:
```
Are you sure you want to exit? (y/n): n

[Returns to main menu]
```

---

## Complete User Journey (End-to-End)

This workflow demonstrates all features in a single session:

### Step 1: Start App & Add Three Tasks

```
python src/main.py

Select option (1-6): 1
Enter task title: Buy groceries
Enter task description: Get milk, eggs, and bread
✓ Task #1 created successfully!

Select option (1-6): 1
Enter task title: Finish homework
Enter task description: Complete math problems 1-20
✓ Task #2 created successfully!

Select option (1-6): 1
Enter task title: Call mom
Enter task description: Wish her happy birthday
✓ Task #3 created successfully!
```

### Step 2: View All Tasks

```
Select option (1-6): 2

┌────┬──────────────────┬───────────────────────────────┬──────────┐
│ ID │ Title            │ Description                    │ Status   │
├────┼──────────────────┼───────────────────────────────┼──────────┤
│ 1  │ Buy groceries    │ Get milk, eggs, and bread      │ ○ Pending│
│ 2  │ Finish homework  │ Complete math problems 1-20    │ ○ Pending│
│ 3  │ Call mom         │ Wish her happy birthday        │ ○ Pending│
└────┴──────────────────┴───────────────────────────────┴──────────┘

Total: 3 task(s)
```

### Step 3: Mark Task #1 Complete

```
Select option (1-6): 5
Enter task ID: 1
✓ Task #1 status changed: ○ Pending → ✓ Complete
```

### Step 4: Update Task #2

```
Select option (1-6): 3
Enter task ID: 2
Enter new title: Finish math homework
Enter new description: Complete problems 1-20 and review chapter 5
✓ Task #2 updated successfully!
```

### Step 5: Delete Task #3

```
Select option (1-6): 4
Enter task ID: 3
Confirm deletion (y/n): y
✓ Task #3 deleted successfully!
```

### Step 6: View Updated Task List

```
Select option (1-6): 2

┌────┬─────────────────────┬───────────────────────────────────┬──────────┐
│ ID │ Title               │ Description                        │ Status   │
├────┼─────────────────────┼───────────────────────────────────┼──────────┤
│ 1  │ Buy groceries       │ Get milk, eggs, and bread          │ ✓ Complete│
│ 2  │ Finish math homework│ Complete problems 1-20 and rev... │ ○ Pending│
└────┴─────────────────────┴───────────────────────────────────┴──────────┘

Total: 2 task(s)
```

### Step 7: Exit

```
Select option (1-6): 6
Are you sure you want to exit? (y/n): y
Goodbye! Thank you for using Todo Console App.
```

---

## Error Handling Examples

### Error 1: Empty Title

```
Select option (1-6): 1
Enter task title:
✗ Error: Title cannot be empty
Please enter a valid title.
Enter task title: Buy groceries
```

### Error 2: Title Too Long (>100 chars)

```
Enter task title: This is a very long title that exceeds one hundred characters and will be rejected by the validation system
✗ Error: Title too long (123 chars, max 100)
Please enter a shorter title.
```

### Error 3: Invalid Task ID (Not Found)

```
Select option (1-6): 5
Enter task ID: 999
✗ Error: Task not found with ID 999
Please enter a valid task ID.
```

### Error 4: Non-Numeric Task ID

```
Select option (1-6): 5
Enter task ID: abc
✗ Error: Please enter a valid number
Enter task ID: 1
```

### Error 5: Invalid Menu Choice

```
Select option (1-6): 9
✗ Invalid option. Please select 1-6.

Select option (1-6):
```

---

## Test Scenarios (For QA/Testing)

### Test Scenario 1: MVP Functionality

**Objective**: Verify core add, view, exit workflow.

**Steps**:
1. Launch app
2. Add task: "Test Task 1" / "Description 1"
3. View tasks (should show 1 task)
4. Exit app

**Expected Results**:
- Task created with ID 1
- Task appears in list with correct title, description, and pending status
- App exits cleanly with goodbye message

**Pass Criteria**: All operations complete without errors, task displayed correctly.

---

### Test Scenario 2: Multiple Tasks

**Objective**: Verify app handles multiple tasks correctly.

**Steps**:
1. Add 5 tasks with different titles/descriptions
2. View tasks (should show all 5 in order)
3. Verify IDs are sequential (1, 2, 3, 4, 5)

**Expected Results**:
- All 5 tasks created successfully
- IDs auto-increment correctly
- All tasks displayed in insertion order

**Pass Criteria**: 5 tasks with IDs 1-5, all displayed correctly.

---

### Test Scenario 3: Status Toggle

**Objective**: Verify status toggle works correctly.

**Steps**:
1. Add task (ID 1, status pending)
2. Toggle status (1 → complete)
3. View tasks (status shows complete)
4. Toggle status again (1 → pending)
5. View tasks (status shows pending)

**Expected Results**:
- Status toggles correctly both directions
- Visual indicator changes (○ ↔ ✓)
- Confirmation messages show old → new status

**Pass Criteria**: Status toggles correctly, displays updated status.

---

### Test Scenario 4: Update Task

**Objective**: Verify task update functionality.

**Steps**:
1. Add task: "Original Title" / "Original Description"
2. Update task: "Updated Title" / "Updated Description"
3. View tasks (should show updated values)
4. Verify ID and status unchanged

**Expected Results**:
- Title and description updated
- ID remains same (1)
- Status unchanged (pending)
- Created timestamp unchanged

**Pass Criteria**: Only title/description changed, other fields preserved.

---

### Test Scenario 5: Delete Task

**Objective**: Verify task deletion.

**Steps**:
1. Add 3 tasks (IDs 1, 2, 3)
2. Delete task 2
3. View tasks (should show only 1 and 3)
4. Add new task (should get ID 4, not 2)

**Expected Results**:
- Task 2 deleted from list
- IDs not reused (next task is 4)
- Tasks 1 and 3 still displayed

**Pass Criteria**: Task deleted, ID not reused, remaining tasks intact.

---

### Test Scenario 6: Validation - Empty Input

**Objective**: Verify validation rejects empty title/description.

**Steps**:
1. Attempt to add task with empty title
2. Attempt to add task with whitespace-only title
3. Attempt to add task with empty description

**Expected Results**:
- All attempts rejected with clear error messages
- User prompted to re-enter valid input
- No tasks created

**Pass Criteria**: Validation errors displayed, no invalid tasks created.

---

### Test Scenario 7: Validation - Length Limits

**Objective**: Verify length validation for title and description.

**Steps**:
1. Attempt title with 101 characters (should fail)
2. Add title with 100 characters (should succeed)
3. Attempt description with 501 characters (should fail)
4. Add description with 500 characters (should succeed)

**Expected Results**:
- 101-char title rejected with error message showing actual length
- 100-char title accepted
- 501-char description rejected
- 500-char description accepted

**Pass Criteria**: Boundary validation works at exactly 100/500 chars.

---

### Test Scenario 8: Error Handling - Invalid IDs

**Objective**: Verify error handling for non-existent task IDs.

**Steps**:
1. Add task (ID 1)
2. Attempt to update task 999 (doesn't exist)
3. Attempt to delete task 0 (invalid)
4. Attempt to toggle status of task -1 (invalid)

**Expected Results**:
- All operations fail with "Task not found" error
- Clear error messages with invalid ID shown
- User prompted to try again

**Pass Criteria**: Invalid IDs rejected, clear error messages displayed.

---

### Test Scenario 9: Performance - 100 Tasks

**Objective**: Verify performance with 100 tasks.

**Steps**:
1. Add 100 tasks (programmatically or manually)
2. View all tasks
3. Update task #50
4. Delete task #75
5. Measure operation response times

**Expected Results**:
- Add 100 tasks: Each <5 seconds
- View 100 tasks: <2 seconds (SC-002)
- Update task: <3 seconds (SC-003)
- Delete task: <3 seconds (SC-004)
- App remains responsive

**Pass Criteria**: All operations meet success criteria timing requirements.

---

### Test Scenario 10: Data Persistence Warning

**Objective**: Verify data loss warning on exit.

**Steps**:
1. Add 3 tasks
2. Select Exit
3. Observe warning message
4. Cancel exit (n)
5. Verify tasks still present
6. Exit again (y)
7. Restart app
8. Verify tasks are gone (fresh state)

**Expected Results**:
- Warning displayed before exit
- Can cancel exit and return to app
- Data lost after exit (expected)
- Fresh start has no tasks

**Pass Criteria**: Warning displayed, data loss occurs as expected.

---

## Troubleshooting

### Issue: ModuleNotFoundError (rich, pytest, etc.)

**Solution**: Install dependencies
```bash
pip install rich pytest mypy ruff pytest-cov
```

### Issue: Python version too old

**Error**: `SyntaxError: invalid syntax` (for modern features)

**Solution**: Upgrade to Python 3.13+
```bash
python --version  # Check current version
# Install Python 3.13 from python.org or via package manager
```

### Issue: Type errors (mypy failures)

**Error**: `error: Incompatible types in assignment`

**Solution**: Add type hints, fix type mismatches
```bash
mypy src/ --strict --show-error-codes
# Fix reported errors
```

### Issue: Linting errors (ruff failures)

**Error**: `E501 line too long`, `F401 unused import`

**Solution**: Fix linting issues
```bash
ruff check src/ --fix  # Auto-fix some issues
# Manually fix remaining issues
```

### Issue: Tests failing

**Error**: `FAILED tests/unit/test_task_model.py::test_task_creation`

**Solution**: Debug failing tests
```bash
pytest tests/ -v --tb=short  # Verbose output with short traceback
pytest tests/unit/test_task_model.py -v  # Run specific test file
pytest tests/ -k test_task_creation  # Run specific test by name
```

### Issue: Coverage below 80%

**Error**: `Coverage: 65% (required 80%)`

**Solution**: Add missing tests
```bash
pytest tests/ --cov=src --cov-report=html
# Open htmlcov/index.html to see uncovered lines
# Add tests for uncovered code
```

---

## Developer Notes

### Running in Development Mode

```bash
# Run with debug output
python -v src/main.py

# Run with Python warnings
python -W all src/main.py

# Run with profiling
python -m cProfile -o profile.stats src/main.py
```

### Running Tests

```bash
# All tests
pytest tests/ -v

# Unit tests only (fast)
pytest tests/unit/ -v

# Integration tests only
pytest tests/integration/ -v

# Specific test
pytest tests/unit/test_task_model.py::test_task_creation -v

# With coverage
pytest tests/ --cov=src --cov-report=term-missing

# Generate HTML coverage report
pytest tests/ --cov=src --cov-report=html
# Open htmlcov/index.html in browser
```

### Code Quality Checks

```bash
# Type checking
mypy src/ tests/ --strict

# Linting
ruff check src/ tests/

# Auto-fix linting issues
ruff check src/ --fix

# Format code (if formatter configured)
ruff format src/ tests/
```

### Pre-Commit Checklist

Before committing code, ensure:
- ✅ All tests pass: `pytest tests/ -v`
- ✅ Type checking passes: `mypy src/ --strict`
- ✅ Linting passes: `ruff check src/`
- ✅ Coverage ≥80%: `pytest tests/ --cov=src`
- ✅ Manual testing: Run app and verify workflows

---

## Next Steps

After completing the quickstart:

1. **Implement MVP** (Phase 1, 2, 3, 4, 8 from tasks.md)
   - Setup project structure
   - Build foundational components (TDD)
   - Implement add, view, exit features
   - Verify all MVP tests pass

2. **Add Full Feature Set** (Phase 5, 6, 7 from tasks.md)
   - Implement update task feature
   - Implement delete task feature
   - Implement toggle status feature
   - Verify all integration tests pass

3. **Polish** (Phase 9 from tasks.md)
   - Add comprehensive documentation
   - Run all quality gates
   - Performance testing
   - Final validation

4. **Demo**: Present working app showing complete workflow

---

**Status**: ✅ Quickstart guide complete - Ready for implementation
**Next Step**: Begin implementation following tasks.md (start with Phase 1: Setup)
