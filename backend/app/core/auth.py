# backend/app/core/auth.py
# T015 [P] Implement backend JWT authentication dependency

from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError

from app.core.security import decode_access_token
from app.db.engine import get_db_session
from sqlmodel import Session, select
from app.db.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token") # tokenUrl needs to point to your actual login endpoint

def get_current_user(
    session: Session = Depends(get_db_session),
    token: str = Depends(oauth2_scheme)
) -> User:
    """
    Dependency to get the current authenticated user from the JWT token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    user_id = decode_access_token(token)
    if user_id is None:
        raise credentials_exception
    
    user = session.exec(select(User).where(User.id == int(user_id))).first()
    if not user:
        raise credentials_exception
    return user