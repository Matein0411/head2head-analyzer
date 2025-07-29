import { Search } from "lucide-react";
import { KeyboardEvent, useState } from "react";

// 1. Definimos una interfaz para el objeto de datos del jugador
interface PlayerData {
  name: string;
  country: string;
  countryCode: string;
  rank: number;
  minRank: number;
  age: number;
  height: string;
  hand: string;
  image: string;
}

// 2. Los props del componente ahora son más limpios
interface PlayerCardProps {
  playerData: PlayerData;
  onSearch: (playerName: string) => void;
  color?: "blue" | "yellow";
}

const PlayerCard = ({ playerData, onSearch, color = "blue" }: PlayerCardProps) => {
  // El estado local se mantiene para controlar la UI de la búsqueda
  const [searching, setSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const cardColor = color === "blue" ? "bg-atp-blue" : "bg-atp-yellow";
  const textColor = color === "blue" ? "text-white" : "text-black";

  // 3. Función para manejar la tecla "Enter"
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchValue.trim()) {
      onSearch(searchValue); // Llama a la función del padre (Home)
      setSearching(false);
      setSearchValue("");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-border">
          {/* 4. Usamos los datos del objeto playerData */}
          <img src={playerData.image} alt={playerData.name} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className={`${cardColor} ${textColor} px-6 py-3 rounded-full flex items-center gap-3 min-w-[280px] justify-center`}>
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full border border-border bg-white/10 hover:bg-white/20 transition"
          onClick={() => setSearching((v) => !v)}
          title="Buscar jugador"
        >
          <Search className="w-4 h-4" />
        </button>
        <div className="w-48 text-center">
          {searching ? (
            <input
              type="text"
              className="rounded px-2 py-1 text-black text-sm outline-none bg-transparent w-full border-none placeholder:text-black"
              placeholder="Buscar y presionar Enter"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              onBlur={() => setSearching(false)}
            />
          ) : (
            <>
              <div className="font-bold">{playerData.name}</div>
              <div className="flex items-center justify-center gap-2">
                <img src={`https://flagcdn.com/16x12/${playerData.countryCode.toLowerCase()}.png`} alt={playerData.country} className="w-4 h-3" />
                <span className="text-sm">{playerData.country}</span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="bg-card rounded-lg p-4 w-full max-w-xs border border-border">
        <div className="space-y-3 text-sm">
          {/* 4. Usamos los datos del objeto playerData */}
          <div className="flex justify-between"><span className="text-muted-foreground">Rank</span><span className="font-semibold">{playerData.rank}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Min Rank</span><span className="font-semibold">{playerData.minRank}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Hand</span><span className="font-semibold">{playerData.hand}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Age</span><span className="font-semibold">{playerData.age}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Height</span><span className="font-semibold">{playerData.height}</span></div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;