---
id: 9
title: Fix Frontend Fetch Error
stage: green
date: 2026-01-10
surface: agent
model: gemini-1.5-pro
feature: todo-web-app
branch: main
user: user
command: /sp.implement
labels: ["bug-fix", "cors", "frontend", "backend"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/app/main.py
tests:
  - none
---

## Prompt

You are debugging a Next.js (App Router) frontend connected to a FastAPI backend.

Problem:
Frontend UI loads correctly, but all API calls fail with:
"Failed to fetch"

Your task:
ONLY debug and fix the fetch/network issue.
DO NOT touch UI, CSS, Tailwind, or redesign anything.
DO NOT repeat already-working code.

Context:
- Frontend: Next.js 14 (App Router)
- Backend: FastAPI
- Backend is running successfully on: http://127.0.0.1:8000
- Frontend runs on: http://localhost:3001
- Error occurs in browser when calling backend APIs

What you must do step-by-step:
1. Verify ALL fetch() calls or API client code in the frontend.
2. Check that every API call uses the FULL absolute URL (http://localhost:8000/...)
   and is NOT using a relative path like /api or missing protocol.
3. Inspect CORS configuration in FastAPI and ensure:
   - allow_origins includes http://localhost:3001
   - allow_methods=["*"]
   - allow_headers=["*"]
4. Check if any middleware, auth wrapper, or interceptor is blocking requests.
5. Open browser Network tab logic (conceptually) and identify why request is blocked
   (CORS, wrong URL, OPTIONS failing, or fetch never sent).
6. Fix ONLY the root cause and show the exact file + exact lines changed.

Output format:
- Root cause (1–2 lines)
- Exact fix (code snippets only)
- File paths where changes were made

Do NOT explain basics.
Do NOT give theory.
Just fix the Failed to fetch issue.

## Response snapshot

Root cause: The FastAPI backend was missing the necessary CORS (Cross-Origin Resource Sharing) configuration, which prevented the Next.js frontend, running on a different origin (`http://localhost:3001`), from successfully making API requests to the backend (`http://127.0.0.1:8000`) due to the browser's same-origin policy.

Exact fix:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth, tasks

app = FastAPI(
    title="Phase-2 Todo Web Application",
    description="API for the Phase-2 Todo Web Application, providing user authentication and task management.",
    version="2.0.0",
)

# Set up CORS middleware
origins = [
    "http://localhost:3001",  # Frontend URL
    "http://127.0.0.1:3001", # Also allow 127.0.0.1 for consistency
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["tasks"])


@app.get("/")
async def read_root():
    return {"message": "Welcome to the Phase-2 Todo Web Application Backend!"}
```

File paths where changes were made:
- `backend/app/main.py`

## Outcome

- ✅ Impact: Resolved 'Failed to fetch' error by implementing CORS middleware in the backend.
- 🧪 Tests: No new tests added, but the fix enables successful API calls.
- 📁 Files: Modified `backend/app/main.py` to include CORS middleware.
- 🔁 Next prompts: None
- 🧠 Reflection: Successfully identified and fixed the CORS issue preventing frontend-backend communication. The issue was due to misconfiguration of the backend, which is a common problem in full-stack development.

## Evaluation notes (flywheel)

- Failure modes observed: Previous attempts to execute powershell script for PHR creation failed due to incorrect script path.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
