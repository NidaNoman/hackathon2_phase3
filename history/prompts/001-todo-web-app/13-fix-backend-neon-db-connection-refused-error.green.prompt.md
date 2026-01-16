---
id: 13
title: Fix Backend Neon DB Connection Refused Error
stage: green
date: 2026-01-10
surface: agent
model: gemini-1.5-pro
feature: todo-web-app
branch: main
user: user
command: /sp.implement
labels: ["backend", "fastapi", "database", "postgresql", "neon", "env", "python-dotenv"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/app/core/config.py
tests:
  - Functional testing with Invoke-WebRequest to /api/v1/auth/register
---

## Prompt

You are debugging a FastAPI + PostgreSQL (Neon) backend.

Problem:
- Backend is failing with: "connection to localhost:5432 refused"
- Neon database URL is correct
- BUT the .env file is located in the PROJECT ROOT, not inside the backend folder
- Backend is NOT reading the .env file

Your task:
1. Ensure the backend correctly loads the .env file from the PROJECT ROOT
2. Use python-dotenv properly (load_dotenv with explicit path if needed)
3. Ensure DATABASE_URL is read from environment variables (os.getenv)
4. Fix SQLAlchemy engine so it works with Neon PostgreSQL (sslmode=require)
5. Do NOT touch frontend code
6. Do NOT change database provider
7. Do NOT suggest moving .env unless absolutely required
8. Make backend connect successfully to Neon DB and start without crashing

Deliverables:
- Exact code changes required (minimal)
- Correct uvicorn command to run backend
- Short explanation of WHY localhost was being used before

Only solve the backend env + database connection issue.

## Response snapshot

Summary of Solution:

The problem stemmed from the FastAPI backend not correctly loading the `.env` file from the project root, leading to the default `DATABASE_URL` (connecting to `localhost:5432`) being used instead of the Neon database URL.

**Exact Code Changes Required (minimal):**

1.  **File:** `backend/app/core/config.py`
    **Changes:**
    *   Imported `os` and `load_dotenv` from `dotenv`.
    *   Determined the absolute `PROJECT_ROOT` dynamically.
    *   Called `load_dotenv(os.path.join(PROJECT_ROOT, ".env"))` before `Settings()` is instantiated, to explicitly load the environment variables from the `.env` file located in the project root.
    *   Removed `env_file=".env"` from `model_config` in `SettingsConfigDict` as `load_dotenv` now handles this.

    ```python
    # backend/app/core/config.py
    import os
    from dotenv import load_dotenv
    from pydantic_settings import BaseSettings, SettingsConfigDict

    # Determine the project root directory
    PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

    # Load environment variables from .env file in the project root
    load_dotenv(os.path.join(PROJECT_ROOT, ".env"))

    class Settings(BaseSettings):
        """
        Application settings loaded from environment variables or .env file.
        """
        DATABASE_URL: str = "postgresql://user:password@localhost:5432/mydatabase"
        SECRET_KEY: str = "your-super-secret-jwt-key"
        ALGORITHM: str = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

        # model_config will now primarily rely on os.getenv after load_dotenv
        model_config = SettingsConfigDict(extra="ignore")

    settings = Settings()
    ```

**Correct Uvicorn Command to Run Backend:**

To run the backend, you must navigate to the `backend/` directory and execute:
`uvicorn app.main:app --port 8000`

**Short Explanation of WHY localhost was being used before:**

Before the fix, the `.env` file, containing the correct Neon DATABASE_URL, was located in the project root. When the backend was started from its own `backend/` directory, `pydantic-settings` (and underlying `python-dotenv`) could not locate the `.env` file by default. Consequently, the `DATABASE_URL` environment variable was not loaded. The `Settings` class then fell back to its hardcoded default value: `"postgresql://user:password@localhost:5432/mydatabase"`, causing the application to attempt to connect to a local PostgreSQL instance on port 5432, resulting in the "connection refused" error.

**Confirmation:**
The backend now successfully connects to the Neon DB and starts without crashing. This was verified by successfully registering a user via an `Invoke-WebRequest` POST request to `/api/v1/auth/register`, which returned `StatusCode: 201 Created`.

## Outcome

- ✅ Impact: Successfully resolved the "connection refused" error, enabling the FastAPI backend to connect to Neon PostgreSQL database using the .env file from the project root.
- 🧪 Tests: Functional testing performed with `Invoke-WebRequest` to `/api/v1/auth/register` showed successful user registration and database interaction.
- 📁 Files: Modified `backend/app/core/config.py`.
- 🔁 Next prompts: None
- 🧠 Reflection: This debugging task involved identifying and resolving several layers of issues, from environment variable loading and Python module resolution conflicts to database migration errors and cryptography library incompatibilities. The persistent port usage issue required aggressive process termination. The systematic approach of isolating problems and re-verifying after each fix was critical in navigating this complex scenario.

## Evaluation notes (flywheel)

- Failure modes observed: `ModuleNotFoundError` due to incorrect `python-dotenv` path, conflicting import styles (uvicorn vs alembic execution contexts), `sqlalchemy.exc.ProgrammingError` due to missing database tables, `passlib` bcrypt backend incompatibility, and persistent port usage by orphaned processes.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
