"use client";

import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const messages: Record<string, string> = {
    AccessDenied: "Acesso negado. Você não tem permissão para entrar.",
    Configuration: "Erro de configuração.",
    Verification: "O link de verificação é inválido ou expirou.",
    Default: "Ocorreu um erro ao tentar entrar.",
  };

  const message = messages[error || "Default"] || messages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center px-4">
      <div className="bg-white p-8 rounded shadow max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4">Erro ao entrar</h1>
        <p className="mb-6">{message}</p>
        <a
          href="/api/auth/signin"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Tentar novamente
        </a>
      </div>
    </div>
  );
}
