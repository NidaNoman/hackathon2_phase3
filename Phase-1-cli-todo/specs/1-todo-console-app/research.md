# Research & Design Decisions: Phase 1 Todo Console App

**Feature**: Phase 1 Todo Console App
**Date**: 2025-12-31
**Purpose**: Document architectural research and design decision rationale

## Overview

This document captures the research and decision-making process for the Phase 1 Todo Console App architecture. All decisions align with Constitution principles and prioritize simplicity, testability, and maintainability.

---

## Decision 1: Data Structure for Task Storage

**Context**: Need efficient in-memory storage for tasks with O(1) ID-based lookup.

**Decision**: `Dict[int, Task]` with separate `_next_id: int` counter for auto-increment.

**Rationale**:
- **Performance**: O(1) lookup, insert, delete by ID
- **Simplicity**: Standard Python dict, no external dependencies
- **Auto-increment**: Separate counter tracks next ID (starts at 1, increments on add)
- **No ID reuse**: Counter never decrements, even after delete (simpler logic)
- **Insertion order preserved**: Python 3.7+ dicts maintain insertion order for get_all()

**Alternatives Considered**:

| Alternative | Pros | Cons | Rejected Because |
|------------|------|------|------------------|
| List[Task] | Simple, ordered | O(n) lookup by ID, complex ID management | Performance degrades with many tasks |
| OrderedDict | Guaranteed order | Unnecessary (dict already ordered in 3.7+) | Added complexity without benefit |
| Custom binary tree | O(log n) operations | Complex implementation, overkill | Violates simplicity principle |
| sqlite3 in-memory | SQL querying, transactions | Violates Constitution (no databases) | Explicitly forbidden |

**Implementation Notes**:
- Store dict as `_tasks: dict[int, Task]` (private attribute)
- Store counter as `_next_id: int = 1` (starts at 1, not 0)
- On add: assign `task.id = self._next_id`, increment counter, store in dict
- On delete: remove from dict, do NOT decrement counter
- On get_all: return `list(self._tasks.values())` (maintains insertion order)

**Trade-offs Accepted**:
- IDs not reused within session (acceptable - simpler code, predictable IDs)
- No ordering guarantees beyond insertion order (acceptable - spec doesn't require sorting)
- Memory grows with deleted tasks' IDs (negligible - counter is just an int)

---

## Decision 2: Console UI Library Choice

**Context**: Need formatted console output with tables and colors for better UX.

**Decision**: Use `rich` library for console formatting.

**Rationale**:
- **Feature-rich**: Tables, colors, progress bars, styled text
- **Simple API**: Easy to use, minimal learning curve
- **Wide adoption**: Well-maintained, stable, popular in Python community
- **Cross-platform**: Works on Windows, Linux, macOS terminals
- **No heavy dependencies**: Pure Python, fast install
- **Constitution compliant**: Allowed library for console formatting

**Alternatives Considered**:

| Alternative | Pros | Cons | Rejected Because |
|------------|------|------|------------------|
| Plain text | No dependencies | Poor UX, hard to read | Unnecessarily poor user experience |
| colorama | Lightweight, colors only | No table support, limited formatting | rich provides better UX for same cost |
| blessed | Full-featured terminal lib | Complex API, overkill for needs | Unnecessary complexity |
| curses | Standard library | Complex, platform issues on Windows | Poor Windows support, complex API |
| prompt_toolkit | Rich interactive features | Heavier, more complex | Overkill for simple menu app |

**Implementation Notes**:
- Use `rich.console.Console` for output
- Use `rich.table.Table` for task lists
- Use `rich.prompt.Prompt` for user input (validates types)
- Use `[bold], [green], [red]` markup for styled messages
- Fallback to plain text if rich import fails (graceful degradation)

**Trade-offs Accepted**:
- External dependency (acceptable - Constitution allows rich/colorama)
- Slightly larger install size (acceptable - rich is still lightweight)
- Terminal compatibility issues possible (mitigated - rich handles most terminals well)

---

## Decision 3: Command Pattern for Menu Options

**Context**: Need to handle 6 menu options (add, view, update, delete, toggle, exit) cleanly.

**Decision**: Separate command handler modules (one file per command).

**Rationale**:
- **Single Responsibility**: Each command file has one job
- **Testability**: Easy to unit test each command independently
- **Maintainability**: Changes to one command don't affect others
- **Clarity**: Clear file → command mapping (add_task.py handles "Add Task")
- **Simplicity**: No class hierarchies, just functions
- **Constitution compliance**: Max 50 lines per function easily achievable

**Alternatives Considered**:

| Alternative | Pros | Cons | Rejected Because |
|------------|------|------|------------------|
| Single menu.py with all logic | One file | 300+ line file, multiple responsibilities | Violates Single Responsibility Principle |
| Class-based Command pattern | OOP design pattern | Unnecessary abstraction, more complex | Over-engineered for simple menu |
| Dictionary dispatch | Concise mapping | Logic still needs organizing | Doesn't solve organization problem |
| Plugin system | Extensible | Way too complex for 6 commands | Massive overkill |

**Implementation Notes**:
- Each command file exports one function: `def <command>_command(service: TaskService) -> None`
- Function handles: prompt → validate → call service → display result
- No business logic in commands (delegate to TaskService)
- Commands raise no exceptions (catch and display errors to user)
- main.py uses match statement to dispatch to command functions

**Trade-offs Accepted**:
- More files (6 command files) vs fewer larger files (acceptable - better organization)
- Slight duplication in error handling (acceptable - each command has unique error messages)

---

## Decision 4: Repository Pattern for Storage Abstraction

**Context**: Need to abstract storage to support testing and potential future extensions.

**Decision**: TaskRepository ABC with InMemoryTaskRepository implementation.

**Rationale**:
- **Testability**: Mock repository in service tests, test service logic independently
- **Separation of Concerns**: Storage details separate from business logic
- **Future extensibility**: Phase 2 could add FileTaskRepository without changing service
- **Dependency Inversion**: Service depends on interface, not concrete implementation
- **Standard pattern**: Well-known design pattern, clear to other developers

**Alternatives Considered**:

| Alternative | Pros | Cons | Rejected Because |
|------------|------|------|------------------|
| Direct dict access in service | Simpler, less code | Tight coupling, hard to test, no abstraction | Poor testability, violates SRP |
| Global task dict | Very simple | Global state, testing nightmare, not Pythonic | Violates good practices |
| No abstraction (service owns dict) | One less layer | Service handles storage AND logic | Violates Single Responsibility |

**Implementation Notes**:
- TaskRepository defined as ABC with @abstractmethod decorators
- Methods: add, get_by_id, get_all, update, delete, exists
- InMemoryTaskRepository implements all methods with dict storage
- TaskService takes TaskRepository in constructor (dependency injection)
- Tests can inject mock repository or real InMemoryTaskRepository

**Trade-offs Accepted**:
- Extra layer of indirection (acceptable - improves testability significantly)
- ABC import required (acceptable - standard library, no external dependency)
- Slightly more code (acceptable - clarity and testability benefits outweigh)

---

## Decision 5: Status Representation

**Context**: Tasks have two states: pending and complete. Need type-safe representation.

**Decision**: Enum `TaskStatus` with `PENDING` and `COMPLETE` values, plus `completed: bool` field on Task.

**Rationale**:
- **Type safety**: Enum prevents invalid values (can't assign "done" or 1)
- **Explicit states**: Clear, self-documenting code
- **IDE support**: Auto-completion, type checking
- **Future-proof**: Easy to add more states in Phase 2 (e.g., ARCHIVED)
- **Boolean field for convenience**: `task.completed` is more Pythonic than `task.status == TaskStatus.COMPLETE`

**Alternatives Considered**:

| Alternative | Pros | Cons | Rejected Because |
|------------|------|------|------------------|
| String status | Simple, human-readable | No type safety, typos possible | Error-prone, no IDE support |
| Boolean only | Very simple | Less explicit, harder to extend | Enum provides better clarity |
| Integer codes | Compact | Magic numbers, not self-documenting | Unreadable, error-prone |
| State pattern (classes) | OOP design | Massive overkill for 2 states | Over-engineered |

**Implementation Notes**:
- Define `TaskStatus` enum in models/task.py
- Task dataclass has `completed: bool` field (default False)
- Formatters use completed bool for display logic
- Enum available for future extensions if needed

**Trade-offs Accepted**:
- Two representations (enum + bool) might seem redundant (acceptable - bool is more convenient, enum is more explicit)
- Enum import in multiple files (acceptable - standard library, lightweight)

---

## Decision 6: ID Assignment Strategy

**Context**: Need unique task IDs that are user-friendly and meet spec requirements.

**Decision**: Sequential auto-increment starting from 1, no ID reuse within session.

**Rationale**:
- **User-friendly**: Small integers easy to type (1, 2, 3 vs UUID)
- **Predictable**: Users can guess next ID
- **Simple implementation**: Just increment counter
- **Spec compliant**: Meets FR-003 (unique sequential integer IDs starting from 1)
- **No collisions**: Counter never reused, even after delete

**Alternatives Considered**:

| Alternative | Pros | Cons | Rejected Because |
|------------|------|------|------------------|
| UUID | Globally unique, no collisions | Not user-friendly, overkill for single-user | Poor UX (long strings to type) |
| Timestamp-based | Sortable by creation time | Not user-friendly, collision risk | Poor UX, unnecessary complexity |
| Random integers | Simple | Collision risk, not predictable | Doesn't meet spec (not sequential) |
| Reuse deleted IDs | More "efficient" | Complex logic, confusing to user | Spec says sequential, reuse breaks that |

**Implementation Notes**:
- Counter starts at 1 (not 0) per spec requirement
- Counter increments on every add (even if previous IDs deleted)
- ID assigned in repository.add() method before storing
- Task.id field is immutable (set once, never changed)
- No maximum ID limit (int has arbitrary precision in Python)

**Trade-offs Accepted**:
- IDs don't get reused (acceptable - simpler logic, predictable behavior)
- Counter grows unbounded (acceptable - int is efficient, session-limited anyway)
- No sorting by ID guarantees insertion order (acceptable - spec doesn't require sorting)

---

## Decision 7: Error Handling Strategy

**Context**: Need consistent error handling for invalid operations and user input.

**Decision**: Validate at entry points (commands), raise ValueError for invalid operations, display errors to user.

**Rationale**:
- **Fail fast**: Catch errors early in command layer before calling service
- **Clear messages**: ValueError with descriptive message ("Task not found with ID 5")
- **No silent failures**: Exceptions force explicit error handling
- **Pythonic**: ValueError is standard Python exception for invalid values
- **User-friendly**: Commands catch exceptions and display friendly messages

**Alternatives Considered**:

| Alternative | Pros | Cons | Rejected Because |
|------------|------|------|------------------|
| Return None/Optional | No exceptions | Silent failures, unclear semantics | Easy to forget None check, bugs |
| Error codes (int return) | Common in C | Not Pythonic, unclear what codes mean | Un-Pythonic, error-prone |
| Result type (Ok/Err) | Explicit success/failure | Not standard Python, complex | Over-engineered, unfamiliar pattern |
| Custom exceptions | Very specific | Many exception classes | Unnecessary complexity for simple app |

**Implementation Notes**:
- Validators raise ValueError with descriptive messages
- Service methods raise ValueError for "not found" errors
- Command functions catch ValueError and display error to user with rich
- No custom exception classes (ValueError sufficient for all cases)
- Error messages include context (e.g., "Task not found with ID 5" not just "Not found")

**Trade-offs Accepted**:
- Exceptions for control flow (acceptable - Pythonic "easier to ask forgiveness")
- Generic ValueError (acceptable - no need for custom exceptions in simple app)
- Some duplication in error messages (acceptable - each command has unique context)

---

## Decision 8: Test Organization

**Context**: Need clear test structure supporting TDD workflow and 80% coverage requirement.

**Decision**: Separate unit tests (isolated components) and integration tests (workflows).

**Rationale**:
- **Fast feedback**: Unit tests run in <1s, provide quick feedback during development
- **Comprehensive coverage**: Integration tests validate end-to-end workflows
- **TDD-friendly**: Write unit tests FIRST for each component
- **Clear purpose**: Unit tests for logic, integration tests for scenarios
- **Easy to locate**: test_task_model.py tests models/task.py (clear mapping)

**Alternatives Considered**:

| Alternative | Pros | Cons | Rejected Because |
|------------|------|------|------------------|
| Only integration tests | Comprehensive, tests real behavior | Slow, hard to isolate failures | Slow feedback loop, harder debugging |
| Only unit tests | Fast, isolated | Misses integration issues, mock hell | Doesn't test real workflows |
| Mixed (both in same files) | Fewer files | Hard to run fast subset, unclear purpose | Confusing, harder to maintain |
| Contract tests (separate) | API contracts validated | Unnecessary for internal app | No external API, overkill |

**Implementation Notes**:
- Unit tests in `tests/unit/` - one test file per source file
- Integration tests in `tests/integration/` - one test file per user story
- Use pytest fixtures for common setup (repository, service)
- Mock repository in service unit tests (test service logic only)
- Use real repository in integration tests (test full stack)
- Run unit tests with `pytest tests/unit/` (fast subset)
- Run all tests with `pytest tests/` (full suite)

**Trade-offs Accepted**:
- More test files (14 total) vs fewer comprehensive files (acceptable - better organization)
- Some overlap between unit and integration tests (acceptable - different purposes)
- Mocking adds complexity (acceptable - enables isolated unit testing)

---

## Technology Choices Summary

| Category | Choice | Rationale |
|----------|--------|-----------|
| Language | Python 3.13+ | Constitution requirement, modern features |
| Storage | Dict[int, Task] | O(1) operations, simple, no dependencies |
| UI Library | rich | Excellent UX, tables, colors, cross-platform |
| Testing | pytest | Standard Python testing, fixtures, coverage |
| Type Checking | mypy strict | Catch type errors early, better IDE support |
| Linting | ruff | Fast, modern, comprehensive rule set |
| Architecture | Layered (models, repos, services, commands, UI) | Separation of concerns, testability |
| Design Patterns | Repository, Command (simplified) | Proven patterns, appropriate complexity |
| Error Handling | ValueError exceptions | Pythonic, clear, fail-fast |
| Test Organization | Unit + Integration split | Fast feedback + comprehensive coverage |

---

## Open Questions & Future Considerations

**Answered Questions** (no longer blocking):
- ✅ How to store tasks in memory? → Dict[int, Task]
- ✅ How to auto-increment IDs? → Separate counter, start at 1
- ✅ How to format console output? → rich library with tables
- ✅ How to organize commands? → Separate files, one per command
- ✅ How to test service layer? → Repository pattern with mock
- ✅ How to handle errors? → ValueError exceptions, catch in commands

**No Open Questions**: All technical decisions made, ready for implementation.

**Future Considerations** (Phase 2+, out of current scope):
- Task editing (modify description after creation) → Would reuse update_task pattern
- Task categories/tags → Add `category: str` field, filter in get_all()
- Task search/filter → Add repository methods: `get_by_status()`, `search(query)`
- Persistent storage → Add FileTaskRepository implementing TaskRepository
- Due dates → Add `due_date: datetime | None` field
- Task priority → Add `priority: int` field, sort by priority in get_all()
- Undo/redo → Add command history stack, implement reverse operations

---

## References

**Python Documentation**:
- Dataclasses: https://docs.python.org/3/library/dataclasses.html
- Enum: https://docs.python.org/3/library/enum.html
- ABC: https://docs.python.org/3/library/abc.html
- Type hints: https://docs.python.org/3/library/typing.html

**Libraries**:
- rich: https://rich.readthedocs.io/
- pytest: https://docs.pytest.org/
- mypy: https://mypy.readthedocs.io/
- ruff: https://docs.astral.sh/ruff/

**Design Patterns**:
- Repository Pattern: Martin Fowler's Patterns of Enterprise Application Architecture
- Command Pattern (simplified): Gang of Four Design Patterns (adapted for functional approach)

**Best Practices**:
- PEP 8: Style Guide for Python Code
- PEP 484: Type Hints
- Google Python Style Guide: Docstring format

---

## Decision Log

| Date | Decision | Made By | Rationale Summary |
|------|----------|---------|-------------------|
| 2025-12-31 | Dict storage | Architect | O(1) lookup, simplicity |
| 2025-12-31 | rich library | Architect | Best UX within constraints |
| 2025-12-31 | Command files | Architect | Single Responsibility Principle |
| 2025-12-31 | Repository pattern | Architect | Testability, separation of concerns |
| 2025-12-31 | TaskStatus enum | Architect | Type safety, clarity |
| 2025-12-31 | Sequential IDs | Architect | User-friendly, spec compliant |
| 2025-12-31 | ValueError for errors | Architect | Pythonic, fail-fast |
| 2025-12-31 | Unit + Integration tests | Architect | Fast feedback + comprehensive coverage |

---

**Status**: ✅ Research complete - All technical decisions made, ready for implementation
**Next Step**: Create data-model.md with detailed entity specifications
