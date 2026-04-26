import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { spread, question, cards } = await req.json();

  if (!spread || !question || !cards?.length) {
    return NextResponse.json({ error: "Укажите расклад, вопрос и карты" }, { status: 400 });
  }

  const prompt = `Ты — мудрая гадалка, которая делает расклад Таро. Отвечай на русском языке, атмосферно и загадочно, но по делу. Не более 200 слов.

Расклад: ${spread}
Вопрос клиента: ${question}
Выпавшие карты: ${(cards as string[]).join(", ")}

Истолкуй эти карты применительно к вопросу клиента.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
