"use client"; // Necessário porque vamos usar hooks do lado do cliente

import "./globals.css";
import Header from "../components/header";
import { SessionProvider } from "next-auth/react"; // Importa o provedor de sessão do next-auth

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>
          {/* Cabeçalho fixo */}
          <Header />

          {/* Conteúdo das páginas, agora com acesso à sessão */}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
