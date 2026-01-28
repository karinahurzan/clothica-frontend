import api from "@/lib/axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { refreshAccessToken } from "../../../../domains/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "FastAPI Login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔑 [NextAuth] Inputs:", credentials);

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ [NextAuth] Missing credentials");
          return null;
        }

        try {
          console.log("🚀 [NextAuth] Sending request to backend...");

          const res = await api.post("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const user = res.data;
          console.log("✅ [NextAuth] Backend response:", user);

          if (user) {
            return user;
          }

          return null;
        } catch (error: any) {
          console.error(
            "🔥 [NextAuth] Backend Error:",
            error.response?.data || error.message,
          );
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        return {
          accessToken: user.token,
          refreshToken: user.refresh_token,
          id: user.id,
          is_admin: user.is_admin,

          accessTokenExpires: Date.now() + 120 * 60 * 1000,
        };
      }
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
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
