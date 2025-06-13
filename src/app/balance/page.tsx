"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

type CashPay = {
  id: string;
  valor: number;
  data_vencimeto: string;
};

type CashReceive = {
  id: string;
  valor: number;
  data_emissao: string;
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const BalancePage = () => {
  const [cashPay, setCashPay] = useState<CashPay[]>([]);
  const [cashReceive, setCashReceive] = useState<CashReceive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3001/cash-pay").then((res) => res.json()),
      fetch("http://localhost:3001/cash-receive").then((res) => res.json()),
    ])
      .then(([pay, receive]) => {
        setCashPay(pay);
        setCashReceive(receive);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Totais
  const totalSaida = cashPay.reduce((sum, op) => sum + op.valor, 0);
  const totalEntrada = cashReceive.reduce((sum, op) => sum + op.valor, 0);
  const saldo = totalEntrada - totalSaida;
  const status = saldo >= 0 ? "LUCRO" : "DEVEDOR";

  // Dados para o gráfico (por mês)
  function getMonth(dateStr: string) {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  }

  // Agrupa por mês
  const monthsSet = new Set([
    ...cashPay.map((p) => getMonth(p.data_vencimeto)),
    ...cashReceive.map((r) => getMonth(r.data_emissao)),
  ]);
  const months = Array.from(monthsSet).sort();

  const chartData = months.map((month) => ({
    month,
    Saidas: cashPay.filter((p) => getMonth(p.data_vencimeto) === month).reduce((sum, p) => sum + p.valor, 0),
    Entradas: cashReceive.filter((r) => getMonth(r.data_emissao) === month).reduce((sum, r) => sum + r.valor, 0),
  }));

  return (
    <div className="p-4 md:ml-64">
      <h1 className="text-2xl font-semibold text-blue-600">Balanço Geral</h1>
      <p className="mt-2 text-gray-700 mb-6">Aqui você poderá visualizar o balanço geral do sistema.</p>
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
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 bg-green-50 rounded p-4 text-green-700 font-bold text-lg shadow">
              Total de Entradas: {formatCurrency(totalEntrada)}
            </div>
            <div className="flex-1 bg-red-50 rounded p-4 text-red-700 font-bold text-lg shadow">
              Total de Saídas: {formatCurrency(totalSaida)}
            </div>
            <div className={`flex-1 rounded p-4 font-bold text-lg shadow ${saldo >= 0 ? "bg-blue-50 text-blue-700" : "bg-yellow-50 text-yellow-700"}`}>
              Saldo: {formatCurrency(saldo)} <span className="ml-2">{status}</span>
            </div>
          </div>

          {/* Tabela de totais por mês */}
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
              <thead>
                <tr className="bg-blue-100">
                  <th className="py-2 px-4 text-left text-blue-700">Mês</th>
                  <th className="py-2 px-4 text-left text-green-700">Entradas</th>
                  <th className="py-2 px-4 text-left text-red-700">Saídas</th>
                  <th className="py-2 px-4 text-left text-blue-700">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row) => (
                  <tr key={row.month} className="border-t hover:bg-blue-50">
                    <td className="py-2 px-4">{row.month}</td>
                    <td className="py-2 px-4 text-green-700">{formatCurrency(row.Entradas)}</td>
                    <td className="py-2 px-4 text-red-700">{formatCurrency(row.Saidas)}</td>
                    <td className={`py-2 px-4 font-semibold ${row.Entradas - row.Saidas >= 0 ? "text-blue-700" : "text-yellow-700"}`}>
                      {formatCurrency(row.Entradas - row.Saidas)}
                    </td>
                  </tr>
                ))}
                {chartData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-400">
                      Nenhum dado encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Gráfico menor */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Entradas x Saídas por mês</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="Entradas" fill="#22c55e" />
                <Bar dataKey="Saidas" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default BalancePage;
