import { generateText } from "ai"
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { poem } = await req.json();

  if (!poem || poem.trim().length === 0) {
    return Response.json({ error: 'No poem provided' }, { status: 400 });
  }

  try {

    const text = "今は返答できないよ。APIを使うにもお金がかかるんじゃ。俳句の感想が欲しいならママにでも聞いてもらったらどうじゃ？"

    // const { text } = await generateText({
    //   model: openai('gpt-5'),
    //   prompt: `あなたは短歌と俳句の添削専門アシスタントです。ユーザーが送った短歌や俳句に対して、①五七五（俳句）や五七五七七（短歌）の形式を確認し、厳密すぎない柔軟な音数判定を行ってください。②多少の字余りや字足らずは詩的表現として尊重し、自然なリズムであれば指摘しないでください。③良い表現や感情の動きを褒めてみましょう。④返答は180文字程度にまとめてください。⑤ユーザーが短歌や俳句以外のものを送った場合は「短歌や俳句を入力してな」と返してください。
      
    //   ${poem}`,
    //   maxTokens: 500,
    // });
    
    return Response.json({ text });
  } catch (error) {
    console.error('Error generating text:', error);
    return Response.json(
      { error: 'Failed to generate response' }, 
      { status: 500 }
    );
  }
}