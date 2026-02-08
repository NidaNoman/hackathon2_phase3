# backend/app/core/security.py
# Fixed version: safe password truncation for bcrypt, supports UTF-8

from datetime import datetime, timedelta
from typing import Union, Any

from jose import jwt, JWTError
from passlib.context import CryptContext

from app.core.config import settings

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
SECRET_KEY = settings.SECRET_KEY

MAX_BCRYPT_BYTES = 72  # bcrypt max bytes

def _truncate_password(password: str) -> str:
    """
    Truncate password to 72 bytes safely for bcrypt.
    Works with UTF-8 characters (including emojis).
    """
    password_bytes = password.encode('utf-8')
    if len(password_bytes) <= MAX_BCRYPT_BYTES:
        return password

    # Truncate to MAX_BCRYPT_BYTES, ensuring we don't cut in the middle of a multi-byte character
    truncated_bytes = password_bytes[:MAX_BCRYPT_BYTES]

    # If the last byte is part of a multi-byte UTF-8 character, remove bytes until we have a valid UTF-8 string
    while truncated_bytes and truncated_bytes[-1] >= 0xF0:  # Start of 4-byte UTF-8 sequence
        truncated_bytes = truncated_bytes[:-1]
    while truncated_bytes and (truncated_bytes[-1] & 0xC0) == 0x80:  # Continuation byte
        truncated_bytes = truncated_bytes[:-1]

    return truncated_bytes.decode('utf-8')

# ------------------------------
# Password hashing / verification
# ------------------------------

def get_password_hash(password: str) -> str:
    """
    Hash a plain password safely for bcrypt.
    """
    try:
        safe_password = _truncate_password(password)
        return pwd_context.hash(safe_password)
    except Exception as e:
        raise ValueError(f"Password hashing failed: {e}")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against the hashed password.
    Truncates password to 72 bytes for bcrypt verification.
    """
    safe_password = _truncate_password(plain_password)
    return pwd_context.verify(safe_password, hashed_password)


# ------------------------------
# JWT token functions
# ------------------------------

def create_access_token(
    subject: Union[str, Any], expires_delta: timedelta = None
) -> str:
    """
    Create a JWT access token.
    """
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Union[str, None]:
    """
    Decode a JWT access token.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None
