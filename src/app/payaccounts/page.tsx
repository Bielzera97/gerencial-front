"use client";
import { useEffect, useState } from "react";

type PayAccount = {
  id: string;
  status: "PENDENTE" | "ATRASADO" | "PAGO" | string;
  valor: number;
  descricao: string | null;
  data_vencimeto: string;
  data_pagamento: string | null;
  clienteId: string;
  createdAt: string;
  updatedAt: string;
};

type Client = {
  id: string;
  nome: string;
};

const statusColors: Record<string, string> = {
  PENDENTE: "bg-yellow-100 text-yellow-800",
  ATRASADO: "bg-red-100 text-red-700",
  PAGO: "bg-green-100 text-green-700",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "Pendente";
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR");
}

const PayAccountsPage = () => {
  const [accounts, setAccounts] = useState<PayAccount[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    valor: 0,
    descricao: "",
    data_vencimeto: "",
    data_pagamento: "",
    clienteId: "",
  });
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    // Busca contas e clientes em paralelo
    Promise.all([
      fetch("http://localhost:3001/cash-pay").then((res) => res.json()),
      fetch("http://localhost:3001/clients").then((res) => res.json()),
    ])
      .then(([accountsData, clientsData]) => {
        setAccounts(accountsData);
        setClients(clientsData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Função para pegar o nome do cliente pelo id
  const getClientName = (id: string) => {
    const client = clients.find((c) => c.id === id);
    return client ? client.nome : "Desconhecido";
  };

  // Modal handlers
  const handleOpenModal = () => {
    setForm({
      valor: 0,
      descricao: "",
      data_vencimeto: "",
      data_pagamento: "",
      clienteId: clients[0]?.id || "",
    });
    setError("");
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (acc: PayAccount) => {
    setForm({
      valor: acc.valor,
      descricao: acc.descricao || "",
      data_vencimeto: acc.data_vencimeto.slice(0, 10),
      data_pagamento: acc.data_pagamento ? acc.data_pagamento.slice(0, 10) : "",
      clienteId: acc.clienteId,
    });
    setEditingId(acc.id);
    setError("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    setError("");
    try {
      const dataVencimentoISO = new Date(form.data_vencimeto).toISOString();
      const dataPagamentoISO = form.data_pagamento
        ? new Date(form.data_pagamento).toISOString()
        : "";

      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:3001/cash-pay/${editingId}`
        : "http://localhost:3001/cash-pay";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valor: Number(form.valor),
          descricao: form.descricao || "",
          data_vencimeto: dataVencimentoISO,
          data_pagamento: dataPagamentoISO,
          clienteId: form.clienteId,
          status: "PENDENTE",
        }),
      });
      if (!res.ok) {
        let msg = "Erro ao salvar conta";
        try {
          const data = await res.json();
          msg = data?.message || msg;
        } catch {}
        throw new Error(msg);
      }
      const savedAccount = await res.json();

      setAccounts((prev) =>
        editingId
          ? prev.map((acc) => (acc.id === editingId ? savedAccount : acc))
          : [...prev, savedAccount]
      );
      setShowModal(false);
      setEditingId(null);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError("Erro ao salvar conta");
    } finally {
      setPosting(false);
    }
  };

  // Função para deletar uma conta
  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta conta?")) return;
    try {
      const res = await fetch(`http://localhost:3001/cash-pay/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        let msg = "Erro ao excluir conta";
        try {
          const data = await res.json();
          msg = data?.message || msg;
        } catch {}
        throw new Error(msg);
      }
      setAccounts((prev) => prev.filter((acc) => acc.id !== id));
    } catch (error) {
      if (error instanceof Error) alert(error.message);
      else alert("Erro ao excluir conta");
    }
  };

  // Filtra as contas pelo nome do cliente
  const filteredAccounts = accounts.filter((acc) => {
    const clientName = getClientName(acc.clienteId).toLowerCase();
    return clientName.includes(filter.toLowerCase());
  });

  return (
    <div className="p-4 md:ml-64">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-blue-600">Contas a Pagar</h1>
        <button
          onClick={handleOpenModal}
          className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Nova Conta
        </button>
      </div>
      {/* Campo de filtro */}
      <div className="mb-4 max-w-xs">
        <input
          type="text"
          placeholder="Filtrar por nome do cliente..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-blue-500 py-8 justify-center">
          <svg className="animate-spin h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24">
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
                <th className="py-2 px-4 text-left text-blue-700">Cliente</th>
                <th className="py-2 px-4 text-left text-blue-700">Valor</th>
                <th className="py-2 px-4 text-left text-blue-700">Status</th>
                <th className="py-2 px-4 text-left text-blue-700">Vencimento</th>
                <th className="py-2 px-4 text-left text-blue-700">Pagamento</th>
                <th className="py-2 px-4 text-left text-blue-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((acc) => (
                <tr key={acc.id} className="border-t hover:bg-blue-50">
                  <td className="py-2 px-4">{getClientName(acc.clienteId)}</td>
                  <td className="py-2 px-4">
                    {acc.valor.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        statusColors[acc.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {acc.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">{formatDate(acc.data_vencimeto)}</td>
                  <td className="py-2 px-4">{formatDate(acc.data_pagamento)}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleEdit(acc)}
                      className="bg-yellow-500 cursor-pointer text-white px-3 py-1 rounded hover:bg-yellow-600 transition mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(acc.id)}
                      className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAccounts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-400">
                    Nenhuma conta encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 h-screen w-screen">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseModal}
              className="absolute cursor-pointer top-2 right-2 text-gray-400 hover:text-blue-600 text-xl"
              aria-label="Fechar"
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-blue-600 mb-6 text-center">
              {editingId ? "Editar Conta a Pagar" : "Nova Conta a Pagar"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Cliente */}
              <label className="text-sm font-medium text-blue-700">Cliente</label>
              <select
                name="clienteId"
                value={form.clienteId}
                onChange={handleChange}
                className="border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nome}
                  </option>
                ))}
              </select>
              {/* Valor */}
              <label className="text-sm font-medium text-blue-700">Valor</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">R$</span>
                <input
                  name="valor"
                  type="number"
                  placeholder="0,00"
                  value={form.valor}
                  onChange={handleChange}
                  className="pl-10 border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  required
                  min={0}
                  step="0.01"
                />
              </div>
              {/* Descrição (opcional) */}
              <input
                name="descricao"
                placeholder="Descrição (opcional)"
                value={form.descricao}
                onChange={handleChange}
                className="border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {/* Data de vencimento */}
              <label className="text-sm font-medium text-blue-700">Data de vencimento</label>
              <input
                name="data_vencimeto"
                type="date"
                value={form.data_vencimeto ? form.data_vencimeto.slice(0, 10) : ""}
                onChange={handleChange}
                className="border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              {/* Data de pagamento */}
              <label className="text-sm font-medium text-blue-700">Data de pagamento</label>
              <input
                name="data_pagamento"
                type="date"
                value={form.data_pagamento ? form.data_pagamento.slice(0, 10) : ""}
                onChange={handleChange}
                className="border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {error && <div className="text-red-600 text-center">{error}</div>}
              <button
                type="submit"
                disabled={posting}
                className="bg-blue-500 cursor-pointer text-white font-semibold rounded px-4 py-2 hover:bg-blue-600 transition disabled:opacity-60"
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

export default PayAccountsPage;
