"use client";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
        credentials: "include", // ESSENCIAL para salvar o cookie!
      });
      if (!res.ok) {
        setError("Usuário ou senha inválidos");
        return;
      }
      // O backend já seta o cookie, recarregue a página:
      window.location.href = "/";
    } catch {
      setError("Erro ao conectar com o servidor");
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg("");
    setForgotLoading(true);
    // Simulação de envio de email
    setTimeout(() => {
      setForgotMsg("Se este e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.");
      setForgotLoading(false);
    }, 1500);
    // Para produção, faça um fetch para seu endpoint de recuperação de senha aqui
    // await fetch("/api/forgot-password", { ... });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-8 relative">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-100 rounded-full p-4 mb-2">
            <svg className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-blue-600 mt-2">Login</h2>
        </div>
        {!showForgot ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              className="border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Usuário ou E-mail"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
            />
            <input
              className="border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-500 cursor-pointer text-white font-semibold rounded px-4 py-2 hover:bg-blue-600 transition"
            >
              Entrar
            </button>
            {error && (
              <div className="text-red-600 text-center">{error}</div>
            )}
            <button
              type="button"
              className="text-blue-500 cursor-pointer hover:underline text-sm mt-2"
              onClick={() => setShowForgot(true)}
            >
              Esqueceu a senha?
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgot} className="flex flex-col gap-4">
            <div className="text-center text-blue-700 font-semibold mb-2">
              Recuperar senha
            </div>
            <input
              className="border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Digite seu e-mail"
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={forgotLoading}
              className="bg-blue-500 text-white font-semibold rounded px-4 py-2 hover:bg-blue-600 transition disabled:opacity-60"
            >
              {forgotLoading ? "Enviando..." : "Enviar"}
            </button>
            {forgotMsg && (
              <div className="text-green-600 text-center">{forgotMsg}</div>
            )}
            <button
              type="button"
              className="text-blue-500 hover:underline text-sm mt-2"
              onClick={() => setShowForgot(false)}
            >
              Voltar ao login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}