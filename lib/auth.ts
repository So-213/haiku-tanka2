// lib/auth.ts

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import LINE from "next-auth/providers/line"
import { prisma } from "./prisma"

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    LINE({
      clientId: process.env.AUTH_LINE_ID,
      clientSecret: process.env.AUTH_LINE_SECRET,
      issuer: 'https://access.line.me',
      checks: ['pkce', 'state'], // ←ここを追加
    }),
  ],
  // 任意: セッション戦略・コールバックなど
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  // debug:true


  callbacks: {

    async signIn({ user, account, profile }) {
      if (user) {
        // PrismaのUserテーブルモデルにユーザー情報を保存
        await prisma.user.upsert({
          where: { id: user.id },
          create: {
            id: user.id,
            name: user.name || 'Unknown User',
            stripe_customer_id: null, // 初期値はnull
          },
          update: {
            name: user.name || 'Unknown User',
          },
        });
      }
      return true;
    },

    async jwt({ token, user }) {
      // 初回ログイン時は user があるので DBのidをトークンに追加
      if (user) {
        token.userId = user.id; // ← DBのUser.idをトークンに入れる
      }
      return token;
    },

    async session({ session, token }) {
      // AuthのsessionにJWTのuserIdを追加
      if (typeof token === 'object' && token && 'userId' in token) {
        session.user.id = (token as { userId: string }).userId;
      }
      return session;
    }

  }
  
})











// クライアント側でuser.idを確認する場合
// import { useSession } from "next-auth/react";

// const Dashboard = () => {
//   const { data: session } = useSession();

//   // session?.user.id が DBのUser.idになる
//   console.log(session?.user.id);
// }



