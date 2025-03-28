// import { streamText } from "ai"
// import { openai } from "@ai-sdk/openai"

// export async function POST(req: Request) {
//   const { poem } = await req.json()


//   // Ensure we have a poem
//   if (!poem || poem.trim().length === 0) {
//     return new Response("No poem provided", { status: 400 })
//   }

//   const result = streamText({
//     model: openai("gpt-4-turbo"),
//     system: "日本の俳句や短歌に詳しい文学者として、提出された俳句や短歌に対して感想や解釈を日本語で返してください。",
//     messages: [{ role: "user", content: poem }],
//     max_tokens: 500,
//     temperature: 0.7,
//   })

//   return result.toDataStreamResponse()
// }

