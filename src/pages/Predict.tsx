import { tennisPlayerService } from "@/services/tennisPlayer.service";
import type { NextMatch, PlayerData } from "@/types/player";
import { useEffect, useState } from "react";

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


const Predecir = () => {
  // Estado estrictamente tipado
  const [nextMatches, setNextMatches] = useState<NextMatch[]>([]);
  const [player1Data, setPlayer1Data] = useState<PlayerData>(initialPlayer1);
  const [player2Data, setPlayer2Data] = useState<PlayerData>(initialPlayer2);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [surface, setSurface] = useState<string>("");
  const [tournamentType, setTournamentType] = useState<string>("");

  // Busca y actualiza el estado del jugador
  const handleSearch = async (
    playerName: string,
    playerSetter: React.Dispatch<React.SetStateAction<PlayerData>>
  ) => {
    setSearchError(null);
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
      setSearchError("No se pudo encontrar al jugador. Verifica el nombre e inténtalo de nuevo.");
    }
  };



  useEffect(() => {
    tennisPlayerService.getNextMatches()
      .then((apiRes) => {
        const matchesRaw = Array.isArray(apiRes) ? apiRes : (apiRes as any).matches;
        if (Array.isArray(matchesRaw)) {
          const mapped = matchesRaw.map((m: any) => ({
            date: m.snapshot_date || m.date || "",
            player1: m.player1_name || m.player1 || "",
            player2: m.player2_name || m.player2 || "",
            tournament: m.tourney_name || m.tournament || "",
            tournamentType: m.tourney_type || m.tournamentType || "",
            surface: m.surface || ""
          }));
          setNextMatches(mapped);
        } else {
          setNextMatches([]);
        }
      })
      .catch(() => setNextMatches([]));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-background via-card to-background py-12 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-repeat" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(66, 133, 244, 0.1) 10px, rgba(66, 133, 244, 0.1) 20px)` }}></div>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <span className="bg-gradient-to-b from-gray-200 to-white bg-clip-text text-transparent">
              HEAD2HEAD
            </span>
          </div>
        </div>

        {/* Comparación de jugadores */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <PlayerCard
            playerData={player1Data}
            onSearch={(name) => handleSearch(name, setPlayer1Data)}
            color="blue"
          />
        <div className="flex items-center justify-center">
            <HeadToHeadStats
              player1Name={player1Data.name}
              player2Name={player2Data.name}
              surface={surface}
              tournamentType={tournamentType}
              onSurfaceChange={setSurface}
              onTournamentTypeChange={setTournamentType}
            />
          </div>
          <PlayerCard
            playerData={player2Data}
            onSearch={(name) => handleSearch(name, setPlayer2Data)}
            color="yellow"
          />
        </div>

        {searchError && (
          <div className="mb-8 text-center text-red-600 bg-red-100 border border-red-300 rounded px-3 py-2 text-sm animate-pulse">
            {searchError}
          </div>
        )}

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
      </main>
      <Footer />
    </div>
  );
};

export default Predecir;