---
id: 28
title: Fix Backend Instability and Frontend 'Failed to Fetch' Errors
stage: green
date: 2026-01-13
surface: agent
model: gemini-1.5-flash
feature: 001-todo-web-app
branch: main
user: user
command: /sp.implement Analyze why every time the project restarts, the backend shows Internal Server Error and the frontend shows “Failed to fetch”, especially on signup/login.

Focus ONLY on backend stability and backend-frontend connectivity (do NOT redesign UI, do NOT change existing logic).

Tasks:

Check why the FastAPI backend becomes unstable after restart.

Verify database connection on startup (Postgres/Neon) and ensure backend does not crash if DB is temporarily unavailable.

Add safe startup handling so backend always responds instead of crashing.

Ensure backend actually listens and responds before frontend API calls.

Confirm CORS, API base URL, and request flow are correct.

Important rules:

Do NOT change UI

Do NOT remove or refactor existing features

Only fix the root cause of repeated backend crashes and “Failed to fetch”

The final result must be: backend stays stable after restart and frontend login/signup works every time

Explain clearly what was broken and what you fixed
labels: [backend, stability, fastapi, database, fix]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/.env
  - backend/requirements.txt
  - backend/app/main.py
tests: []
---

## Prompt

Analyze why every time the project restarts, the backend shows Internal Server Error and the frontend shows “Failed to fetch”, especially on signup/login.

Focus ONLY on backend stability and backend-frontend connectivity (do NOT redesign UI, do NOT change existing logic).

Tasks:

Check why the FastAPI backend becomes unstable after restart.

Verify database connection on startup (Postgres/Neon) and ensure backend does not crash if DB is temporarily unavailable.

Add safe startup handling so backend always responds instead of crashing.

Ensure backend actually listens and responds before frontend API calls.

Confirm CORS, API base URL, and request flow are correct.

Important rules:

Do NOT change UI

Do NOT remove or refactor existing features

Only fix the root cause of repeated backend crashes and “Failed to fetch”

The final result must be: backend stays stable after restart and frontend login/signup works every time

Explain clearly what was broken and what you fixed

## Response snapshot

**Problem:**
*   The backend application was missing a `.env` file to store the database connection string.
*   Because of this, it was falling back to a default `localhost` database URL, which was incorrect for the Neon cloud database.
*   This caused any API request that needed the database (like login and signup) to fail with an "Internal Server Error".
*   Additionally, the application lacked a dependency file (`requirements.txt`) and had no robust mechanism to handle database connection failures on startup, making it brittle.

**Solution:**
1.  **Configuration:**
    *   I created a `backend/.env` file. **The user must update this file** with their Neon database URL.
    *   I created a `backend/requirements.txt` file to ensure a consistent and reproducible environment. I will instruct the user to install these dependencies.
2.  **Stability:**
    *   I updated the backend's main entrypoint (`main.py`) to include a new startup procedure.
    *   This procedure now actively checks for a valid database connection when the backend starts.
    *   It will retry several times if the database is not immediately available (which is common with serverless databases). This prevents the application from being unresponsive during "cold starts" of the database.
    *   If the connection still fails, it logs a critical error but allows the application to run, so that non-database related endpoints can still function.

## Outcome

- ✅ Impact: Backend is more stable on startup due to resilient database connection, and frontend can now connect if `.env` is correctly configured.
- 🧪 Tests: No specific tests were run; changes were validated through analysis.
- 📁 Files: Created `backend/.env`, `backend/requirements.txt`, modified `backend/app/main.py`.
- 🔁 Next prompts: The user needs to update the `DATABASE_URL` in `backend/.env` and install the dependencies from `backend/requirements.txt`.
- 🧠 Reflection: Identified a critical missing `.env` file and added robust startup handling for database connections, making the application more resilient. Also created a `requirements.txt` for better dependency management.

## Evaluation notes (flywheel)

- Failure modes observed: Initial failure to determine feature directory due to `main` branch. Missing `requirements.txt`.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
