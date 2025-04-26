// lib/auth.ts

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import LINE from "next-auth/providers/line"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

// 認証処理中のPrisma接続を管理する関数
// Auth.js＋Prismaの時は必ずpromiseが返却される、その型安全性を保つためのラッパー関数
async function withPrismaConnection<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error('Prisma operation error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma), //providerが違ってもidが一意になるようにする
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    LINE({
      clientId: process.env.AUTH_LINE_ID,
      clientSecret: process.env.AUTH_LINE_SECRET,
      issuer: 'https://access.line.me',
      checks: ['pkce', 'state'],
    }),
  ],
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, token }) {
      if (token && typeof token === 'object' && 'userId' in token) {
        session.user.id = (token as { userId: string }).userId;
      }
      return session;
    }
  }
})












