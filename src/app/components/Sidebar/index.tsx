"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Users, X, Download, DollarSign, BarChart, LogOut } from "lucide-react";
import { useAuth } from "@/app/context/Context";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Redireciona e fecha o menu
  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  // Logout e fecha o menu
  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Fundo escuro clicável */}
      {isOpen && (
        <div className="fixed inset-0 bg-opacity-50 z-30" />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white z-40 transform transition-transform duration-300 shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 ">
          <h2 className="text-lg font-bold text-blue-500">Logo</h2>
          <button onClick={onClose} className="hover:bg-blue-100 active:bg-blue-200 transition-colors rounded-full p-2">
            <X size={24} className="text-blue-500 active:text-blue-700" />
          </button>
        </div>
        <ul className="p-4 space-y-4">
          <li
            onClick={() => handleNavigate("/clients")}
            className="hover:text-gray-300 cursor-pointer flex items-center gap-2 hover:bg-blue-100 transition-colors rounded p-2 active:bg-blue-200" 
          >
            <Users size={20} className="text-blue-500 active:text-blue-700" />
            <p className="active:text-blue-700 transition-colors">Clientes</p> 
          </li>
          <li
            onClick={() => handleNavigate("/payaccounts")}
            className="hover:text-gray-300 cursor-pointer flex items-center gap-2 hover:bg-blue-100 transition-colors rounded p-2 active:bg-blue-200"
          >
            <CreditCard size={20} className="text-blue-500 active:text-blue-700" />
            <p className="active:text-blue-700 transition-colors">Contas a pagar</p>
          </li>
          <li
            onClick={() => handleNavigate("/receiveaccounts")}
            className="hover:text-gray-300 cursor-pointer flex items-center gap-2 hover:bg-blue-100 transition-colors rounded p-2 active:bg-blue-200"
          >
            <Download size={20} className="text-blue-500 active:text-blue-700" />
            <p className="active:text-blue-700 transition-colors">Contas a receber</p>
          </li>
          <li
            onClick={() => handleNavigate("/financial")}
            className="hover:text-gray-300 cursor-pointer flex items-center gap-2 hover:bg-blue-100 transition-colors rounded p-2 active:bg-blue-200"
          >
            <DollarSign size={20} className="text-blue-500 active:text-blue-700" />
            <p className="active:text-blue-700 transition-colors">Financeiro</p>
          </li>
          <li
            onClick={() => handleNavigate("/balance")}
            className="hover:text-gray-300 cursor-pointer flex items-center gap-2 hover:bg-blue-100 transition-colors rounded p-2 active:bg-blue-200"
          >
            <BarChart size={20} className="text-blue-500 active:text-blue-700" />
            <p className="active:text-blue-700 transition-colors">Balanço Geral</p>
          </li>
          {/* Botão de logout */}
          <li
            onClick={handleLogout}
            className="cursor-pointer flex items-center gap-2 hover:bg-blue-100 transition-colors rounded p-2 active:bg-blue-200"
          >
            <LogOut size={20} className="text-blue-500 active:text-blue-700" />
            <p className="active:text-blue-700 transition-colors">Sair</p>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
