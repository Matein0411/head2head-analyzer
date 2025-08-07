from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc
from typing import Dict, Any
from datetime import datetime  # date se agregará cuando se active el filtro de partidos futuros

from app.dependencies.database import get_db
from app.models import Player, PlayerStadistics, Match, H2H
from app.schemas.jugadores import MatchCompleto, MatchesResponse, PlayerCompleto, PlayerBasicInfo

router = APIRouter(prefix="/players", tags=["Jugadores de Tenis"])

def obtener_info_completa_player(db: Session, player_id: int) -> Dict[str, Any]:
    """
    Obtiene información completa del jugador incluyendo datos básicos y estadísticas más recientes.
    
    Args:
        db: Sesión de base de datos
        player_id: ID del jugador
        
    Returns:
        Diccionario con información completa del jugador o None si no existe
    """
    # Obtener información básica del jugador
    player = db.query(Player).filter(Player.player_id == player_id).first()
    if not player:
        return None
    
    # Obtener estadísticas más recientes del jugador ordenadas por snapshot_date
    estadisticas = db.query(PlayerStadistics).filter(
        PlayerStadistics.player_id == player_id
    ).order_by(desc(PlayerStadistics.snapshot_date)).first()
    
    # Información básica del jugador
    info_completa = {
        "name": player.name,
        "country": player.country,
        "date_of_birth": player.date_of_birth,
        "height_cm": player.height_cm,
        "hand": player.hand,
    }
    
    # Agregar estadísticas si existen
    if estadisticas:
        estadisticas_dict = {
            "actual_rank": estadisticas.actual_rank,
            "min_rank": estadisticas.min_rank,
            "grass_winrt": float(estadisticas.grass_winrt) if estadisticas.grass_winrt is not None else None,
            "hard_winrt": float(estadisticas.hard_winrt) if estadisticas.hard_winrt is not None else None,
            "clay_winrt": float(estadisticas.clay_winrt) if estadisticas.clay_winrt is not None else None,
            "g_winrt": float(estadisticas.g_winrt) if estadisticas.g_winrt is not None else None,
            "a_winrt": float(estadisticas.a_winrt) if estadisticas.a_winrt is not None else None,
            "d_winrt": float(estadisticas.d_winrt) if estadisticas.d_winrt is not None else None,
            "m_winrt": float(estadisticas.m_winrt) if estadisticas.m_winrt is not None else None,
            "f_winrt": float(estadisticas.f_winrt) if estadisticas.f_winrt is not None else None,
            "o_winrt": float(estadisticas.o_winrt) if estadisticas.o_winrt is not None else None,
            "pct_1stin": float(estadisticas.pct_1stin) if estadisticas.pct_1stin is not None else None,
            "pct_1stwon": float(estadisticas.pct_1stwon) if estadisticas.pct_1stwon is not None else None,
            "pct_2ndwon": float(estadisticas.pct_2ndwon) if estadisticas.pct_2ndwon is not None else None,
            "pct_svptswon": float(estadisticas.pct_svptswon) if estadisticas.pct_svptswon is not None else None,
            "pct_bpconv": float(estadisticas.pct_bpconv) if estadisticas.pct_bpconv is not None else None,
            "pct_bpsaved": float(estadisticas.pct_bpsaved) if estadisticas.pct_bpsaved is not None else None,
            "pct_1stretptswon": float(estadisticas.pct_1stretptswon) if estadisticas.pct_1stretptswon is not None else None,
            "pct_2ndretptswon": float(estadisticas.pct_2ndretptswon) if estadisticas.pct_2ndretptswon is not None else None,
            "recperf": float(estadisticas.recperf) if estadisticas.recperf is not None else None,
        }
        info_completa.update(estadisticas_dict)
    
    return info_completa

def obtener_h2h_info(db: Session, player1_id: int, player2_id: int) -> Dict[str, Any]:
    """
    Obtiene información Head-to-Head entre dos jugadores.
    
    Args:
        db: Sesión de base de datos
        player1_id: ID del primer jugador
        player2_id: ID del segundo jugador
        
    Returns:
        Diccionario con información H2H con claves p1_h2h_win y p2_h2h_win
    """
    # Buscar H2H en cualquier orden de los jugadores
    h2h = db.query(H2H).filter(
        or_(
            and_(H2H.player1_id == player1_id, H2H.player2_id == player2_id),
            and_(H2H.player1_id == player2_id, H2H.player2_id == player1_id)
        )
    ).order_by(desc(H2H.snapshot_date)).first()
    
    if not h2h:
        return {"p1_h2h_win": None, "p2_h2h_win": None}
    
    # Si el orden está invertido en la BD, intercambiar los valores
    if h2h.player1_id == player2_id:
        return {"p1_h2h_win": h2h.p2_h2h_win, "p2_h2h_win": h2h.p1_h2h_win}
    else:
        return {"p1_h2h_win": h2h.p1_h2h_win, "p2_h2h_win": h2h.p2_h2h_win}

@router.get("/player/{nombre}", 
            response_model=PlayerCompleto,
            summary="Obtener información completa de un jugador",
            description="Busca un jugador por nombre exacto y devuelve toda su información")
async def obtener_player_completo(nombre: str, db: Session = Depends(get_db)):
    """
    Obtiene información completa de un jugador mediante búsqueda exacta por nombre.
    
    Args:
        nombre: Nombre exacto del jugador a buscar
        db: Sesión de base de datos
        
    Returns:
        PlayerCompleto: Información completa del jugador
        
    Raises:
        HTTPException: Si el jugador no existe o no se puede obtener su información
    """
    player = db.query(Player).filter(Player.name == nombre).first()
    
    if not player:
        raise HTTPException(
            status_code=404,
            detail=f"Jugador '{nombre}' no encontrado. Verifique el nombre exacto."
        )
    
    info_completa = obtener_info_completa_player(db, player.player_id)
    
    if not info_completa:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno: No se pudo obtener información completa del jugador '{nombre}'"
        )
    
    return PlayerCompleto(**info_completa)

def obtener_info_basica_player(db: Session, player_id: int) -> Dict[str, Any]:
    """
    Obtiene información básica del jugador con datos calculados y formateados.
    
    Args:
        db: Sesión de base de datos
        player_id: ID del jugador
        
    Returns:
        Diccionario con información básica del jugador o None si no existe
    """
    # Obtener información básica del jugador
    player = db.query(Player).filter(Player.player_id == player_id).first()
    if not player:
        return None
    
    # Obtener estadísticas más recientes del jugador
    estadisticas = db.query(PlayerStadistics).filter(
        PlayerStadistics.player_id == player_id
    ).order_by(desc(PlayerStadistics.snapshot_date)).first()
    
    # Calcular edad si hay fecha de nacimiento
    age = None
    if player.date_of_birth:
        current_year = datetime.now().year
        birth_year = player.date_of_birth.year
        age = current_year - birth_year
    
    # Formatear mano
    hand_str = None
    if player.hand is not None:
        hand_str = "Right-handed" if player.hand == 1 else "Left-handed"
    
    # Información básica del jugador
    info_basica = {
        "name": player.name,
        "age": age,
        "hand": hand_str,
        "country": player.country,
        "actual_rank": estadisticas.actual_rank if estadisticas else None,
        "min_rank": estadisticas.min_rank if estadisticas else None,
        "height": player.height_cm,
        "image_url": player.image_url,
    }
    
    return info_basica

def obtener_tasas_especificas(info_player: Dict[str, Any], surface: str = None, tourney_type: str = None) -> Dict[str, Any]:
    """
    Obtiene las tasas de victoria específicas por superficie y tipo de torneo.
    
    Args:
        info_player: Información completa del jugador
        surface: Tipo de superficie (grass, hard, clay)
        tourney_type: Tipo de torneo (G, M, A, F, D, O)
        
    Returns:
        Dict con las tasas específicas
    """
    result = {}
    
    # Tasas por superficie
    if surface:
        surface_lower = surface.lower()
        if surface_lower == "Grass":
            result["surface_wRate"] = info_player.get("grass_winrt")
        elif surface_lower == "Hard":
            result["surface_wRate"] = info_player.get("hard_winrt")
        elif surface_lower == "Clay":
            result["surface_wRate"] = info_player.get("clay_winrt")
        else:
            result["surface_wRate"] = None
    else:
        result["surface_wRate"] = None
    
    # Tasas por tipo de torneo
    if tourney_type:
        tourney_upper = tourney_type.upper()
        if tourney_upper == "G":
            result["tourney_wRate"] = info_player.get("g_winrt")
        elif tourney_upper == "M":
            result["tourney_wRate"] = info_player.get("m_winrt")
        elif tourney_upper == "A":
            result["tourney_wRate"] = info_player.get("a_winrt")
        elif tourney_upper == "F":
            result["tourney_wRate"] = info_player.get("f_winrt")
        elif tourney_upper == "D":
            result["tourney_wRate"] = info_player.get("d_winrt")
        elif tourney_upper == "O":
            result["tourney_wRate"] = info_player.get("o_winrt")
        else:
            result["tourney_wRate"] = None
    else:
        result["tourney_wRate"] = None
    
    return result

# Endpoint H2H simple entre dos jugadores por nombre
@router.get("/h2h/{nombre1}/{nombre2}", summary="Obtener H2H simple entre dos jugadores por nombre", response_model=dict)
async def obtener_h2h_simple(nombre1: str, nombre2: str, db: Session = Depends(get_db)):
    """
    Devuelve el H2H entre dos jugadores, retornando solo p1_h2h_won y p2_h2h_won.
    """
    player1 = db.query(Player).filter(Player.name == nombre1).first()
    player2 = db.query(Player).filter(Player.name == nombre2).first()
    if not player1 or not player2:
        raise HTTPException(status_code=404, detail="Uno o ambos jugadores no encontrados")

    h2h = db.query(H2H).filter(
        or_(
            and_(H2H.player1_id == player1.player_id, H2H.player2_id == player2.player_id),
            and_(H2H.player1_id == player2.player_id, H2H.player2_id == player1.player_id)
        )
    ).order_by(desc(H2H.snapshot_date)).first()

    if not h2h:
        return {"p1_h2h_won": None, "p2_h2h_won": None}

    if h2h.player1_id == player1.player_id:
        return {"p1_h2h_won": h2h.p1_h2h_win, "p2_h2h_won": h2h.p2_h2h_win}
    else:
        return {"p1_h2h_won": h2h.p2_h2h_win, "p2_h2h_won": h2h.p1_h2h_win}

@router.get("/player/{nombre}/basic", 
            response_model=PlayerBasicInfo,
            summary="Obtener información básica de un jugador",
            description="Busca un jugador por nombre exacto y devuelve su información básica (nombre, edad, mano, país, rankings)")
async def obtener_player_basico(nombre: str, db: Session = Depends(get_db)):
    """
    Obtiene información básica de un jugador mediante búsqueda exacta por nombre.
    Incluye datos calculados como edad y mano formateada.
    
    Args:
        nombre: Nombre exacto del jugador a buscar
        db: Sesión de base de datos
        
    Returns:
        PlayerBasicInfo: Información básica del jugador con datos formateados
        
    Raises:
        HTTPException: Si el jugador no existe o no se puede obtener su información
    """
    player = db.query(Player).filter(Player.name == nombre).first()
    
    if not player:
        raise HTTPException(
            status_code=404,
            detail=f"Jugador '{nombre}' no encontrado. Verifique el nombre exacto."
        )
    
    info_basica = obtener_info_basica_player(db, player.player_id)
    
    if not info_basica:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno: No se pudo obtener información básica del jugador '{nombre}'"
        )
    
    return PlayerBasicInfo(**info_basica)

@router.get("/compare/{nombre1}/{nombre2}/basic", 
            response_model=Dict[str, Any],
            summary="Comparar dos jugadores por información básica",
            description="Compara información básica de dos jugadores incluyendo datos H2H")
async def comparar_jugadores_basico(
    nombre1: str, 
    nombre2: str,
    db: Session = Depends(get_db)
):
    """
    Compara dos jugadores mediante información básica y H2H.
    
    Args:
        nombre1: Nombre exacto del primer jugador
        nombre2: Nombre exacto del segundo jugador
        db: Sesión de base de datos
        
    Returns:
        Dict: Información básica de ambos jugadores con prefijos p1_ y p2_, incluyendo H2H
        
    Raises:
        HTTPException: Si algún jugador no existe o no se puede obtener su información
    """
    # Buscar ambos jugadores
    player1 = db.query(Player).filter(Player.name == nombre1).first()
    if not player1:
        raise HTTPException(
            status_code=404, 
            detail=f"Jugador '{nombre1}' no encontrado. Verifique el nombre exacto."
        )
    
    player2 = db.query(Player).filter(Player.name == nombre2).first()
    if not player2:
        raise HTTPException(
            status_code=404, 
            detail=f"Jugador '{nombre2}' no encontrado. Verifique el nombre exacto."
        )
    
    # Obtener información básica de ambos jugadores
    info_basica_j1 = obtener_info_basica_player(db, player1.player_id)
    info_basica_j2 = obtener_info_basica_player(db, player2.player_id)
    
    if not info_basica_j1:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno: No se pudo obtener información básica del jugador '{nombre1}'"
        )
    
    if not info_basica_j2:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno: No se pudo obtener información básica del jugador '{nombre2}'"
        )
    
    # Obtener información H2H
    h2h_info = obtener_h2h_info(db, player1.player_id, player2.player_id)
    
    # Construir respuesta con información básica y H2H
    return {
        # Información básica del jugador 1 con prefijo p1_
        "p1_name": info_basica_j1["name"],
        "p1_age": info_basica_j1["age"] or 0,
        "p1_hand": info_basica_j1["hand"],
        "p1_country": info_basica_j1["country"],
        "p1_actual_rank": info_basica_j1["actual_rank"] or 0,
        "p1_min_rank": info_basica_j1["min_rank"] or 0,
        "p1_image_url": info_basica_j1["image_url"],
        
        # Información básica del jugador 2 con prefijo p2_
        "p2_name": info_basica_j2["name"],
        "p2_age": info_basica_j2["age"] or 0,
        "p2_hand": info_basica_j2["hand"],
        "p2_country": info_basica_j2["country"],
        "p2_actual_rank": info_basica_j2["actual_rank"] or 0,
        "p2_min_rank": info_basica_j2["min_rank"] or 0,
        "p2_image_url": info_basica_j2["image_url"],
        
        # Información Head-to-Head
        "p1_h2h_won": h2h_info["p1_h2h_win"] or 0,
        "p2_h2h_won": h2h_info["p2_h2h_win"] or 0,
    }

@router.get("/compare/{nombre1}/{nombre2}", 
            response_model=Dict[str, Any],
            summary="Comparar rendimiento de dos jugadores",
            description="Compara información completa de dos jugadores incluyendo datos H2H y tasas específicas por superficie y tipo de torneo")
async def comparar_jugadores_exacto(
    nombre1: str, 
    nombre2: str,
    surface: str = None,  # grass, hard, clay
    tourney_type: str = None,  # G, M, A, F, D, O
    db: Session = Depends(get_db)
):
    """
    Compara dos jugadores mediante búsqueda exacta por nombre.
    Incluye tasas de victoria específicas por superficie y tipo de torneo.
    
    Args:
        nombre1: Nombre exacto del primer jugador
        nombre2: Nombre exacto del segundo jugador
        surface: Tipo de superficie (grass, hard, clay) - opcional
        tourney_type: Tipo de torneo (G, M, A, F, D, O) - opcional
        db: Sesión de base de datos
        
    Returns:
        Dict: Información completa de ambos jugadores con prefijos p1_ y p2_, incluyendo H2H y tasas específicas
        
    Raises:
        HTTPException: Si algún jugador no existe o no se puede obtener su información
    """
    # Buscar ambos jugadores
    player1 = db.query(Player).filter(Player.name == nombre1).first()
    if not player1:
        raise HTTPException(
            status_code=404, 
            detail=f"Jugador '{nombre1}' no encontrado. Verifique el nombre exacto."
        )
    
    player2 = db.query(Player).filter(Player.name == nombre2).first()
    if not player2:
        raise HTTPException(
            status_code=404, 
            detail=f"Jugador '{nombre2}' no encontrado. Verifique el nombre exacto."
        )
    
    # Obtener información completa de ambos jugadores
    info_j1 = obtener_info_completa_player(db, player1.player_id)
    info_j2 = obtener_info_completa_player(db, player2.player_id)
    
    if not info_j1:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno: No se pudo obtener información del jugador '{nombre1}'"
        )
    
    if not info_j2:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno: No se pudo obtener información del jugador '{nombre2}'"
        )
    
    # Obtener información H2H
    h2h_info = obtener_h2h_info(db, player1.player_id, player2.player_id)
    
    # Obtener tasas específicas para ambos jugadores
    tasas_j1 = obtener_tasas_especificas(info_j1, surface, tourney_type)
    tasas_j2 = obtener_tasas_especificas(info_j2, surface, tourney_type)
    
    # Calcular edad para ambos jugadores
    p1_age = 0
    if info_j1.get("date_of_birth"):
        current_year = datetime.now().year
        birth_year = info_j1["date_of_birth"].year
        p1_age = current_year - birth_year
    
    p2_age = 0
    if info_j2.get("date_of_birth"):
        current_year = datetime.now().year
        birth_year = info_j2["date_of_birth"].year
        p2_age = current_year - birth_year
    
    # Construir respuesta con el formato exacto solicitado
    return {
        "p1_age": p1_age,
        "p2_age": p2_age,
        "p1_ht": info_j1.get("height_cm") or 0,
        "p2_ht": info_j2.get("height_cm") or 0,
        "p1_hand_encoded": info_j1.get("hand") or 0,
        "p2_hand_encoded": info_j2.get("hand") or 0,
        "p1_rank": info_j1.get("actual_rank") or 0,
        "p2_rank": info_j2.get("actual_rank") or 0,
        "p1_min_rank": info_j1.get("min_rank") or 0,
        "p2_min_rank": info_j2.get("min_rank") or 0,
        "p1_pct_1stIn": info_j1.get("pct_1stin") or 0,
        "p2_pct_1stIn": info_j2.get("pct_1stin") or 0,
        "p1_pct_1stWon": info_j1.get("pct_1stwon") or 0,
        "p2_pct_1stWon": info_j2.get("pct_1stwon") or 0,
        "p1_pct_2ndWon": info_j1.get("pct_2ndwon") or 0,
        "p2_pct_2ndWon": info_j2.get("pct_2ndwon") or 0,
        "p1_pct_SvPtsWon": info_j1.get("pct_svptswon") or 0,
        "p2_pct_SvPtsWon": info_j2.get("pct_svptswon") or 0,
        "p1_pct_bpConv": info_j1.get("pct_bpconv") or 0,
        "p2_pct_bpConv": info_j2.get("pct_bpconv") or 0,
        "p1_pct_bpSaved": info_j1.get("pct_bpsaved") or 0,
        "p2_pct_bpSaved": info_j2.get("pct_bpsaved") or 0,
        "p1_pct_1stRetPtsWon": info_j1.get("pct_1stretptswon") or 0,
        "p2_pct_1stRetPtsWon": info_j2.get("pct_1stretptswon") or 0,
        "p1_pct_2ndRetPtsWon": info_j1.get("pct_2ndretptswon") or 0,
        "p2_pct_2ndRetPtsWon": info_j2.get("pct_2ndretptswon") or 0,
        "p1_h2h_won": h2h_info["p1_h2h_win"] or 0,
        "p2_h2h_won": h2h_info["p2_h2h_win"] or 0,
        "p1_recPerf": info_j1.get("recperf") or 0,
        "p2_recPerf": info_j2.get("recperf") or 0,
        "p1_surface_wRate": tasas_j1["surface_wRate"] or 0,
        "p2_surface_wRate": tasas_j2["surface_wRate"] or 0,
        "p1_tourney_wRate": tasas_j1["tourney_wRate"] or 0,
        "p2_tourney_wRate": tasas_j2["tourney_wRate"] or 0
    }

def crear_match_completo(match: Match, info_j1: Dict[str, Any], info_j2: Dict[str, Any], h2h_info: Dict[str, Any]) -> MatchCompleto:
    """
    Crea un objeto MatchCompleto con toda la información de jugadores y H2H.
    
    Args:
        match: Objeto Match de la base de datos
        info_j1: Información completa del jugador 1
        info_j2: Información completa del jugador 2
        h2h_info: Información Head-to-Head
        
    Returns:
        MatchCompleto: Match con información completa de ambos jugadores
    """
    return MatchCompleto(
        match_id=match.match_id,
        snapshot_date=match.snapshot_date,
        tourney_name=match.tourney_name,
        tourney_tipe=match.tourney_tipe,
        surface=match.surface,
        p1_h2h_win=h2h_info["p1_h2h_win"],
        p2_h2h_win=h2h_info["p2_h2h_win"],
        
        # Información del jugador 1 con prefijo p1_
        p1_player_id=info_j1["player_id"],
        p1_name=info_j1["name"],
        p1_country=info_j1["country"],
        p1_date_of_birth=info_j1["date_of_birth"],
        p1_height_cm=info_j1["height_cm"],
        p1_hand=info_j1["hand"],
        p1_actual_rank=info_j1.get("actual_rank"),
        p1_min_rank=info_j1.get("min_rank"),
        p1_grass_winrt=info_j1.get("grass_winrt"),
        p1_hard_winrt=info_j1.get("hard_winrt"),
        p1_clay_winrt=info_j1.get("clay_winrt"),
        p1_g_winrt=info_j1.get("g_winrt"),
        p1_a_winrt=info_j1.get("a_winrt"),
        p1_d_winrt=info_j1.get("d_winrt"),
        p1_m_winrt=info_j1.get("m_winrt"),
        p1_f_winrt=info_j1.get("f_winrt"),
        p1_o_winrt=info_j1.get("o_winrt"),
        p1_pct_1stin=info_j1.get("pct_1stin"),
        p1_pct_1stwon=info_j1.get("pct_1stwon"),
        p1_pct_2ndwon=info_j1.get("pct_2ndwon"),
        p1_pct_svptswon=info_j1.get("pct_svptswon"),
        p1_pct_bpconv=info_j1.get("pct_bpconv"),
        p1_pct_bpsaved=info_j1.get("pct_bpsaved"),
        p1_pct_1stretptswon=info_j1.get("pct_1stretptswon"),
        p1_pct_2ndretptswon=info_j1.get("pct_2ndretptswon"),
        p1_recperf=info_j1.get("recperf"),
        
        # Información del jugador 2 con prefijo p2_
        p2_player_id=info_j2["player_id"],
        p2_name=info_j2["name"],
        p2_country=info_j2["country"],
        p2_date_of_birth=info_j2["date_of_birth"],
        p2_height_cm=info_j2["height_cm"],
        p2_hand=info_j2["hand"],
        p2_actual_rank=info_j2.get("actual_rank"),
        p2_min_rank=info_j2.get("min_rank"),
        p2_grass_winrt=info_j2.get("grass_winrt"),
        p2_hard_winrt=info_j2.get("hard_winrt"),
        p2_clay_winrt=info_j2.get("clay_winrt"),
        p2_g_winrt=info_j2.get("g_winrt"),
        p2_a_winrt=info_j2.get("a_winrt"),
        p2_d_winrt=info_j2.get("d_winrt"),
        p2_m_winrt=info_j2.get("m_winrt"),
        p2_f_winrt=info_j2.get("f_winrt"),
        p2_o_winrt=info_j2.get("o_winrt"),
        p2_pct_1stin=info_j2.get("pct_1stin"),
        p2_pct_1stwon=info_j2.get("pct_1stwon"),
        p2_pct_2ndwon=info_j2.get("pct_2ndwon"),
        p2_pct_svptswon=info_j2.get("pct_svptswon"),
        p2_pct_bpconv=info_j2.get("pct_bpconv"),
        p2_pct_bpsaved=info_j2.get("pct_bpsaved"),
        p2_pct_1stretptswon=info_j2.get("pct_1stretptswon"),
        p2_pct_2ndretptswon=info_j2.get("pct_2ndretptswon"),
        p2_recperf=info_j2.get("recperf"),
    )

def obtener_info_jugador_fallback(player_id: int) -> Dict[str, Any]:
    """
    Proporciona información básica de fallback cuando no se encuentra un jugador.
    
    Args:
        player_id: ID del jugador
        
    Returns:
        Dict con información básica por defecto
    """
    return {
        "player_id": player_id,
        "name": f"Player {player_id}",
        "country": None,
        "date_of_birth": None,
        "height_cm": None,
        "hand": None,
    }

@router.get("/matches", 
            response_model=Dict[str, Any],
            summary="Obtener partidos futuros",
            description="Obtiene partidos con información básica. Usa /compare para obtener información detallada de jugadores específicos")
async def obtener_partidos_futuros(db: Session = Depends(get_db)):
    """
    Obtiene partidos de la base de datos con información básica.
    Para obtener información detallada de los jugadores, usa el endpoint /compare.
    
    NOTA: En el futuro, cuando tengas más registros, descomenta las líneas marcadas
    para filtrar solo partidos posteriores a la fecha actual.
    
    Args:
        db: Sesión de base de datos
        
    Returns:
        Dict: Lista de partidos con información básica y total de partidos
        
    Raises:
        HTTPException: Si no se encuentran partidos en la base de datos
    """
    # TODO: descomentar estas líneas para filtrar partidos futuros
    # from datetime import date
    # today = date.today()
    # matches = db.query(Match).filter(Match.snapshot_date > today).all()
    
    # Por ahora, obtener todos los partidos (comentar esta línea cuando actives el filtro de fecha)
    matches = db.query(Match).all()
    
    if not matches:
        raise HTTPException(
            status_code=404,
            detail="No se encontraron partidos en la base de datos"
        )
    
    partidos_basicos = []
    
    for match in matches:
        # Obtener nombres de los jugadores
        player1 = db.query(Player).filter(Player.player_id == match.player1_id).first()
        player2 = db.query(Player).filter(Player.player_id == match.player2_id).first()
        
        partido_basico = {
            "snapshot_date": match.snapshot_date.isoformat() if match.snapshot_date else None,
            "player1_name": player1.name if player1 else f"Player {match.player1_id}",
            "player2_name": player2.name if player2 else f"Player {match.player2_id}",
            "tourney_name": match.tourney_name,
            "tourney_type": match.tourney_tipe,
            "surface": match.surface
        }
        partidos_basicos.append(partido_basico)
    
    return {
        "total_matches": len(partidos_basicos),
        "matches": partidos_basicos
    }
