---
id: 45
title: Clarifying Ambiguous "Solve" Prompt
stage: misc
date: 2026-01-15
surface: agent
model: gemini
feature: none
branch: 
user: 
command: /sp.implement
labels: [clarification]
links:
  spec: 
  ticket: 
  adr: 
  pr: 
files:

tests:

---

## Prompt

solve

## Response snapshot

The request "solve" is too broad. Please provide more context or specify the problem you would like me to solve.

## Outcome

- ✅ Impact: Clarified ambiguous user intent.
- 🧪 Tests: N/A
- 📁 Files: N/A
- 🔁 Next prompts: Awaiting user clarification.
- 🧠 Reflection: Ambiguous prompts require clarification to proceed effectively.

## Evaluation notes (flywheel)

- Failure modes observed: User provided a non-specific command.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
