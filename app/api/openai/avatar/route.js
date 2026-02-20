import { NextResponse } from "next/server";
import OpenAI from "openai";
import { checkRateLimit } from "@/libs/rateLimit";

const openai = new OpenAI({
  apiKey: process.env.DALLE_OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt, responseId, surveyId } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Check rate limit (use surveyId for spam prevention)
    const rateLimitResult = await checkRateLimit(req, "/api/openai/avatar", responseId, surveyId);
    
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
            'X-RateLimit-Limit': rateLimitResult.limit?.total?.toString() || '3',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.limit?.reset?.toISOString() || '',
          }
        }
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
      created: response.created,
      rateLimit: rateLimitResult.limit
    }, {
      headers: {
        'X-RateLimit-Limit': rateLimitResult.limit?.total?.toString() || '3',
        'X-RateLimit-Remaining': rateLimitResult.limit?.remaining?.toString() || '0',
        'X-RateLimit-Reset': rateLimitResult.limit?.reset?.toISOString() || '',
      }
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