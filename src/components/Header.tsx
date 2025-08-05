import { useAuth } from "@/context/AuthContext";
import { Menu, UserCircle2, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import UserCredits from "./UserCredits";

export default function Header() {
  const { user, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-black/60 backdrop-blur-md border-b border-gray-700 sticky top-0 z-[100] transition-all duration-300 shadow-sm text-white">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <img src="/tennis-icon.png" alt="Logo TennAI" className="w-12 h-12 object-contain" />
              <div>
                <div className="text-2xl font-bold">TennAI</div>
                <div className="text-xs text-gray-400">la IA a tu alcance</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-7 ml-6">
              <Link to="/" className="text-base text-gray-300 hover:text-white font-medium">Información</Link>
              <Link to="/Predict" className="text-base text-gray-300 hover:text-white font-medium">Predecir</Link>
              <Link to="/jugadores" className="text-base text-gray-300 hover:text-white font-medium">Jugadores</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* User Credits - Always visible when user is logged in */}
            {!isLoading && user && <UserCredits />}
            
            {isLoading ? (
              // Muestra un placeholder mientras carga para evitar parpadeos
              <div className="flex items-center gap-4">
                <div className="w-16 h-8 bg-gray-700 rounded animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            ) : user ? (
              <>
                {/* Desktop Logout Button */}
                <div className="hidden md:block">
                  <LogoutButton />
                </div>
                {/* Mobile Menu Button */}
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2"
                  aria-label="Toggle mobile menu"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Link
                  to="/Login"
                  className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2"
                  aria-label="Log in"
                >
                  <UserCircle2 size={28} className="text-white" />
                </Link>
                {/* Mobile Menu Button for non-logged users */}
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2"
                  aria-label="Toggle mobile menu"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-700">
            <div className="flex flex-col space-y-3 pt-4">
              <Link 
                to="/" 
                className="text-base text-gray-300 hover:text-white font-medium py-2 px-2 rounded hover:bg-gray-700/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Información
              </Link>
              <Link 
                to="/Predict" 
                className="text-base text-gray-300 hover:text-white font-medium py-2 px-2 rounded hover:bg-gray-700/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Predecir
              </Link>
              <Link 
                to="/jugadores" 
                className="text-base text-gray-300 hover:text-white font-medium py-2 px-2 rounded hover:bg-gray-700/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Jugadores
              </Link>
              
              {/* Mobile Logout Button - Only show when user is logged in */}
              {!isLoading && user && (
                <div className="pt-2 border-t border-gray-700">
                  <LogoutButton />
                </div>
              )}

              {/* Mobile Login Link - Only show when user is not logged in */}
              {!isLoading && !user && (
                <Link 
                  to="/Login" 
                  className="text-base text-gray-300 hover:text-white font-medium py-2 px-2 rounded hover:bg-gray-700/50 transition-colors border-t border-gray-700 pt-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};