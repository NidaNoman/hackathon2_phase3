---
id: 2
title: Create Phase 3 Constitution
stage: constitution
date: 2026-01-17
surface: "agent"
model: "Gemini"
feature: "AI Chatbot"
branch: main
user: {{USER}}
command: "/sp.constitution"
labels: ["constitution", "planning", "phase3"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
- specs/constitution-phase3.md
tests:
- "none"
---

## Prompt

/sp.constitution You are a Spec-Driven Development Architect.

Context:
- Hackathon II Todo App
- Phase 2 already completed
- Now starting Phase 3 (AI Chatbot)

Task:
Create Phase 3 Constitution.

Include:
- Goal of Phase 3
- Non-negotiable rules
- Stateless backend rule
- MCP-only access rule
- AI agent boundaries
- Security & auth reuse from Phase 2

Rules:
- No code
- No implementation details

Output:
Create `specs/constitution-phase3.md`

## Response snapshot

Created the Phase 3 constitution file at `specs/constitution-phase3.md` as requested.

## Outcome

- ✅ Impact: {{OUTCOME_IMPACT}}
- 🧪 Tests: {{TESTS_SUMMARY}}
- 📁 Files: {{FILES_SUMMARY}}
- 🔁 Next prompts: {{NEXT_PROMPTS}}
- 🧠 Reflection: {{REFLECTION_NOTE}}

## Evaluation notes (flywheel)

- Failure modes observed: {{FAILURE_MODES}}
- Graders run and results (PASS/FAIL): {{GRADER_RESULTS}}
- Prompt variant (if applicable): {{PROMPT_VARIANT_ID}}
- Next experiment (smallest change to try): {{NEXT_EXPERIMENT}}
