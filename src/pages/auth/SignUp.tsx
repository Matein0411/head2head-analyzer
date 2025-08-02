import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { tennisPlayerService } from "@/services/tennisPlayer.service";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SignUp() {
  const { user } = useAuth();
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
      // Recarga el usuario para asegurar que displayName esté actualizado
      await credential.user.reload();
      // Fuerza la regeneración del token para que incluya el displayName actualizado
      const idToken = await credential.user.getIdToken(true); // Aquí obtienes el token

      await tennisPlayerService.syncUser();

      toast.success("¡Cuenta creada con éxito!");
      
      // 4. Redirige al usuario a la página principal
      navigate("/");

    } catch (error: any) {
      toast.error(error?.message || "Ocurrió un error al crear la cuenta.");
    }
    setIsLoading(false);
  };

  return (
    <main className="w-full flex justify-center items-center bg-gradient-to-br from-black via-gray-900 to-gray-800 md:p-24 p-10 min-h-screen">
      <section className="flex flex-col gap-3">
        <div className="flex justify-center">
          <img className="h-24 w-24 object-contain" src="/tennis-icon.png" alt="Logo" />
        </div>
        <div className="flex flex-col gap-3 bg-white/95 md:p-10 p-5 rounded-2xl md:min-w-[440px] w-full shadow-2xl">
          <h1 className="font-bold text-2xl text-center text-black">Crear una Cuenta</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp();
            }}
            className="flex flex-col gap-4"
          >
            <input
              placeholder="Tu Nombre"
              type="text"
              required
              className="px-3 py-2 rounded-xl border focus:outline-none w-full text-black placeholder-gray-500"
              value={data.name}
              onChange={(e) => handleData("name", e.target.value)}
            />
            <input
              placeholder="Tu Email"
              type="email"
              required
              className="px-3 py-2 rounded-xl border focus:outline-none w-full text-black placeholder-gray-500"
              value={data.email}
              onChange={(e) => handleData("email", e.target.value)}
            />
            <input
              placeholder="Tu Contraseña (mín. 6 caracteres)"
              type="password"
              required
              minLength={6}
              className="px-3 py-2 rounded-xl border focus:outline-none w-full text-black placeholder-gray-500"
              value={data.password}
              onChange={(e) => handleData("password", e.target.value)}
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500 rounded-lg py-2 font-semibold shadow transition-all duration-200 disabled:opacity-50"
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
