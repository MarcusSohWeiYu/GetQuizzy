import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.DALLE_OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1024x1024",
      n: 1,
    });

    return NextResponse.json({
      data: response.data,
      created: response.created
    });

  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate image",
        details: error.message 
      },
      { status: 500 }
    );
  }
}