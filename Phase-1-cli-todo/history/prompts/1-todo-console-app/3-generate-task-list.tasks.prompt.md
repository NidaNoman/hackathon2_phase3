---
id: 3
title: Generate Task List for Todo Console App
stage: tasks
date: 2025-12-31
surface: agent
model: claude-sonnet-4-5-20250929
feature: 1-todo-console-app
branch: 1-todo-console-app
user: user
command: /sp.tasks
labels: ["tasks", "tdd", "implementation", "user-stories", "sdd"]
links:
  spec: specs/1-todo-console-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/1-todo-console-app/tasks.md
tests:
  - None (task planning phase)
---

## Prompt

Create specs/task-crud.md with full spec-driven detail.

Include:
User Stories:
- Add task
- View all tasks
- Update task
- Delete task
- Mark task complete/incomplete

Acceptance Criteria:
- Task has id, title, description, completed
- IDs auto-increment
- CLI menu driven
- Clear console output

## Response snapshot

Created comprehensive task breakdown for Phase 1 Todo Console App with 65 tasks organized by user story.

**⚠️ Spec Deviation Notice**: User requested features beyond current spec.md:
- Added: "Update task" functionality (not in original spec - spec only covers create, view, complete, delete)
- Added: Separate "title" field (spec only has "description")
- Added: Toggle complete/incomplete (spec only has "mark complete")

Generated tasks align with user's expanded requirements but noted deviation for SDD compliance.

**Task Organization (9 Phases)**:

**Phase 1: Setup (7 tasks)**
- Project structure, pyproject.toml, mypy/ruff/pytest config, .gitignore, README

**Phase 2: Foundational (10 tasks) - BLOCKING**
- Task model with id, title, description, completed, created_at
- TaskRepository interface and InMemoryTaskRepository implementation
- Input validators (description, ID, menu choice)
- Console UI helpers (menu display, task list formatter)
- TDD: All unit tests written FIRST

**Phase 3: US1 - Add Task (6 tasks) - P1/MVP**
- Integration tests (write FIRST)
- TaskService.create_task()
- Add task command handler
- Menu integration
- Error handling

**Phase 4: US2 - View Tasks (7 tasks) - P1/MVP**
- Integration tests (write FIRST)
- TaskService.get_all_tasks()
- View tasks command with formatting
- Status indicators (✓ complete, ○ pending)
- Empty state handling

**Phase 5: US3 - Update Task (6 tasks) - P2**
- Integration tests
- TaskService.update_task()
- Update command handler
- Validation for empty values

**Phase 6: US4 - Delete Task (6 tasks) - P2**
- Integration tests
- TaskService.delete_task()
- Delete command with confirmation
- Error handling

**Phase 7: US5 - Toggle Status (6 tasks) - P2**
- Integration tests
- TaskService.toggle_task_status()
- Toggle command handler
- Status change confirmation messages

**Phase 8: US6 - Exit Application (6 tasks) - P1/MVP**
- Integration tests
- Exit command with data loss warning
- Main application loop
- Graceful termination

**Phase 9: Polish (11 tasks)**
- Docstrings, type checking (mypy), linting (ruff), coverage ≥80%
- Unit tests for TaskService
- End-to-end integration test
- README update, edge case handling, performance testing
- Final quality gates

**Task Format Compliance**:
- ✅ All 65 tasks follow checklist format: `- [ ] [ID] [P?] [Story?] Description with file path`
- ✅ 20 tasks marked [P] for parallel execution
- ✅ Story labels [US1]-[US6] for traceability
- ✅ Exact file paths specified (src/models/task.py, tests/unit/test_task_model.py, etc.)

**Dependencies & Execution Order**:
- Setup (Phase 1) → Foundational (Phase 2) → User Stories (Phases 3-8) → Polish (Phase 9)
- Foundational BLOCKS all user stories (must complete first)
- User stories independent after Foundational (can run in parallel)
- TDD mandatory: tests FIRST (red), implementation (green), refactor

**MVP Scope (36 tasks)**:
- Phases 1, 2, 3, 4, 8 deliver working app: add tasks + view tasks + exit
- Fastest path to demo with core functionality
- All quality gates pass (tests, mypy, ruff, coverage)

**Parallel Opportunities**:
- Setup: Config files (T003-T005) in parallel
- Foundational: Model/enum/tests (T008-T010), validators/tests (T013-T015), UI/tests (T016-T017)
- Polish: Quality checks (T055-T060) all parallel

**Implementation Strategy**:
1. MVP First: Phases 1, 2, 3, 4, 8 → validate → demo
2. Incremental: Add US5 (toggle) → US4 (delete) → US3 (update)
3. Polish: Final quality gates and documentation
4. Parallel Team: Split user stories after Foundational complete

**Quality Criteria Per Task**:
- ✅ Type hints + mypy strict pass
- ✅ Docstrings (Google style)
- ✅ Ruff linting pass
- ✅ Tests pass + coverage ≥80%
- ✅ Error handling + user feedback
- ✅ Documentation updated

## Outcome

- ✅ Impact: Complete implementation roadmap ready for TDD execution
- 🧪 Tests: TDD workflow defined - 18 integration test tasks, 6 unit test tasks (24 total test tasks)
- 📁 Files: Created tasks.md (517 lines) with 65 tasks across 9 phases
- 🔁 Next prompts: Begin implementation with `/sp.implement` or start MVP manually (Phase 1 → Phase 2 → Phase 3)
- 🧠 Reflection: Comprehensive task breakdown with strict TDD compliance, clear dependencies, parallel opportunities, and MVP path. Noted spec deviation for user's expanded requirements.

## Evaluation notes (flywheel)

- Failure modes observed: Spec deviation (user added features) - documented clearly for SDD compliance
- Graders run and results (PASS/FAIL): Format validation - PASS (all 65 tasks follow checklist format with ID, [P], [Story], file paths)
- Prompt variant (if applicable): Task generation with expanded requirements beyond original spec
- Next experiment (smallest change to try): Begin TDD implementation starting with Phase 1 Setup, then Phase 2 Foundational (write tests FIRST)
