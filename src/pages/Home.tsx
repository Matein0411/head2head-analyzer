import grassImage from "@/assets/grass.png";
import CreditNotification from "@/components/CreditNotification";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/context/UserProfileContext";
import { useEffect, useRef, useState } from "react";
import { FaBrain, FaChartLine, FaUsers } from "react-icons/fa";

const Home = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [showCreditNotification, setShowCreditNotification] = useState(false);
  const [notificationCredits, setNotificationCredits] = useState(100);
  const hasShownNotification = useRef(false);

  // Verificar si se debe mostrar la notificación de créditos
  useEffect(() => {
    const shouldShowNotification = localStorage.getItem('showCreditNotification');
    const newUserCredits = localStorage.getItem('newUserCredits');
    
    if ((shouldShowNotification === 'true' || newUserCredits) && 
        user && !hasShownNotification.current) {
      
      const creditsToShow = newUserCredits ? parseInt(newUserCredits) : 100;
      setNotificationCredits(creditsToShow);
      
      setShowCreditNotification(true);
      hasShownNotification.current = true;
      
      localStorage.removeItem('showCreditNotification');
      localStorage.removeItem('newUserCredits');
    }
  }, [user, profile]);

  const handleCreditNotificationClose = () => {
    setShowCreditNotification(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-secondary">
      <Header />
      
      {/* Contenedor del cuerpo con barras laterales */}
      <div className="flex relative min-h-[calc(100vh-80px)]">
        {/* Barra Lateral Izquierda */}
        <div className="hidden lg:flex w-64 bg-[#FFFFF0] items-center justify-center">
          <img 
            src={grassImage} 
            alt="Grass court left" 
            className="w-full h-full object-cover opacity-90"
            style={{ objectPosition: 'left center' }}
          />
        </div>

        {/* Contenido central con ancho fijo */}
        <div className="flex-1 flex flex-col">
          {/* Hero Section */}
          <section className="flex flex-col items-center justify-center py-24 px-4 text-center relative overflow-hidden bg-gradient-to-b from-transparent via-background/50 to-card/30">
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="w-full h-full bg-[url('/public/tennis-icon.png')] bg-no-repeat bg-center bg-contain opacity-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground drop-shadow-2xl mb-6 z-10 animate-fade-in">
              Head2Head Analyzer
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 z-10 animate-fade-in leading-relaxed" style={{ animationDelay: '200ms' }}>
              La plataforma inteligente para comparar jugadores de tenis, predecir resultados y descubrir estadísticas clave en segundos. ¡Impulsa tu análisis y toma mejores decisiones!
            </p>
            <a href="/Predict" className="inline-block bg-gradient-to-r from-primary to-primary/80 hover:from-accent hover:to-accent/90 text-primary-foreground hover:text-accent-foreground font-bold px-8 py-4 rounded-full shadow-2xl hover:shadow-accent/25 transition-all duration-300 text-lg z-10 animate-pop transform hover:scale-105" style={{ animationDelay: '400ms' }}>
              Probar ahora
            </a>
            <div className="absolute left-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-60 animate-float" />
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl opacity-50 animate-float-reverse" />
          </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-black/80 via-gray-900/90 to-gray-800/80 py-16 px-4 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 animate-fade-in text-center">
          <span className="text-transparent bg-gradient-to-r from-yellow-400/80 to-amber-600/60 bg-clip-text">
            ¿Por qué elegir<br />
            Head to Head Analyzer?
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/90 rounded-xl p-6 shadow-lg border border-slate-600/40 hover:border-primary/50 flex flex-col items-center animate-fade-in transition-all duration-300 transform hover:scale-105 group">
            <div className="mb-5 p-3 rounded-full bg-slate-600/30 border border-slate-500/40 group-hover:bg-primary/20 group-hover:border-primary/60 transition-all duration-300">
              <FaUsers className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-3 text-center group-hover:text-primary/90 transition-colors duration-300">Comparación instantánea</h3>
            <p className="text-slate-300 text-center leading-relaxed text-sm transition-colors duration-300">Compara cualquier par de jugadores ATP y obtén estadísticas clave, historial y predicciones en segundos.</p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/90 rounded-xl p-6 shadow-lg border border-slate-600/40 hover:border-yellow-400 flex flex-col items-center animate-fade-in transition-all duration-300 transform hover:scale-105 group" style={{ animationDelay: '200ms' }}>
            <div className="mb-5 p-3 rounded-full bg-slate-600/30 border border-slate-500/40 group-hover:bg-primary/20 group-hover:border-primary/60 transition-all duration-300">
              <FaBrain className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-3 text-center group-hover:text-yellow-400 transition-colors duration-300">Predicción con IA</h3>
            <p className="text-slate-300 text-center leading-relaxed text-sm transition-colors duration-300">Nuestra IA analiza datos históricos y actuales para predecir el resultado más probable de cada enfrentamiento.</p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/90 rounded-xl p-6 shadow-lg border border-slate-600/40 hover:border-primary/50 flex flex-col items-center animate-fade-in transition-all duration-300 transform hover:scale-105 group" style={{ animationDelay: '400ms' }}>
            <div className="mb-5 p-3 rounded-full bg-slate-600/30 border border-slate-500/40 group-hover:bg-primary/20 group-hover:border-primary/60 transition-all duration-300">
              <FaChartLine className="w-12 h-12 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-3 text-center group-hover:text-primary/90 transition-colors duration-300">Datos históricos</h3>
            <p className="text-slate-300 text-center leading-relaxed text-sm transition-colors duration-300">Accede al rendimiento histórico de cada jugador con estadísticas detalladas de torneos y superficies.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 flex flex-col items-center bg-gradient-to-br from-background via-card to-secondary relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="w-full max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
              <span className="text-transparent bg-gradient-to-r from-blue-400/80 to-cyan-600/60 bg-clip-text">
                Predicciones inteligentes
              </span>
            </h3>
            <p className="text-xl text-muted-foreground">Paga solo por lo que uses, sin compromisos</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Trial */}
            <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/90 rounded-xl p-6 shadow-lg border border-slate-600/40 hover:border-primary/50 transition-all duration-300 transform hover:scale-105 group">
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-600/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-500/40 group-hover:bg-primary/20 group-hover:border-primary/60 transition-all duration-300">
                  <span className="text-green-400 text-xl">🎁</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-primary/90 transition-colors duration-300">Registro gratuito</h4>
                <p className="text-3xl font-bold text-green-400 mb-1">100</p>
                <p className="text-sm text-slate-400 mb-4 group-hover:text-slate-300 transition-colors duration-300">crédito de bienvenida</p>
                <p className="text-slate-300 text-sm group-hover:text-slate-200 transition-colors duration-300">Prueba la plataforma sin costo inicial</p>
              </div>
            </div>

            {/* Per Prediction */}
            <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/90 rounded-xl p-6 shadow-lg border border-slate-600/40 hover:border-yellow-400 transition-all duration-300 transform hover:scale-105 group">
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-600/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-500/40 group-hover:bg-primary/20 group-hover:border-primary/60 transition-all duration-300">
                  <span className="text-blue-400 text-xl">⚡</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">Por predicción</h4>
                <p className="text-3xl font-bold text-blue-400 mb-1">0.20</p>
                <p className="text-sm text-slate-400 mb-4 group-hover:text-slate-300 transition-colors duration-300">análisis con IA</p>
                <p className="text-slate-300 text-sm group-hover:text-slate-200 transition-colors duration-300">Predicciones precisas usando machine learning</p>
              </div>
            </div>

            {/* Flexible */}
            <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/90 rounded-xl p-6 shadow-lg border border-slate-600/40 hover:border-primary/50 transition-all duration-300 transform hover:scale-105 group">
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-600/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-500/40 group-hover:bg-primary/20 group-hover:border-primary/60 transition-all duration-300">
                  <span className="text-purple-400 text-xl">🔄</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-primary/90 transition-colors duration-300">Recarga flexible</h4>
                <p className="text-3xl font-bold text-yellow-400 mb-1">+$5</p>
                <p className="text-sm text-slate-400 mb-4 group-hover:text-slate-300 transition-colors duration-300">mínimo de recarga</p>
                <p className="text-slate-300 text-sm group-hover:text-slate-200 transition-colors duration-300">Agrega créditos cuando los necesites</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <a href="/Plans" className="inline-block bg-gradient-to-r from-primary to-primary/80 hover:from-accent hover:to-accent/90 text-primary-foreground hover:text-accent-foreground font-bold px-8 py-4 rounded-full shadow-2xl hover:shadow-accent/25 transition-all duration-300 text-lg transform hover:scale-105">
              Ver Planes
            </a>
          </div>
        </div>
      </section>
        </div>

        {/* Barra Lateral Derecha */}
        <div className="hidden lg:flex w-64 bg-[#FFFFF0] items-center justify-center">
          <img 
            src={grassImage} 
            alt="Grass court right" 
            className="w-full h-full object-cover opacity-90"
            style={{ objectPosition: 'right center' }}
          />
        </div>
      </div>

      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 1s ease forwards;
            opacity: 0;
          }
          @keyframes fadeIn {
            to { opacity: 1; }
          }
          .animate-pop {
            animation: popIn 0.7s cubic-bezier(.17,.67,.83,.67) forwards;
            opacity: 0;
          }
          @keyframes popIn {
            0% { transform: scale(0.7); opacity: 0; }
            80% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite alternate;
          }
          .animate-float-reverse {
            animation: floatReverse 6s ease-in-out infinite alternate;
          }
          @keyframes float {
            0% { transform: translateY(0) scale(1); }
            100% { transform: translateY(-30px) scale(1.1); }
          }
          @keyframes floatReverse {
            0% { transform: translateY(0) scale(1); }
            100% { transform: translateY(30px) scale(1.1); }
          }
        `}
      </style>

      <Footer />

      {/* Notificación de créditos */}
      <CreditNotification
        isVisible={showCreditNotification}
        onClose={handleCreditNotificationClose}
        credits={notificationCredits}
      />
    </div>
  );
};

export default Home;