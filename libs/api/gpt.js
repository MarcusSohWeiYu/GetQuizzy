import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import OpenAI from "openai";

// Use this if you want to make a call to OpenAI GPT-4 for instance. userId is used to identify the user on openAI side.
export const sendOpenAi = async (messages, userId, max = 1000, temp = 1) => {
  try {
    // Log the messages (keeping the existing logging)
    console.log("Ask GPT >>>");
    messages.map((m) =>
      console.log(" - " + m.role.toUpperCase() + ": " + m.content)
    );

    const response = await fetch('/api/openai/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        userId,
        max,
        temp
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get response');
    }

    console.log(">>> " + data.answer);
    if (data.usage) {
      console.log(
        `TOKENS USED: ${data.usage.total_tokens} (prompt: ${data.usage.prompt_tokens} / response: ${data.usage.completion_tokens})`
      );
    }
    console.log("\n");

    return data.answer;
  } catch (e) {
    console.error("GPT Error:", e);
    return null;
  }
};

export const generatePromptFromAnswers = (answers, questions) => {
  const answersList = Object.entries(answers)
    .map(([index, answer]) => `${questions[index].question}: ${answer}`)
    .join('. ');

  return `Create single 3D cartoon mascot character with these strict requirements:
- Style: Vinyl collectible toy like Funko Pop or Disney Infinity
- Essential features: smooth matte texture, rounded proportions, big expressive eyes, friendly face
- Character must wear modern casual clothing that reflects personality
- Environment: Simple circular platform/base with subtle shadows
- Lighting: Soft studio lighting with gentle gradient background
- Composition: Character centered, full-body view
- Strict rule: It should include no words at all

Character traits created based on these answers and questions: ${answersList}

Style: High-end 3D character render similar to modern Pixar or Disney character collectible figures. Think high-quality vinyl toy photography.`;
};

// Define Zod schema without Mongoose dependency
const PersonalitySchema = z.object({
  name: z.string(),
  trait1: z.string(),
  trait2: z.string(),
  trait3: z.string(),
  description: z.string(),
});

export const generatePersonalityDescription = async (answers, questions, userId) => {
  try {
    const response = await fetch('/api/openai/personality', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answers,
        questions,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate personality');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Personality Generation Error:", error);
    return {
      name: "Mysterious Explorer",
      description: "An amazing personality that's yet to be discovered!",
      traits: ["Unique", "Adventurous", "Creative"]
    };
  }
};