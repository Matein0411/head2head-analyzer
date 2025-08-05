import { tennisPlayerService } from "@/services/tennisPlayer.service";
import type { NextMatch, PlayerData } from "@/types/player";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeadToHeadStats from "@/components/HeadToHeadStats";
import NextMatches from "@/components/nextMatches";
import PlayerCard from "@/components/PlayerCard";


// Datos iniciales de los jugadores (usa tipado estricto)
const initialPlayer1: PlayerData = {
  name: "Giovanni Mpetshi",
  country: "FRA",
  countryCode: "fr",
  rank: 43,
  minRank: 43,
  age: 22,
  height: "6'8\" (203cm)",
  hand: "Right-Handed",
  image: "/src/assets/player1.jpg",
};

const initialPlayer2: PlayerData = {
  name: "Holger Rune",
  country: "DEN",
  countryCode: "dk",
  rank: 9,
  minRank: 9,
  age: 22,
  height: "6'2\" (188cm)",
  hand: "Right-Handed",
  image: "/src/assets/player2.jpg",
};

// Mapa para convertir códigos de país
const countryCodeMap: { [key: string]: string } = {
  FRA: "fr", DEN: "dk", ESP: "es", ITA: "it", SRB: "rs", USA: "us", GER: "de",
};


const Predict = () => {
  // Estado estrictamente tipado
  const [nextMatches, setNextMatches] = useState<NextMatch[]>([]);
  const [player1Data, setPlayer1Data] = useState<PlayerData>(initialPlayer1);
  const [player2Data, setPlayer2Data] = useState<PlayerData>(initialPlayer2);
  const [surface, setSurface] = useState<string>("");
  const [tournamentType, setTournamentType] = useState<string>("");
  const [isLoadingMatches, setIsLoadingMatches] = useState<boolean>(true);

  // Busca y actualiza el estado del jugador
  const handleSearch = async (
    playerName: string,
    playerSetter: React.Dispatch<React.SetStateAction<PlayerData>>
  ) => {
    if (!playerName.trim()) return;
    try {
      const data = await tennisPlayerService.getPlayerByName(playerName);
      playerSetter({
        name: data.name,
        country: data.country,
        countryCode: countryCodeMap[data.country] || 'xx',
        rank: data.actual_rank,
        minRank: data.min_rank,
        age: data.age,
        hand: data.hand,
        height: data.height,
        image: data.image_url,
      });
    } catch (error) {
      const errorMessage = "No se pudo encontrar al jugador. Verifica el nombre e inténtalo de nuevo.";
      toast.error(errorMessage);
    }
  };



  useEffect(() => {
    setIsLoadingMatches(true);
    
    tennisPlayerService.getNextMatches()
      .then((apiRes) => {
        let matchesRaw;
        if (Array.isArray(apiRes)) {
          matchesRaw = apiRes;
        } else if (apiRes && typeof apiRes === 'object') {
          matchesRaw = (apiRes as any).matches || (apiRes as any).data || (apiRes as any).results || [];
        } else {
          matchesRaw = [];
        }
        
        if (Array.isArray(matchesRaw) && matchesRaw.length > 0) {
          const mapped = matchesRaw.map((m: any) => ({
            date: m.snapshot_date || m.date || m.match_date || "Sin fecha",
            player1: m.player1_name || m.player1 || m.player_1 || "Jugador 1",
            player2: m.player2_name || m.player2 || m.player_2 || "Jugador 2",
            tournament: m.tourney_name || m.tournament || m.tournament_name || "Sin torneo",
            tournamentType: m.tourney_type || m.tournamentType || m.tournament_type || "Sin tipo",
            surface: m.surface || "Sin superficie"
          }));
          setNextMatches(mapped);
        } else {
          setNextMatches([]);
        }
      })
      .catch(() => {
        setNextMatches([]);
      })
      .finally(() => {
        setIsLoadingMatches(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-background via-card to-background py-8 md:py-12 mb-6 md:mb-8 relative overflow-hidden rounded-lg">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-repeat" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(66, 133, 244, 0.1) 10px, rgba(66, 133, 244, 0.1) 20px)` }}></div>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-b from-gray-200 to-white bg-clip-text text-transparent text-center">
              HEAD2HEAD
            </h1>
            <p className="text-sm md:text-base text-gray-400 mt-2 text-center max-w-md">
              Compara jugadores y predice resultados con IA
            </p>
          </div>
        </div>

{/* Comparación de jugadores - Layout responsive */}
      {/* CAMBIO 1: de lg:grid-cols-8 a lg:grid-cols-10 */}
      <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-10 lg:gap-6 mb-8 md:mb-12">
        
        {/* Player 1 */}
        <div className="order-1 lg:col-span-3">
          <PlayerCard
            playerData={player1Data}
            onSearch={(name) => handleSearch(name, setPlayer1Data)}
            color="blue"
          />
        </div>

        {/* Head to Head Stats - Center on desktop, top on mobile */}
        <div className="order-first lg:order-2 lg:col-span-4 flex items-center justify-center">
          <div className="w-full max-w-md lg:max-w-none">
            <HeadToHeadStats
              player1Name={player1Data.name}
              player2Name={player2Data.name}
              surface={surface}
              tournamentType={tournamentType}
              onSurfaceChange={setSurface}
              onTournamentTypeChange={setTournamentType}
            />
          </div>
        </div>

        {/* Player 2 */}
        <div className="order-2 lg:order-3 lg:col-span-3">
          <PlayerCard
            playerData={player2Data}
            onSearch={(name) => handleSearch(name, setPlayer2Data)}
            color="yellow"
          />
        </div>
      </div>

        {/* Next Matches - Mobile optimized */}
        <div className="px-2 md:px-0">
          {isLoadingMatches ? (
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">Próximos Partidos</h2>
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground text-sm">Cargando partidos...</p>
                </div>
              </div>
            </div>
          ) : (
            <NextMatches
              matches={nextMatches}
              onCompare={async (match) => {
                await handleSearch(match.player1, setPlayer1Data);
                await handleSearch(match.player2, setPlayer2Data);
                // Normaliza superficie para la API
                let normalizedSurface = (match.surface || "").toLowerCase();
                if (["clay", "arcilla"].includes(normalizedSurface)) normalizedSurface = "Clay";
                else if (["hard", "dura"].includes(normalizedSurface)) normalizedSurface = "Hard";
                else if (["grass", "césped"].includes(normalizedSurface)) normalizedSurface = "Grass";
                else normalizedSurface = "";
                setSurface(normalizedSurface);
                // Normaliza tipo de torneo para la API
                let normalizedType = (match.tournamentType || "").toUpperCase();
                if (["G", "grand slam", "grand slams", "gs"].includes(normalizedType) || normalizedType === "G") normalizedType = "G";
                else if (["M", "masters", "masters 1000", "masters1000"].includes(normalizedType) || normalizedType === "M") normalizedType = "M";
                else if (["A", "atp", "tour", "other tour-level events", "atp 250", "atp 500"].includes(normalizedType) || normalizedType === "A") normalizedType = "A";
                else if (["F", "finals", "tour finals"].includes(normalizedType) || normalizedType === "F") normalizedType = "F";
                else if (["D", "davis", "davis cup"].includes(normalizedType) || normalizedType === "D") normalizedType = "D";
                else if (["O", "olympics", "olimpicos", "olimpics"].includes(normalizedType) || normalizedType === "O") normalizedType = "O";
                else normalizedType = "";
                setTournamentType(normalizedType);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Predict;