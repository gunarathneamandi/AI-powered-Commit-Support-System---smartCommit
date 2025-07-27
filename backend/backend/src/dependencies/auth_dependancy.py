from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from backend.src.utils import verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload