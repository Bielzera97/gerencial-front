"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/Context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      router.push("/clients");
    } else {
      setError("Usuário ou senha inválidos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-16 text-center">
          Logo
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <input
            className="border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <input
            className="border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold rounded px-4 py-2 hover:bg-blue-600 transition"
          >
            Entrar
          </button>
          {error && (
            <div className="text-red-600 text-center">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
}