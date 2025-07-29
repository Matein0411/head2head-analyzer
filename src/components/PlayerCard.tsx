import { Search } from "lucide-react";

interface PlayerCardProps {
  name: string;
  country: string;
  countryCode: string;
  rank: number;
  age: number;
  weight: string;
  height: string;
  plays: string;
  backhand: string;
  turnedPro: number;
  image: string;
  color?: "blue" | "yellow";
}

const PlayerCard = ({ 
  name, 
  country, 
  countryCode, 
  rank, 
  age, 
  weight, 
  height, 
  plays, 
  backhand, 
  turnedPro,
  image,
  color = "blue"
}: PlayerCardProps) => {
  const cardColor = color === "blue" ? "bg-atp-blue" : "bg-atp-yellow";
  const textColor = color === "blue" ? "text-white" : "text-black";

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Player Image */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-border">
          <img 
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Player Info Card */}
      <div className={`${cardColor} ${textColor} px-6 py-3 rounded-full flex items-center gap-3`}>
        <Search className="w-4 h-4" />
        <div>
          <div className="font-bold">{name}</div>
          <div className="flex items-center gap-2">
            <img 
              src={`https://flagcdn.com/16x12/${countryCode.toLowerCase()}.png`}
              alt={country}
              className="w-4 h-3"
            />
            <span className="text-sm">{country}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-card rounded-lg p-4 w-full max-w-xs border border-border">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rank</span>
            <span className="font-semibold">{rank}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Age</span>
            <span className="font-semibold">{age}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Weight</span>
            <span className="font-semibold">{weight}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Height</span>
            <span className="font-semibold">{height}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Plays</span>
            <span className="font-semibold">{plays}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Backhand</span>
            <span className="font-semibold">{backhand}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Turned Pro</span>
            <span className="font-semibold">{turnedPro}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;