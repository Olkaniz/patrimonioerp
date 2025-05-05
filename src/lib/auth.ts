import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import db from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email ?? "";

      // Bloqueia quem não for do domínio autorizado
      if (!email.endsWith("@plataformainternacional.com.br")) {
        return false;
      }

      // Verifica se o usuário já está no banco
      const existing = db
        .prepare("SELECT * FROM usuarios WHERE email = ?")
        .get(email);

      // Se não existir, insere como nível 1
      if (!existing) {
        db.prepare(`
          INSERT INTO usuarios (email, nome, setor, nivel_permissao)
          VALUES (?, ?, ?, ?)
        `).run(email, user.name ?? "", "", 1);
      }

      return true;
    },

    async session({ session }) {
      const email = session.user?.email ?? "";

      const usuario = db
        .prepare("SELECT * FROM usuarios WHERE email = ?")
        .get(email);

      if (usuario) {
        session.user.nivel_permissao = usuario.nivel_permissao;
        session.user.setor = usuario.setor;
      } else {
        session.user.nivel_permissao = 1;
        session.user.setor = "";
      }

      return session;
    },
  },
};
