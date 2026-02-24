import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt é obrigatório" },
        { status: 400 },
      );
    }

    const response = await axios.post(
      "https://cloud.leonardo.ai/api/rest/v1/generations",
      {
        prompt: `Educational activity for children, Pathfinders club (Adventist), ${prompt}, clean illustration, no text, no words, no letters, simple line art, coloring book style`,
        modelId: "6bef9f1b-29cb-40c7-b9df-cfb050bd5105",
        width: 1024,
        height: 768,
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${process.env.LEONARDO_API_KEY}`,
        },
      },
    );

    const generationId = response.data.sdGenerationJob.generationId;
    return NextResponse.json({ generationId });
  } catch (error) {
    console.error("Erro no Leonardo AI:", error);
    return NextResponse.json(
      { error: "Erro ao iniciar geração de imagem." },
      { status: 500 },
    );
  }
}
