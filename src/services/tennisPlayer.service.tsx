import { auth } from "@/lib/firebase";
import axios from 'axios';
import type { NextMatch, Player, SimpleH2HStats } from "../types/player";
import type { CreditUpdate, UserProfile } from "../types/user";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Usuario no autenticado para realizar esta acción.");
  }
  const token = await user.getIdToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

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


/**
 * Sincroniza el usuario de Firebase con la base de datos del backend.
 * Se debe llamar después de un login/registro exitoso.
 */
const syncUser = async (): Promise<UserProfile> => {
  try {
    const config = await getAuthHeaders();
    const response = await axios.post(`${API_URL}/users/auth/sync`, {}, config); 
    return response.data;
  } catch (error) {
    console.error("Error al sincronizar el usuario:", error);
    throw error;
  }
};

/**
 * Obtiene el perfil del usuario actualmente logueado desde el backend.
 */
const getProfile = async (): Promise<UserProfile> => {
  try {
    const config = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/users/me`, config);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    throw error;
  }
};

/**
 * Envía una petición para realizar una predicción, descontando créditos.
 */
const updateCredit = async (data: CreditUpdate): Promise<CreditUpdate> => {
  try {
    const config = await getAuthHeaders();
    const response = await axios.post(`${API_URL}/users/predict`, data, config);
    return response.data;
  } catch (error) {
    console.error("Error al realizar la predicción:", error);
    throw error;
  }
};


export const tennisPlayerService = {
  // Funciones públicas
  getPlayerByName,
  getSimpleH2HStats,
  getComparisonBasic,
  getNextMatches,
  // Funciones seguras
  syncUser,
  getProfile,
  updateCredit,
};

