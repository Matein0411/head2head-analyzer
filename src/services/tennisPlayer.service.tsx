
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface Player {
  name: string;
  age: number;
  hand: string;
  country: string;
  actual_rank: number;
  min_rank: number;
  image_url: string;
}

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

export const tennisPlayerService = {
  getPlayerByName,
};