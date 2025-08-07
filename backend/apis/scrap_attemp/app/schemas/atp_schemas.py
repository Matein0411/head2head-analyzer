# app/schemas/atp_schemas.py
from pydantic import BaseModel
from typing import List, Optional

# Modelo para un partido (dentro de los partidos incompletos)
class Match(BaseModel):
    player1: str
    player2: str

# Modelo para los resultados de un torneo
class TournamentResult(BaseModel):
    tournament_name: str
    category: str
    surface: str
    incomplete_matches: List[Match]