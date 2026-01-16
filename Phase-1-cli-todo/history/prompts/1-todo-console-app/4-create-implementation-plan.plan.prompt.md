---
id: 4
title: Create Implementation Plan
stage: plan
date: 2025-12-31
surface: agent
model: claude-sonnet-4-5-20250929
feature: 1-todo-console-app
branch: 1-todo-console-app
user: user
command: /sp.plan
labels: ["plan", "architecture", "design", "phase1", "sdd"]
links:
  spec: specs/1-todo-console-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/1-todo-console-app/plan.md
  - specs/1-todo-console-app/research.md
  - specs/1-todo-console-app/data-model.md
  - specs/1-todo-console-app/quickstart.md
tests:
  - None (planning phase)
---

## Prompt

Based on Constitution.md and specs/task-crud.md, generate an implementation plan for Phase 1.

Break into:
- Models
- In-memory store
- CLI interface
- Main runner

## Response snapshot

Created comprehensive implementation plan with 4 supporting documents for Phase 1 Todo Console App.

**plan.md (553 lines)** - Master implementation plan:

**Technical Context**:
- Python 3.13+, standard library + rich/pytest/mypy/ruff
- In-memory dict storage, console UI only
- Single project structure (src/, tests/)
- Performance: <2s startup, <500ms ops with 100 tasks

**Constitution Check**: ✅ ALL 7 principles satisfied
- Spec-Driven Development, AI sole implementer, TDD, Python 3.13+, in-memory only, console UI, simplicity

**Project Structure**:
- Models: Task dataclass, TaskStatus enum
- Repositories: TaskRepository ABC, InMemoryTaskRepository
- Services: TaskService (business logic)
- Commands: 6 command handlers (add, view, update, delete, toggle, exit)
- UI: console.py (helpers), formatters.py (task display)
- Utils: validators.py (input validation)
- Main: main.py (application loop, dependency wiring)

**Component Responsibilities**: Clear separation of concerns
- Models: Pure data structures
- Repositories: Storage abstraction (dict-based)
- Services: Business logic, orchestration
- Commands: User interaction, prompts
- UI: Console rendering (rich library)
- Utils: Validation functions
- Main: Entry point, main loop

**Testing Strategy**:
- Unit tests: Isolated components with mocks (fast <1s)
- Integration tests: End-to-end workflows (comprehensive)
- TDD workflow: Red (failing test) → Green (passing implementation) → Refactor

**Quality Gates**:
- mypy strict (all type hints)
- ruff (no linting violations)
- pytest ≥80% coverage
- All tests passing

**Implementation Sequence**:
- Setup → Foundational (BLOCKING) → User Stories (MVP first) → Polish
- MVP: Phases 1, 2, 3, 4, 8 (add, view, exit)
- Full: Add phases 5, 6, 7 (update, delete, toggle)

---

**research.md (360 lines)** - Design decisions with rationale:

**8 Key Decisions Documented**:

1. **Data Structure**: Dict[int, Task] with separate counter
   - Rationale: O(1) operations, simple, no dependencies
   - Alternatives: List (O(n) lookup), OrderedDict (unnecessary), sqlite (forbidden)

2. **Console UI Library**: rich
   - Rationale: Feature-rich, simple API, cross-platform
   - Alternatives: plain text (poor UX), colorama (limited), blessed (complex)

3. **Command Pattern**: Separate command handler files
   - Rationale: Single Responsibility, testability, maintainability
   - Alternatives: Monolithic menu (violates SRP), class-based (over-engineered)

4. **Repository Pattern**: TaskRepository ABC + implementation
   - Rationale: Testability (mock), separation of concerns, future extensibility
   - Alternatives: Direct dict (tight coupling), global state (testing nightmare)

5. **Status Representation**: TaskStatus enum + completed bool
   - Rationale: Type safety, explicit states, IDE support
   - Alternatives: String status (no type safety), boolean only (less explicit)

6. **ID Assignment**: Sequential auto-increment, no reuse
   - Rationale: User-friendly, predictable, simple, spec compliant
   - Alternatives: UUID (poor UX), timestamp (not user-friendly), reuse (complex)

7. **Error Handling**: ValueError exceptions
   - Rationale: Pythonic fail-fast, clear messages
   - Alternatives: Return None (silent failures), error codes (not Pythonic)

8. **Test Organization**: Unit + Integration split
   - Rationale: Fast feedback (unit) + comprehensive coverage (integration)
   - Alternatives: Only integration (slow), only unit (misses integration issues)

**Technology Summary Table**: Language, storage, UI, testing, patterns
**No Open Questions**: All decisions made, ready for implementation

---

**data-model.md (474 lines)** - Entity specifications:

**Task Entity**:
- Fields: id (int), title (str), description (str), completed (bool), created_at (datetime)
- Constraints: Title 1-100 chars, description 1-500 chars, ID auto-increment from 1
- Validation: Entry point validators with descriptive error messages
- Immutability: id and created_at never change after creation

**Field Details** (for each field):
- Purpose, constraints, validation rules, examples (valid/invalid)
- Python implementation with type hints
- Display behavior

**TaskRepository Interface**:
- Methods: add, get_by_id, get_all, update, delete, exists
- All methods have precise signatures with type hints
- Return types: Task | None, list[Task], bool

**InMemoryTaskRepository Implementation**:
- Internal state: _tasks dict, _next_id counter
- O(1) operations for all ID-based access
- No ID reuse within session
- Insertion order preserved (Python 3.7+ guarantee)

**Data Flow Diagrams**:
- Create task flow: Input → Command → Service → Repository → Return
- Update task flow: Input → Validate → Modify → Store → Confirm
- Toggle status flow: Input → Toggle bool → Update → Display change

**Data Lifecycle**: Creation, read, update, delete, no persistence

**Testing Data**: Valid/invalid test cases for boundary conditions

**Schema Diagram**: Visual representation of Task entity and repository

---

**quickstart.md (559 lines)** - Usage guide and test scenarios:

**Installation & Setup**:
- Prerequisites (Python 3.13+)
- Install dependencies (pip install)
- Verify installation (mypy, ruff, pytest)

**Running the Application**: Start command, expected startup output

**6 Basic Workflows with Expected Output**:
1. Add first task: Step-by-step with console output
2. View all tasks: Table format with empty state
3. Mark complete: Toggle with status change confirmation
4. Update task: Modify title/description
5. Delete task: Confirmation prompt, cancel option
6. Exit app: Data loss warning, goodbye message

**Complete User Journey**: End-to-end workflow exercising all features (7 steps)

**Error Handling Examples** (5 scenarios):
- Empty title, title too long, invalid ID, non-numeric ID, invalid menu choice
- Each with expected error message and recovery

**10 Test Scenarios for QA**:
1. MVP functionality (add, view, exit)
2. Multiple tasks (5 tasks, sequential IDs)
3. Status toggle (both directions)
4. Update task (title/description change)
5. Delete task (no ID reuse)
6. Validation - empty input
7. Validation - length limits (boundary testing)
8. Error handling - invalid IDs
9. Performance - 100 tasks (timing requirements)
10. Data persistence warning (verify data loss)

**Troubleshooting**: Common issues and solutions (ModuleNotFoundError, Python version, mypy errors, linting, tests, coverage)

**Developer Notes**: Development mode, running tests, quality checks, pre-commit checklist

---

**Architecture Highlights**:

**Layered Architecture** (Separation of Concerns):
```
┌─────────────┐
│  Commands   │ ← User interaction, prompts, display
├─────────────┤
│  Services   │ ← Business logic, validation
├─────────────┤
│ Repositories│ ← Storage abstraction
├─────────────┤
│   Models    │ ← Pure data structures
└─────────────┘
     ↕
┌─────────────┐
│  UI Helpers │ ← Console rendering (rich)
└─────────────┘
```

**Dependency Flow** (Inversion of Control):
- Main → Service (injects Repository)
- Commands → Service (receive as parameter)
- Service → Repository (depends on interface, not implementation)
- No circular dependencies

**TDD Workflow** (Red-Green-Refactor):
1. RED: Write failing test (define expected behavior)
2. GREEN: Minimal implementation to pass test
3. REFACTOR: Improve code quality, tests still pass

**Quality Gates** (All must pass):
- ✅ Type checking (mypy strict, all type hints, no Any)
- ✅ Linting (ruff, PEP 8, max 50 lines per function)
- ✅ Testing (pytest, all pass, ≥80% coverage)
- ✅ Documentation (docstrings, README, self-documenting code)

**Risk Assessment** (5 risks with mitigation):
1. Type checking complexity → Keep code simple
2. Test coverage gaps → TDD workflow, review reports
3. Console UI limitations → Test multiple terminals
4. Performance with large lists → Dict O(1) operations
5. Scope creep → Strict YAGNI adherence

**Success Criteria Compliance**:
- All 8 success criteria from spec.md mapped to architecture
- Performance requirements achievable with chosen data structures
- Quality gates ensure non-functional requirements met

## Outcome

- ✅ Impact: Complete architectural blueprint ready for TDD implementation
- 🧪 Tests: TDD strategy defined - unit tests for isolation, integration for workflows
- 📁 Files: Created plan.md (553 lines), research.md (360 lines), data-model.md (474 lines), quickstart.md (559 lines)
- 🔁 Next prompts: Begin implementation with Phase 1 Setup tasks (T001-T007), then Foundational (T008-T017)
- 🧠 Reflection: Comprehensive planning complete - all architectural decisions made, Constitution compliance verified, clear implementation path defined with TDD workflow

## Evaluation notes (flywheel)

- Failure modes observed: None - all planning artifacts created successfully
- Graders run and results (PASS/FAIL): Constitution Check - PASS (all 7 principles satisfied)
- Prompt variant (if applicable): Standard planning workflow with Phase 0 (research) + Phase 1 (data model, quickstart)
- Next experiment (smallest change to try): Begin TDD implementation starting with Setup phase (create project structure, configure tools)
