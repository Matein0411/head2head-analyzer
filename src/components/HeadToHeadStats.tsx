import { useState } from "react";

const HeadToHeadStats = () => {
  // Datos quemados de ejemplo
  const leftWins = 7;
  const rightWins = 5;
  const total = leftWins + rightWins;
  const leftPercent = total > 0 ? Math.round((leftWins / total) * 100) : 50;
  const rightPercent = total > 0 ? 100 - leftPercent : 50;

  const [showPrediction, setShowPrediction] = useState(false);

  return (
    <div className="bg-card rounded-lg p-6 border border-border flex flex-col items-center">
      {/* Círculo H2H con victorias */}
      <div className="flex items-center justify-center mb-8 gap-12">
        <span className="text-6xl font-bold text-white drop-shadow-lg">{leftWins}</span>
        <div className="w-60 h-60 rounded-full border-8 border-atp-blue flex items-center justify-center">
          <span className="text-5xl font-bold text-foreground">H2H</span>
        </div>
        <span className="text-6xl font-bold text-white drop-shadow-lg">{rightWins}</span>
      </div>

      {/* Selectores de superficie y tipo de torneo */}
      <div className="w-full flex justify-center gap-8 mb-8">
        {/* Selector de superficie */}
        <div className="flex flex-col items-center">
          <label htmlFor="surface" className="mb-2 text-white font-semibold">Superficie</label>
          <div className="relative w-full min-w-[180px]">
            <select
              id="surface"
              className="bg-black/20 border-2 border-white text-white rounded-xl px-6 py-3 w-full shadow-md backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-atp-blue appearance-none pr-10"
              defaultValue="hard"
              style={{ WebkitTextFillColor: 'white', colorScheme: 'dark' }}
            >
              <option className="bg-black/80 text-white" value="hard">Dura</option>
              <option className="bg-black/80 text-white" value="clay">Arcilla</option>
              <option className="bg-black/80 text-white" value="grass">Césped</option>
              <option className="bg-black/80 text-white" value="carpet">Carpeta</option>
            </select>
            {/* Flecha blanca personalizada */}
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {/* Selector de tipo de torneo */}
        <div className="flex flex-col items-center">
          <label htmlFor="tournament" className="mb-2 text-white font-semibold">Tipo de torneo</label>
          <div className="relative w-full min-w-[180px]">
            <select
              id="tournament"
              className="bg-black/20 border-2 border-white text-white rounded-xl px-6 py-3 w-full shadow-md backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-atp-blue appearance-none pr-10"
              defaultValue="atp"
              style={{ WebkitTextFillColor: 'white', colorScheme: 'dark' }}
            >
              <option className="bg-black/80 text-white" value="atp">ATP</option>
              <option className="bg-black/80 text-white" value="wta">WTA</option>
              <option className="bg-black/80 text-white" value="challenger">Challenger</option>
              <option className="bg-black/80 text-white" value="itf">ITF</option>
              <option className="bg-black/80 text-white" value="exhibicion">Exhibición</option>
            </select>
            {/* Flecha blanca personalizada */}
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Botón Predecir */}
      <div className="w-full flex justify-center mb-8">
        <button
          className="bg-black/0 border-2 border-white text-white px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 ease-in-out hover:bg-black/0 hover:scale-105 hover:shadow-lg"
          style={{ backdropFilter: 'blur(2px)' }}
          onClick={() => setShowPrediction(true)}
        >
          Predecir
        </button>
      </div>

      {/* Ganador predicho solo si showPrediction */}
      {showPrediction && (
        <div className="w-full max-w-md flex flex-col items-center">
          <span className="mb-2 text-lg font-semibold text-foreground">Ganador predicho:</span>
          <div className="w-full bg-muted rounded-full h-8 flex overflow-hidden border border-border">
            <div
              className="h-full flex items-center justify-center bg-atp-blue text-white text-sm font-bold transition-all duration-500"
              style={{ width: `${leftPercent}%` }}
            >
              {leftPercent > 10 && `${leftPercent}%`}
            </div>
            <div
              className="h-full flex items-center justify-center bg-atp-yellow text-black text-sm font-bold transition-all duration-500"
              style={{ width: `${rightPercent}%` }}
            >
              {rightPercent > 10 && `${rightPercent}%`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeadToHeadStats;