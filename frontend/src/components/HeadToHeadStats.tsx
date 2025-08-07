import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUserProfile } from "@/context/UserProfileContext";
import { toast } from "@/hooks/use-toast";
import { predictApiService } from "@/services/predictApi.service";
import { tennisPlayerService } from "@/services/tennisPlayer.service";
import confetti from "canvas-confetti";
import { AlertTriangle, CreditCard } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast as sonnerToast } from "sonner";

interface HeadToHeadStatsProps {
  player1Name?: string;
  player2Name?: string;
  surface?: string;
  tournamentType?: string;
  onSurfaceChange?: (value: string) => void;
  onTournamentTypeChange?: (value: string) => void;
}

const HeadToHeadStats = (props: HeadToHeadStatsProps) => {
  const navigate = useNavigate();
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
  const [showCreditsModal, setShowCreditsModal] = useState(false);
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
    // Verificar si el usuario tiene créditos
    if (profile?.credits === 0) {
      setShowCreditsModal(true);
      return;
    }

    if (!player1Name || !player2Name) {
      sonnerToast.error(
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
          <div>
            <div className="flex items-center gap-2 text-yellow-700 text-base font-bold">
              Completa ambos jugadores
            </div>
            <div className="text-muted-foreground">
              Debes buscar ambos jugadores antes de predecir.
            </div>
          </div>
        </div>
      );
      return;
    }
    if (!surface) {
      sonnerToast.error(
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
          <div>
            <div className="flex items-center gap-2 text-yellow-700 text-base font-bold">
              Selecciona una superficie
            </div>
            <div className="text-muted-foreground">
              Debes elegir la superficie del partido.
            </div>
          </div>
        </div>
      );
      return;
    }
    if (!tournamentType) {
      sonnerToast.error(
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
          <div>
            <div className="flex items-center gap-2 text-yellow-700 text-base font-bold">
              Selecciona un tipo de torneo
            </div>
            <div className="text-muted-foreground">
              Debes elegir el tipo de torneo.
            </div>
          </div>
        </div>
      );
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
      sonnerToast.error(
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
          <div>
            <div className="flex items-center gap-2 text-red-700 text-base font-bold">
              Error
            </div>
            <div className="text-muted-foreground">
              No se pudo obtener la predicción. Intenta de nuevo.
            </div>
          </div>
        </div>
      );
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
    <div className="bg-card rounded-lg p-4 md:p-6 border border-border flex flex-col items-center w-full">
      {/* H2H Display - Responsive */}
      <div className="flex items-center justify-center mb-6 md:mb-8 gap-4 md:gap-8 lg:gap-12 w-full">
        <span className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
          {h2hLoading ? '-' : leftWins}
        </span>
        <div className="w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 rounded-full border-4 md:border-6 lg:border-8 border-atp-blue flex items-center justify-center flex-shrink-0">
          <span className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground">H2H</span>
        </div>
        <span className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
          {h2hLoading ? '-' : rightWins}
        </span>
      </div>

      {/* Filters - Stack on mobile, side by side on desktop */}
      <div className="w-full flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-6 md:mb-8">
        <div className="flex flex-col items-center w-full md:w-auto">
          <label htmlFor="surface" className="mb-2 text-white font-semibold text-sm md:text-base">Superficie</label>
          <div className="relative w-full md:min-w-[180px] max-w-xs">
            <select
              id="surface"
              className="bg-black/20 border-2 border-white text-white rounded-xl px-4 md:px-6 py-2 md:py-3 w-full shadow-md backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-atp-blue appearance-none pr-10 text-sm md:text-base"
              value={surface}
              onChange={e => setSurface(e.target.value)}
              style={{ WebkitTextFillColor: 'white', colorScheme: 'dark' }}
            >
              <option value="">Seleccionar</option>
              <option className="bg-black/80 text-white" value="Hard">Dura</option>
              <option className="bg-black/80 text-white" value="Clay">Arcilla</option>
              <option className="bg-black/80 text-white" value="Grass">Césped</option>
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col items-center w-full md:w-auto">
          <label htmlFor="tournament" className="mb-2 text-white font-semibold text-sm md:text-base">Tipo de torneo</label>
          <div className="relative w-full md:min-w-[180px] max-w-xs">
            <select
              id="tournament"
              className="bg-black/20 border-2 border-white text-white rounded-xl px-4 md:px-6 py-2 md:py-3 w-full shadow-md backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-atp-blue appearance-none pr-10 text-sm md:text-base"
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
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Predict Button */}
      <div className="w-full flex justify-center mb-6 md:mb-8">
        <button
          className={`border-2 px-6 md:px-8 py-2 md:py-3 rounded-full font-semibold text-base md:text-lg transition-all duration-300 ease-in-out w-full max-w-xs md:w-auto ${
            profile?.credits === 0
              ? 'bg-orange-500/20 border-orange-500 text-orange-400 hover:bg-orange-500/30 hover:scale-105'
              : 'bg-black/0 border-white text-white hover:bg-black/0 hover:scale-105 hover:shadow-lg'
          } disabled:opacity-60`}
          style={{ backdropFilter: 'blur(2px)' }}
          onClick={handlePredict}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2 animate-pulse">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-atp-blue animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              <span className="text-sm md:text-base">Prediciendo con IA...</span>
            </span>
          ) : profile?.credits === 0 ? (
            <span className="flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Sin créditos - recargar</span>
            </span>
          ) : "Predecir"}
        </button>
      </div>

      {/* Prediction Results */}
      {showPrediction && probabilities && (
        <div className="w-full max-w-md flex flex-col items-center px-4 md:px-0">
          <span className="mb-3 text-base md:text-lg font-semibold text-foreground text-center">Probabilidad de victoria:</span>
          <div className="w-full bg-muted rounded-full h-8 md:h-10 flex overflow-hidden border border-border">
            <div
              className="h-full flex items-center justify-center bg-atp-blue text-white text-xs md:text-sm font-bold transition-all duration-500"
              style={{ width: `${Math.round(probabilities.p1 * 100)}%` }}
            >
              {Math.round(probabilities.p1 * 100)}%
            </div>
            <div
              className="h-full flex items-center justify-center bg-atp-yellow text-black text-xs md:text-sm font-bold transition-all duration-500"
              style={{ width: `${Math.round(probabilities.p2 * 100)}%` }}
            >
              {Math.round(probabilities.p2 * 100)}%
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para recargar créditos */}
      <AlertDialog open={showCreditsModal} onOpenChange={setShowCreditsModal}>
        <AlertDialogContent className="z-[200] fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-500" />
              Sin créditos disponibles
            </AlertDialogTitle>
            <AlertDialogDescription>
              Necesitas créditos para realizar predicciones con IA. ¿Te gustaría ver nuestros planes y recargar créditos?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setShowCreditsModal(false);
                navigate("/Plans");
              }}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Ver planes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HeadToHeadStats;