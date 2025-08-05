import { Search } from "lucide-react";
import { KeyboardEvent, useState } from "react";

import type { PlayerData } from "@/types/player";
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
      event.preventDefault(); // Prevenir comportamiento por defecto
      event.stopPropagation(); // Evitar que el evento se propague
      onSearch(searchValue); // Llama a la función del padre (Home)
      setSearching(false);
      setSearchValue("");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3 md:space-y-4 w-full">
      <div className="relative">
        <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border-2 md:border-4 border-border">
          {/* 4. Usamos los datos del objeto playerData */}
          <img src={playerData.image} alt={playerData.name} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className={`${cardColor} ${textColor} px-3 md:px-6 py-2 md:py-3 rounded-full flex items-center gap-2 md:gap-3 w-full max-w-[280px] justify-center text-sm md:text-base`}>
        <button
          className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full border border-border bg-white/10 hover:bg-white/20 transition flex-shrink-0"
          onClick={() => setSearching((v) => !v)}
          title="Buscar jugador"
        >
          <Search className="w-3 h-3 md:w-4 md:h-4" />
        </button>
        <div className="flex-1 text-center min-w-0">
          {searching ? (
            <input
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              className="rounded px-2 py-1 text-black text-xs md:text-sm outline-none bg-transparent w-full border-none placeholder:text-black"
              placeholder="Buscar y presionar Enter"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              onBlur={() => setSearching(false)}
            />
          ) : (
            <>
              <div className="font-bold truncate">{playerData.name}</div>
              <div className="flex items-center justify-center gap-1 md:gap-2">
                <img src={`https://flagcdn.com/16x12/${playerData.countryCode.toLowerCase()}.png`} alt={playerData.country} className="w-3 h-2 md:w-4 md:h-3" />
                <span className="text-xs md:text-sm">{playerData.country}</span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="bg-card rounded-lg p-3 md:p-4 w-full max-w-xs border border-border">
        <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
          {/* 4. Usamos los datos del objeto playerData */}
          <div className="flex justify-between"><span className="text-muted-foreground">Rank</span><span className="font-semibold">{playerData.rank}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Min Rank</span><span className="font-semibold">{playerData.minRank}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Hand</span><span className="font-semibold">{playerData.hand}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Age</span><span className="font-semibold">{playerData.age}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Height</span><span className="font-semibold text-xs md:text-sm">{playerData.height}</span></div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;