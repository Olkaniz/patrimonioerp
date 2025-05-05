"use client";

import { useEffect, useState } from "react";
import type { Patrimonio } from "@/types/patrimonio"; // Correto!

export default function Patrimonio() {
  const [patrimonios, setPatrimonios] = useState<Patrimonio[]>([]); // AQUI está o certo!

  useEffect(() => {
    fetch("/api/patrimonios")
      .then((res) => res.json())
      .then((data) => setPatrimonios(data));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Patrimônios</h1>

      <div className="bg-zinc-800 p-4 rounded shadow">
        <p className="text-zinc-300">
          Aqui você poderá visualizar e gerenciar os bens patrimoniais da empresa.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-zinc-700 text-white">
              <tr>
                <th className="px-4 py-2">Código</th>
                <th className="px-4 py-2">Nome</th>
                <th className="px-4 py-2">Categoria</th>
                <th className="px-4 py-2">Descrição</th>
                <th className="px-4 py-2">Data de Aquisição</th>
                <th className="px-4 py-2">Localização</th>
                <th className="px-4 py-2">Responsável</th>
                <th className="px-4 py-2">Situação</th>
              </tr>
            </thead>
            <tbody>
              {patrimonios.map((item) => (
                <tr key={item.id} className="border-b border-zinc-600 hover:bg-zinc-600 transition">
                  <td className="px-4 py-2">{item.codigo}</td>
                  <td className="px-4 py-2">{item.nome}</td>
                  <td className="px-4 py-2">{item.categoria}</td>
                  <td className="px-4 py-2">{item.descricao}</td>
                  <td className="px-4 py-2">{item.data_aquisicao}</td>
                  <td className="px-4 py-2">{item.localizacao}</td>
                  <td className="px-4 py-2">{item.responsavel}</td>
                  <td className="px-4 py-2">{item.situacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
