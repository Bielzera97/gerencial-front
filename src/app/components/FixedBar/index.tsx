"use client";

import {
  Users,
  CreditCard,
  Download,
  DollarSign,
  BarChart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const FixedBar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/clients", label: "Clientes", icon: Users },
    { href: "/payaccounts", label: "Contas a pagar", icon: CreditCard },
    { href: "/receiveaccounts", label: "Contas a receber", icon: Download },
    { href: "/financial", label: "Financeiro", icon: DollarSign },
    { href: "/balance", label: "Balanço Geral", icon: BarChart },
  ];

  return (
    <aside className="hidden md:flex h-screen w-64 bg-white flex-col p-4 fixed z-30 shadow-md">
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
      </nav>
    </aside>
  );
};

export default FixedBar;
