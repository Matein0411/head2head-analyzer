import { useUserProfile } from "@/context/UserProfileContext";
import { Coins } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function UserCredits() {
  const { profile, isLoading, error } = useUserProfile();
  const [showAnimation, setShowAnimation] = useState(false);
  const [creditDiff, setCreditDiff] = useState<number>(0);
  const previousCreditsRef = useRef<number | null>(null);

  // Detectar cambios solo cuando hay una diferencia real
  useEffect(() => {
    if (profile?.credits !== undefined) {
      const currentCredits = profile.credits;
      const previous = previousCreditsRef.current;
      
      // Solo animar si hay un cambio real y los créditos bajaron
      if (previous !== null && currentCredits < previous) {
        const diff = currentCredits - previous;
        setCreditDiff(diff);
        setShowAnimation(true);
        
        setTimeout(() => {
          setShowAnimation(false);
        }, 1500);
      }
      
      previousCreditsRef.current = currentCredits;
    }
  }, [profile?.credits]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-white">
        <Coins size={20} className="text-yellow-500" />
        <div className="w-8 h-4 bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error || !profile) {
    return null;
  }

  return (
    <div className="relative flex items-center gap-2 text-white">
      <Coins 
        size={20} 
        className={`text-yellow-500 transition-all duration-300 ${
          showAnimation ? 'scale-125 rotate-12' : ''
        }`} 
      />
      <span 
        className={`font-medium transition-all duration-300 ${
          showAnimation ? 'text-red-400 scale-110' : 'text-white'
        }`}
      >
        {profile.credits}
      </span>
      
      {/* Animación de créditos restados */}
      {showAnimation && (
        <div 
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 pointer-events-none animate-pulse"
        >
          <span className="text-red-400 text-sm font-bold">
            {creditDiff}
          </span>
        </div>
      )}
    </div>
  );
}
