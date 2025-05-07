import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { db } from "@/lib/firebase.js";
import {
  collection,
  getDoc,
  getDocs,
  setDoc,
  doc,
  query,
  where
} from "firebase/firestore";

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

      // Permitir só e-mails autorizados
      if (!email.endsWith("@plataformainternacional.com.br")) {
        return false;
      }

      const usuariosRef = collection(db, "usuarios");
      const q = query(usuariosRef, where("email", "==", email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Cria novo usuário com nível 1 se não existir
        const newUserRef = doc(usuariosRef); // ID automático
        await setDoc(newUserRef, {
          email,
          nome: user.name ?? "",
          setor: "",
          nivel_permissao: 1,
        });
      }

      return true;
    },

    async session({ session }) {
      const email = session.user?.email ?? "";

      const usuariosRef = collection(db, "usuarios");
      const q = query(usuariosRef, where("email", "==", email));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const usuario = snapshot.docs[0].data();
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
