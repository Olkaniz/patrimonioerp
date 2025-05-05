// app/not-found.tsx (se estiver usando App Router)
export default function NotFound() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Página não encontrada.</p>
        <a
          href="/"
          className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-500 cursor-pointer"
        >
          Voltar para a Home
        </a>
      </div>
    );
  }
  