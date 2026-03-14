import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      name: string;
      email?: string | null;
      role: string;
    };
  }

  interface User {
    id: string;
    username: string;
    name: string;
    email?: string | null;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    name: string;
    email?: string | null;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[DEBUG] authorize called", credentials);
        if (!credentials?.username || !credentials?.password) {
          console.log("[DEBUG] Missing username or password");
          return null;
        }

        const user = await db.user.findUnique({
          where: { username: credentials.username },
        });
        console.log("[DEBUG] User from DB:", user);

        if (!user) {
          console.log("[DEBUG] User not found");
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        console.log("[DEBUG] Password match:", passwordMatch);

        if (!passwordMatch) {
          console.log("[DEBUG] Password incorrect");
          return null;
        }

        console.log("[DEBUG] Login success, returning user");
        return {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        username: token.username,
        name: token.name,
        email: token.email,
        role: token.role,
      };
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "attendance-secret-key-2024",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
