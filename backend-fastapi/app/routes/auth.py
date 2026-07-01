from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import fetch_one
from app.auth import verify_password, create_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(data: LoginRequest):
    user = fetch_one(
        "SELECT * FROM usuarios WHERE email = ?",
        (data.email,)
    )
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    
    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    
    token = create_token({
        "id": user["id"],
        "email": user["email"],
        "rol": user["rol"]
    })
    
    return {
        "token": token,
        "usuario": {
            "id": user["id"],
            "nombre": user["nombre"],
            "rol": user["rol"]
        }
    }