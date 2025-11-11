import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const PersonalitySchema = z.object({
  traits: z.array(z.string()).length(3),
  PersonalityTraitDescription: z.string(),
  CareerPath: z.string(),
  Strengths: z.string(),
  Weaknesses: z.string(),
});

const openai = new OpenAI({
  apiKey: process.env.COMPLETION_OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { answers, questions } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a fun but also informative personality analyzer, I want you to communicate in a way where you balance humor with insightful observations. Create a personality profile in JSON format with these exact fields:
          {
            "traits" : ["first key trait", "second key trait", "third key trait"],
            "PersonalityTraitDescription": "A brief description of the personality based on the traits",
            "CareerPath": "Suggested career paths that align with this personality"
            "Strengths": "Key strengths associated with this personality",
            "Weaknesses": "Potential weaknesses or challenges for this personality"
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
      traits: parsedData.traits,
      PersonalityTraitDescription: parsedData.PersonalityTraitDescription,
      CareerPath: parsedData.CareerPath,
      Strengths: parsedData.Strengths,
      Weaknesses: parsedData.Weaknesses
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