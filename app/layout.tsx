import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AIに俳句/短歌を投げてみよう！",
  description: "俳句や短歌をAIに投げかけて、AIからの感想や解釈を得られるアプリケーション",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}




