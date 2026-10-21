from bson import ObjectId
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from core.config import settings
from db.database import get_database
from schemas.token import TokenPayload
from utils.user_store import ROLE_COLLECTIONS, get_user_with_profile_by_role

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(get_database)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        if user_id is None or role not in ROLE_COLLECTIONS:
            raise credentials_exception
        token_data = TokenPayload(sub=user_id, role=role)
    except JWTError:
        raise credentials_exception

    if not ObjectId.is_valid(token_data.sub):
        raise credentials_exception

    user = await get_user_with_profile_by_role(db, token_data.role, token_data.sub)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_active", True):
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def require_roles(*roles: str):
    async def role_dependency(current_user: dict = Depends(get_current_active_user)):
        if current_user.get("role") not in roles:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        return current_user

    return role_dependency
