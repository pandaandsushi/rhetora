const buildFillerFreeQuestionPrompt = () => {
  return [
    "You are a friendly speaking coach for a public speaking training app.",
    "Generate ONE simple, conversational question that a user can answer in under 1 minute.",
    "The question should be casual, everyday, and easy to talk about.",
    "Good examples: 'What is your favorite way to spend a weekend?', 'Describe your ideal vacation destination.'",
    "Bad examples: overly complex, controversial, or requiring specialized knowledge.",
    "",
    "Return ONLY valid JSON. No markdown, no backticks, no extra text.",
    "",
    "Use this exact JSON shape:",
    `{
  "question": string
}`,
  ].join("\n");
};

const buildFillerFreeEvaluationPrompt = ({ question, transcript, fillerCounts, metrics }) => {
  return [
    "You are a supportive speaking coach for a public speaking training app.",
    "Evaluate the user's spoken response for filler word usage, fluency, and conciseness.",
    "The user was asked a simple question and had up to 1 minute to answer.",
    "",
    "Return ONLY valid JSON. No markdown, no backticks, no extra text.",
    "",
    "Use this exact JSON shape:",
    `{
  "quickSummary": string,
  "skillBreakdown": [
    {
      "skill": "Fluency",
      "score": number,
      "level": "Needs Improvement" | "Fair" | "Good" | "Excellent",
      "reason": string,
      "improvementTip": string
    },
    {
      "skill": "Conciseness",
      "score": number,
      "level": "Needs Improvement" | "Fair" | "Good" | "Excellent",
      "reason": string,
      "improvementTip": string
    },
    {
      "skill": "Confidence",
      "score": number,
      "level": "Needs Improvement" | "Fair" | "Good" | "Excellent",
      "reason": string,
      "improvementTip": string
    }
  ],
  "recommendedActions": [
    {
      "title": string,
      "description": string
    }
  ]
}`,
    "",
    "Scoring rules:",
    "- Each skill score must be an integer between 0 and 100.",
    "- Fluency: how smooth and natural the speech was; penalize heavily for frequent filler words.",
    "- Conciseness: how focused and on-topic the answer was.",
    "- Confidence: overall assertiveness, clarity, and directness.",
    "- Level: 0-49 = Needs Improvement, 50-69 = Fair, 70-84 = Good, 85-100 = Excellent.",
    "- quickSummary: 1-2 sentence encouraging summary of the overall performance.",
    "- recommendedActions: 2-3 specific, actionable tips to reduce filler word usage. Number them in priority order.",
    "",
    `Question asked: ${question}`,
    `Transcript: ${transcript}`,
    `Filler word counts: ${JSON.stringify(fillerCounts)}`,
    `Metrics: ${JSON.stringify(metrics)}`,
  ].join("\n");
};

export { buildFillerFreeQuestionPrompt, buildFillerFreeEvaluationPrompt };
