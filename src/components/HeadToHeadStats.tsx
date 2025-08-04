import { ToastDescription, ToastTitle } from "@/components/ui/toast";
import { useUserProfile } from "@/context/UserProfileContext";
import { toast } from "@/hooks/use-toast";
import { predictApiService } from "@/services/predictApi.service";
import { tennisPlayerService } from "@/services/tennisPlayer.service";
import confetti from "canvas-confetti";
import { AlertTriangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface HeadToHeadStatsProps {
  player1Name?: string;
  player2Name?: string;
  surface?: string;
  tournamentType?: string;
  onSurfaceChange?: (value: string) => void;
  onTournamentTypeChange?: (value: string) => void;
}

const HeadToHeadStats = (props: HeadToHeadStatsProps) => {
  const player1Name = props.player1Name || "";
  const player2Name = props.player2Name || "";
  const surface = props.surface || "";
  const tournamentType = props.tournamentType || "";
  const setSurface = props.onSurfaceChange ?? (() => {});
  const setTournamentType = props.onTournamentTypeChange ?? (() => {});
  const [leftWins, setLeftWins] = useState<number>(0);
  const [rightWins, setRightWins] = useState<number>(0);
  const [h2hLoading, setH2hLoading] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [probabilities, setProbabilities] = useState<{p1: number, p2: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const confettiShown = useRef(false);
  
  const { profile, updateCredits } = useUserProfile();

  const total = leftWins + rightWins;
  const leftPercent = total > 0 ? Math.round((leftWins / total) * 100) : 50;
  const rightPercent = total > 0 ? 100 - leftPercent : 50;

  // Actualizar H2H automáticamente al cambiar los nombres de jugadores
  useEffect(() => {
    if (!player1Name || !player2Name) {
      setLeftWins(0);
      setRightWins(0);
      return;
    }
    setH2hLoading(true);
    tennisPlayerService.getSimpleH2HStats(player1Name, player2Name)
      .then(res => {
        setLeftWins(res.p1_h2h_won);
        setRightWins(res.p2_h2h_won);
      })
      .catch(() => {
        setLeftWins(0);
        setRightWins(0);
      })
      .finally(() => setH2hLoading(false));
  }, [player1Name, player2Name]);

  const handlePredict = async () => {
    if (!player1Name || !player2Name) {
      toast({
        description: (
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
            <div>
              <ToastTitle className="flex items-center gap-2 text-yellow-700 text-base font-bold">
                Completa ambos jugadores
              </ToastTitle>
              <ToastDescription>
                Debes buscar ambos jugadores antes de predecir.
              </ToastDescription>
            </div>
          </div>
        ),
        variant: "default",
      });
      return;
    }
    if (!surface) {
      toast({
        description: (
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
            <div>
              <ToastTitle className="flex items-center gap-2 text-yellow-700 text-base font-bold">
                Selecciona una superficie
              </ToastTitle>
              <ToastDescription>
                Debes elegir la superficie del partido.
              </ToastDescription>
            </div>
          </div>
        ),
        variant: "default",
      });
      return;
    }
    if (!tournamentType) {
      toast({
        description: (
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
            <div>
              <ToastTitle className="flex items-center gap-2 text-yellow-700 text-base font-bold">
                Selecciona un tipo de torneo
              </ToastTitle>
              <ToastDescription>
                Debes elegir el tipo de torneo.
              </ToastDescription>
            </div>
          </div>
        ),
        variant: "default",
      });
      return;
    }
    setLoading(true);
    
    try {
      // Simular delay de IA
      await new Promise(res => setTimeout(res, 3000));
      
      // Obtener datos de comparación
      const data = await tennisPlayerService.getComparisonBasic(player1Name, player2Name, surface, tournamentType);
      
      // Realizar predicción
      const prediction = await predictApiService.predict(data);
      setProbabilities({
        p1: prediction.probability_p1_wins,
        p2: prediction.probability_p2_wins
      });
      setShowPrediction(true);
      confettiShown.current = false;

      // Actualizar créditos en el backend
      if (profile) {
        try {
          const updatedCreditData = await tennisPlayerService.updateCredit({
            firebase_uid: profile.firebase_uid,
            prediction_data: data,
            new_credits: 0
          });
          updateCredits(updatedCreditData.new_credits);
        } catch (creditError) {
          console.error("Error al actualizar créditos:", creditError);
          toast({
            description: "Error al actualizar créditos. Recarga la página para ver el estado actual.",
            variant: "destructive",
          });
        }
      }
    } catch (e) {
      toast({
        description: (
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-black shrink-0" />
            <div>
              <ToastTitle className="flex items-center gap-2 text-white text-base font-bold">
                Error
              </ToastTitle>
              <ToastDescription>
                No se pudo obtener la predicción. Intenta de nuevo.
              </ToastDescription>
            </div>
          </div>
        ),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showPrediction && probabilities && !confettiShown.current) {
      const winner = probabilities.p1 > probabilities.p2 ? "left" : probabilities.p2 > probabilities.p1 ? "right" : null;
      if (winner) {
        confettiShown.current = true;
        confetti({
          particleCount: 120,
          spread: 80,
          origin: winner === "left" ? { x: 0.18, y: 0.2 } : { x: 0.82, y: 0.2 },
          angle: winner === "left" ? 60 : 120,
          colors: winner === "left" ? ["#2563eb"] : ["#fde047"],
        });
      }
    }
  }, [showPrediction, probabilities]);

  return (
    <div className="bg-card rounded-lg p-6 border border-border flex flex-col items-center">
      <div className="flex items-center justify-center mb-8 gap-12">
        <span className="text-6xl font-bold text-white drop-shadow-lg">
          {h2hLoading ? '-' : leftWins}
        </span>
        <div className="w-60 h-60 rounded-full border-8 border-atp-blue flex items-center justify-center">
          <span className="text-5xl font-bold text-foreground">H2H</span>
        </div>
        <span className="text-6xl font-bold text-white drop-shadow-lg">
          {h2hLoading ? '-' : rightWins}
        </span>
      </div>

      <div className="w-full flex justify-center gap-8 mb-8">
        <div className="flex flex-col items-center">
          <label htmlFor="surface" className="mb-2 text-white font-semibold">Superficie</label>
          <div className="relative w-full min-w-[180px]">
            <select
              id="surface"
              className="bg-black/20 border-2 border-white text-white rounded-xl px-6 py-3 w-full shadow-md backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-atp-blue appearance-none pr-10"
              value={surface}
              onChange={e => setSurface(e.target.value)}
              style={{ WebkitTextFillColor: 'white', colorScheme: 'dark' }}
            >
              <option value="">Seleccionar</option>
              <option className="bg-black/80 text-white" value="Hard">Dura</option>
              <option className="bg-black/80 text-white" value="Clay">Arcilla</option>
              <option className="bg-black/80 text-white" value="Grass">Césped</option>
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <label htmlFor="tournament" className="mb-2 text-white font-semibold">Tipo de torneo</label>
          <div className="relative w-full min-w-[180px]">
            <select
              id="tournament"
              className="bg-black/20 border-2 border-white text-white rounded-xl px-6 py-3 w-full shadow-md backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-atp-blue appearance-none pr-10"
              value={tournamentType}
              onChange={e => setTournamentType(e.target.value)}
              style={{ WebkitTextFillColor: 'white', colorScheme: 'dark' }}
            >
              <option value="">Seleccionar</option>
              <option className="bg-black/80 text-white" value="G">Grand Slam</option>
              <option className="bg-black/80 text-white" value="M">Masters 1000</option>
              <option className="bg-black/80 text-white" value="A">ATP Tour</option>
              <option className="bg-black/80 text-white" value="F">Tour Finals</option>
              <option className="bg-black/80 text-white" value="D">Davis Cup</option>
              <option className="bg-black/80 text-white" value="O">Olímpicos</option>
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center mb-8">
        <button
          className="bg-black/0 border-2 border-white text-white px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 ease-in-out hover:bg-black/0 hover:scale-105 hover:shadow-lg disabled:opacity-60"
          style={{ backdropFilter: 'blur(2px)' }}
          onClick={handlePredict}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2 animate-pulse">
              <svg className="w-5 h-5 text-atp-blue animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              Prediciendo con IA...
            </span>
          ) : "Predecir"}
        </button>
      </div>

      {showPrediction && probabilities && (
        <div className="w-full max-w-md flex flex-col items-center">
          <span className="mb-2 text-lg font-semibold text-foreground">Probabilidad de victoria:</span>
          <div className="w-full bg-muted rounded-full h-8 flex overflow-hidden border border-border">
            <div
              className="h-full flex items-center justify-center bg-atp-blue text-white text-sm font-bold transition-all duration-500"
              style={{ width: `${Math.round(probabilities.p1 * 100)}%` }}
            >
              {Math.round(probabilities.p1 * 100)}%
            </div>
            <div
              className="h-full flex items-center justify-center bg-atp-yellow text-black text-sm font-bold transition-all duration-500"
              style={{ width: `${Math.round(probabilities.p2 * 100)}%` }}
            >
              {Math.round(probabilities.p2 * 100)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeadToHeadStats;