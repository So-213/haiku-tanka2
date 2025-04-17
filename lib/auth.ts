// lib/auth.ts

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import LINE from "next-auth/providers/line"
import { prisma } from "./prisma"

// 認証処理中のPrisma接続を管理する関数
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

export const { auth, handlers, signIn, signOut } = NextAuth({   //オブジェクトを渡してオブジェクトを返してくれる NextAuth
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

    async signIn({ user, account, profile }) {    //ここでいうuserはSupabaseDBのUserテーブルのレコード
      if (user && account) {
        console.log('認証プロバイダー:', account.provider);
        console.log('プロバイダーID:', account.providerAccountId);
        
        // Prisma接続を管理しながらユーザー検索
        let dbUser = await withPrismaConnection(async () => {
          return await prisma.user.findFirst({
            where: {
              provider: account.provider,
              provider_id: account.providerAccountId,
            },
          });
        });
        
        // ユーザーが見つからない場合は新規作成
        if (!dbUser) {
          dbUser = await withPrismaConnection(async () => {
            return await prisma.user.create({
              data: {
                name: user.name || 'Unknown User',
                email: user.email || null,
                provider: account.provider,
                provider_id: account.providerAccountId,
                stripe_customer_id: null,
              },
            });
          });
          console.log('新規ユーザーを作成しました:', dbUser.id);
        } else {
          // 既存ユーザーは必要に応じて更新
          const updatedUser = await withPrismaConnection(async () => {
            return await prisma.user.update({
              where: { id: dbUser!.id },
              data: {
                name: user.name || dbUser!.name,
                email: user.email || dbUser!.email,
              },
            });
          });
          dbUser = updatedUser;
          console.log('既存ユーザーを更新しました:', dbUser.id);
        }
        
        user.id = dbUser.id;
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // 初回ログイン時は user がある
      if (user) {
        token.userId = user.id;
        console.log('JWTトークンにユーザーIDを設定:', user.id);
      }
      // 既存のトークンがある場合は、そのトークンを使い続ける
      if (token && token.userId) {
        console.log('JWTトークンのユーザーID:', token.userId);
      } else {
        console.log('JWTトークンにユーザーIDがありません');
      }
      return token;
    },

    async session({ session, token }) {
      // Authのsession（ラップが必要なクライアントコンポーネント）にJWTのuserIdを追加
      if (token && typeof token === 'object' && 'userId' in token) {
        session.user.id = (token as { userId: string }).userId;
        console.log('セッションにユーザーIDを設定:', session.user.id);
      } else {
        console.log('トークンにユーザーIDがありません');
      }
      return session;
    }

  }
  
})












