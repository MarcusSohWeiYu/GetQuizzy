import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.COMPLETION_OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        items: [
          {
            type: "message",
            role: "user",
            content: content,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      console.error("OpenAI API error:", errorData);
      return NextResponse.json(
        {
          error: "Failed to create conversation",
          details: errorData.error || errorData.message || "Unknown error",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Conversation API error:", error);
    return NextResponse.json(
      {
        error: "Failed to create conversation",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

