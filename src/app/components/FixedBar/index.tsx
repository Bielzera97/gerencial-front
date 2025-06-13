"use client";

import { LogOut, Users, CreditCard, Download, DollarSign, BarChart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { useAuth } from "@/app/context/Context";

const FixedBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const links = [
    { href: "/clients", label: "Clientes", icon: Users },
    { href: "/payaccounts", label: "Contas a pagar", icon: CreditCard },
    { href: "/receiveaccounts", label: "Contas a receber", icon: Download },
    { href: "/financial", label: "Financeiro", icon: DollarSign },
    { href: "/balance", label: "Balanço Geral", icon: BarChart },
  ];

  // Corrige o logout para limpar o cookie e redirecionar para login
  const handleLogout = () => {
    // Remove o cookie auth
    document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    if (logout) logout();
    router.push("/login");
  };

  return (
    <aside className="hidden md:flex h-screen w-64 bg-white flex-col p-4 fixed z-30 shadow-md overflow-y-auto">
      <div className="flex items-center justify-center my-6 pb-5">
        <h2 className="text-lg font-bold text-blue-500">Logo</h2>
      </div>
      <nav className="flex-1 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 p-2 rounded-md transition-all group",
                "hover:bg-blue-100 active:scale-[0.98]",
                isActive ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700"
              )}
            >
              <Icon
                size={20}
                className={clsx(
                  "transition-colors",
                  isActive ? "text-blue-700" : "text-blue-500 group-hover:text-blue-700"
                )}
              />
              <span>{label}</span>
            </Link>
          );
        })}
        {/* Botão de logout como item do menu */}
        <button
          onClick={handleLogout}
          className={clsx(
            "flex items-center gap-3 p-2 rounded-md transition-all group w-full text-left mt-2",
            "hover:bg-blue-100 active:scale-[0.98] text-gray-700"
          )}
        >
          <LogOut
            size={20}
            className="text-blue-500 group-hover:text-blue-700 transition-colors"
          />
          <span>Sair</span>
        </button>
      </nav>
    </aside>
  );
};

export default FixedBar;
