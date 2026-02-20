import { NextResponse } from "next/server";
import OpenAI from "openai";
import { checkRateLimit } from "@/libs/rateLimit";

export async function POST(req) {
  try {
    const { content, responseId, surveyId } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Check rate limit (use surveyId for spam prevention)
    const rateLimitResult = await checkRateLimit(req, "/api/openai/custom", responseId, surveyId);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: rateLimitResult.error,
          retryAfter: rateLimitResult.retryAfter,
          limit: rateLimitResult.limit
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '3600',
            'X-RateLimit-Limit': rateLimitResult.limit?.total?.toString() || '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.limit?.reset?.toISOString() || '',
          }
        }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || process.env.COMPLETION_OPENAI_API_KEY,
    });

    // Use the standard chat completions API
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini-2025-04-14",
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
      temperature: 1,
      max_completion_tokens: 500,
    });

    // Extract the assistant's message
    const assistantMessage = response.choices[0]?.message?.content || "";

    return NextResponse.json({
      content: assistantMessage,
      fullResponse: response,
      rateLimit: rateLimitResult.limit
    }, { 
      status: 200,
      headers: {
        'X-RateLimit-Limit': rateLimitResult.limit?.total?.toString() || '10',
        'X-RateLimit-Remaining': rateLimitResult.limit?.remaining?.toString() || '0',
        'X-RateLimit-Reset': rateLimitResult.limit?.reset?.toISOString() || '',
      }
    });

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

