# app/models.py
from sqlalchemy import Column, Integer, String, Float, DateTime, Date, Boolean, Text, DECIMAL, VARCHAR, ForeignKey
from sqlalchemy.orm import relationship
from app.dependencies.database import Base

class Player(Base):
    __tablename__ = "players"
    
    player_id = Column(Integer, primary_key=True, index=True)
    name = Column(VARCHAR(255), nullable=False, index=True)
    country = Column(VARCHAR(3))
    date_of_birth = Column(Date)
    height_cm = Column(Integer)
    hand = Column(Integer)
    image_url = Column(Text)
    
    # Relaciones
    estadisticas = relationship("PlayerStadistics", back_populates="player")
    matches_as_p1 = relationship("Match", foreign_keys="Match.player1_id", back_populates="player1")
    matches_as_p2 = relationship("Match", foreign_keys="Match.player2_id", back_populates="player2")
    h2h_as_p1 = relationship("H2H", foreign_keys="H2H.player1_id", back_populates="player1")
    h2h_as_p2 = relationship("H2H", foreign_keys="H2H.player2_id", back_populates="player2")

class PlayerStadistics(Base):
    __tablename__ = "player_stadistics"
    
    stat_id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("players.player_id", ondelete="CASCADE"), nullable=False, index=True)
    snapshot_date = Column(Date, nullable=False)
    actual_rank = Column(Integer)
    min_rank = Column(Integer)
    grass_winrt = Column(DECIMAL(5,3))
    hard_winrt = Column(DECIMAL(5,3))
    clay_winrt = Column(DECIMAL(5,3))
    g_winrt = Column(DECIMAL(5,3))
    a_winrt = Column(DECIMAL(5,3))
    d_winrt = Column(DECIMAL(5,3))
    m_winrt = Column(DECIMAL(5,3))
    f_winrt = Column(DECIMAL(5,3))
    o_winrt = Column(DECIMAL(5,3))
    pct_1stin = Column(DECIMAL(5,3))
    pct_1stwon = Column(DECIMAL(5,3))
    pct_2ndwon = Column(DECIMAL(5,3))
    pct_svptswon = Column(DECIMAL(5,3))
    pct_bpconv = Column(DECIMAL(5,3))
    pct_bpsaved = Column(DECIMAL(5,3))
    pct_1stretptswon = Column(DECIMAL(5,3))
    pct_2ndretptswon = Column(DECIMAL(5,3))
    recperf = Column(DECIMAL(5,3))
    
    # Relación
    player = relationship("Player", back_populates="estadisticas")

class Match(Base):
    __tablename__ = "matches"
    
    match_id = Column(Integer, primary_key=True, index=True)
    snapshot_date = Column(Date, nullable=False)
    tourney_name = Column(VARCHAR(255))
    tourney_tipe = Column(VARCHAR(100))
    surface = Column(VARCHAR(50))
    player1_id = Column(Integer, ForeignKey("players.player_id"), nullable=False, index=True)
    player2_id = Column(Integer, ForeignKey("players.player_id"), nullable=False, index=True)
    
    # Relaciones
    player1 = relationship("Player", foreign_keys=[player1_id], back_populates="matches_as_p1")
    player2 = relationship("Player", foreign_keys=[player2_id], back_populates="matches_as_p2")

class H2H(Base):
    __tablename__ = "h2h"
    
    h2h_id = Column(Integer, primary_key=True, index=True)
    snapshot_date = Column(Date, nullable=False)
    player1_id = Column(Integer, ForeignKey("players.player_id", ondelete="CASCADE"), nullable=False, index=True)
    player2_id = Column(Integer, ForeignKey("players.player_id", ondelete="CASCADE"), nullable=False, index=True)
    p1_h2h_win = Column(Integer)
    p2_h2h_win = Column(Integer)
    
    # Relaciones
    player1 = relationship("Player", foreign_keys=[player1_id], back_populates="h2h_as_p1")
    player2 = relationship("Player", foreign_keys=[player2_id], back_populates="h2h_as_p2")


# Modelo para la tabla users
class User(Base):
    __tablename__ = "users"

    firebase_uid = Column(VARCHAR(255), primary_key=True, index=True)
    email = Column(VARCHAR(255), unique=True, nullable=False, index=True)
    display_name = Column(VARCHAR(255))
    photo_url = Column(Text)
    auth_provider = Column(VARCHAR(50), nullable=False)
    credits = Column(Integer, nullable=False, default=100)
    created_at = Column(DateTime(timezone=True), nullable=False)
    updated_at = Column(DateTime(timezone=True), nullable=False)