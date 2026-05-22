const buildStoryInitialPrompt = (genre) => {
  return [
    "You are a creative writing assistant.",
    "Write a short opening for a story in the requested genre.",
    "Keep it to 2-3 sentences, vivid but concise.",
    "Return ONLY JSON: {\"text\": string}.",
    `Genre: ${genre || "general"}`,
  ].join("\n");
};

const buildStoryContinuationPrompt = ({ genre, turns }) => {
  const formattedTurns = turns
    .map((turn) => `${turn.speaker.toUpperCase()}: ${turn.text}`)
    .join("\n");

  return [
    "You are a creative writing assistant.",
    "Continue the story with 2-4 sentences.",
    "Maintain tone, characters, and continuity.",
    "Return ONLY JSON: {\"text\": string}.",
    `Genre: ${genre || "general"}`,
    "---",
    formattedTurns,
  ].join("\n");
};

const buildStoryEvaluationPrompt = ({ genre, turns, metrics }) => {
  const formattedTurns = turns
    .map((turn) => `${turn.speaker.toUpperCase()}: ${turn.text}`)
    .join("\n");

  return [
    "You are a supportive and detailed storytelling coach for a public speaking training app.",
    "Evaluate ONLY the user's storytelling performance, not the AI's writing quality.",
    "Focus on how well the user continues the story, speaks clearly, builds logical events, and responds creatively to the AI prompt.",
    "",
    "Return ONLY valid JSON. Do not include markdown, code fences, explanations, or extra text.",
    "",
    "Use this exact JSON shape:",
    `{
  "mode": "storytelling",
  "genre": string,
  "storyScore": number,
  "wordRatePerMinute": number,
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
      "skill": "Critical Thinking",
      "score": number,
      "level": "Needs Improvement" | "Fair" | "Good" | "Excellent",
      "reason": string,
      "improvementTip": string
    },
    {
      "skill": "Structure",
      "score": number,
      "level": "Needs Improvement" | "Fair" | "Good" | "Excellent",
      "reason": string,
      "improvementTip": string
    }
  ],
  "storyRecap": {
    "items": [
      {
        "speaker": "ai" | "user",
        "text": string
      }
    ]
  },
  "overallFeedback": {
    "title": string,
    "summary": string
  },
  "whatYouDidWell": string[],
  "structureAnalysis": {
    "title": string,
    "description": string
  }[],
  "recommendedActions": {
    "title": string,
    "description": string
  }[]
}`,
    "",
    "Scoring rules:",
    "- storyScore must be an integer between 0 and 100.",
    "- Each skill score must be an integer between 0 and 100.",
    "- Fluency measures smoothness, pacing, hesitation, filler words, and how naturally the user continues the story.",
    "- Critical Thinking measures how logically the user responds to the AI prompt, makes decisions, solves story situations, and develops cause-and-effect.",
    "- Structure measures whether the user's continuation has a clear sequence, connects to previous events, and maintains story continuity.",
    "- The level should follow this rule: 0-49 = Needs Improvement, 50-69 = Fair, 70-84 = Good, 85-100 = Excellent.",
    "",
    "Feedback style:",
    "- Use a supportive tone.",
    "- Give detailed but concise reasons.",
    "- Make the feedback actionable.",
    "- Mention specific evidence from the user's story when possible.",
    "- Do not overpraise. Be honest but encouraging.",
    "",
    "Story recap rules:",
    "- Include both AI and user turns in chronological order.",
    "- Keep the original meaning of each turn.",
    "- Do not invent story events that are not present in the turns.",
    "",
    "Recommended actions rules:",
    "- Give 3 recommended actions.",
    "- Each action must have a short title and a practical description.",
    "",
    `Genre: ${genre || "general"}`,
    `Metrics: ${JSON.stringify(metrics)}`,
    "--- STORY TURNS ---",
    formattedTurns,
  ].join("\n");
};

export { buildStoryInitialPrompt, buildStoryContinuationPrompt, buildStoryEvaluationPrompt };
