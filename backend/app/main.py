import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tenacity import retry, stop_after_attempt, wait_fixed, before_sleep_log
from sqlmodel import Session, create_engine
from sqlalchemy import text # <-- Import text

from .api import auth, tasks, chat
from .core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@retry(
    stop=stop_after_attempt(5),
    wait=wait_fixed(3),
    before_sleep=before_sleep_log(logger, logging.WARNING),
)
def check_db_connection() -> None:
    """
    Tries to establish a database connection.
    If it fails, tenacity will retry a few times.
    """
    try:
        logger.info("Attempting to connect to the database...")
        engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
        with Session(engine) as session:
            session.execute(text("SELECT 1")) # <-- Use text()
        logger.info("Database connection successful.")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise

app = FastAPI(
    title="Phase-2 Todo Web Application",
    description="API for the Phase-2 Todo Web Application, providing user authentication and task management.",
    version="2.0.0",
)

@app.on_event("startup")
def on_startup():
    """
    Event handler for application startup.
    """
    try:
        check_db_connection()
    except Exception as e:
        logger.critical(f"Could not establish database connection after multiple retries: {e}")
        logger.critical("The application will start, but API endpoints requiring database access will fail.")
        logger.critical("Please check your DATABASE_URL in the .env file and ensure the database is running.")


# Set up CORS middleware
# For development, we allow all origins.
# For production, this should be restricted to the frontend URL.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["tasks"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])


@app.get("/")
async def read_root():
    return {"message": "Welcome to the Phase-2 Todo Web Application Backend!"}


@app.get("/healthz")
async def health_check():
    """Health check endpoint for Kubernetes probes."""
    try:
        engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
        with Session(engine) as session:
            session.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=503,
            content={"status": "unhealthy", "database": str(e)}
        )
