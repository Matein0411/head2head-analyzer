interface HeadToHeadStatsProps {
  leftWins: number;
  rightWins: number;
  leftStats: {
    ytdWL: string;
    ytdTitles: number;
    careerWL: string;
    careerTitles: number;
    careerPrizeMoney: string;
  };
  rightStats: {
    ytdWL: string;
    ytdTitles: number;
    careerWL: string;
    careerTitles: number;
    careerPrizeMoney: string;
  };
}

const HeadToHeadStats = ({ leftWins, rightWins, leftStats, rightStats }: HeadToHeadStatsProps) => {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      {/* Head to Head Circle */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-8">
          <div className="text-6xl font-bold text-foreground">{leftWins}</div>
          
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-atp-blue flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">wins</div>
              </div>
            </div>
          </div>
          
          <div className="text-6xl font-bold text-foreground">{rightWins}</div>
        </div>
      </div>

      {/* Lexus ATP HEAD2HEAD Logo */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 text-foreground">
          <span className="text-lg font-bold">LEXUS</span>
          <span className="text-2xl font-bold">ATP HEAD2HEAD</span>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        {/* Left Player Stats */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold">{leftStats.ytdWL}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">{leftStats.ytdTitles}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">{leftStats.careerWL}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">{leftStats.careerTitles}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">{leftStats.careerPrizeMoney}</span>
          </div>
        </div>

        {/* Center Labels */}
        <div className="space-y-4 text-center">
          <div className="text-muted-foreground">YTD W/L</div>
          <div className="text-muted-foreground">YTD titles</div>
          <div className="text-muted-foreground">Career W/L</div>
          <div className="text-muted-foreground">Career titles</div>
          <div className="text-muted-foreground">Career prize money</div>
        </div>

        {/* Right Player Stats */}
        <div className="space-y-4 text-right">
          <div className="flex justify-end">
            <span className="font-semibold">{rightStats.ytdWL}</span>
          </div>
          <div className="flex justify-end">
            <span className="font-semibold">{rightStats.ytdTitles}</span>
          </div>
          <div className="flex justify-end">
            <span className="font-semibold">{rightStats.careerWL}</span>
          </div>
          <div className="flex justify-end">
            <span className="font-semibold">{rightStats.careerTitles}</span>
          </div>
          <div className="flex justify-end">
            <span className="font-semibold">{rightStats.careerPrizeMoney}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadToHeadStats;