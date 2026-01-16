---
id: 1
title: Create Phase 3 Constitution for Todo AI Chatbot
stage: constitution
date: 2026-01-16
surface: agent
model: gemini-1.5-flash
feature: todo-ai-chatbot
branch: main
user: user
command: /sp.constitution You are a Spec-Driven Development architect.

Create a Phase 3 Constitution for "Todo AI Chatbot" based on Hackathon II PDF.

Rules:
- No manual coding allowed
- Backend must be stateless
- Conversation state must persist in database
- AI must use MCP tools only to modify tasks
- Follow OpenAI Agents SDK and Official MCP SDK

Output:
- Phase 3 Constitution in Markdown
labels:
  - constitution
  - setup
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - .specify/memory/constitution.md
tests_yaml: []
prompt_text: |-
  /sp.constitution You are a Spec-Driven Development architect.

  Create a Phase 3 Constitution for "Todo AI Chatbot" based on Hackathon II PDF.

  Rules:
  - No manual coding allowed
  - Backend must be stateless
  - Conversation state must persist in database
  - AI must use MCP tools only to modify tasks
  - Follow OpenAI Agents SDK and Official MCP SDK

  Output:
  - Phase 3 Constitution in Markdown
response_text: |-
  The constitution has been successfully created and updated with version `0.1.0`.

  **Summary:**
  *   **New version and bump rationale**: The constitution has been created with version `0.1.0`. This is considered a MINOR bump as it's the initial foundational document for Phase 3 of the "Todo AI Chatbot" project.
  *   **Files flagged for manual follow-up**:
      *   `.specify/templates/plan-template.md`
      *   `.specify/templates/spec-template.md`
      *   `.specify/templates/tasks-template.md`
      *   All command files in `.specify/commands/` (e.g., `sp.adr.toml`, `sp.analyze.toml`, etc.)
      *   `README.md`
      *   `backend/README.md` (if exists)
      *   `frontend/README.md` (if exists)
      These files require review and potential updates to ensure alignment with the newly defined constitution principles.
  *   **Suggested commit message**: `docs: feat(constitution): Amend constitution to v0.1.0 for Todo AI Chatbot (initial principles + governance)`
outcome: Constitution for "Todo AI Chatbot" created and saved. Manual follow-up needed for dependent templates.
evaluation: The constitution was successfully created, including all specified rules as principles and adhering to the requested format. A sync impact report was generated and prepended to the file. A summary and suggested commit message were provided.
---