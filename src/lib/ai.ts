import Groq from "groq-sdk";
import axios from "axios";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Gera texto usando Groq para auxílio em reuniões e classes
 */
export async function generateContent(prompt: string) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Você é um instrutor especialista em Desbravadores e Aventureiros da Igreja Adventista. Use manuais oficiais da DSA.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Erro no Groq:", error);
    return "Erro ao gerar conteúdo via IA.";
  }
}

/**
 * Gera imagem usando Leonardo AI
 */
export async function generateImage(prompt: string) {
  try {
    const response = await axios.post(
      "https://cloud.leonardo.ai/api/rest/v1/generations",
      {
        prompt: `Desbravadores lifestyle, ${prompt}, realistic, 4k, cinematic lighting`,
        modelId: "6bef9f1b-29cb-40c7-b9df-cfb050bd5105", // Model ID padrão
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

    // Em um sistema real, você precisaria de um poll ou webhook para pegar o resultado final.
    // Para simplificar agora, retornamos o ID para posterior checagem.
    return generationId;
  } catch (error) {
    console.error("Erro no Leonardo AI:", error);
    return null;
  }
}

/**
 * Busca o resultado de uma geração de imagem no Leonardo AI
 */
export async function getGeneratedImage(generationId: string) {
  try {
    const response = await axios.get(
      `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
      {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${process.env.LEONARDO_API_KEY}`,
        },
      },
    );

    const images = response.data.generations_by_pk.generated_images;
    if (images && images.length > 0) {
      return images[0].url;
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar imagem:", error);
    return null;
  }
}
