export const ImageGenerationPrompt = (aiInstructions, answers, questions) => {
  // Format answers and questions into a readable string
  const answersList = questions
    .map((question, index) => {
      const answer = answers[index];
      return `${question.title || question.question}: ${answer}`;
    })
    .join('. ');

  return `${aiInstructions}. Based on these survey responses: ${answersList}`;
};