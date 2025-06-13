"use client";
import { useEffect, useState } from "react";

type CashPay = {
  id: string;
  status: "PENDENTE" | "ATRASADO" | "PAGO" | string;
  valor: number;
  descricao: string | null;
  data_vencimeto: string;
  data_pagamento: string | null;
  clienteId: string;
};

type CashReceive = {
  id: string;
  status: "PENDENTE" | "ATRASADO" | "RECEBIDO" | string;
  valor: number;
  descricao: string | null;
  data_emissao: string;
  data_recebimento: string | null;
  clienteId: string;
};

type Client = {
  id: string;
  nome: string;
};

type Operation = {
  id: string;
  tipo: "ENTRADA" | "SAIDA";
  clienteId: string;
  clienteNome: string;
  valor: number;
  status: string;
  data: string;
  descricao: string | null;
};

const statusColors: Record<string, string> = {
  PENDENTE: "bg-yellow-100 text-yellow-800",
  ATRASADO: "bg-red-100 text-red-700",
  PAGO: "bg-green-100 text-green-700",
  RECEBIDO: "bg-green-100 text-green-700",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "Pendente";
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR");
}

const FinancialPage = () => {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<"TODOS" | "ENTRADA" | "SAIDA">("TODOS");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3001/cash-pay").then((res) => res.json()),
      fetch("http://localhost:3001/cash-receive").then((res) => res.json()),
      fetch("http://localhost:3001/clients").then((res) => res.json()),
    ])
      .then(([cashPays, cashReceives, clientsData]) => {
        // Mapeia cash-pay para operações de saída
        const payOps: Operation[] = cashPays.map((pay: CashPay) => ({
          id: pay.id,
          tipo: "SAIDA",
          clienteId: pay.clienteId,
          clienteNome: clientsData.find((c: Client) => c.id === pay.clienteId)?.nome || "Desconhecido",
          valor: pay.valor,
          status: pay.status,
          data: pay.data_vencimeto,
          descricao: pay.descricao,
        }));

        // Mapeia cash-receive para operações de entrada
        const receiveOps: Operation[] = cashReceives.map((rec: CashReceive) => ({
          id: rec.id,
          tipo: "ENTRADA",
          clienteId: rec.clienteId,
          clienteNome: clientsData.find((c: Client) => c.id === rec.clienteId)?.nome || "Desconhecido",
          valor: rec.valor,
          status: rec.status,
          data: rec.data_emissao,
          descricao: rec.descricao,
        }));

        // Junta e ordena por data decrescente
        const allOps = [...payOps, ...receiveOps].sort(
          (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
        );
        setOperations(allOps);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filtro por nome e tipo
  const filteredOperations = operations.filter((op) => {
    const matchesName = op.clienteNome.toLowerCase().includes(filter.toLowerCase());
    const matchesType = typeFilter === "TODOS" ? true : op.tipo === typeFilter;
    return matchesName && matchesType;
  });

  // Totais filtrados
  const totalEntrada = filteredOperations
    .filter((op) => op.tipo === "ENTRADA")
    .reduce((sum, op) => sum + op.valor, 0);

  const totalSaida = filteredOperations
    .filter((op) => op.tipo === "SAIDA")
    .reduce((sum, op) => sum + op.valor, 0);

  return (
    <div className="p-4 md:ml-64">
      <h1 className="text-2xl font-semibold text-blue-600">Financeiro</h1>
      <p className="mt-2 text-gray-700 mb-6">Todas as entradas e saídas do sistema.</p>
      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Filtrar por nome do cliente..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:max-w-xs border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex gap-2 items-center">
          <button
            className={`cursor-pointer px-4 py-2 rounded ${typeFilter === "TODOS" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} transition`}
            onClick={() => setTypeFilter("TODOS")}
          >
            Todos
          </button>
          <button
            className={`cursor-pointer px-4 py-2 rounded ${typeFilter === "ENTRADA" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"} transition`}
            onClick={() => setTypeFilter("ENTRADA")}
          >
            Entradas
          </button>
          <button
            className={`cursor-pointer px-4 py-2 rounded ${typeFilter === "SAIDA" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"} transition`}
            onClick={() => setTypeFilter("SAIDA")}
          >
            Saídas
          </button>
        </div>
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
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
              <thead>
                <tr className="bg-blue-100">
                  <th className="py-2 px-4 text-left text-blue-700">Tipo</th>
                  <th className="py-2 px-4 text-left text-blue-700">Cliente</th>
                  <th className="py-2 px-4 text-left text-blue-700">Valor</th>
                  <th className="py-2 px-4 text-left text-blue-700">Status</th>
                  <th className="py-2 px-4 text-left text-blue-700">Data</th>
                  <th className="py-2 px-4 text-left text-blue-700">Descrição</th>
                </tr>
              </thead>
              <tbody>
                {filteredOperations.map((op) => (
                  <tr key={op.tipo + op.id} className="border-t hover:bg-blue-50">
                    <td className="py-2 px-4 font-semibold">
                      <span className={op.tipo === "ENTRADA" ? "text-green-600" : "text-red-600"}>
                        {op.tipo}
                      </span>
                    </td>
                    <td className="py-2 px-4">{op.clienteNome}</td>
                    <td className="py-2 px-4">
                      {op.valor.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          statusColors[op.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {op.status}
                      </span>
                    </td>
                    <td className="py-2 px-4">{formatDate(op.data)}</td>
                    <td className="py-2 px-4">{op.descricao || "-"}</td>
                  </tr>
                ))}
                {filteredOperations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-400">
                      Nenhuma operação encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Totais */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="flex-1 bg-green-50 rounded p-4 text-green-700 font-bold text-lg shadow">
              Total de Entradas:{" "}
              {totalEntrada.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <div className="flex-1 bg-red-50 rounded p-4 text-red-700 font-bold text-lg shadow">
              Total de Saídas:{" "}
              {totalSaida.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FinancialPage;
