import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertDialogPortal,
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
      await signOut(auth);
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
      
      <AlertDialogPortal>
        <AlertDialogOverlay className="fixed inset-0 z-[200] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialogContent className="z-[200] fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
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
      </AlertDialogPortal>
    </AlertDialog>
  );
}