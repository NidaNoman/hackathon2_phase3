# backend/app/core/config.py
# T009 [P] Setup backend core/config.py for environment variable loading using Pydantic BaseSettings

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
    DATABASE_URL: str
    SECRET_KEY: str = "your-super-secret-jwt-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # model_config will now primarily rely on os.getenv after load_dotenv
    model_config = SettingsConfigDict(extra="ignore")

settings = Settings()
