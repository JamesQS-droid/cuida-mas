from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, dashboard, adultos, alertas

app = FastAPI(
    title="CuidaMás API",
    description="Sistema de monitoreo de adultos mayores vulnerables en Huancayo",
    version="1.0.0"
)

# CORS — permite que Angular se conecte
origins = [
    "http://localhost:4200",
    "http://localhost",
    "http://127.0.0.1:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Registrar rutas
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(adultos.router)
app.include_router(alertas.router)

@app.get("/")
def root():
    return {"mensaje": "API CuidaMás con FastAPI funcionando ✅"}