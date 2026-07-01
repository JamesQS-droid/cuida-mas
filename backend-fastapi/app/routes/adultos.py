from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from app.database import fetch_all, execute
from app.auth import verify_token

router = APIRouter(prefix="/api/adultos", tags=["adultos"])

class AdultoCreate(BaseModel):
    dni: str
    nombre: str
    edad: int
    sexo: Optional[str] = None
    distrito: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    foto: Optional[str] = None
    condicion: Optional[str] = "estable"
    enfermedades: Optional[str] = None
    familiar: Optional[str] = None
    telefono: Optional[str] = None

class AdultoUpdate(BaseModel):
    condicion: str

@router.get("")
def get_adultos(usuario=Depends(verify_token)):
    return fetch_all("""
        SELECT a.*, u.nombre as cuidador_nombre
        FROM adultos a
        LEFT JOIN cuidadores c ON a.cuidador_id = c.id
        LEFT JOIN usuarios u ON c.usuario_id = u.id
        ORDER BY a.created_at DESC
    """, ())

@router.post("")
def crear_adulto(data: AdultoCreate, usuario=Depends(verify_token)):
    execute("""
        INSERT INTO adultos
            (dni, nombre, edad, sexo, distrito, lat, lng,
             foto, condicion, enfermedades, familiar, telefono)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.dni, data.nombre, data.edad, data.sexo,
        data.distrito, data.lat, data.lng, data.foto,
        data.condicion, data.enfermedades, data.familiar, data.telefono
    ))
    return {"mensaje": "Adulto registrado correctamente"}

@router.put("/{id}")
def actualizar_estado(id: int, data: AdultoUpdate, usuario=Depends(verify_token)):
    execute(
        "UPDATE adultos SET condicion = ? WHERE id = ?",
        (data.condicion, id)
    )
    return {"mensaje": "Estado actualizado"}