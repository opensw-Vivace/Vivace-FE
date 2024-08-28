import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, role, step, userInput } = req.body;

  // 역할에 맞는 프롬프팅 불러오기
  const prompt = await prisma.prompt.findFirst({
    where: { role },
    orderBy: {
      version: 'desc',
    },
  });

  if (!prompt) {
    return res.status(404).json({ error: "Prompt not found" });
  }

  // 프롬프팅 텍스트에서 플레이스홀더 대체
  const systemContent = prompt.content
    .replaceAll("{name}", name)
    .replaceAll("{role}", role)
    .replaceAll("{step}", step);

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemContent,
        },
        {
          role: "user",
          content: userInput,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const botResponse = response.data.choices[0].message.content;
  res.status(200).json({ message: botResponse });
}
