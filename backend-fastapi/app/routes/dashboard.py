from fastapi import APIRouter, Depends
from app.database import fetch_all, fetch_one
from app.auth import verify_token

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("")
def get_dashboard(usuario=Depends(verify_token)):
    total = fetch_one("SELECT COUNT(*) as total FROM adultos", ())
    estable = fetch_one("SELECT COUNT(*) as total FROM adultos WHERE condicion = 'estable'", ())
    observacion = fetch_one("SELECT COUNT(*) as total FROM adultos WHERE condicion = 'observacion'", ())
    urgente = fetch_one("SELECT COUNT(*) as total FROM adultos WHERE condicion = 'urgente'", ())
    recientes = fetch_all("""
        SELECT TOP 5 a.id, a.nombre, a.edad, a.distrito, a.condicion,
               u.nombre as cuidador_nombre
        FROM adultos a
        LEFT JOIN cuidadores c ON a.cuidador_id = c.id
        LEFT JOIN usuarios u ON c.usuario_id = u.id
        ORDER BY a.created_at DESC
    """, ())

    return {
        "total": total["total"],
        "estable": estable["total"],
        "observacion": observacion["total"],
        "urgente": urgente["total"],
        "recientes": recientes
    }