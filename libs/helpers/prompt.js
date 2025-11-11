

export const ImageGenerationPrompt = (answers, questions) => {
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