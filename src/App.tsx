import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthContextProvider, { useAuth } from "./context/AuthContext";
import { UserProfileProvider } from "./context/UserProfileContext";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Plans from "./pages/Plans";
import Predict from "./pages/Predict";

const queryClient = new QueryClient();

// Componente de carga mientras se verifica la autenticación
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-background via-card to-secondary flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <img src="/tennis-icon.png" alt="Logo TennAI" className="w-16 h-16 object-contain animate-pulse" />
      <div className="text-xl font-semibold text-foreground">Cargando...</div>
    </div>
  </div>
);

// Ruta protegida que usa el contexto de autenticación
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/Login" replace />;
  }
  
  return children;
};

// Componente de rutas que debe estar dentro del AuthContext
const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/Login" element={<Login />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/" element={<Home />} />
      <Route path="/Plans" element={<Plans />} />
      <Route
        path="/Predict"
        element={
          <PrivateRoute>
            <Predict />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const App = () => (
  <AuthContextProvider>
    <UserProfileProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </QueryClientProvider>
    </UserProfileProvider>
  </AuthContextProvider>
);

export default App;