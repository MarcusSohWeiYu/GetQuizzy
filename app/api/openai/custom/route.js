import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || process.env.COMPLETION_OPENAI_API_KEY,
    });

    // Use the standard chat completions API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // Extract the assistant's message
    const assistantMessage = response.choices[0]?.message?.content || "";

    return NextResponse.json({
      content: assistantMessage,
      fullResponse: response
    }, { status: 200 });

  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate content",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

