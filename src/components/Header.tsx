import { useAuth } from "@/context/AuthContext";
import { UserCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function Header() {
  const { user, isLoading } = useAuth();

  return (
    <header className="bg-black/60 backdrop-blur-md border-b border-gray-700 sticky top-0 z-30 transition-all duration-300 shadow-sm text-white">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <img src="/tennis-icon.png" alt="Logo TennAI" className="w-12 h-12 object-contain" />
              <div>
                <div className="text-2xl font-bold">TennAI</div>
                <div className="text-xs text-gray-400">la ia a tu alcance</div>
              </div>
            </Link>

            <div className="flex gap-7 ml-6">
              <Link to="/" className="text-base text-gray-300 hover:text-white font-medium">Información</Link>
              <Link to="/Predict" className="text-base text-gray-300 hover:text-white font-medium">Predecir</Link>
              <Link to="/jugadores" className="text-base text-gray-300 hover:text-white font-medium">Jugadores</Link>
            </div>
          </div>
          
          <div className="flex items-center">
            {isLoading ? (
              // Muestra un placeholder mientras carga para evitar parpadeos
              <div className="w-24 h-10 bg-gray-700 rounded-full animate-pulse"></div>
            ) : user ? (
              <LogoutButton />
            ) : (
              <Link
                to="/Login"
                className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2"
                aria-label="Log in"
              >
                <UserCircle2 size={28} className="text-white" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};