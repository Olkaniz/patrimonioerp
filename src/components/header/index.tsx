"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center px-4 py-2 shadow-md bg-zinc-900 text-white">
      {/* Esquerda - Botão de menu */}
      <div className="relative">
        <button
          className="text-sm px-5 py-4 bg-zinc-700 rounded hover:bg-zinc-500 transition"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰ Menu
        </button>
        {isMenuOpen && (
          <ul className="absolute left-0 mt-2 bg-zinc-700 border shadow-lg rounded w-40 z-10">
          <li className="px-4 py-2 hover:bg-zinc-500 cursor-pointer">
            <Link href="/" className="block w-full h-full">Home</Link>
          </li>
          <li className="px-4 py-2 hover:bg-zinc-500 cursor-pointer">
            <Link href="/patrimonio" className="block w-full h-full">Patrimonios</Link>
          </li>
        </ul>
        )}
      </div>

      {/* Centro - Logo */}
      <div>
      <Link href="/">
        <Image src="/logo.jpg" alt="Logo" width={60} height={60} className="mx-auto" />
        </Link>
      </div>

      {/* Direita - Avatar do usuário */}
      <div>
        <Image
          src="/user.jpg"
          alt="User"
          width={60}
          height={60}
          className="rounded-full"
        />
      </div>
    </header>
  );
}
