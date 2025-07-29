import { useState } from "react";
import { tennisPlayerService } from "@/services/tennisPlayer.service"; 

// Componentes
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlayerCard from "@/components/PlayerCard";
import HeadToHeadStats from "@/components/HeadToHeadStats";
import FutureMatches from "@/components/FutureMatches";

// Datos iniciales de los jugadores
const initialPlayer1 = {
  name: "Giovanni Mpetshi",
  country: "FRA",
  countryCode: "fr",
  rank: 43,
  minRank: 43,
  age: 22,
  height: "6'8\" (203cm)",
  hand: "Right-Handed",
  image: "/src/assets/player1.jpg", // Asegúrate de que esta ruta sea correcta
};

const initialPlayer2 = {
  name: "Holger Rune",
  country: "DEN",
  countryCode: "dk",
  rank: 9,
  minRank: 9,
  age: 22,
  height: "6'2\" (188cm)",
  hand: "Right-Handed",
  image: "/src/assets/player2.jpg", // Asegúrate de que esta ruta sea correcta
};

// Mapa para convertir códigos de país
const countryCodeMap: { [key: string]: string } = {
  FRA: "fr", DEN: "dk", ESP: "es", ITA: "it", SRB: "rs", USA: "us", GER: "de",
};


const Home = () => {
  // 1. El estado de los datos vive aquí, inicializado con los datos de arriba
  const [player1Data, setPlayer1Data] = useState(initialPlayer1);
  const [player2Data, setPlayer2Data] = useState(initialPlayer2);

  // 2. La función que usa el servicio para buscar y actualizar el estado
  const handleSearch = async (playerName: string, playerSetter: React.Dispatch<React.SetStateAction<any>>) => {
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
        image: data.image_url,
        height: "N/A",
      });
    } catch (error) {
      alert("No se pudo encontrar al jugador.");
    }
  };

  // Lógica para los enfrentamientos
  const leftWins = 7;
  const rightWins = 5;

  // Lógica para los partidos futuros
  const futureMatches = [
    {
      date: "2025-08-01",
      player1: "Giovanni Mpetshi Perricard",
      player2: "Holger Rune",
      tournament: "Geneva Open",
      tournamentType: "ATP 250",
      surface: "Clay"
    },
    {
      date: "2025-08-10",
      player1: "Carlos Alcaraz",
      player2: "Jannik Sinner",
      tournament: "Madrid Masters",
      tournamentType: "ATP 1000",
      surface: "Hard"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ... Tu sección de Hero no cambia ... */}
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
          {/* 3. Pasamos los datos del estado y la función de búsqueda a PlayerCard */}
          <PlayerCard
            playerData={player1Data}
            onSearch={(name) => handleSearch(name, setPlayer1Data)}
            color="blue"
          />
          <div className="flex items-center justify-center">
            <HeadToHeadStats />
          </div>
          <PlayerCard
            playerData={player2Data}
            onSearch={(name) => handleSearch(name, setPlayer2Data)}
            color="yellow"
          />
        </div>

        <FutureMatches matches={futureMatches} />
      </main>
      <Footer />
    </div>
  );
};

export default Home;