import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica real de autenticación
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="bg-card p-8 rounded-lg shadow-lg w-full max-w-sm border border-border">
        <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Iniciar Sesión</h2>
        <div className="mb-4">
          <label className="block text-sm mb-1 text-muted-foreground">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm mb-1 text-muted-foreground">Contraseña</label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-atp-blue text-white py-2 rounded font-semibold hover:bg-atp-blue/90 transition">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
