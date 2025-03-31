// lib/auth.ts

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import LINE from "next-auth/providers/line"



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
      checks: ['pkce', 'state'], // ←ここを追加！
    }),
  ],
  // 任意: セッション戦略・コールバックなど
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  // debug:true
})






