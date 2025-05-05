"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo ao ERP de Patrimônio</h1>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card de Patrimônios */}
        <Link href="/patrimonio" className="bg-zinc-700 p-6 rounded shadow hover:bg-zinc-500 transition">
          <h2 className="text-xl font-semibold mb-2">Gerenciar Patrimônios</h2>
          <p className="text-zinc-300">Visualize, edite e acompanhe os bens da empresa.</p>
        </Link>

        {/* Card de Relatórios */}
        <div className="bg-zinc-700 p-6 rounded shadow opacity-50 cursor-not-allowed">
          <h2 className="text-xl font-semibold mb-2">Relatórios (em breve)</h2>
          <p className="text-zinc-300">Gere relatórios detalhados sobre o uso dos patrimônios.</p>
        </div>
      </section>
    </main>
  );
}
