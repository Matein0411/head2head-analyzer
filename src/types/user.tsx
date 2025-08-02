import type { User as FirebaseUser } from "firebase/auth";

/**
 * Representa el perfil del usuario como se guarda en tu base de datos PostgreSQL
 * y como lo devuelve tu API.
 */
export interface UserProfile {
  firebase_uid: string;
  email: string;
  display_name: string | null;
  photo_url: string | null;
  credits: number;
  created_at: string; // Las fechas se suelen recibir como strings en formato ISO
  updated_at: string;
}

export interface CreditUpdate {
  firebase_uid: string;
  new_credits: number;
  // Aquí irían los resultados de la predicción
  // winner: string;
  // probability: number;
}

/**
 * Define la forma del valor proporcionado por tu AuthContext.
 */
export interface AuthContextType {
  user: FirebaseUser | null; // El objeto de usuario directamente de Firebase Auth
  isLoading: boolean;
  logout: () => Promise<void>;
}