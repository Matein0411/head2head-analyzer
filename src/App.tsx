import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthContextProvider from "./context/AuthContext";
import { UserProfileProvider } from "./context/UserProfileContext";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Predict from "./pages/Predict";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    return <Navigate to="/Login" replace />;
  }
  return children;
};

const App = () => (
  <AuthContextProvider>
    <UserProfileProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/Login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/Predict"
              element={
                <PrivateRoute>
                  <Predict />
                </PrivateRoute>
              }
            />
            <Route path="/SignUp" 
            element={<PrivateRoute>
              <SignUp />
              </PrivateRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </UserProfileProvider>
  </AuthContextProvider>
);

export default App;