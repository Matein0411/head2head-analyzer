# app/main.py
from fastapi import FastAPI
from app.routers import atp_scraper_router # Importa tu router

app = FastAPI(
    title="ATP Tour Scraper API",
    description="API para obtener información de torneos ATP actuales, incluyendo categoría, superficie y partidos incompletos con nombres completos de jugadores.",
    version="1.0.0",
)

# Incluye tu router en la aplicación principal
app.include_router(atp_scraper_router.router, prefix="/api", tags=["ATP Matches"])

@app.get("/")
async def root():
    return {"message": "Bienvenido a la API de ATP Tour Scraper. Visita /api/atp_matches para obtener los datos o /docs para la documentación."}