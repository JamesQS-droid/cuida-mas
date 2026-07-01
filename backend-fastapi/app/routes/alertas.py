from fastapi import APIRouter, Depends
from app.database import fetch_all
from app.auth import verify_token

router = APIRouter(prefix="/api/alertas", tags=["alertas"])

@router.get("")
def get_alertas(usuario=Depends(verify_token)):
    return fetch_all("""
        SELECT al.*, a.nombre as adulto_nombre,
               a.distrito, a.condicion
        FROM alertas al
        JOIN adultos a ON al.adulto_id = a.id
        WHERE al.estado = 'pendiente'
        ORDER BY al.fecha DESC
    """, ())