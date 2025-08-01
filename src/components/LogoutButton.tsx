import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; 
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export default function LogoutButton() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await toast.promise(signOut(auth), {
        loading: "Cerrando sesión...",
        success: "¡Sesión cerrada con éxito!",
        error: (e) => `Error: ${e.message}`,
      });
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="p-2 flex justify-center items-center rounded-full text-white hover:bg-gray-700 transition-colors"
          title="Cerrar sesión"
        >
          <LogOut size={18} />
        </button>
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción cerrará tu sesión actual en este dispositivo. Podrás volver a iniciar sesión cuando quieras.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>
            Sí, cerrar sesión
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}