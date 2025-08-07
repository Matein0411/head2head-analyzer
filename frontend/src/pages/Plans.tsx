import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { FaBolt, FaCheck, FaCrown, FaGift, FaStar, FaTelegram } from "react-icons/fa";

const Plans = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-secondary">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground drop-shadow-2xl mb-6 animate-fade-in">
            <span className="text-transparent bg-gradient-to-r from-blue-400 via-amber-400 to-yellow-500 bg-clip-text">
              Elige tu Plan
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in leading-relaxed" style={{ animationDelay: '200ms' }}>
            Encuentra el plan perfecto para tu nivel de análisis. Desde explorar gratis hasta análisis profesional ilimitado.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {/* Plan Gratuito */}
          <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/90 rounded-2xl p-8 shadow-2xl border border-slate-600/40 hover:border-green-400/60 transition-all duration-300 transform hover:scale-105 group relative flex flex-col">
            <div className="absolute top-4 right-4">
              <FaGift className="w-8 h-8 text-green-400 opacity-80" />
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors duration-300">
                Plan Gratuito
              </h3>
              <div className="text-4xl font-bold text-green-400 mb-2">$0</div>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">USD</p>
            </div>

            <div className="space-y-4 mb-8 flex-grow">
              <div className="flex items-center space-x-3">
                <FaCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                  <strong className="text-green-400">100 créditos</strong> de bienvenida
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheck className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <span className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                  Cara a cara simple
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheck className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                  Predicciones de partidos futuros <span className="text-blue-400">(5 predicciones)</span>
                </span>
              </div>
            </div>

            <div className="bg-slate-600/30 rounded-lg p-4 mb-6 border border-slate-500/40">
              <p className="text-sm text-slate-300 text-center">
                <FaStar className="w-4 h-4 text-yellow-400 inline mr-2" />
                Ideal para usuarios nuevos o curiosos que quieren explorar las funciones
              </p>
            </div>

            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-4 rounded-full shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 mt-auto">
              Comenzar Gratis
            </button>
          </div>

          {/* Plan Premium */}
          <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/90 rounded-2xl p-8 shadow-2xl border-2 border-blue-400/60 hover:border-blue-300/80 transition-all duration-300 transform hover:scale-105 group relative flex flex-col">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                MÁS POPULAR
              </div>
            </div>
            
            <div className="absolute top-4 right-4">
              <FaBolt className="w-8 h-8 text-blue-400 opacity-80" />
            </div>
            
            <div className="text-center mb-8 mt-4">
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                Plan Premium
              </h3>
              <div className="text-4xl font-bold text-blue-400 mb-2">$5.00</div>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">USD</p>
            </div>

            <div className="space-y-4 mb-8 flex-grow">
              <div className="flex items-center space-x-3">
                <FaCheck className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                  <strong className="text-blue-400">200 créditos</strong> incluidos
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheck className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <span className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                  Cara a cara simple
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheck className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                  Predicciones de partidos futuros <span className="text-blue-400">(10 predicciones)</span>
                </span>
              </div>
            </div>

            <div className="bg-blue-900/30 rounded-lg p-4 mb-6 border border-blue-500/40">
              <p className="text-sm text-slate-300 text-center">
                <FaBolt className="w-4 h-4 text-blue-400 inline mr-2" />
                Flexible y sin compromiso, ideal para acceso puntual o seguir torneos
              </p>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-6 py-4 rounded-full shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 mt-auto">
              Comprar Premium
            </button>
          </div>

          {/* Plan VIP */}
          <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/90 rounded-2xl p-8 shadow-2xl border border-slate-600/40 hover:border-purple-400/60 transition-all duration-300 transform hover:scale-105 group relative flex flex-col hover:shadow-purple-500/50 hover:shadow-2xl animate-pulse-glow">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <div className="relative">
              <div className="absolute top-4 right-4">
                <FaCrown className="w-8 h-8 text-purple-400 opacity-80 group-hover:animate-bounce" />
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">
                  Plan VIP
                </h3>
                <div className="text-4xl font-bold text-purple-400 mb-2 group-hover:animate-pulse">$10.00</div>
                <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">USD</p>
              </div>

              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex items-center space-x-3">
                  <FaCheck className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <span className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                    <strong className="text-purple-400">500 créditos</strong> incluidos
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheck className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                    Cara a cara simple
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheck className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                    Predicciones de partidos futuros <span className="text-blue-400">(25 predicciones)</span>
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaTelegram className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                    Acceso al <strong className="text-cyan-400">bot de Telegram</strong> con notificaciones
                  </span>
                </div>
              </div>

              <div className="bg-purple-900/30 rounded-lg p-4 mb-6 border border-purple-500/40 group-hover:bg-purple-800/40 group-hover:border-purple-400/60 transition-all duration-300">
                <p className="text-sm text-slate-300 text-center">
                  <FaCrown className="w-4 h-4 text-purple-400 inline mr-2" />
                  Para usuarios VIP que requieren análisis completo y notificaciones automáticas
                </p>
              </div>

              <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold px-6 py-4 rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 mt-auto group-hover:shadow-purple-400/50">
                Acceso VIP
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-2xl p-8 border border-slate-600/40">
          <h3 className="text-2xl font-bold text-white mb-4">
            ¿No estás seguro? <span className="text-blue-400">¡Comienza gratis!</span>
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Explora todas las funciones con tus créditos de bienvenida. Sin compromisos, sin tarjetas de crédito requeridas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/SignUp" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
              Registrarse Gratis
            </a>
            <a href="/Login" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105">
              Ya tengo cuenta
            </a>
          </div>
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
          
          .animate-pulse-glow {
            animation: pulseGlow 3s ease-in-out infinite;
          }
          @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
            50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.4); }
          }
          
          .animate-tilt {
            animation: tilt 10s infinite linear;
          }
          @keyframes tilt {
            0%, 50%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(1deg); }
            75% { transform: rotate(-1deg); }
          }
        `}
      </style>

      <Footer />
    </div>
  );
};

export default Plans;