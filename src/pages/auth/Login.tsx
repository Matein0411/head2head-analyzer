import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase.tsx";
import { tennisPlayerService } from "@/services/tennisPlayer.service";
import { GoogleAuthProvider, signInWithPopup, UserCredential } from "firebase/auth"; // Importa UserCredential si usas TS estricto
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate(); 

  useEffect(() => {
    if (user) {
      navigate("/"); 
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col justify-center items-center">
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col items-center mb-8 mt-8">
          <img src="/tennis-icon.png" alt="Logo TennAI" className="w-24 h-24 object-contain mb-2 drop-shadow-lg" />
          <div className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">TennAI</div>
          <div className="text-base text-gray-300 mb-2">la ia a tu alcance</div>
        </div>
        <div className="bg-white/95 rounded-2xl shadow-2xl px-8 py-10 w-full max-w-md flex flex-col items-center gap-6 border border-gray-200">
          <h1 className="font-bold text-2xl text-center text-gray-900 mb-2">Iniciar sesión</h1>
          <form className="flex flex-col gap-3 w-full">
            <input
              placeholder="Enter your email"
              type="email"
              name="user-email"
              id="user-email"
              className="px-3 py-2 rounded-xl border focus:outline-none w-full"
            />
            <input
              placeholder="Enter your password"
              type="password"
              name="user-password"
              id="user-password"
              className="px-3 py-2 rounded-xl border focus:outline-none w-full"
            />
            <button className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500 rounded-lg py-2 font-semibold shadow transition-all duration-200">Login</button>
          </form>
          <div className="flex justify-between w-full">
            <Link to="/SignUp" className="font-semibold text-sm text-[#1f50aa] hover:text-[#173b8a] hover:underline transition-colors">
              New? Create an account
            </Link>
            <Link to="/ForgetPassword" className="font-semibold text-sm text-[#1f50aa] hover:text-[#173b8a] hover:underline transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="w-full border-t border-gray-200 my-2"></div>
          <SignInWithGoogleComponent />
        </div>
      </div>
    </div>
  );
}

function SignInWithGoogleComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const userCredential: UserCredential = await signInWithPopup(auth, new GoogleAuthProvider());
      await tennisPlayerService.syncUser();
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };
  return (
    <button
      disabled={isLoading}
      onClick={handleLogin}
      className={`bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100 text-gray-900 rounded-full px-6 py-3 font-bold shadow-md text-lg flex items-center gap-3 transition-all duration-200 backdrop-blur-sm border border-yellow-300/70 ${
        isLoading ? "opacity-50 cursor-not-allowed" : "hover:from-yellow-400 hover:to-yellow-200"
      }`}
    >
      {isLoading ? "Cargando..." : (
        <span className="flex items-center justify-center gap-2">
          <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_17_40)"><path d="M47.532 24.552c0-1.636-.147-3.2-.42-4.704H24.48v9.12h13.008c-.56 2.96-2.24 5.456-4.768 7.136v5.888h7.712c4.52-4.16 7.1-10.288 7.1-17.44z" fill="#4285F4"/><path d="M24.48 48c6.48 0 11.92-2.144 15.888-5.824l-7.712-5.888c-2.144 1.44-4.88 2.288-8.176 2.288-6.288 0-11.616-4.24-13.536-9.968H2.56v6.176C6.528 43.36 14.016 48 24.48 48z" fill="#34A853"/><path d="M10.944 28.608A14.88 14.88 0 0 1 9.6 24c0-1.6.288-3.152.8-4.608v-6.176H2.56A23.98 23.98 0 0 0 0 24c0 3.872.928 7.52 2.56 10.784l8.384-6.176z" fill="#FBBC05"/><path d="M24.48 9.6c3.52 0 6.656 1.216 9.136 3.584l6.832-6.832C36.384 2.144 30.96 0 24.48 0 14.016 0 6.528 4.64 2.56 13.216l8.384 6.176c1.92-5.728 7.248-9.792 13.536-9.792z" fill="#EA4335"/></g><defs><clipPath id="clip0_17_40"><path fill="#fff" d="M0 0h48v48H0z"/></clipPath></defs></svg>
          Iniciar sesión con Google
        </span>
      )}
    </button>
  );
}
