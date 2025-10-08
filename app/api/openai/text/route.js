import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.COMPLETION_OPENAI_API_KEY,
});

export const POST = async function handleTextGeneration(req) {
  try {
    const { messages, userId, max = 1000, temp = 1 } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      max_tokens: max,
      temperature: temp,
      user: userId,
    });

    return NextResponse.json({
      answer: response.choices[0].message.content,
      usage: response.usage
    });

  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Failed to generate text" },
      { status: 500 }
    );
  }
}