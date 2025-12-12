'use client'

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import PoemForm from "@/components/PoemForm"
import ResponseBox from "@/components/ResponseBox"



export default function Page() {
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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-white to-purple-100">
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
          <CardContent className="p-4">
            <PoemForm
              poem={poem}
              setPoem={setPoem}
              isLoading={isLoading}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>

        <ResponseBox response={response} />
      </div>
    </main>
  )
}