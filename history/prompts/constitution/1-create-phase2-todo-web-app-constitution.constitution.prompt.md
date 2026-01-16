---
id: 1
title: Create Phase-2 Todo Web App Constitution
stage: constitution
date: 2026-01-10
surface: agent
model: gemini-1.5-pro
feature: none
branch: master
user: user
command: /sp.constitution Create speckit.constitution for Phase-2 (Todo Full-Stack Web App).
labels: [constitution, phase-2, web-app]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - No tests run.
---

## Prompt

/sp.constitution Create speckit.constitution for Phase-2 (Todo Full-Stack Web App).

Context:
- Phase-1 CLI todo is completed and stored in /phase1-cli
- Phase-2 is a multi-user web application

Non-Negotiable Principles:
- Spec-Driven Development ONLY
- No manual coding by humans
- Monorepo architecture
- Frontend and backend separated
- JWT-based authentication mandatory
- User data isolation is critical
- Phase-1 code must remain unchanged
- Use only approved stack:
  - Frontend: Next.js App Router + TypeScript
  - Backend: FastAPI
  - ORM: SQLModel
  - DB: Neon Serverless PostgreSQL
  - Auth: Better Auth (JWT)

Include:
- Architectural principles
- Security principles
- Coding constraints
- Phase-2 scope boundaries

Output only speckit.constitution.
Do NOT generate code.

## Response snapshot

Updated the project constitution to version 0.1.0, defining architectural, security, and coding principles, along with Phase-2 scope boundaries for the Todo Full-Stack Web App.

## Outcome

- ✅ Impact: Successfully created and updated the project constitution for Phase-2.
- 🧪 Tests: N/A
- 📁 Files: One file modified: .specify/memory/constitution.md
- 🔁 Next prompts: Continue with project specification based on the new constitution.
- 🧠 Reflection: The constitution was created successfully, outlining key principles and scope. Manual follow-up is required for updating related templates and documentation.

## Evaluation notes (flywheel)

- Failure modes observed: None.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
