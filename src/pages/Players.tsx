import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { tennisPlayerService } from "@/services/tennisPlayer.service";
import { AlertTriangle, Search, TrendingUp, Trophy, User } from "lucide-react";
import { useState } from "react";
import { toast as sonnerToast } from "sonner";
import type { Player } from "@/types/player";

const Players = () => {
  const [playerName, setPlayerName] = useState("");
  const [playerData, setPlayerData] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!playerName.trim()) {
      sonnerToast.error(
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
          <div>
            <div className="flex items-center gap-2 text-yellow-700 text-base font-bold">
              Nombre requerido
            </div>
            <div className="text-muted-foreground">
              Por favor ingresa el nombre de un jugador.
            </div>
          </div>
        </div>
      );
      return;
    }

    setLoading(true);
    setSearched(true);
    
    try {
      const response = await tennisPlayerService.getPlayerByName(playerName.trim());
      setPlayerData(response);
      sonnerToast.success(
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-green-500 shrink-0" />
          <div>
            <div className="flex items-center gap-2 text-green-700 text-base font-bold">
              Jugador encontrado
            </div>
            <div className="text-muted-foreground">
              Estadísticas de {response.name} cargadas exitosamente
            </div>
          </div>
        </div>
      );
    } catch (error) {
      setPlayerData(null);
      sonnerToast.error(
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
          <div>
            <div className="flex items-center gap-2 text-red-700 text-base font-bold">
              Jugador no encontrado
            </div>
            <div className="text-muted-foreground">
              No se pudo encontrar información del jugador "{playerName}".
            </div>
          </div>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  const getHandText = (hand: string) => {
    if (hand === 'R' || hand === 'Right-Handed') return "Diestro";
    if (hand === 'L' || hand === 'Left-Handed') return "Zurdo";
    return hand;
  };
  
  const getCountryFlag = (country: string) => {
    // Simulamos banderas con emojis comunes
    const flags: { [key: string]: string } = {
      'ESP': '🇪🇸',
      'SRB': '🇷🇸', 
      'USA': '🇺🇸',
      'FRA': '🇫🇷',
      'GER': '🇩🇪',
      'ITA': '🇮🇹',
      'ARG': '🇦🇷',
      'BRA': '🇧🇷',
      'RUS': '🇷🇺',
      'GBR': '🇬🇧',
      'SUI': '🇨🇭',
      'AUS': '🇦🇺',
      'CAN': '🇨🇦',
      'JPN': '🇯🇵'
    };
    return flags[country] || '🌍';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-secondary">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground drop-shadow-2xl mb-6 animate-fade-in">
            <span className="text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text">
              Estadísticas de Jugadores
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in leading-relaxed" style={{ animationDelay: '200ms' }}>
            Descubre información detallada y estadísticas completas de tus jugadores favoritos de tenis.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-2xl p-8 border border-slate-600/40">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Ingresa el nombre del jugador (ej: Carlos Alcaraz)"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-4 py-4 bg-black/20 border-2 border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400 text-lg"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Buscando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Search className="w-5 h-5" />
                    Buscar Jugador
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Player Data Section */}
        {searched && !loading && (
          playerData ? (
            <div className="max-w-6xl mx-auto">
              {/* Player Info Card */}
              <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/90 rounded-2xl p-8 shadow-2xl border border-slate-600/40 mb-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border-4 border-blue-400/50">
                    <User className="w-16 h-16 md:w-24 md:h-24 text-blue-400" />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {playerData.name}
                    </h2>
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                      <span className="text-2xl">{getCountryFlag(playerData.country)}</span>
                      <span className="text-xl text-slate-300">{playerData.country}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                      <div className="bg-slate-600/30 rounded-lg p-3">
                        <div className="text-2xl font-bold text-blue-400">#{playerData.actual_rank}</div>
                        <div className="text-sm text-slate-400">Ranking Actual</div>
                      </div>
                      <div className="bg-slate-600/30 rounded-lg p-3">
                        <div className="text-2xl font-bold text-green-400">#{playerData.min_rank}</div>
                        <div className="text-sm text-slate-400">Mejor Ranking</div>
                      </div>
                      <div className="bg-slate-600/30 rounded-lg p-3">
                        <div className="text-2xl font-bold text-orange-400">{playerData.age}</div>
                        <div className="text-sm text-slate-400">Años</div>
                      </div>
                      <div className="bg-slate-600/30 rounded-lg p-3">
                        <div className="text-2xl font-bold text-purple-400">{playerData.height}</div>
                        <div className="text-sm text-slate-400">Altura</div>
                      </div>
                      <div className="bg-slate-600/30 rounded-lg p-3">
                        <div className="text-2xl font-bold text-yellow-400">{getHandText(playerData.hand)}</div>
                        <div className="text-sm text-slate-400">Mano</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Player Information */}
                <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/90 rounded-2xl p-6 shadow-2xl border border-slate-600/40">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-blue-400" />
                    Información del Jugador
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-slate-600/30 rounded-xl">
                      <span className="font-semibold text-white">🌍 País</span>
                      <span className="text-xl font-bold text-blue-400">{playerData.country}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-600/30 rounded-xl">
                      <span className="font-semibold text-white">🎾 Mano Dominante</span>
                      <span className="text-xl font-bold text-green-400">{getHandText(playerData.hand)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-600/30 rounded-xl">
                      <span className="font-semibold text-white">📏 Altura</span>
                      <span className="text-xl font-bold text-purple-400">{playerData.height}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-600/30 rounded-xl">
                      <span className="font-semibold text-white">🎂 Edad</span>
                      <span className="text-xl font-bold text-yellow-400">{playerData.age} años</span>
                    </div>
                  </div>
                </div>

                {/* Ranking History */}
                <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/90 rounded-2xl p-6 shadow-2xl border border-slate-600/40">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    Historial de Rankings
                  </h3>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-gradient-to-r from-blue-600/30 to-blue-800/30 rounded-xl border border-blue-400/30">
                      <div className="text-4xl font-bold text-blue-400 mb-2">
                        #{playerData.actual_rank}
                      </div>
                      <div className="text-lg text-slate-300">Ranking Actual ATP</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-r from-green-600/30 to-green-800/30 rounded-xl border border-green-400/30">
                      <div className="text-4xl font-bold text-green-400 mb-2">
                        #{playerData.min_rank}
                      </div>
                      <div className="text-lg text-slate-300">Mejor Ranking de Carrera</div>
                    </div>
                  </div>
                </div>

                {/* Coming Soon - Statistics */}
                <div className="lg:col-span-2 bg-gradient-to-br from-purple-700/80 to-purple-800/90 rounded-2xl p-8 shadow-2xl border border-purple-600/40">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                    Estadísticas Detalladas
                  </h3>
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">📊</div>
                    <h4 className="text-2xl font-bold text-white mb-2">Próximamente</h4>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                      Las estadísticas detalladas de superficie, torneos, servicio y devolución 
                      estarán disponibles muy pronto. ¡Mantente al tanto!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/90 rounded-2xl p-12 shadow-2xl border border-slate-600/40 max-w-md mx-auto">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-2">Jugador no encontrado</h3>
                <p className="text-slate-400">
                  No se pudo encontrar información del jugador "{playerName}". 
                  Verifica que el nombre esté escrito correctamente.
                </p>
              </div>
            </div>
          )
        )}
      </div>

      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 1s ease forwards;
            opacity: 0;
          }
          @keyframes fadeIn {
            to { opacity: 1; }
          }
        `}
      </style>

      <Footer />
    </div>
  );
};

export default Players;