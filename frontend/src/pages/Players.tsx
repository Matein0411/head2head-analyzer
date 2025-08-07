import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { tennisPlayerService } from "@/services/tennisPlayer.service";
import type { Player, PlayerStats } from "@/types/player";
import { AlertTriangle, Search, Shield, TrendingUp, Trophy, User, Zap } from "lucide-react";
import { useState } from "react";
import { toast as sonnerToast } from "sonner";

const Players = () => {
  const [playerName, setPlayerName] = useState("");
  const [playerData, setPlayerData] = useState<Player | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
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
      // Obtener información básica del jugador
      const basicResponse = await tennisPlayerService.getPlayerByName(playerName.trim());
      setPlayerData(basicResponse);
      
      // Obtener estadísticas detalladas del jugador
      const statsResponse = await tennisPlayerService.getPlayerStats(playerName.trim());
      setPlayerStats(statsResponse);
      
    } catch (error) {
      setPlayerData(null);
      setPlayerStats(null);
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

  const getHandText = (hand: string | number) => {
    if (hand === 'R' || hand === 'Right-Handed' || hand === 1) return "Diestro";
    if (hand === 'L' || hand === 'Left-Handed' || hand === 0) return "Zurdo";
    return hand.toString();
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

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-background via-card to-background py-8 md:py-12 mb-6 md:mb-8 relative overflow-hidden rounded-lg">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-repeat" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(66, 133, 244, 0.1) 10px, rgba(66, 133, 244, 0.1) 20px)` }}></div>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-b from-gray-200 to-white bg-clip-text text-transparent text-center">
              ESTADÍSTICAS DE JUGADORES
            </h1>
            <p className="text-sm md:text-base text-gray-400 mt-2 text-center max-w-md">
              Descubre información detallada y estadísticas completas de tus jugadores favoritos de tenis
            </p>
          </div>
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
                  <div className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border-4 border-blue-400/50 overflow-hidden">
                    {playerData.image_url ? (
                      <img 
                        src={playerData.image_url} 
                        alt={`Foto de ${playerData.name}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Si la imagen falla al cargar, mostrar el ícono por defecto
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <User className={`w-16 h-16 md:w-24 md:h-24 text-blue-400 ${playerData.image_url ? 'hidden' : ''}`} />
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
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                    Información del Jugador
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl border-l-4 border-blue-500">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-blue-400 text-lg">🌍</span>
                        </div>
                        <span className="font-medium text-gray-200">País</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-400">
                          {playerData.country}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-transparent rounded-xl border-l-4 border-green-500">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-green-400 text-lg">🎾</span>
                        </div>
                        <span className="font-medium text-gray-200">Mano Dominante</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-400">
                          {getHandText(playerData.hand)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-transparent rounded-xl border-l-4 border-purple-500">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-purple-400 text-lg">📏</span>
                        </div>
                        <span className="font-medium text-gray-200">Altura</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-purple-400">
                          {playerData.height}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-xl border-l-4 border-yellow-500">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-yellow-400 text-lg">🎂</span>
                        </div>
                        <span className="font-medium text-gray-200">Edad</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-yellow-400">
                          {playerData.age} años
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ranking History */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                    </div>
                    Historial de Rankings
                  </h3>
                  <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl border border-blue-500/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-blue-400 text-lg">🏆</span>
                        </div>
                        <span className="text-sm font-medium text-gray-300">Ranking Actual ATP</span>
                      </div>
                      <div className="text-4xl font-bold text-blue-400 mb-1">
                        #{playerData.actual_rank}
                      </div>
                      <div className="text-xs text-gray-400">Posición Actual</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl border border-green-500/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-green-400 text-lg">⭐</span>
                        </div>
                        <span className="text-sm font-medium text-gray-300">Mejor Ranking de Carrera</span>
                      </div>
                      <div className="text-4xl font-bold text-green-400 mb-1">
                        #{playerData.min_rank}
                      </div>
                      <div className="text-xs text-gray-400">Máximo Histórico</div>
                    </div>
                  </div>
                </div>

                {/* Statistics Grid - Surface Performance */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    Rendimiento por Superficie
                  </h3>
                  {playerStats ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-transparent rounded-xl border-l-4 border-green-500">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-green-400 text-lg">🌱</span>
                          </div>
                          <span className="font-medium text-gray-200">Césped</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-400">
                            {formatPercentage(playerStats.grass_winrt)}
                          </div>
                          <div className="text-xs text-gray-400">Win Rate</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl border-l-4 border-blue-500">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-blue-400 text-lg">🏟️</span>
                          </div>
                          <span className="font-medium text-gray-200">Pista Dura</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-400">
                            {formatPercentage(playerStats.hard_winrt)}
                          </div>
                          <div className="text-xs text-gray-400">Win Rate</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500/10 to-transparent rounded-xl border-l-4 border-orange-500">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-orange-400 text-lg">🧱</span>
                          </div>
                          <span className="font-medium text-gray-200">Arcilla</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-orange-400">
                            {formatPercentage(playerStats.clay_winrt)}
                          </div>
                          <div className="text-xs text-gray-400">Win Rate</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8" />
                      </div>
                      <p className="text-sm">Cargando estadísticas de superficie...</p>
                    </div>
                  )}
                </div>

                {/* Tournament Performance */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                    </div>
                    Rendimiento por Torneo
                  </h3>
                  {playerStats ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-xl border-l-4 border-yellow-500">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-yellow-400 text-lg">🏆</span>
                          </div>
                          <span className="font-medium text-gray-200">Grand Slam</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-yellow-400">
                            {formatPercentage(playerStats.g_winrt)}
                          </div>
                          <div className="text-xs text-gray-400">Win Rate</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-transparent rounded-xl border-l-4 border-purple-500">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-purple-400 text-lg">🥇</span>
                          </div>
                          <span className="font-medium text-gray-200">ATP 250</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-purple-400">
                            {formatPercentage(playerStats.a_winrt)}
                          </div>
                          <div className="text-xs text-gray-400">Win Rate</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-500/10 to-transparent rounded-xl border-l-4 border-pink-500">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-pink-400 text-lg">🥈</span>
                          </div>
                          <span className="font-medium text-gray-200">ATP 500</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-pink-400">
                            {formatPercentage(playerStats.m_winrt)}
                          </div>
                          <div className="text-xs text-gray-400">Win Rate</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-500/10 to-transparent rounded-xl border-l-4 border-red-500">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-red-400 text-lg">💎</span>
                          </div>
                          <span className="font-medium text-gray-200">Masters 1000</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-red-400">
                            {formatPercentage(playerStats.d_winrt)}
                          </div>
                          <div className="text-xs text-gray-400">Win Rate</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-8 h-8" />
                      </div>
                      <p className="text-sm">Cargando estadísticas de torneos...</p>
                    </div>
                  )}
                </div>

                {/* Serve Statistics */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-cyan-400" />
                    </div>
                    Estadísticas de Servicio
                  </h3>
                  {playerStats ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 rounded-xl border border-cyan-500/20">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-6 h-6 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-cyan-400 text-sm">🎯</span>
                          </div>
                          <span className="text-sm font-medium text-gray-300">1er Servicio</span>
                        </div>
                        <div className="text-2xl font-bold text-cyan-400 mb-1">
                          {formatPercentage(playerStats.pct_1stin)}
                        </div>
                        <div className="text-xs text-gray-400">Porcentaje de Entrada</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl border border-green-500/20">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-green-400 text-sm">⚡</span>
                          </div>
                          <span className="text-sm font-medium text-gray-300">Puntos 1er Servicio</span>
                        </div>
                        <div className="text-2xl font-bold text-green-400 mb-1">
                          {formatPercentage(playerStats.pct_1stwon)}
                        </div>
                        <div className="text-xs text-gray-400">Ganados</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl border border-blue-500/20">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-blue-400 text-sm">🔄</span>
                          </div>
                          <span className="text-sm font-medium text-gray-300">Puntos 2do Servicio</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-400 mb-1">
                          {formatPercentage(playerStats.pct_2ndwon)}
                        </div>
                        <div className="text-xs text-gray-400">Ganados</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl border border-purple-500/20">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-purple-400 text-sm">🎾</span>
                          </div>
                          <span className="text-sm font-medium text-gray-300">Total Servicio</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-400 mb-1">
                          {formatPercentage(playerStats.pct_svptswon)}
                        </div>
                        <div className="text-xs text-gray-400">Puntos Ganados</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8" />
                      </div>
                      <p className="text-sm">Cargando estadísticas de servicio...</p>
                    </div>
                  )}
                </div>

                {/* Return & Break Points Statistics */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-red-400" />
                    </div>
                    Devolución y Break Points
                  </h3>
                  {playerStats ? (
                    <div className="grid grid-cols-1 gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl border border-red-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-red-400 text-lg">🔴</span>
                            <span className="text-sm font-medium text-gray-300">BP Convertidos</span>
                          </div>
                          <div className="text-xl font-bold text-red-400 mb-1">
                            {formatPercentage(playerStats.pct_bpconv)}
                          </div>
                          <div className="text-xs text-gray-400">Conversión</div>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl border border-green-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-green-400 text-lg">🛡️</span>
                            <span className="text-sm font-medium text-gray-300">BP Salvados</span>
                          </div>
                          <div className="text-xl font-bold text-green-400 mb-1">
                            {formatPercentage(playerStats.pct_bpsaved)}
                          </div>
                          <div className="text-xs text-gray-400">Defensa</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-xl border border-orange-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-orange-400 text-sm">🎯</span>
                            <span className="text-xs font-medium text-gray-300">1era Devolución</span>
                          </div>
                          <div className="text-lg font-bold text-orange-400">
                            {formatPercentage(playerStats.pct_1stretptswon)}
                          </div>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl border border-blue-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-blue-400 text-sm">🔄</span>
                            <span className="text-xs font-medium text-gray-300">2da Devolución</span>
                          </div>
                          <div className="text-lg font-bold text-blue-400">
                            {formatPercentage(playerStats.pct_2ndretptswon)}
                          </div>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl border border-purple-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-purple-400 text-sm">📈</span>
                            <span className="text-xs font-medium text-gray-300">Rendimiento</span>
                          </div>
                          <div className="text-lg font-bold text-purple-400">
                            {formatPercentage(playerStats.recperf)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8" />
                      </div>
                      <p className="text-sm">Cargando estadísticas de devolución...</p>
                    </div>
                  )}
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
      </main>

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