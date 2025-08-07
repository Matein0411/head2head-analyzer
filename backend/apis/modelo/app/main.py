from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.routers import prediction
from app.config import settings

# Configurar logging
logging.basicConfig(level=getattr(logging, settings.LOG_LEVEL))
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(prediction.router, prefix="/api/v1", tags=["prediction"])

@app.get("/")
async def root():
    return {
        "message": settings.API_TITLE,
        "version": settings.API_VERSION,
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
