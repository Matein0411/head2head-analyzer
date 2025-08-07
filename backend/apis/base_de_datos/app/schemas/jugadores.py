from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date

# Schema para información del jugador
class PlayerInfo(BaseModel):
    player_id: int
    name: str
    country: Optional[str] = None
    date_of_birth: Optional[date] = None
    height_cm: Optional[int] = None
    hand: Optional[int] = None  # 0 = zurdo, 1 = diestro

# Schema para estadísticas del jugador
class PlayerStadistics(BaseModel):
    stat_id: int
    player_id: int
    snapshot_date: date
    actual_rank: Optional[int] = None
    min_rank: Optional[int] = None
    grass_winrt: Optional[float] = None
    hard_winrt: Optional[float] = None
    clay_winrt: Optional[float] = None
    g_winrt: Optional[float] = None
    a_winrt: Optional[float] = None
    d_winrt: Optional[float] = None
    m_winrt: Optional[float] = None
    f_winrt: Optional[float] = None
    o_winrt: Optional[float] = None
    pct_1stin: Optional[float] = None
    pct_1stwon: Optional[float] = None
    pct_2ndwon: Optional[float] = None
    pct_svptswon: Optional[float] = None
    pct_bpconv: Optional[float] = None
    pct_bpsaved: Optional[float] = None
    pct_1stretptswon: Optional[float] = None
    pct_2ndretptswon: Optional[float] = None
    recperf: Optional[float] = None

# Schema para información completa del jugador (jugador + estadísticas más recientes)
class PlayerCompleto(BaseModel):
    # Información básica del jugador
    name: str
    country: Optional[str] = None
    date_of_birth: Optional[date] = None
    height_cm: Optional[int] = None
    hand: Optional[int] = None
    
    # Estadísticas más recientes del jugador
    actual_rank: Optional[int] = None
    min_rank: Optional[int] = None
    grass_winrt: Optional[float] = None
    hard_winrt: Optional[float] = None
    clay_winrt: Optional[float] = None
    g_winrt: Optional[float] = None
    a_winrt: Optional[float] = None
    d_winrt: Optional[float] = None
    m_winrt: Optional[float] = None
    f_winrt: Optional[float] = None
    o_winrt: Optional[float] = None
    pct_1stin: Optional[float] = None
    pct_1stwon: Optional[float] = None
    pct_2ndwon: Optional[float] = None
    pct_svptswon: Optional[float] = None
    pct_bpconv: Optional[float] = None
    pct_bpsaved: Optional[float] = None
    pct_1stretptswon: Optional[float] = None
    pct_2ndretptswon: Optional[float] = None
    recperf: Optional[float] = None

# Schema para H2H
class H2HInfo(BaseModel):
    h2h_id: int
    player1_id: int
    player2_id: int
    p1_h2h_win: Optional[int] = None
    p2_h2h_win: Optional[int] = None
    snapshot_date: date

# Schema para match con información completa de ambos jugadores
class MatchCompleto(BaseModel):
    match_id: int
    snapshot_date: date
    tourney_name: Optional[str] = None
    tourney_tipe: Optional[str] = None
    surface: Optional[str] = None
    
    # Información H2H
    p1_h2h_win: Optional[int] = None
    p2_h2h_win: Optional[int] = None
    
    # Información completa del jugador 1 con prefijo p1_
    p1_player_id: int
    p1_name: str
    p1_country: Optional[str] = None
    p1_date_of_birth: Optional[date] = None
    p1_height_cm: Optional[int] = None
    p1_hand: Optional[int] = None
    p1_actual_rank: Optional[int] = None
    p1_min_rank: Optional[int] = None
    p1_grass_winrt: Optional[float] = None
    p1_hard_winrt: Optional[float] = None
    p1_clay_winrt: Optional[float] = None
    p1_g_winrt: Optional[float] = None
    p1_a_winrt: Optional[float] = None
    p1_d_winrt: Optional[float] = None
    p1_m_winrt: Optional[float] = None
    p1_f_winrt: Optional[float] = None
    p1_o_winrt: Optional[float] = None
    p1_pct_1stin: Optional[float] = None
    p1_pct_1stwon: Optional[float] = None
    p1_pct_2ndwon: Optional[float] = None
    p1_pct_svptswon: Optional[float] = None
    p1_pct_bpconv: Optional[float] = None
    p1_pct_bpsaved: Optional[float] = None
    p1_pct_1stretptswon: Optional[float] = None
    p1_pct_2ndretptswon: Optional[float] = None
    p1_recperf: Optional[float] = None
    
    # Información completa del jugador 2 con prefijo p2_
    p2_player_id: int
    p2_name: str
    p2_country: Optional[str] = None
    p2_date_of_birth: Optional[date] = None
    p2_height_cm: Optional[int] = None
    p2_hand: Optional[int] = None
    p2_actual_rank: Optional[int] = None
    p2_min_rank: Optional[int] = None
    p2_grass_winrt: Optional[float] = None
    p2_hard_winrt: Optional[float] = None
    p2_clay_winrt: Optional[float] = None
    p2_g_winrt: Optional[float] = None
    p2_a_winrt: Optional[float] = None
    p2_d_winrt: Optional[float] = None
    p2_m_winrt: Optional[float] = None
    p2_f_winrt: Optional[float] = None
    p2_o_winrt: Optional[float] = None
    p2_pct_1stin: Optional[float] = None
    p2_pct_1stwon: Optional[float] = None
    p2_pct_2ndwon: Optional[float] = None
    p2_pct_svptswon: Optional[float] = None
    p2_pct_bpconv: Optional[float] = None
    p2_pct_bpsaved: Optional[float] = None
    p2_pct_1stretptswon: Optional[float] = None
    p2_pct_2ndretptswon: Optional[float] = None
    p2_recperf: Optional[float] = None

# Schema para respuesta de múltiples matches
class MatchesResponse(BaseModel):
    total_matches: int
    matches: List[MatchCompleto]

# Schema para información básica del jugador con datos calculados
class PlayerBasicInfo(BaseModel):
    name: str
    age: Optional[int] = None  # Calculada a partir del año de nacimiento
    hand: Optional[str] = None  # "Right-handed" o "Left-handed"
    country: Optional[str] = None
    actual_rank: Optional[int] = None
    min_rank: Optional[int] = None
    height: Optional[int] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True
