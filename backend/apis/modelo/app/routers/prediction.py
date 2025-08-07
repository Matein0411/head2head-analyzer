from fastapi import APIRouter, HTTPException, status
import logging

from app.schemas.prediction import MatchPredictionInput, MatchPredictionInputReduced, MatchPredictionOutput, PredictionResponse
from app.models.predictor import get_predictor
from app.config import settings

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
async def predict_match_outcome(match_data: MatchPredictionInput):
    """
    Predice el resultado de un partido de tenis usando el modelo XGBoost
    
    Parameters:
    - match_data: Datos del partido incluyendo estadísticas de ambos jugadores
    
    Returns:
    - PredictionResponse: Resultado de la predicción con probabilidades
    """
    try:
        # Obtener instancia del predictor
        predictor = get_predictor()
        
        # Si el modelo no está cargado, intentar cargarlo automáticamente
        if not predictor.is_model_loaded():
            logger.info(f"Model not loaded, attempting to load from {settings.MODEL_PATH}")
            if not predictor.load_model(settings.MODEL_PATH):
                return PredictionResponse(
                    success=False,
                    message="Model could not be loaded",
                    error=f"Failed to load model from {settings.MODEL_PATH}. Please check if the file exists."
                )
        
        # Convertir datos de entrada a diccionario
        input_dict = match_data.dict()
        
        # Realizar predicción
        prediction_result = predictor.predict(input_dict)
        
        # Crear objeto de respuesta
        prediction_output = MatchPredictionOutput(**prediction_result)
        
        return PredictionResponse(
            success=True,
            message="Prediction completed successfully",
            data=prediction_output
        )
        
    except ValueError as ve:
        logger.error(f"Validation error: {str(ve)}")
        return PredictionResponse(
            success=False,
            message="Validation error",
            error=str(ve)
        )
        
    except Exception as e:
        logger.error(f"Unexpected error in prediction: {str(e)}")
        return PredictionResponse(
            success=False,
            message="Internal server error",
            error="An unexpected error occurred during prediction"
        )

@router.post("/predict-reduced", response_model=PredictionResponse)
async def predict_match_outcome_reduced(match_data: MatchPredictionInputReduced):
    """
    Predice el resultado de un partido de tenis usando características reducidas
    
    Parameters:
    - match_data: Datos del partido con solo las características más importantes
    
    Returns:
    - PredictionResponse: Resultado de la predicción con probabilidades
    """
    try:
        # Obtener instancia del predictor
        predictor = get_predictor()
        
        # Si el modelo reducido no está cargado, intentar cargarlo automáticamente
        if not predictor.is_model_reduced_loaded():
            logger.info(f"Reduced model not loaded, attempting to load from {settings.MODEL_REDUCED_PATH}")
            if not predictor.load_model_reduced(settings.MODEL_REDUCED_PATH):
                return PredictionResponse(
                    success=False,
                    message="Reduced model could not be loaded",
                    error=f"Failed to load reduced model from {settings.MODEL_REDUCED_PATH}. Please check if the file exists."
                )
        
        # Convertir datos de entrada a diccionario
        input_dict = match_data.dict()
        
        # Realizar predicción con características reducidas
        prediction_result = predictor.predict_reduced(input_dict)
        
        # Crear objeto de respuesta
        prediction_output = MatchPredictionOutput(**prediction_result)
        
        return PredictionResponse(
            success=True,
            message="Reduced prediction completed successfully",
            data=prediction_output
        )
        
    except ValueError as ve:
        logger.error(f"Validation error in reduced prediction: {str(ve)}")
        return PredictionResponse(
            success=False,
            message="Validation error",
            error=str(ve)
        )
        
    except Exception as e:
        logger.error(f"Unexpected error in reduced prediction: {str(e)}")
        return PredictionResponse(
            success=False,
            message="Internal server error",
            error="An unexpected error occurred during reduced prediction"
        )