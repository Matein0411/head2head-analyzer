import Coin from "@/components/icons/Coin";
import { useEffect, useState } from "react";

interface CreditNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  credits: number;
}

const CreditNotification = ({ isVisible, onClose, credits }: CreditNotificationProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true);
      // Auto cerrar después de 4 segundos
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div 
        className={`bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 max-w-md w-full mx-4 text-center border-2 border-yellow-200 shadow-2xl transform transition-all duration-500 ${
          showAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Animación de monedas flotantes */}
        <div className="relative mb-6">
          <div className="flex justify-center items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`absolute animate-bounce`}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  left: `${20 + i * 15}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <Coin size={32} className="drop-shadow-lg" />
              </div>
            ))}
          </div>
          {/* Espacio para las monedas */}
          <div className="h-12"></div>
        </div>

        {/* Título principal */}
        <h2 className="text-3xl font-bold text-yellow-800 mb-2">
          ¡Felicidades! 🎉
        </h2>
        
        {/* Mensaje de créditos */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl p-4 mb-4 shadow-lg">
          <p className="text-lg font-semibold mb-1">Has obtenido</p>
          <div className="flex items-center justify-center gap-2">
            <Coin size={28} />
            <span className="text-2xl font-bold">{credits}</span>
            <span className="text-lg">créditos</span>
          </div>
        </div>

        {/* Mensaje adicional */}
        <p className="text-gray-600 text-sm mb-6">
          Ahora puedes usar estos créditos para realizar predicciones de tenis con IA
        </p>

        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
        >
          ¡Entendido!
        </button>

        {/* Partículas decorativas */}
        <div className="absolute top-4 left-4 text-yellow-400 animate-pulse">✨</div>
        <div className="absolute top-6 right-6 text-orange-400 animate-pulse" style={{ animationDelay: '0.5s' }}>💫</div>
        <div className="absolute bottom-6 left-6 text-yellow-500 animate-pulse" style={{ animationDelay: '1s' }}>⭐</div>
        <div className="absolute bottom-4 right-4 text-orange-500 animate-pulse" style={{ animationDelay: '1.5s' }}>✨</div>
      </div>
    </div>
  );
};

export default CreditNotification;
