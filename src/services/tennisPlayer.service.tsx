import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Mapeos para traducir los datos de la UI al formato de la API de comparación
const tourneyTypeMapping: Record<string, string> = {
  "ATP 250": "A",
  "ATP 500": "M",
  "ATP 1000": "B",
  "Grand Slam": "G",
  "Challenger": "C",
  "Future": "F",
};

const surfaceMapping: Record<string, string> = {
  "Grass": "grass",
  "Hard": "hard",
  "Clay": "clay",
  "Carpet": "carpet",
};

/**
 * Obtiene la comparación  entre dos jugadores para una superficie y tipo de torneo.
 */
const getComparisonBasic = async (
  player1: string,
  player2: string,
  surface: string,
  tourneyType: string
): Promise<any> => {
  try {
    const encodedPlayer1 = encodeURIComponent(player1);
    const encodedPlayer2 = encodeURIComponent(player2);
    const mappedSurface = surfaceMapping[surface] || surface;
    const mappedTourneyType = tourneyTypeMapping[tourneyType] || tourneyType;
    const response = await axios.get(
      `${API_URL}/players/compare/${encodedPlayer1}/${encodedPlayer2}`,
      { params: { surface: mappedSurface, type_tourney: mappedTourneyType } }
    );
    return response.data;
  } catch (error) {
    console.error(`Error al obtener comparación:`, error);
    throw error;
  }
};

import type { NextMatch, Player, SimpleH2HStats } from "../types/player";

/**
 * Busca un jugador de tenis por su nombre.
 * @param playerName - El nombre completo del jugador a buscar.
 * @returns Una promesa que resuelve con los datos del jugador.
 */
const getPlayerByName = async (playerName: string): Promise<Player> => {
  try {
    const encodedPlayerName = encodeURIComponent(playerName);
    
    const response = await axios.get<Player>(`${API_URL}/players/player/${encodedPlayerName}/basic`);    
    return response.data;

  } catch (error) {
    console.error(`Error al buscar al jugador "${playerName}":`, error);
    
    throw error;
  }
};

// ...existing code...

/**
 * Obtiene el H2H simple entre dos jugadores.
 * @param player1 Nombre del primer jugador
 * @param player2 Nombre del segundo jugador
 */
const getSimpleH2HStats = async (
  player1: string,
  player2: string
): Promise<SimpleH2HStats> => {
  try {
    const encodedPlayer1 = encodeURIComponent(player1);
    const encodedPlayer2 = encodeURIComponent(player2);
    const response = await axios.get<SimpleH2HStats>(
      `${API_URL}/players/h2h/${encodedPlayer1}/${encodedPlayer2}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error al obtener H2H simple:`, error);
    throw error;
  }
};


const getNextMatches = async (): Promise<NextMatch[]> => {
  try {
    const response = await axios.get(`${API_URL}/players/matches`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener partidos próximos:", error);
    throw error;
  }
}


export const tennisPlayerService = {
  getPlayerByName,
  getSimpleH2HStats,
  getComparisonBasic,
  getNextMatches,
};  


