<!--
Sync Impact Report:
- Version change: NONE → 1.0.0 (Initial constitution)
- Modified principles: N/A (new constitution)
- Added sections: Core Principles (7), Phase 1 Constraints, Development Workflow, Governance
- Removed sections: N/A
- Templates requiring updates:
  ✅ .specify/memory/constitution.md (this file)
  ⚠ .specify/templates/plan-template.md (pending validation)
  ⚠ .specify/templates/spec-template.md (pending validation)
  ⚠ .specify/templates/tasks-template.md (pending validation)
- Follow-up TODOs: Validate dependent templates align with new principles
-->

# Hackathon II Phase 1 Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
All development MUST follow the Spec-Driven Development (SDD) workflow:
- **Specification First**: Every feature begins with a complete `spec.md` documenting requirements, acceptance criteria, and constraints.
- **Architectural Planning**: An `plan.md` MUST be created before implementation, detailing design decisions, component architecture, and data flows.
- **Task Decomposition**: Implementation proceeds via `tasks.md` with discrete, testable tasks.
- **No Manual Coding**: Human developers MUST NOT write application code; Claude Code is the sole implementer.

**Rationale**: SDD ensures clarity, traceability, and prevents scope creep. Manual coding bypasses the specification process and undermines the Phase 1 evaluation criteria.

### II. AI Agent as Sole Implementer
Claude Code is the exclusive code implementer for Phase 1:
- Human role: Architect, specification author, reviewer, and decision maker.
- Claude Code role: Code generation, test execution, implementation, and artifact creation.
- All code changes MUST be generated through Claude Code following SDD artifacts.
- Manual code edits invalidate Phase 1 compliance.

**Rationale**: Phase 1 evaluates AI-driven development effectiveness. Human intervention in coding undermines assessment goals.

### III. Test-First Development (NON-NEGOTIABLE)
TDD MUST be strictly followed:
- Tests written and approved BEFORE implementation.
- Red-Green-Refactor cycle enforced: failing tests → passing implementation → quality improvements.
- Every task MUST include test cases in `tasks.md`.
- Implementation begins only after test approval.

**Rationale**: Test-first ensures requirements clarity, prevents gold-plating, and provides objective success criteria.

### IV. Python 3.13+ Only
All code MUST use Python 3.13 or higher:
- Leverage modern Python features (type hints, match statements, structural pattern matching).
- Use standard library where possible; minimize external dependencies.
- Type annotations MUST be complete and accurate.
- Code MUST pass type checking (mypy strict mode).

**Rationale**: Python 3.13 provides latest language features and performance improvements. Phase 1 focuses on core capabilities without dependency management complexity.

### V. In-Memory Storage Only
NO persistent storage allowed in Phase 1:
- All data MUST reside in memory (variables, data structures).
- NO databases, files, caches, or external storage systems.
- Application state resets on restart.
- Data structures MUST be efficient for in-memory operations.

**Rationale**: In-memory constraint simplifies Phase 1 scope, eliminates persistence complexity, and focuses evaluation on core logic.

### VI. Console-Based UI Only
User interface MUST be console/terminal-based:
- Text input/output via stdin/stdout.
- Rich console formatting allowed (colors, tables, progress indicators via libraries like `rich` or `colorama`).
- NO web interfaces, GUI frameworks, or graphical components.
- Interactive menus and prompts via console only.

**Rationale**: Console UI reduces complexity, ensures portability, and aligns with rapid prototyping goals for Phase 1.

### VII. Simplicity and Minimalism
Keep everything as simple as possible:
- YAGNI (You Aren't Gonna Need It): implement only specified requirements.
- Avoid premature optimization or abstraction.
- Clear, readable code over clever solutions.
- Single Responsibility Principle for functions and modules.
- Maximum function length: 50 lines (excluding docstrings).

**Rationale**: Simplicity accelerates development, improves maintainability, and reduces AI-generated code errors.

## Phase 1 Constraints

### Technology Stack
- **Language**: Python 3.13+
- **Storage**: In-memory only (dicts, lists, sets, dataclasses)
- **UI**: Console/terminal (stdout/stdin)
- **Testing**: pytest with coverage reporting
- **Type Checking**: mypy (strict mode)
- **Linting**: ruff (modern, fast Python linter)
- **Allowed Libraries**: Standard library + rich/colorama (UI), pytest (testing), mypy (types), ruff (linting)

### Non-Goals (Explicitly Out of Scope)
- Persistent storage (databases, files, caching)
- Web interfaces or APIs (REST, GraphQL, WebSockets)
- GUI frameworks (tkinter, PyQt, etc.)
- Authentication/authorization systems
- Multi-user or concurrent access
- Performance optimization beyond reasonable in-memory efficiency
- Deployment, containerization, or production readiness
- External service integrations

### Security Requirements
- Input validation for all user-supplied data
- No eval() or exec() on untrusted input
- Sanitize outputs to prevent injection attacks (even in console context)
- Document any assumptions about trusted execution environment

### Performance Standards
- In-memory operations MUST be O(n log n) or better for collections with >100 items
- Interactive commands MUST respond within 500ms for typical datasets
- Startup time MUST be under 2 seconds
- Memory usage MUST be reasonable (<500MB for typical workloads)

## Development Workflow

### 1. Specification Phase
- Author creates `specs/<feature>/spec.md` with requirements, acceptance criteria, constraints
- Spec MUST include success metrics and test scenarios
- Spec reviewed and approved before proceeding

### 2. Planning Phase
- Claude Code generates `specs/<feature>/plan.md` with architectural decisions
- Plan MUST address data structures, module organization, algorithms, error handling
- Architect reviews and approves (or requests revisions)

### 3. Task Decomposition
- Claude Code generates `specs/<feature>/tasks.md` with discrete implementation tasks
- Each task MUST include test cases and acceptance criteria
- Tasks reviewed and approved

### 4. Implementation Phase
- For each task:
  1. Claude Code writes tests (red phase)
  2. Architect approves tests
  3. Claude Code implements to pass tests (green phase)
  4. Claude Code refactors if needed (refactor phase)
  5. Architect reviews and approves
- Repeat until all tasks complete

### 5. Documentation Phase
- Claude Code creates/updates README, usage guides, docstrings
- Prompt History Records (PHRs) automatically generated for every interaction
- Architectural Decision Records (ADRs) created for significant decisions

### Quality Gates
All code MUST pass before approval:
- ✅ All tests passing (pytest)
- ✅ Type checking passing (mypy strict)
- ✅ Linting passing (ruff)
- ✅ Test coverage ≥80% for new code
- ✅ Documentation complete (docstrings, README)
- ✅ Spec requirements met

## Governance

### Constitution Authority
This Constitution supersedes all other development practices, conventions, or preferences. When conflicts arise, Constitution principles take precedence.

### Amendment Process
1. Proposal MUST document rationale and impact on dependent templates
2. Semantic versioning applied: MAJOR (breaking principle changes), MINOR (new principles/sections), PATCH (clarifications)
3. Sync Impact Report MUST be generated listing affected templates and artifacts
4. All dependent templates (`plan-template.md`, `spec-template.md`, `tasks-template.md`, command files) MUST be updated for consistency
5. Migration plan required if changes affect in-flight work

### Compliance Review
- Every PR MUST verify Constitution compliance
- Claude Code MUST validate work against Constitution principles before presenting
- Any deviation MUST be explicitly flagged and justified
- Unjustified complexity or scope expansion is grounds for rejection

### Prompt History Records (PHRs)
- PHR MUST be created for every user interaction (implementation, planning, debugging, etc.)
- PHRs stored in `history/prompts/` with routing: constitution/, <feature-name>/, or general/
- PHRs capture verbatim user input and AI response for traceability
- See CLAUDE.md for detailed PHR creation protocol

### Architectural Decision Records (ADRs)
- ADRs MUST be suggested (not auto-created) when architecturally significant decisions are made
- Three-part test: long-term impact, multiple alternatives, cross-cutting scope
- ADRs stored in `history/adr/` and linked from relevant artifacts
- Format: suggestion prompt for user consent before creation

### Runtime Guidance
For detailed AI agent operational rules, see `CLAUDE.md` (this file provides execution contracts, PHR procedures, ADR policies, and tool-specific guidance).

**Version**: 1.0.0 | **Ratified**: 2025-12-31 | **Last Amended**: 2025-12-31
