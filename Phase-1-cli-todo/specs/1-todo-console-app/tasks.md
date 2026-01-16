---
description: "Task list for Phase 1 Todo Console App implementation"
---

# Tasks: Phase 1 Todo Console App

**Input**: Design documents from `specs/1-todo-console-app/`
**Prerequisites**: spec.md (available)
**Note**: plan.md not yet created - using Constitution constraints and spec details for architectural assumptions

**⚠️ SPEC DEVIATION NOTICE**: User requested additional features beyond current spec.md:
- **Added**: "Update task" functionality (not in original spec)
- **Added**: Separate "title" field for tasks (spec only has "description")
- **Added**: Toggle complete/incomplete status (spec only has "mark complete")

These enhancements align with user requirements but should be documented in spec.md for full SDD compliance.

**Tests**: TDD mandatory per Constitution - all test tasks included (red-green-refactor cycle)

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project structure** (per Constitution): `src/` and `tests/` at repository root
- Python 3.13+ with type hints (mypy strict mode)
- In-memory storage only (no databases/files)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project directory structure (src/, tests/unit/, tests/integration/)
- [ ] T002 Initialize Python project with pyproject.toml (Python 3.13+, pytest, mypy, ruff dependencies)
- [ ] T003 [P] Configure mypy for strict type checking in pyproject.toml
- [ ] T004 [P] Configure ruff linting rules in pyproject.toml
- [ ] T005 [P] Configure pytest with coverage settings in pyproject.toml
- [ ] T006 Create .gitignore for Python (*.pyc, __pycache__/, .pytest_cache/, .mypy_cache/, .coverage)
- [ ] T007 Create README.md with project overview and setup instructions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 [P] Create Task entity model in src/models/task.py with fields: id (int), title (str), description (str), completed (bool), created_at (datetime)
- [ ] T009 [P] Create TaskStatus enum in src/models/task.py (PENDING, COMPLETE)
- [ ] T010 [P] Write unit tests for Task model in tests/unit/test_task_model.py (TDD - write these FIRST, ensure they FAIL)
- [ ] T011 Create TaskRepository interface in src/repositories/task_repository.py with methods: add, get_by_id, get_all, update, delete
- [ ] T012 Implement InMemoryTaskRepository in src/repositories/in_memory_repository.py with dict-based storage and auto-increment IDs
- [ ] T013 [P] Write unit tests for InMemoryTaskRepository in tests/unit/test_repository.py (TDD - write FIRST, ensure FAIL)
- [ ] T014 Create input validation module in src/utils/validators.py (validate_description, validate_id, validate_menu_choice)
- [ ] T015 [P] Write unit tests for validators in tests/unit/test_validators.py (TDD - write FIRST, ensure FAIL)
- [ ] T016 Create console UI helper module in src/ui/console.py (display_menu, display_task_list, display_message, get_user_input)
- [ ] T017 [P] Write unit tests for console helpers in tests/unit/test_console.py (TDD - write FIRST, ensure FAIL)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add Task (Priority: P1) 🎯 MVP

**Goal**: User can create a new task by providing title and description. System assigns unique ID and stores in memory.

**Independent Test**: Launch app, select "Add Task", enter title "Buy groceries" and description "Get milk and eggs", verify task created with ID 1 and appears in list.

### Tests for User Story 1 (TDD - Write FIRST) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T018 [P] [US1] Integration test for add task workflow in tests/integration/test_add_task.py (test_add_task_success, test_add_task_empty_title, test_add_task_empty_description, test_add_task_auto_increment_ids)

### Implementation for User Story 1

- [ ] T019 [US1] Create TaskService class in src/services/task_service.py with create_task(title, description) method
- [ ] T020 [US1] Implement add_task command handler in src/commands/add_task.py (prompt for title, prompt for description, validate, call service, display confirmation)
- [ ] T021 [US1] Add "Add Task" option to main menu in src/main.py
- [ ] T022 [US1] Implement error handling for validation failures (empty title/description, length limits)
- [ ] T023 [US1] Add logging for task creation operations in src/services/task_service.py

**Checkpoint**: At this point, users can add tasks and see them created with unique IDs

---

## Phase 4: User Story 2 - View All Tasks (Priority: P1) 🎯 MVP

**Goal**: User can view complete list of all tasks with ID, title, description, and completion status.

**Independent Test**: Create 3 tasks (1 pending, 1 complete, 1 pending), select "View Tasks", verify all 3 display with correct status indicators.

### Tests for User Story 2 (TDD - Write FIRST) ⚠️

- [ ] T024 [P] [US2] Integration test for view tasks workflow in tests/integration/test_view_tasks.py (test_view_tasks_with_data, test_view_tasks_empty, test_view_tasks_displays_status, test_view_tasks_formatting)

### Implementation for User Story 2

- [ ] T025 [US2] Add get_all_tasks() method to TaskService in src/services/task_service.py
- [ ] T026 [US2] Implement view_tasks command handler in src/commands/view_tasks.py (retrieve all tasks, format display with table, handle empty state)
- [ ] T027 [US2] Create task display formatter in src/ui/formatters.py (format_task_table with columns: ID, Title, Description, Status)
- [ ] T028 [US2] Add visual status indicators in formatter (e.g., "✓" for complete, "○" for pending, or use rich library for colors)
- [ ] T029 [US2] Add "View Tasks" option to main menu in src/main.py
- [ ] T030 [US2] Handle edge case: display "No tasks found" message when list is empty

**Checkpoint**: At this point, users can add tasks AND view the complete list with status

---

## Phase 5: User Story 3 - Update Task (Priority: P2)

**Goal**: User can update an existing task's title and/or description by providing task ID.

**Independent Test**: Create task with ID 1, select "Update Task", enter ID 1, update title to "Modified Title", verify task displays updated title in list.

### Tests for User Story 3 (TDD - Write FIRST) ⚠️

- [ ] T031 [P] [US3] Integration test for update task workflow in tests/integration/test_update_task.py (test_update_title, test_update_description, test_update_both, test_update_invalid_id, test_update_empty_values)

### Implementation for User Story 3

- [ ] T032 [US3] Add update_task(task_id, title, description) method to TaskService in src/services/task_service.py
- [ ] T033 [US3] Implement update_task command handler in src/commands/update_task.py (prompt for ID, validate ID exists, prompt for new title, prompt for new description, update, display confirmation)
- [ ] T034 [US3] Add "Update Task" option to main menu in src/main.py
- [ ] T035 [US3] Implement error handling for invalid task ID (display "Task not found" message)
- [ ] T036 [US3] Add validation to prevent updating to empty title/description

**Checkpoint**: At this point, users can add, view, AND update tasks

---

## Phase 6: User Story 4 - Delete Task (Priority: P2)

**Goal**: User can permanently delete a task by providing task ID.

**Independent Test**: Create 3 tasks, delete task with ID 2, view tasks, verify only tasks 1 and 3 remain.

### Tests for User Story 4 (TDD - Write FIRST) ⚠️

- [ ] T037 [P] [US4] Integration test for delete task workflow in tests/integration/test_delete_task.py (test_delete_success, test_delete_invalid_id, test_delete_task_not_in_list_after_deletion)

### Implementation for User Story 4

- [ ] T038 [US4] Add delete_task(task_id) method to TaskService in src/services/task_service.py
- [ ] T039 [US4] Implement delete_task command handler in src/commands/delete_task.py (prompt for ID, validate ID exists, confirm deletion, delete, display confirmation)
- [ ] T040 [US4] Add "Delete Task" option to main menu in src/main.py
- [ ] T041 [US4] Implement error handling for invalid task ID
- [ ] T042 [US4] Add confirmation prompt "Are you sure you want to delete task #[ID]? (y/n)"

**Checkpoint**: At this point, users can add, view, update, AND delete tasks

---

## Phase 7: User Story 5 - Mark Task Complete/Incomplete (Priority: P2)

**Goal**: User can toggle task completion status between complete and incomplete by providing task ID.

**Independent Test**: Create task with ID 1 (pending), mark complete, verify status changes to complete. Mark incomplete, verify status returns to pending.

### Tests for User Story 5 (TDD - Write FIRST) ⚠️

- [ ] T043 [P] [US5] Integration test for toggle task status workflow in tests/integration/test_toggle_status.py (test_mark_complete, test_mark_incomplete, test_toggle_idempotent, test_toggle_invalid_id)

### Implementation for User Story 5

- [ ] T044 [US5] Add toggle_task_status(task_id) method to TaskService in src/services/task_service.py
- [ ] T045 [US5] Implement toggle_status command handler in src/commands/toggle_status.py (prompt for ID, validate, toggle status, display confirmation with new status)
- [ ] T046 [US5] Add "Toggle Task Status" option to main menu in src/main.py
- [ ] T047 [US5] Implement error handling for invalid task ID
- [ ] T048 [US5] Display current status and new status in confirmation message (e.g., "Task #1 status changed: Pending → Complete")

**Checkpoint**: All core CRUD operations complete - fully functional task manager

---

## Phase 8: User Story 6 - Exit Application (Priority: P1)

**Goal**: User can gracefully exit application with data loss warning.

**Independent Test**: Launch app, select "Exit", verify goodbye message displays and application terminates cleanly.

### Tests for User Story 6 (TDD - Write FIRST) ⚠️

- [ ] T049 [P] [US6] Integration test for exit workflow in tests/integration/test_exit.py (test_exit_displays_warning, test_exit_terminates_cleanly)

### Implementation for User Story 6

- [ ] T050 [US6] Implement exit_app command handler in src/commands/exit_app.py (display warning about data loss, display goodbye message, return exit signal)
- [ ] T051 [US6] Add "Exit" option to main menu in src/main.py
- [ ] T052 [US6] Implement main application loop in src/main.py (menu display, command dispatch, exit handling)
- [ ] T053 [US6] Add warning message: "⚠️ Warning: All data will be lost. Are you sure? (y/n)"
- [ ] T054 [US6] Add goodbye message: "Goodbye! Thank you for using Todo Console App."

**Checkpoint**: Complete application with all user stories functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T055 [P] Add comprehensive docstrings to all modules (Google style with type hints)
- [ ] T056 [P] Run mypy strict type checking and fix any type errors
- [ ] T057 [P] Run ruff linting and fix any violations
- [ ] T058 [P] Run pytest with coverage report and ensure ≥80% coverage
- [ ] T059 [P] Add unit tests for TaskService methods in tests/unit/test_task_service.py
- [ ] T060 [P] Create end-to-end integration test in tests/integration/test_full_workflow.py (complete user journey: add → view → update → toggle → delete → exit)
- [ ] T061 Update README.md with usage instructions, examples, and screenshots (text-based)
- [ ] T062 [P] Add error handling for edge cases: very long task lists (100+ items with pagination), special characters in input, extremely long descriptions
- [ ] T063 [P] Performance testing: verify <2s startup, <500ms operations with 100 tasks, <500MB memory with 500 tasks
- [ ] T064 Create quickstart guide in docs/quickstart.md with step-by-step examples
- [ ] T065 Run final quality gate checks (all tests pass, mypy pass, ruff pass, coverage ≥80%)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-8)**: All depend on Foundational phase completion
  - US1 (Add Task) → No dependencies on other stories
  - US2 (View Tasks) → Should integrate with US1 (view added tasks)
  - US3 (Update Task) → Depends on US1 and US2 (need tasks to update and view changes)
  - US4 (Delete Task) → Depends on US1 and US2 (need tasks to delete and verify removal)
  - US5 (Toggle Status) → Depends on US1 and US2 (need tasks to toggle and view status)
  - US6 (Exit) → No dependencies (can be implemented anytime)
- **Polish (Phase 9)**: Depends on all user stories being complete

### Recommended Implementation Order

**MVP First (Fastest Path to Working App)**:
1. Phase 1: Setup
2. Phase 2: Foundational
3. Phase 3: User Story 1 (Add Task)
4. Phase 4: User Story 2 (View Tasks)
5. Phase 8: User Story 6 (Exit)
**→ STOP and VALIDATE: You now have a minimal working app (add + view + exit)**

**Incremental Feature Addition**:
6. Phase 7: User Story 5 (Toggle Status)
7. Phase 6: User Story 4 (Delete Task)
8. Phase 5: User Story 3 (Update Task)
9. Phase 9: Polish

### Within Each User Story

**TDD Workflow (MANDATORY per Constitution)**:
1. **RED**: Write tests FIRST (ensure they FAIL)
2. **GREEN**: Implement code to pass tests
3. **REFACTOR**: Clean up code while keeping tests green

**Task Order Within Story**:
- Tests before implementation (TDD red phase)
- Models/repositories (data layer)
- Services (business logic)
- Commands/UI (presentation layer)
- Error handling and validation
- Integration with main menu

### Parallel Opportunities

**Within Setup (Phase 1)**:
- T003, T004, T005 (config files) can run in parallel

**Within Foundational (Phase 2)**:
- T008, T009, T010 (Task model + tests) can run together
- T013, T014, T015 (validation + tests) can run together
- T016, T017 (UI helpers + tests) can run together

**Within Each User Story**:
- Test file creation can happen in parallel with design/planning
- Different developers can work on different user stories after Foundational is complete

**Within Polish (Phase 9)**:
- T055, T056, T057, T058, T059 (documentation, linting, testing) can all run in parallel
- T062, T063 (edge cases, performance) can run in parallel

---

## Parallel Execution Examples

### Example 1: Foundational Phase

```bash
# Launch all model-related tasks together:
Task T008: Create Task model in src/models/task.py
Task T009: Create TaskStatus enum in src/models/task.py
Task T010: Write unit tests for Task model in tests/unit/test_task_model.py

# Then launch repository tasks:
Task T011: Create TaskRepository interface
Task T012: Implement InMemoryTaskRepository
Task T013: Write repository tests
```

### Example 2: Polish Phase

```bash
# Launch all quality checks together:
Task T056: Run mypy strict type checking
Task T057: Run ruff linting
Task T058: Run pytest with coverage
Task T059: Add service unit tests
Task T060: Add E2E integration test
```

---

## Implementation Strategy

### MVP First (User Stories 1, 2, 6 Only)

**Goal**: Fastest path to working demo

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T017)
3. Complete Phase 3: US1 - Add Task (T018-T023)
4. Complete Phase 4: US2 - View Tasks (T024-T030)
5. Complete Phase 8: US6 - Exit (T049-T054)
6. **STOP and VALIDATE**: Test complete workflow (add → view → exit)
7. Deploy/demo if ready

**At this checkpoint, you have**:
- Working console application
- Can add tasks with title and description
- Can view all tasks in formatted list
- Can exit gracefully
- All tests passing
- Type checking and linting pass

### Full Feature Set (All User Stories)

**Goal**: Complete task management system

1. Complete MVP (Phases 1, 2, 3, 4, 8)
2. Add Phase 7: US5 - Toggle Status (T043-T048)
3. Add Phase 6: US4 - Delete Task (T037-T042)
4. Add Phase 5: US3 - Update Task (T031-T036)
5. Complete Phase 9: Polish (T055-T065)
6. Final validation and quality gates

### Parallel Team Strategy

With multiple developers or parallel implementation:

1. **Team completes Setup + Foundational together** (Phases 1-2)
2. **Once Foundational is done, split work**:
   - Developer A: US1 (Add) + US2 (View)
   - Developer B: US5 (Toggle) + US4 (Delete)
   - Developer C: US3 (Update) + US6 (Exit)
3. **Integrate and test all stories together**
4. **Team completes Polish together** (Phase 9)

---

## Task Acceptance Criteria

**Every task MUST meet these criteria before marking complete**:

✅ **Code Quality**:
- Type hints on all functions (mypy strict mode passes)
- Docstrings on all public functions (Google style)
- No linting errors (ruff passes)
- Code is readable and follows Python conventions (PEP 8)

✅ **Testing** (per Constitution TDD requirement):
- Tests written BEFORE implementation (red-green-refactor)
- All tests pass (pytest)
- Coverage ≥80% for new code
- Integration tests validate user workflows

✅ **Functionality**:
- Meets acceptance criteria from spec.md
- Handles error cases gracefully
- Provides clear user feedback
- Console output is formatted and readable

✅ **Documentation**:
- Code is self-documenting with clear names
- Complex logic has explanatory comments
- README updated if user-facing changes
- Inline TODOs resolved or documented

---

## Notes

- **[P] tasks** = different files, no dependencies, can run in parallel
- **[Story] label** (e.g., [US1], [US2]) maps task to specific user story for traceability
- **TDD is mandatory**: Write tests FIRST, watch them FAIL, then implement
- **Each user story should be independently testable** - stop at any checkpoint to validate
- **Commit after each task** or logical group of related tasks
- **Quality gates**: All tests pass + mypy pass + ruff pass + coverage ≥80%
- **Avoid**: vague tasks, same-file conflicts, cross-story dependencies that break independence

## Summary

**Total Tasks**: 65
- Setup: 7 tasks
- Foundational: 10 tasks
- US1 (Add Task): 6 tasks
- US2 (View Tasks): 7 tasks
- US3 (Update Task): 6 tasks
- US4 (Delete Task): 6 tasks
- US5 (Toggle Status): 6 tasks
- US6 (Exit): 6 tasks
- Polish: 11 tasks

**Parallel Opportunities**: 20 tasks marked [P] can run in parallel within their phases

**MVP Scope**: Phases 1, 2, 3, 4, 8 (36 tasks) delivers working add/view/exit app

**Independent Test Criteria**:
- US1: Can add task and see confirmation with ID
- US2: Can view all tasks in formatted table
- US3: Can update task title/description and see changes
- US4: Can delete task and verify removal from list
- US5: Can toggle status and see visual change
- US6: Can exit with warning and clean termination
