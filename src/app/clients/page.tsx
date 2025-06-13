"use client";
import { useEffect, useState } from "react";

type Client = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
};

const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "" });
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/clients")
      .then((res) => res.json())
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleOpenModal = () => {
    setForm({ nome: "", email: "", telefone: "" });
    setError("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3001/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erro ao cadastrar cliente");
      const newClient = await res.json();
      setClients((prev) => [...prev, newClient]);
      setShowModal(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao cadastrar cliente");
      }
    } finally {
      setPosting(false);
    }
  };

  // Filtra os clientes pelo nome digitado
  const filteredClients = clients.filter((client) =>
    client.nome.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-4 md:ml-64">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-blue-600">Clientes</h1>
        <button
          onClick={handleOpenModal}
          className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Novo Cliente
        </button>
      </div>
      {/* Campo de filtro */}
      <div className="mb-4 max-w-xs">
        <input
          type="text"
          placeholder="Filtrar por nome..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-blue-500 py-8 justify-center">
          <svg
            className="animate-spin h-6 w-6 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span className="font-medium">Carregando...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead>
              <tr className="bg-blue-100">
                <th className="py-2 px-4 text-left text-blue-700">Nome</th>
                <th className="py-2 px-4 text-left text-blue-700">Email</th>
                <th className="py-2 px-4 text-left text-blue-700">Telefone</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-t hover:bg-blue-50">
                  <td className="py-2 px-4">{client.nome}</td>
                  <td className="py-2 px-4">{client.email}</td>
                  <td className="py-2 px-4">{client.telefone}</td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-400">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 text-xl"
              aria-label="Fechar"
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-blue-600 mb-6 text-center">
              Novo Cliente
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                name="nome"
                placeholder="Nome"
                value={form.nome}
                onChange={handleChange}
                className="border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                name="telefone"
                placeholder="Telefone"
                value={form.telefone}
                onChange={handleChange}
                className="border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              {error && <div className="text-red-600 text-center">{error}</div>}
              <button
                type="submit"
                disabled={posting}
                className="bg-blue-500 text-white font-semibold rounded px-4 py-2 hover:bg-blue-600 transition disabled:opacity-60"
              >
                {posting ? "Salvando..." : "Salvar"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
