const buildStoryModeEvaluationPrompt = ({ episodeTitle, transcript, metrics }) => {
  return [
    // 1. Role
    "You are a supportive public speaking coach for a public speaking training app.",
    "",
    // 2. Task
    "Evaluate the user's performance in a Story Mode roleplay simulation.",
    "Assess how well they delivered their lines, stayed in context, and communicated clearly within the episode scenario.",
    "",
    // 3. Scope
    `Evaluate only the user's speaking performance within the context of the episode: "${episodeTitle}".`,
    "Do not invent information outside the transcript.",
    "",
    // 4. Output instruction
    "Return ONLY valid JSON. No markdown, no backticks, no extra text.",
    "",
    // 5. JSON shape
    "Use this exact JSON shape:",
    `{
  "quickSummary": string,
  "whatYouDidWell": string[],
  "structureAnalysis": [
    {
      "point": string,
      "excerpt": string,
      "feedback": string
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
    "Output quantity rules:",
    "- quickSummary: 2-3 sentences summarizing the user's overall performance.",
    "- whatYouDidWell: exactly 3-4 specific positive points about their speech or content.",
    "- structureAnalysis: exactly 2-3 items, each referencing a structural aspect with a short exact quote from the transcript.",
    "- recommendedActions: exactly 3 items, each with a short actionable title and a detailed practical description.",
    "",
    // 7. Feedback style
    "Feedback style:",
    "- Be supportive, constructive, specific, and actionable. Never be judgmental.",
    "- Use a warm, encouraging, and narrative tone — like a coach who genuinely wants the user to grow.",
    "- Acknowledge effort and strengths before pointing out areas to improve.",
    "- Directly reference the context of the episode scenario in your feedback.",
    "- Reference specific evidence from the transcript when possible.",
    "",
    // 8. Input
    `Episode title: ${episodeTitle}`,
    `Transcript: ${transcript}`,
    `Metrics: ${JSON.stringify(metrics)}`,
  ].join("\n");
};

export { buildStoryModeEvaluationPrompt };
