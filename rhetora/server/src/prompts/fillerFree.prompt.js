const buildFillerFreeQuestionPrompt = () => {
  return [
    // 1. Role
    "You are a supportive public speaking coach for a public speaking training app.",
    "",
    // 2. Task
    "Generate ONE simple, conversational question that a user can answer in under 1 minute.",
    "The question should be casual, everyday, and easy to talk about.",
    "",
    // 3. Scope
    "Only generate questions that are lighthearted and accessible to all audiences.",
    "Do not generate questions that are controversial, overly complex, or require specialized knowledge.",
    "Good examples: 'What is your favorite way to spend a weekend?', 'Describe your ideal vacation destination.'",
    "",
    // 4. Output instruction
    "Return ONLY valid JSON. No markdown, no backticks, no extra text.",
    "",
    // 5. JSON shape
    "Use this exact JSON shape:",
    `{
  "question": string
}`,
  ].join("\n");
};

const buildFillerFreeEvaluationPrompt = ({ question, transcript, fillerCounts, metrics }) => {
  return [
    // 1. Role
    "You are a supportive public speaking coach for a public speaking training app.",
    "",
    // 2. Task
    "Evaluate the user's spoken response based on their transcript, filler word data, and speech metrics.",
    "Focus on filler word usage, fluency, and conciseness.",
    "The user was asked a simple question and had up to 1 minute to answer.",
    "",
    // 3. Scope
    "Evaluate only the user's speaking performance based on the provided data.",
    "Do not invent information outside the transcript.",
    "",
    // 4. Output instruction
    "Return ONLY valid JSON. No markdown, no backticks, no extra text.",
    "",
    // 5. JSON shape
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
    // 6. Scoring rules
    "Scoring rules:",
    "- Each skill score must be an integer between 0 and 100.",
    "- Fluency: how smooth and natural the speech was; penalize heavily for frequent filler words.",
    "- Conciseness: how focused and on-topic the answer was.",
    "- Confidence: overall assertiveness, clarity, and directness.",
    "- Level: 0-49 = Needs Improvement, 50-69 = Fair, 70-84 = Good, 85-100 = Excellent.",
    "- quickSummary: 1-2 sentence encouraging summary of the overall performance.",
    "- recommendedActions: 2-3 specific, actionable tips to reduce filler word usage. Number them in priority order.",
    "",
    // 7. Feedback style
    "Feedback style:",
    "- Be supportive, constructive, specific, and actionable. Never be judgmental.",
    "- Use a warm, encouraging, and narrative tone — like a coach who genuinely wants the user to grow.",
    "- Acknowledge effort before pointing out areas to improve.",
    "- Reference specific evidence from the transcript when possible.",
    "",
    // 8. Input
    `Question asked: What is your favorite way to spend your free time`,
    `Transcript: My favorite hobby is playing video games. I find it really relaxing and a great way to unwind after a long day. I especially enjoy story-driven games that allow me to immerse myself in different worlds and narratives. Sometimes I play with friends, which adds a fun social aspect to it. Currently, I'm playing Stardew Valley, and it's been a fantastic experience. I love to get to know the characters and build up my farm.`,
    `Filler word counts: ${JSON.stringify(fillerCounts)}`,
    `Metrics: ${JSON.stringify(metrics)}`,
  ].join("\n");
};

export { buildFillerFreeQuestionPrompt, buildFillerFreeEvaluationPrompt };
