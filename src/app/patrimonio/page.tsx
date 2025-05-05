"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { Patrimonio } from "@/types/patrimonio";
import { useRouter } from "next/navigation";

export default function PatrimonioPage() {
  const { data: session, status } = useSession();

  const [patrimonios, setPatrimonios] = useState<Patrimonio[]>([]);
  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    categoria: "",
    descricao: "",
    data_aquisicao: "",
    localizacao: "",
    responsavel: "",
    situacao: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const nivel = session?.user?.nivel_permissao || 1;
  const setorUsuario = session?.user?.setor || "";
  const nomeUsuario = session?.user?.name || "";

  useEffect(() => {
    fetch("/api/patrimonios")
      .then((res) => res.json())
      .then((data) => setPatrimonios(data));
  }, []);

  const podeModificar = (item: Patrimonio) => {
    return (
      nivel === 4 ||
      (nivel === 3 && item.localizacao === setorUsuario) ||
      (nivel === 2 && item.responsavel === nomeUsuario)
    );
  };

  const handleEdit = (item: Patrimonio) => {
    if (!podeModificar(item)) return alert("Você não tem permissão para editar este item.");

    setFormData({
      codigo: item.codigo,
      nome: item.nome,
      categoria: item.categoria,
      descricao: item.descricao,
      data_aquisicao: item.data_aquisicao.slice(0, 10),
      localizacao: item.localizacao,
      responsavel: item.responsavel,
      situacao: item.situacao,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number, item: Patrimonio) => {
    if (!podeModificar(item)) return alert("Você não tem permissão para excluir este item.");
    if (!confirm("Tem certeza que deseja excluir este item?")) return;

    const res = await fetch("/api/patrimonios", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      return alert(error || "Erro ao excluir item.");
    }

    setPatrimonios((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const body = JSON.stringify(editingId ? { ...formData, id: editingId } : formData);

    const res = await fetch("/api/patrimonios", {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });

    const result = await res.json();

    if (!res.ok) {
      return alert(result.error || "Erro ao salvar");
    }

    if (editingId) {
      setPatrimonios((prev) =>
        prev.map((item) => (item.id === editingId ? { ...result, id: editingId } : item))
      );
    } else {
      setPatrimonios((prev) => [...prev, result]);
    }

    setFormData({
      codigo: "",
      nome: "",
      categoria: "",
      descricao: "",
      data_aquisicao: "",
      localizacao: "",
      responsavel: "",
      situacao: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Patrimônios</h1>

      {nivel > 1 && (
        <button
          onClick={() => {
            setShowForm(true);
            setFormData({
              codigo: "",
              nome: "",
              categoria: "",
              descricao: "",
              data_aquisicao: "",
              localizacao: "",
              responsavel: "",
              situacao: "",
            });
            setEditingId(null);
          }}
          className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Adicionar Patrimônio
        </button>
      )}

      {showForm && nivel > 1 && (
        <form onSubmit={handleSubmit} className="bg-zinc-700 p-4 rounded mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData).map(([key, value]) => {
              if (key === "situacao") {
                return (
                  <select
                    key={key}
                    value={value}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="p-2 rounded bg-zinc-800 text-white"
                    required
                  >
                    <option value="">Selecione a Situação</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                );
              }

              return (
                <input
                  key={key}
                  type={key === "data_aquisicao" ? "date" : "text"}
                  placeholder={key}
                  value={value}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="p-2 rounded bg-zinc-800 text-white"
                  required
                />
              );
            })}
          </div>
          <div className="flex gap-4">
            <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
              {editingId ? "Salvar Alterações" : "Cadastrar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="bg-zinc-800 p-4 rounded shadow">
        <p className="text-zinc-300 mb-4">
          Aqui você poderá visualizar e gerenciar os bens patrimoniais da empresa.
        </p>

        <div className="overflow-x-auto">
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
                {nivel > 1 && <th className="px-4 py-2">Ações</th>}
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
                  {nivel > 1 && (
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-400 hover:underline mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item)}
                        className="text-red-400 hover:underline"
                      >
                        Excluir
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
