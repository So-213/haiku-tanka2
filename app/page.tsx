"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"



export default function Home() {
  const [poem, setPoem] = useState("古池や　蛙飛びこむ　水の音")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!poem.trim()) return

    setIsLoading(true)
    setResponse("")

    setResponse("今は返答できないよ。APIを使うにもお金がかかるんじゃ。俳句の感想が欲しいならママにでも聞いてもらったらどうじゃ？")
    setIsLoading(false)

    // try {
    //   const { text } = await generateText({
    //     model: openai("gpt-4o"),
    //     prompt: `以下の俳句または短歌を解釈して、感想を述べてください。日本語で回答してください。
        
    //     ${poem}`,
    //     maxTokens: 500,
    //   })

    //   setResponse(text)
    // } catch (error) {
    //   console.error("Error generating response:", error)
    //   setResponse("申し訳ありません。エラーが発生しました。もう一度お試しください。")
    // } finally {
    //   setIsLoading(false)
    // }


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

        <p className="mb-12 text-sm"></p>

        <Card className="w-full border rounded-md overflow-hidden mb-4">
          <CardContent className="p-0">
            <div className="p-4">
              <label className="block text-sm mb-2">ここに文章を入力してください：</label>
              <textarea
                value={poem}
                onChange={(e) => setPoem(e.target.value)}
                className="w-full border rounded-md p-2 min-h-[100px]"
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-blue-500 hover:bg-blue-600 rounded-none h-12 text-white font-normal"
              disabled={isLoading}
            >
              {isLoading ? "処理中..." : "提出"}
            </Button>
          </CardContent>
        </Card>

        <Card className="w-full border rounded-md overflow-hidden">
          <CardContent className="p-4 min-h-[150px]">{response}</CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-center">
        <Image
          src="/gm.webp?height=100&width=100"
          alt="先生"
          width={100}
          height={100}
          className="opacity-80"
        />
      </div>
    </main>
  )
}

