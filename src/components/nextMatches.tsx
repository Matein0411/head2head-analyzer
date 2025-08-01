
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
    <div className="bg-card rounded-lg p-6 border border-border">
      <h2 className="text-xl font-bold text-foreground mb-6">Próximos Partidos</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 text-muted-foreground font-medium">Fecha</th>
              <th className="pb-3 text-muted-foreground font-medium">Nombre del torneo</th>
              <th className="pb-3 text-muted-foreground font-medium">Tipo de torneo</th>
              <th className="pb-3 text-muted-foreground font-medium">Superficie</th>
              <th className="pb-3 text-muted-foreground font-medium">Jugador 1</th>
              <th className="pb-3 text-muted-foreground font-medium">Jugador 2</th>
              <th className="pb-3 text-muted-foreground font-medium">Ver detalles</th>
              <th className="pb-3 text-muted-foreground font-medium">Comparar</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, index) => (
              <tr key={index} className="border-b border-border">
                <td className="py-3 text-foreground">{match.date}</td>
                <td className="py-3 text-foreground">{match.tournament}</td>
                <td className="py-3 text-foreground">{match.tournamentType}</td>
                <td className="py-3 text-foreground">{match.surface}</td>
                <td className="py-3 text-foreground">{match.player1}</td>
                <td className="py-3 text-foreground">{match.player2}</td>
                <td className="py-3">
                  <button className="text-atp-blue hover:underline">
                    Ver detalles
                  </button>
                </td>
                <td className="py-3">
                <button
                  className="bg-atp-blue text-white px-4 py-1 rounded-full font-semibold hover:bg-atp-blue/90 transition"
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
      {/* Botón comparar ahora está por fila */}
    </div>
  );
};

export default NextMatches;