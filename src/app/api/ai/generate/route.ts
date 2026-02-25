import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt é obrigatório" },
        { status: 400 },
      );
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Você é um instrutor especialista em Desbravadores e Aventureiros da Igreja Adventista do Sétimo Dia. Use linguagem clara, pedagógica e bíblica. Seja prático e objetivo.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 2048,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Erro no Groq:", error);
    return NextResponse.json(
      { error: "Erro ao gerar conteúdo via IA." },
      { status: 500 },
    );
  }
}
