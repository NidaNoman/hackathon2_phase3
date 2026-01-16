---
id: 10
title: Fix FastAPI Module Not Found Error
stage: green
date: 2026-01-10
surface: agent
model: gemini-1.5-pro
feature: todo-web-app
branch: main
user: user
command: /sp.implement
labels: ["bug-fix", "backend", "fastapi"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - none
tests:
  - none
---

## Prompt

I am running this command:

uvicorn app.main:app --reload

and I am getting this error:

ModuleNotFoundError: No module named 'app'

Your task:

Find the exact reason why Python cannot find the app module

Tell me the correct uvicorn command that will work

Tell me from which directory I must run

## Response snapshot

Exact reason for the error:
The `ModuleNotFoundError: No module named 'app'` occurs because you are running the `uvicorn` command from a directory where Python cannot find the `app` module directly. The `app` module containing your `main.py` is located at `backend/app/main.py`, meaning it's nested inside the `backend` directory relative to your project root. When you run `uvicorn app.main:app`, Python searches for an `app` directory (package) within your current working directory. If you're not in the `backend` directory, this search fails.

The one correct uvicorn command to run the backend:
`uvicorn app.main:app --reload`

The directory you must be in when running that command:
`backend/` (specifically, `C:\Users\user\Desktop\lastdamn\backend`)

## Outcome

- ✅ Impact: Provided correct `uvicorn` command and execution directory for FastAPI, resolving the `ModuleNotFoundError`.
- 🧪 Tests: None.
- 📁 Files: None.
- 🔁 Next prompts: None
- 🧠 Reflection: Successfully identified the cause of `ModuleNotFoundError` due to incorrect working directory for `uvicorn` and provided precise instructions for resolution.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
