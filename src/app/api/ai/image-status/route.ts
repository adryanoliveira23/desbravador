import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const generationId = searchParams.get("id");

    if (!generationId) {
      return NextResponse.json(
        { error: "ID de geração é obrigatório" },
        { status: 400 },
      );
    }

    const response = await axios.get(
      `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
      {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${process.env.LEONARDO_API_KEY}`,
        },
      },
    );

    const images = response.data.generations_by_pk?.generated_images;
    if (images && images.length > 0) {
      return NextResponse.json({ imageUrl: images[0].url });
    }

    return NextResponse.json({ imageUrl: null });
  } catch (error) {
    console.error("Erro ao buscar imagem:", error);
    return NextResponse.json({ imageUrl: null });
  }
}
