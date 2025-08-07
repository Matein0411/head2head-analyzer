
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials

from app.routers import jugadores
from app.routers import usuarios

load_dotenv()

# En Cloud Run, usar la ruta absoluta del archivo de credenciales
key_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "/app/serviceAccountKey.json")

# 3. Inicializa el SDK de Firebase Admin (si no se ha hecho ya)
if not firebase_admin._apps:
    if key_path:
        cred = credentials.Certificate(key_path)
        firebase_admin.initialize_app(cred)
        print("Firebase Admin SDK inicializado correctamente.")
    else:
        print("ADVERTENCIA: No se encontró la ruta a las credenciales. Firebase Admin no se pudo inicializar.")

app = FastAPI(
    title="API de Consulta de Jugadores de Tenis",
    description="API profesional para consultar matches y estadísticas de jugadores desde PostgreSQL",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(jugadores.router)
app.include_router(usuarios.router)

@app.get("/",
         summary="Información de la API",
         description="Endpoint raíz que proporciona información sobre la API y sus endpoints disponibles")
async def root():
    """
    Endpoint raíz con información de la API y endpoints disponibles.
    
    Returns:
        Dict: Información general de la API
    """
    return {
        "message": "API de Consulta de Jugadores de Tenis",
        "version": "2.0.0",
        "status": "Activa",
        "estructura_bd": {
            "tablas": ["players", "player_stadistics", "matches", "h2h"],
            "descripcion": "Base de datos normalizada con información completa de jugadores de tenis"
        },
        "endpoints": {
            "todos_los_matches": "/players/matches",
            "comparar_jugadores": "/players/compare/{nombre1}/{nombre2}",
            "jugador_individual": "/players/player/{nombre}",
            "documentacion": "/docs",
            "documentacion_alternativa": "/redoc"
        },
        "caracteristicas": [
            "Búsqueda exacta por nombre de jugador",
            "Información completa con prefijos p1_ y p2_",
            "Datos estadísticos y Head-to-Head",
            "Validación automática con Pydantic"
        ]
    }

@app.get("/health", 
         summary="Health Check",
         description="Endpoint de verificación de salud para Google Cloud")
async def health_check():
    """
    Health check endpoint para Google Cloud Run.
    
    Returns:
        Dict: Estado de salud de la aplicación
    """
    return {
        "status": "healthy",
        "service": "Tennis API",
        "version": "2.0.0"
    }

