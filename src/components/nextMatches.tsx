
interface NextMatch {
  date: string;
  tournament: string;
  tournamentType: string;
  surface: string;
  player1: string;
  player2: string;
}


interface NextMatchesProps {
  matches: NextMatch[];
  onCompare?: (match: NextMatch) => void;
}

const NextMatches = ({ matches, onCompare }: NextMatchesProps) => {

  return (
    <div className="bg-card rounded-lg p-3 md:p-4 lg:p-6 border border-border">
      <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">Próximos Partidos</h2>
      
      {/* Desktop Table View (Large screens only) */}
      <div className="hidden xl:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 text-muted-foreground font-medium text-sm">Fecha</th>
              <th className="pb-3 text-muted-foreground font-medium text-sm">Torneo</th>
              <th className="pb-3 text-muted-foreground font-medium text-sm">Tipo</th>
              <th className="pb-3 text-muted-foreground font-medium text-sm">Superficie</th>
              <th className="pb-3 text-muted-foreground font-medium text-sm">Jugador 1</th>
              <th className="pb-3 text-muted-foreground font-medium text-sm">Jugador 2</th>
              <th className="pb-3 text-muted-foreground font-medium text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, index) => (
              <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="py-3 text-foreground text-sm">{match.date}</td>
                <td className="py-3 text-foreground text-sm max-w-40 truncate" title={match.tournament}>{match.tournament}</td>
                <td className="py-3 text-foreground text-sm">{match.tournamentType}</td>
                <td className="py-3 text-foreground text-sm">{match.surface}</td>
                <td className="py-3 text-foreground text-sm max-w-32 truncate" title={match.player1}>{match.player1}</td>
                <td className="py-3 text-foreground text-sm max-w-32 truncate" title={match.player2}>{match.player2}</td>
                <td className="py-3">
                  <button
                    className="bg-atp-blue text-white px-3 py-1.5 rounded-full font-semibold hover:bg-atp-blue/90 transition text-sm whitespace-nowrap"
                    onClick={() => onCompare && onCompare(match)}
                  >
                    Comparar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tablet Simplified Table View */}
      <div className="hidden md:block xl:hidden overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 text-muted-foreground font-medium text-sm">Fecha</th>
              <th className="pb-3 text-muted-foreground font-medium text-sm">Torneo</th>
              <th className="pb-3 text-muted-foreground font-medium text-sm">Enfrentamiento</th>
              <th className="pb-3 text-muted-foreground font-medium text-sm">Superficie</th>
              <th className="pb-3 text-muted-foreground font-medium text-sm">Acción</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, index) => (
              <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="py-3 text-foreground text-sm">{match.date}</td>
                <td className="py-3 text-foreground text-sm">
                  <div className="max-w-32 truncate" title={match.tournament}>
                    {match.tournament}
                  </div>
                  <div className="text-xs text-muted-foreground">{match.tournamentType}</div>
                </td>
                <td className="py-3 text-foreground text-sm">
                  <div className="space-y-1">
                    <div className="font-medium truncate max-w-28" title={match.player1}>{match.player1}</div>
                    <div className="text-xs text-muted-foreground">vs</div>
                    <div className="font-medium truncate max-w-28" title={match.player2}>{match.player2}</div>
                  </div>
                </td>
                <td className="py-3 text-foreground text-sm">{match.surface}</td>
                <td className="py-3">
                  <button
                    className="bg-atp-blue text-white px-3 py-1.5 rounded-full font-semibold hover:bg-atp-blue/90 transition text-sm"
                    onClick={() => onCompare && onCompare(match)}
                  >
                    Comparar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {matches.map((match, index) => (
          <div key={index} className="bg-background/50 rounded-lg p-3 border border-border/50 hover:border-border/80 transition-colors">
            {/* Header with tournament and date */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm truncate pr-2" title={match.tournament}>
                  {match.tournament}
                </h3>
                <p className="text-xs text-muted-foreground">{match.date}</p>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <span className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                  {match.tournamentType}
                </span>
                <span className="inline-block bg-secondary/20 text-secondary-foreground px-2 py-0.5 rounded text-xs">
                  {match.surface}
                </span>
              </div>
            </div>
            
            {/* Players */}
            <div className="mb-4">
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center justify-center">
                  <div className="flex-1 text-center">
                    <div className="text-sm font-medium text-foreground truncate" title={match.player1}>
                      {match.player1}
                    </div>
                  </div>
                  <div className="px-3">
                    <span className="text-xs text-muted-foreground font-semibold">VS</span>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-sm font-medium text-foreground truncate" title={match.player2}>
                      {match.player2}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action button */}
            <div className="flex justify-center">
              <button
                className="bg-atp-blue text-white px-6 py-2 rounded-full font-semibold hover:bg-atp-blue/90 transition text-sm w-full max-w-32"
                onClick={() => onCompare && onCompare(match)}
              >
                Comparar
              </button>
            </div>
          </div>
        ))}
        
        {/* Empty state for mobile */}
        {matches.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">🎾</div>
            <p className="text-muted-foreground text-sm">No hay partidos próximos disponibles</p>
          </div>
        )}
      </div>

      {/* Empty state for tablet and desktop */}
      {matches.length === 0 && (
        <div className="hidden md:flex flex-col items-center justify-center py-12">
          <div className="text-5xl mb-4">🎾</div>
          <p className="text-muted-foreground">No hay partidos próximos disponibles</p>
        </div>
      )}
    </div>
  );
};

export default NextMatches;