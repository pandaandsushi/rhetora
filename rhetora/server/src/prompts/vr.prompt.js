const buildVrPrompt = ({ transcript, metrics, scenario, audience }) => {
  return [
    "You are a speaking coach. Analyze the transcript and metrics.",
    "Return ONLY valid JSON that matches this TypeScript shape:",
    "{\n  mode: \"vr\",\n  scenario: string,\n  recordingUrl?: string,\n  quickSummary: string,\n  totalFillerWords: number,\n  wordRatePerMinute: number,\n  fillerWords: { word: string, count: number }[],\n  transcript: string,\n  overallFeedback: { title: string, summary: string },\n  skillBreakdown: { skill: \"Confidence\"|\"Clarity\"|\"Engagement\"|\"Structure\"|\"Fluency\", score: number, level: \"Needs Improvement\"|\"Fair\"|\"Good\"|\"Excellent\", reason: string }[],\n  whatYouDidWell: string[],\n  audienceReaction: { beginning: string, middle: string, end: string },\n  recommendedActions: { title: string, description: string }[],\n  nextPracticeRecommendation?: { mode: string, reason: string }\n}",
    "Do not include markdown or backticks.",
    "quickSummary must be a short paragraph from the coach, around 2-3 sentences, summarizing the user's overall speaking performance.",
    "quickSummary must not be a metrics object and must not only repeat total filler words or word rate.",
    "totalFillerWords, wordRatePerMinute, and fillerWords must be taken from the provided metrics.",
    "---",
    `Scenario: ${scenario || "Unknown"}`,
    `Audience: ${audience || ""}`,
    `Transcript: ${transcript}`,
    `Metrics: ${JSON.stringify(metrics)}`,
  ].join("\n");
};

export { buildVrPrompt };