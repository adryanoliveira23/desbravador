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
        modelId: "de7d3faf-762f-48e0-b3b7-9d0ac3a3fcf3", // Leonardo Phoenix 1.0
        width: 1024,
        height: 768,
        num_images: 1,
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${process.env.LEONARDO_API_KEY}`,
        },
      },
    );

    if (!response.data?.sdGenerationJob?.generationId) {
      console.error("Resposta inesperada do Leonardo AI:", response.data);
      throw new Error("Falha ao obter ID de geração");
    }

    const generationId = response.data.sdGenerationJob.generationId;
    console.log("Geração iniciada:", generationId);
    return NextResponse.json({ generationId });
  } catch (error: unknown) {
    let message = "Erro desconhecido";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || error.message;
      console.error("Erro no Leonardo AI:", error.response?.data);
    } else if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json(
      { error: "Erro ao iniciar geração de imagem.", details: message },
      { status: 500 },
    );
  }
}
