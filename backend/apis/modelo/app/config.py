import os
from pathlib import Path

class Settings:
    """
    Configuración de la aplicación
    """
    
    # Configuración del modelo
    MODEL_PATH: str = os.getenv("MODEL_PATH", "./AI_models/modelo_xgb2.pkl")
    MODEL_REDUCED_PATH: str = os.getenv("MODEL_REDUCED_PATH", "./AI_models/modelo_reduced_xgb2.pkl")
    MODEL_VERSION: str = "1.0.0"
    
    # Configuración de la API
    API_TITLE: str = "Tennis Match Prediction API"
    API_DESCRIPTION: str = "API for predicting tennis match outcomes using XGBoost model"
    API_VERSION: str = "1.0.0"
    
    # Configuración del servidor
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Configuración de logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    # Configuración de CORS
    CORS_ORIGINS: list = ["*"]  # En producción, especificar orígenes específicos
    
    @property
    def model_exists(self) -> bool:
        """Verifica si el archivo del modelo existe"""
        return Path(self.MODEL_PATH).exists()
    
    @property
    def model_reduced_exists(self) -> bool:
        """Verifica si el archivo del modelo reducido existe"""
        return Path(self.MODEL_REDUCED_PATH).exists()

# Instancia global de configuración
settings = Settings()
