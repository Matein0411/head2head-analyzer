interface Match {
  year: string;
  winner: string;
  event: string;
  round: string;
  surface: string;
  score: string;
}

interface EventBreakdownProps {
  matches: Match[];
}

const EventBreakdown = ({ matches }: EventBreakdownProps) => {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h2 className="text-xl font-bold text-foreground mb-6">Event Breakdown</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 text-muted-foreground font-medium">Year</th>
              <th className="pb-3 text-muted-foreground font-medium">Winner</th>
              <th className="pb-3 text-muted-foreground font-medium">Event</th>
              <th className="pb-3 text-muted-foreground font-medium">Round</th>
              <th className="pb-3 text-muted-foreground font-medium">Surface</th>
              <th className="pb-3 text-muted-foreground font-medium">Score</th>
              <th className="pb-3 text-muted-foreground font-medium">View details</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, index) => (
              <tr key={index} className="border-b border-border">
                <td className="py-3 text-foreground">{match.year}</td>
                <td className="py-3 text-foreground">{match.winner}</td>
                <td className="py-3 text-foreground">{match.event}</td>
                <td className="py-3 text-foreground">{match.round}</td>
                <td className="py-3 text-foreground">{match.surface}</td>
                <td className="py-3 text-foreground">{match.score}</td>
                <td className="py-3">
                  <button className="text-atp-blue hover:underline">
                    View details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventBreakdown;