// components/Navbar.tsx
"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../Sidebar"; // Ajuste o caminho conforme necessário
const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <nav className="flex justify-between items-center p-4 bg-blue-500 text-white">
        <h1 className="text-lg font-bold">Logo ou Slogan</h1>
        <button
          className="md:hidden p-2 rounded transition duration-200 hover:bg-blue-600 active:scale-95 active:bg-blue-700"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu size={28} className="text-white" />
        </button>
      </nav>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default Navbar;
