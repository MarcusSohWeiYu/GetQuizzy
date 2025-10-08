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

Character traits created based on these answers and questions: ${answersList}

CRITICAL: This MUST be a clean render with NO TEXT, NO LABELS, NO ANNOTATIONS whatsoever. The image should contain ONLY the 3D character on its platform with absolutely no text elements or overlays of any kind. Any text or labels will make the image unusable.

Style: High-end 3D character render similar to modern Pixar or Disney character collectible figures. Think high-quality vinyl toy photography.`;
};

export const generatePersonalityDescription = async (answers, questions, userId) => {
  const messages = [
    {
      role: "system",
      content: "You are a fun, insightful personality analyzer. Generate engaging, positive, and playful personality descriptions based on quiz answers. Keep it within 2-3 sentences."
    },
    {
      role: "user",
      content: `Based on these quiz answers, create a fun and engaging personality description that captures their essence. Make it playful and positive. Here are the answers: ${Object.entries(answers)
        .map(([index, answer]) => `${questions[index].question}: ${answer}`)
        .join('. ')}`
    }
  ];

  const response = await sendOpenAi(messages, userId);
  
  return {
    description: response || "An amazing personality that's yet to be discovered!",
    emoji: "✨🎨🌟",
    traits: [] // Add empty traits array as default
  };
};