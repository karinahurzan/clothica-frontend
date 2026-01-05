import api from "@/lib/axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "FastAPI Login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. ДЕБАГ: Перевіряємо, чи прийшли дані з форми
        console.log("🔑 [NextAuth] Inputs:", credentials);

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ [NextAuth] Missing credentials");
          return null;
        }

        try {
          // 2. ДЕБАГ: Робимо запит на бекенд
          // УВАГА: FastAPI часто вимагає 'username' замість 'email' у тілі запиту,
          // і часто вимагає Form Data (application/x-www-form-urlencoded), а не JSON.

          console.log("🚀 [NextAuth] Sending request to backend...");

          // ВАРІАНТ А: Якщо ваш бекенд приймає JSON:
          const res = await api.post("/auth/login", {
            email: credentials.email, // Перевірте, чи бекенд чекає "email" чи "username"
            password: credentials.password,
          });

          // ВАРІАНТ Б: Якщо ваш бекенд стандартний FastAPI (OAuth2PasswordRequestForm):
          /*
          const formData = new URLSearchParams();
          formData.append('username', credentials.email); // Мапимо email на username
          formData.append('password', credentials.password);
          
          const res = await api.post("/auth/login", formData, {
             headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          });
          */

          const user = res.data;
          console.log("✅ [NextAuth] Backend response:", user);

          // 3. Перевіряємо, чи є токен/юзер
          if (user) {
            return user; // Успіх!
          }

          return null; // Якщо user пустий -> 401
        } catch (error: any) {
          // 4. ДЕБАГ: Якщо бекенд повернув помилку
          console.error(
            "🔥 [NextAuth] Backend Error:",
            error.response?.data || error.message
          );
          return null; // Це викличе 401 у браузері
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.token;
        token.id = user.id;
        token.is_admin = user.is_admin;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.token = token.accessToken;
      session.user.id = token.id;
      session.user.is_admin = token.is_admin;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
