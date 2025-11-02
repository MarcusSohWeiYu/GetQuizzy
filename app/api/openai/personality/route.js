import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const PersonalitySchema = z.object({
  name: z.string(),
  trait1: z.string(),
  trait2: z.string(),
  trait3: z.string(),
  description: z.string(),
});

const openai = new OpenAI({
  apiKey: process.env.COMPLETION_OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { answers, questions, userId } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a fun personality analyzer. Create a personality profile in JSON format with these exact fields:
          {
            "name": "a creative personality type name",
            "trait1": "first key trait",
            "trait2": "second key trait",
            "trait3": "third key trait",
            "description": "a fun, positive 2-3 sentence description"
          }`
        },
        {
          role: "user",
          content: `Based on these quiz answers, create a personality profile: ${
            Object.entries(answers)
              .map(([index, answer]) => `${questions[index].question}: ${answer}`)
              .join('. ')
          }`
        }
      ],
      response_format: { type: "json_object" }
    });

    const personalityData = JSON.parse(response.choices[0].message.content);
    const parsedData = PersonalitySchema.parse(personalityData);

    return NextResponse.json({
      name: parsedData.name,
      description: parsedData.description,
      traits: [parsedData.trait1, parsedData.trait2, parsedData.trait3]
    });

  } catch (error) {
    console.error("Personality Generation Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate personality",
        details: error.message 
      },
      { status: 500 }
    );
  }
}