import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/context/UserProfileContext";
import { auth } from "@/lib/firebase";
import { tennisPlayerService } from "@/services/tennisPlayer.service";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SignUp() {
  const { user } = useAuth();
  const { setProfileManually } = useUserProfile();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Redirige al usuario a la página principal si ya ha iniciado sesión
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Maneja los cambios en los campos del formulario
  const handleData = (key: string, value: string) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  // Proceso principal para registrar un nuevo usuario
  const handleSignUp = async () => {
    // Validación de campos
    if (!data.name || !data.email || !data.password) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }
    if (data.password.length < 6) {
        toast.error("La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    setIsLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(credential.user, { displayName: data.name });
      await credential.user.reload();
      const idToken = await credential.user.getIdToken(true);
      
      const userProfile = await tennisPlayerService.syncUser();
      setProfileManually(userProfile);
      
      // Marcar que se debe mostrar la notificación de créditos en el Home
      localStorage.setItem('showCreditNotification', 'true');
      localStorage.setItem('newUserCredits', userProfile.credits.toString());
      
      // Pequeño delay para asegurar que el contexto se propague
      await new Promise(resolve => setTimeout(resolve, 200));
      
      navigate("/");

    } catch (error: any) {
      console.error("Error en el registro:", error);
      toast.error(error?.message || "Ocurrió un error al crear la cuenta.");
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col justify-center items-center px-4 py-6">
      <section className="flex flex-col items-center w-full">
        <div className="flex flex-col items-center mb-6 sm:mb-8 mt-4 sm:mt-8">
          <img src="/tennis-icon.png" alt="Logo TennAI" className="w-24 h-24 object-contain mb-2 drop-shadow-lg" />
          <div className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">TennAI</div>
          <div className="text-sm sm:text-base text-gray-300 mb-2">la IA a tu alcance</div>
        </div>
        <div className="bg-white/95 rounded-2xl shadow-2xl px-4 sm:px-8 py-6 sm:py-10 w-full max-w-md flex flex-col items-center gap-4 sm:gap-6 border border-gray-200">
          <h1 className="font-bold text-xl sm:text-2xl text-center text-gray-900 mb-2">Crear una Cuenta</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp();
            }}
            className="flex flex-col gap-3 w-full"
          >
            <input
              placeholder="Tu Nombre"
              type="text"
              required
              className="px-3 py-3 sm:py-2 rounded-xl border border-gray-300 focus:outline-none w-full text-base text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={data.name}
              onChange={(e) => handleData("name", e.target.value)}
            />
            <input
              placeholder="Tu Email"
              type="email"
              required
              className="px-3 py-3 sm:py-2 rounded-xl border border-gray-300 focus:outline-none w-full text-base text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={data.email}
              onChange={(e) => handleData("email", e.target.value)}
            />
            <input
              placeholder="Tu Contraseña (mín. 6 caracteres)"
              type="password"
              required
              minLength={6}
              className="px-3 py-3 sm:py-2 rounded-xl border border-gray-300 focus:outline-none w-full text-base text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={data.password}
              onChange={(e) => handleData("password", e.target.value)}
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500 rounded-lg py-3 sm:py-2 font-semibold shadow transition-all duration-200 text-base disabled:opacity-50"
            >
              {isLoading ? "Creando cuenta..." : "Registrarse"}
            </button>
          </form>
          <div className="flex justify-center mt-2">
            <Link to="/login" className="font-semibold text-sm text-[#1f50aa] hover:text-[#173b8a] hover:underline transition-colors">
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
