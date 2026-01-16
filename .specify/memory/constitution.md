<!-- Sync Impact Report
Version change: None -> 0.1.0
List of modified principles:
  - None (all new principles)
Added sections:
  - 2.1. No Manual Coding Allowed
  - 2.2. Stateless Backend Architecture
  - 2.3. Persistent Conversation State
  - 2.4. AI-driven Task Modification via MCP Tools
  - 2.5. Adherence to SDKs
Removed sections:
  - None
Templates requiring updates:
  - .specify/templates/plan-template.md ⚠ pending
  - .specify/templates/spec-template.md ⚠ pending
  - .specify/templates/tasks-template.md ⚠ pending
  - .specify/commands/sp.adr.toml ⚠ pending
  - .specify/commands/sp.analyze.toml ⚠ pending
  - .specify/commands/sp.checklist.toml ⚠ pending
  - .specify/commands/sp.clarify.toml ⚠ pending
  - .specify/commands/sp.constitution.toml ⚠ pending
  - .specify/commands/sp.git.commit_pr.toml ⚠ pending
  - .specify/commands/sp.implement.toml ⚠ pending
  - .specify/commands/sp.phr.toml ⚠ pending
  - .specify/commands/sp.plan.toml ⚠ pending
  - .specify/commands/sp.reverse-engineer.toml ⚠ pending
  - .specify/commands/sp.specify.toml ⚠ pending
  - .specify/commands/sp.tasks.toml ⚠ pending
  - .specify/commands/sp.taskstoissues.toml ⚠ pending
  - README.md ⚠ pending
  - backend/README.md ⚠ pending (assuming there might be one)
  - frontend/README.md ⚠ pending (assuming there might be one)
Follow-up TODOs:
  - Review and update all dependent templates and guidance documents to align with the new constitution principles.
-->
# Todo AI Chatbot Project Constitution

## 1. Introduction

This Constitution outlines the core principles, governance, and architectural guidelines for the Todo AI Chatbot project, aligning with a Spec-Driven Development (SDD) approach. It serves as the foundational document for all development, ensuring consistency, quality, and maintainability.

- **Ratification Date**: 2026-01-16
- **Last Amended**: 2026-01-16
- **Constitution Version**: 0.1.0

## 2. Core Principles

These principles are non-negotiable directives that guide all technical and product decisions.

### 2.1. No Manual Coding Allowed
All code modifications, feature implementations, and bug fixes MUST be performed exclusively through automated agent interactions and approved tools. Direct human modification of the codebase outside of tool-assisted workflows is prohibited to ensure traceability, consistency, and adherence to SDD principles.

### 2.2. Stateless Backend Architecture
The backend services MUST remain stateless. All session-specific or conversational state data MUST NOT be stored within the application instance but rather externalized to a persistent data store. This ensures scalability, resilience, and ease of deployment.

### 2.3. Persistent Conversation State
All conversational state and user interaction history related to the AI chatbot MUST be stored persistently in the database. This allows for continuity across sessions, recovery from failures, and historical analysis.

### 2.4. AI-driven Task Modification via MCP Tools
The AI agent MUST ONLY modify tasks within the system by interacting with the project's defined MCP (Managed Control Plane) tools. Direct manipulation of data or bypassing the MCP tools is strictly forbidden to maintain system integrity and auditability.

### 2.5. Adherence to SDKs
Development MUST strictly adhere to the guidelines, patterns, and libraries provided by the OpenAI Agents SDK and the Official MCP SDK. This ensures compatibility, leverage of established best practices, and streamlines agent development.

## 3. Governance

### 3.1. Amendment Procedure
This Constitution can only be amended through a formal proposal, discussion, and consensus among designated project architects and leads. All amendments require a version bump following semantic versioning rules.

### 3.2. Versioning Policy
This Constitution adheres to semantic versioning (MAJOR.MINOR.PATCH):
- MAJOR: Backward incompatible changes, principle removals, or significant redefinitions.
- MINOR: Additions of new principles, sections, or material expansions of guidance.
- PATCH: Clarifications, wording improvements, typo corrections, or non-semantic refinements.

### 3.3. Compliance and Review
Adherence to this Constitution will be reviewed bi-weekly by the project architects and leads. Any deviations or non-compliance issues will be addressed promptly.

## 4. Phase-Specific Guidance

This section provides guidance specific to the current development phase, "Phase 3: Development of the "Todo AI Chatbot" based on the Hackathon II PDF, focusing on agent-driven development and strict adherence to defined SDKs and architectural constraints.".

## 5. Architectural Oversight

All architectural decisions are subject to review by the designated architect.

- **Architect**: Gemini