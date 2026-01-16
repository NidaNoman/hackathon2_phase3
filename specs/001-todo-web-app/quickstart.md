# Quickstart Guide: Phase-2 Todo Web Application

**Date**: 2026-01-10
**Feature**: [Phase-2 Todo Web Application](specs/001-todo-web-app/spec.md)
**Plan**: [Implementation Plan](specs/001-todo-web-app/plan.md)

## 1. Project Overview

This guide provides instructions to set up and run the Phase-2 Todo Web Application locally. The project uses a monorepo structure with a Next.js frontend, a FastAPI backend, and shared TypeScript/Python types.

## 2. Prerequisites

Before you begin, ensure you have the following installed:

-   Git
-   Python 3.11+
-   Node.js (LTS version)
-   npm or Yarn
-   Docker (optional, for local PostgreSQL if not using Neon Dev Tier)

## 3. Setup

### 3.1. Clone the Repository

```bash
git clone <repository_url>
cd <repository_name>
git checkout 001-todo-web-app # Or your feature branch
```

### 3.2. Environment Variables

Create a `.env` file in the project root directory and add the following variables. You can use the `.env.example` file as a template.

```ini
# .env example
# For Backend
DATABASE_URL="postgresql://user:password@host:port/dbname" # Replace with your Neon connection string or local PG
SECRET_KEY="your-super-secret-jwt-key" # Generate a strong, random key, e.g., via `openssl rand -hex 32`
ACCESS_TOKEN_EXPIRE_MINUTES=30

# For Frontend
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"
```

**Note**: For `DATABASE_URL`, you can use a local PostgreSQL instance or a free Neon.tech development tier.

### 3.3. Backend Setup

Navigate to the `backend/` directory, create a Python virtual environment, install dependencies, and run database migrations.

```bash
cd backend/
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
# If requirements.txt is missing, generate it: pip freeze > requirements.txt
pip install -r requirements.txt
alembic upgrade head # Run database migrations
```

### 3.4. Frontend Setup

Navigate to the `frontend/` directory and install Node.js dependencies.

```bash
cd frontend/
npm install # or yarn install
```

### 3.5. Shared Types Setup

The project is configured to use shared types between the frontend and backend. No special setup is required for this to work.

## 4. Running the Application

### 4.1. Start the Backend

From the `backend/` directory:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be accessible at `http://localhost:8000`. The API endpoints are prefixed with `/api/v1`.

### 4.2. Start the Frontend

From the `frontend/` directory:

```bash
npm run dev # or yarn dev
```

The frontend application will be accessible at `http://localhost:3000`.

## 5. First Use

1.  Open your browser and navigate to `http://localhost:3000`.
2.  Register a new user account.
3.  Log in with your new credentials.
4.  Start creating and managing your todo tasks!

## 6. Testing

### Backend Tests

From the `backend/` directory:

```bash
pytest
```

### Frontend Tests

From the `frontend/` directory:

```bash
npm test # or yarn test
```

## 7. Troubleshooting

-   **Database Connection Issues**: Double-check your `DATABASE_URL` in `.env`. Ensure your PostgreSQL instance is running and accessible.
-   **JWT Secret**: Ensure `SECRET_KEY` in `.env` is set and matches what the backend expects.
-   **Port Conflicts**: If ports 8000 or 3000 are in use, you may need to adjust the `uvicorn` and Next.js `dev` commands or environment configuration.
