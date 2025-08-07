from pydantic import BaseModel
from typing import Optional

class MatchPredictionInput(BaseModel):
    """
    Schema para los datos de entrada del modelo de predicción de tenis
    """
    # Player ages
    p1_age: float
    p2_age: float
    
    # Player heights
    p1_ht: float
    p2_ht: float
    
    # Player hand encoded (0 = izquierdo, 1 = derecho)
    p1_hand_encoded: int
    p2_hand_encoded: int
    
    # Player rankings
    p1_rank: float
    p2_rank: float
    p1_min_rank: float
    p2_min_rank: float
    
    # General player stats - serve statistics
    p1_pct_1stIn: float  # Porcentaje de primeros servicios
    p2_pct_1stIn: float
    p1_pct_1stWon: float  # Porcentaje de puntos ganados con primer servicio
    p2_pct_1stWon: float
    p1_pct_2ndWon: float  # Porcentaje de puntos ganados con segundo servicio
    p2_pct_2ndWon: float
    p1_pct_SvPtsWon: float  # Porcentaje de puntos de servicio ganados
    p2_pct_SvPtsWon: float
    
    # Break point statistics
    p1_pct_bpConv: float  # Porcentaje de break points convertidos
    p2_pct_bpConv: float
    p1_pct_bpSaved: float  # Porcentaje de break points salvados
    p2_pct_bpSaved: float
    
    # Return statistics
    p1_pct_1stRetPtsWon: float  # Porcentaje de puntos ganados en devolución de primer servicio
    p2_pct_1stRetPtsWon: float
    p1_pct_2ndRetPtsWon: float  # Porcentaje de puntos ganados en devolución de segundo servicio
    p2_pct_2ndRetPtsWon: float
    
    # Head-to-head
    p1_h2h_won: float  # Victorias head-to-head del jugador 1
    p2_h2h_won: float  # Victorias head-to-head del jugador 2
    
    # Recent performance
    p1_recPerf: float  # Rendimiento reciente del jugador 1
    p2_recPerf: float  # Rendimiento reciente del jugador 2
    
    # Surface and tournament win rates
    p1_surface_wRate: float  # Tasa de victorias en la superficie
    p2_surface_wRate: float
    p1_tourney_wRate: float  # Tasa de victorias en el torneo
    p2_tourney_wRate: float

class MatchPredictionInputReduced(BaseModel):
    """
    Schema para los datos de entrada del modelo con características reducidas
    """
    # Recent performance
    p1_recPerf: float  # Rendimiento reciente del jugador 1
    p2_recPerf: float  # Rendimiento reciente del jugador 2
    
    # Player rankings
    p1_rank: float
    p2_rank: float
    
    # Service points won
    p1_pct_SvPtsWon: float  # Porcentaje de puntos de servicio ganados
    p2_pct_SvPtsWon: float
    
    # Return statistics
    p1_pct_1stRetPtsWon: float  # Porcentaje de puntos ganados en devolución de primer servicio
    p2_pct_1stRetPtsWon: float
    p1_pct_2ndRetPtsWon: float  # Porcentaje de puntos ganados en devolución de segundo servicio
    p2_pct_2ndRetPtsWon: float
    
    # Tournament and surface win rates
    p1_tourney_wRate: float  # Tasa de victorias en el torneo
    p2_tourney_wRate: float
    p1_surface_wRate: float  # Tasa de victorias en la superficie
    p2_surface_wRate: float
    
    # First serve won
    p1_pct_1stWon: float  # Porcentaje de puntos ganados con primer servicio
    p2_pct_1stWon: float

class MatchPredictionOutput(BaseModel):
    """
    Schema para la respuesta de la predicción
    """
    prediction: int  # 0 o 1 (gana jugador 1 o jugador 2)
    probability_p1_wins: float  # Probabilidad de que gane el jugador 1
    probability_p2_wins: float  # Probabilidad de que gane el jugador 2

class PredictionResponse(BaseModel):
    """
    Schema para la respuesta completa de la API
    """
    success: bool
    message: str
    data: Optional[MatchPredictionOutput] = None
    error: Optional[str] = None
