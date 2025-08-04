import { useAuth } from "@/context/AuthContext";
import { tennisPlayerService } from "@/services/tennisPlayer.service";
import type { UserProfile } from "@/types/user";
import { createContext, useContext, useEffect, useState } from "react";

interface UserProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateCredits: (newCredits: number) => void;
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

export const UserProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user || authLoading) {
      setProfile(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const userProfile = await tennisPlayerService.getProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error("Error al obtener el perfil del usuario:", error);
      setError("Error al cargar los datos del usuario");
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user, authLoading]);

  const updateCredits = (newCredits: number) => {
    if (profile) {
      const updatedProfile = {
        ...profile,
        credits: newCredits
      };
      setProfile(updatedProfile);
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  const value = {
    profile,
    isLoading: authLoading || isLoading,
    error,
    updateCredits,
    refreshProfile,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};
