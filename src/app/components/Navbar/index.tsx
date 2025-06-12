"use client"
import { useState } from "react";
import { Menu } from "lucide-react"; // biblioteca de ícones (opcional)

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center p-4 bg-blue-500 text-white">
      <h1 className="text-lg font-bold">Logo ou Slogan</h1>

      {/* Menu Hamburguer visível em telas pequenas */}
      <button
        className="block md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Abrir menu"
      >
        <Menu size={28} />
      </button>

      {/* Itens do menu - ocultos por enquanto */}
      {/* <div className={`absolute top-16 left-0 w-full bg-gray-800 ${isMenuOpen ? 'block' : 'hidden'}`}>
        <ul className="flex flex-col items-center gap-4 p-4">
          <li>Link 1</li>
          <li>Link 2</li>
          <li>Link 3</li>
        </ul>
      </div> */}
    </nav>
  );
};

export default Navbar;
