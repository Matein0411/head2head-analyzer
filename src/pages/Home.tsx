import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { FaBolt, FaDollarSign, FaRegCreditCard } from "react-icons/fa";
import AnimatedFeature from "../components/AnimatedFeature";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-yellow-400 flex flex-col">
      <Header />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none animate-gradient-move">
          <div className="w-full h-full bg-[url('/public/tennis-icon.png')] bg-no-repeat bg-center bg-contain opacity-20" />
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg mb-6 z-10 animate-fade-in">
          Head2Head Analyzer
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-8 z-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
          La plataforma inteligente para comparar jugadores de tenis, predecir resultados y descubrir estadísticas clave en segundos. ¡Impulsa tu análisis y toma mejores decisiones!
        </p>
        <a href="/Predict" className="inline-block bg-atp-blue text-white font-bold px-8 py-4 rounded-full shadow-lg hover:bg-atp-yellow hover:text-black transition-all text-lg z-10 animate-pop" style={{ animationDelay: '400ms' }}>
          Probar ahora
        </a>
        <div className="absolute left-0 top-0 w-32 h-32 bg-atp-yellow rounded-full blur-2xl opacity-30 animate-float" />
        <div className="absolute right-0 bottom-0 w-32 h-32 bg-atp-blue rounded-full blur-2xl opacity-30 animate-float-reverse" />
      </section>

      {/* Features Section */}
      <section className="bg-black/80 py-16 px-4 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-atp-yellow mb-8 animate-fade-in">¿Por qué elegir Head2Head Analyzer?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-5xl">
          <AnimatedFeature
            icon={<img src="/public/tennis-icon.png" alt="Comparación" className="w-16 h-16" />}
            title="Comparación instantánea"
            description="Compara cualquier par de jugadores ATP/WTA y obtén estadísticas clave, historial y predicciones en segundos."
            delay={0}
          />
          <AnimatedFeature
            icon={<img src="/public/placeholder.svg" alt="Predicción" className="w-16 h-16" />}
            title="Predicción con IA"
            description="Nuestra IA analiza datos históricos y actuales para predecir el resultado más probable de cada enfrentamiento."
            delay={200}
          />
          <AnimatedFeature
            icon={<img src="/public/tennis-icon.png" alt="Estadísticas" className="w-16 h-16" />}
            title="Estadísticas visuales"
            description="Visualiza porcentajes, gráficos y tendencias para tomar decisiones informadas y mejorar tu análisis."
            delay={400}
          />
        </div>
      </section>
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
    .animate-bounce-slow {
      animation: bounceSlow 2.5s infinite;
    }
    @keyframes bounceSlow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-16px); }
    }
    .animate-gradient-move {
      animation: gradientMove 8s linear infinite alternate;
    }
    @keyframes gradientMove {
      0% { background-position: left top; }
      100% { background-position: right bottom; }
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
      {/* AI Credits Section (fondo transparente con iconos) */}
      <section className="py-16 px-4 flex flex-col items-center bg-transparent">
        <div className="w-full max-w-2xl bg-black/40 backdrop-blur-md rounded-2xl p-8 shadow-xl flex flex-col items-center border border-atp-blue animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <FaRegCreditCard className="text-lime-400 text-3xl" />
            <h3 className="text-2xl font-bold text-white">AI Credits: paga solo por lo que usas</h3>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2 justify-center">
              <FaDollarSign className="text-lime-400 text-xl flex-shrink-0" />
              <p className="text-base text-gray-200 text-center flex-1">Al registrarte recibes <span className="font-bold text-atp-yellow">$1 USD gratis</span> para probar la plataforma.</p>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <FaBolt className="text-lime-400 text-xl flex-shrink-0" />
              <p className="text-base text-gray-200 text-center flex-1">Cada predicción con IA cuesta <span className="font-bold text-atp-yellow">$0.20 USD</span> y se descuenta automáticamente de tu saldo.</p>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <FaRegCreditCard className="text-lime-400 text-xl flex-shrink-0" />
              <p className="text-base text-gray-200 text-center flex-1">Puedes recargar tu saldo en cualquier momento y seguir disfrutando de análisis avanzados sin límites.</p>
            </div>
          </div>
          <a href="/  " className="inline-block bg-atp-blue text-white font-bold px-6 py-3 rounded-full shadow hover:bg-atp-yellow hover:text-black transition-all text-base animate-pop mt-6" style={{ animationDelay: '800ms' }}>
            Registrarse y obtener $1 gratis
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
