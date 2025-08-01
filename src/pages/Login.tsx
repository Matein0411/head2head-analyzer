
import { useState } from "react";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple email regex for client validation
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError("Por favor ingresa un email válido.");
      return;
    }
    if (password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres.");
      return;
    }

    setLoading(true);
    try {
      // Aquí iría la lógica real de autenticación (API call)
      // Simulación de éxito
      await new Promise(res => setTimeout(res, 600));
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "/";
    } catch (err) {
      setError("Error al iniciar sesión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="bg-card p-8 rounded-lg shadow-lg w-full max-w-sm border border-border"
        aria-label="Formulario de inicio de sesión"
        autoComplete="on"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Iniciar Sesión</h2>
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 border border-red-300 rounded px-3 py-2 text-sm text-center animate-pulse">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm mb-1 text-muted-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-atp-blue"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
            aria-invalid={!!error}
            aria-describedby={error ? "login-error" : undefined}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm mb-1 text-muted-foreground">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-atp-blue"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            minLength={4}
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-atp-blue text-white py-2 rounded font-semibold hover:bg-atp-blue/90 transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
};

export default Login;
