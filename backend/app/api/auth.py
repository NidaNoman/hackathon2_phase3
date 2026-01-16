# backend/app/api/auth.py
# T020 [P] [US1] Implement backend endpoint for user registration

from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session

from app.schemas.user import UserCreate, UserPublic
from app.crud.user import create_user, get_user_by_username
from app.db.engine import get_db_session
from app.core.security import verify_password, create_access_token
from app.core.config import settings

router = APIRouter()

@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def register_user(
    user_create: UserCreate,
    session: Session = Depends(get_db_session)
):
    """
    Register a new user.

    - **username**: Unique username for the user.
    - **password**: User's password.
    """
    db_user = get_user_by_username(session, username=user_create.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    try:
        user = create_user(session, user_create)
        return user
    except Exception as e:
        # After the previous change to crud/user.py, this will catch the raised SQLAlchemyError
        # and any other unexpected errors during user creation.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An internal error occurred during user registration: {e}"
        )

@router.post("/login")
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_db_session)
):
    """
    Authenticate user and return JWT access token.
    """
    user = get_user_by_username(session, username=form_data.username)
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

