// HomeClient.tsx
'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { signIn } from "next-auth/react"
import { Session } from 'next-auth'



interface HomeClientProps {
  session: Session | null
}

export default function HomeClient({ session }: HomeClientProps) {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [poem, setPoem] = useState("古池や　蛙飛びこむ　水の音")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {

    if (!poem.trim()) return
    setIsLoading(true)
    setResponse("")

    try {


      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ poem }),
      })

      const data = await res.json()
      setResponse(data.text)
    } catch (err) {
      console.error(err)
      setResponse("申し訳ありません。エラーが発生しました。もう一度お試しください。")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">AIに俳句/短歌を投げてみよう！</h1>

        <p className="mb-6 text-sm">
          以下のフォームに俳句や短歌を入力し、「提出」ボタンを押してみましょう。
          <br />
          AIおばあちゃんが感想を返してくれます。
          <br />
          ※AIのため、正しく解釈できない場合があります。
        </p>

        <Card className="w-full border rounded-md overflow-hidden mb-4 mt-12">
          <CardContent className="p-0">
            <div className="p-4">
              <label className="block text-sm mb-2">ここに文章を入力してください：</label>
              <textarea
                value={poem}
                onChange={(e) => setPoem(e.target.value)}
                className="w-full border rounded-md p-2 min-h-[100px]"
              />
            </div>

            {session ? (
              <Button
                onClick={handleSubmit}
                className="w-full bg-blue-500 hover:bg-blue-600 rounded-none h-12 text-white font-normal"
                disabled={isLoading}
              >
                {isLoading ? "処理中..." : "提出"}
              </Button>
            ) : (
              <Button
                onClick={() => setShowLoginModal(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 rounded-none h-12 text-white font-normal"
              >
                ログインして使う
              </Button>
            )}
          </CardContent>
        </Card>



        <div className="relative mt-6 flex flex-col items-center w-full">
          <div className="relative bg-white border-2 border-gray-600 rounded-2xl p-4 max-w-md shadow-lg text-base font-medium 
                          after:absolute after:top-full after:left-1/2 after:-ml-3 
                          after:w-0 after:h-0 
                          after:border-l-8 after:border-r-8 after:border-t-8 
                          after:border-l-transparent after:border-r-transparent after:border-t-white 
                          after:drop-shadow-md">
            {response}
          </div>
            <Image
              src="/gm.webp?height=100&width=100"
              alt="先生"
              width={100}
              height={100}
              className="opacity-80 mt-2"
            />
          </div>
        </div>



      {session === null && showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <h2 className="text-lg font-semibold mb-4">ログイン方法を選択</h2>
            <Button
              onClick={() => {
                signIn("google")
                setShowLoginModal(false)
              }}
              className="w-full mb-2 bg-green-500 hover:bg-green-600 text-white"
            >
              Googleでログイン
            </Button>
            <Button
              onClick={() => setShowLoginModal(false)}
              className="w-full bg-gray-300 hover:bg-gray-400 text-black"
            >
              キャンセル
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}
