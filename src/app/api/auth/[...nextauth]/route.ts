import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // importando da lib centralizada

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
