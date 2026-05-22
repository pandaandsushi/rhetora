const buildPitchInitialPrompt = (pitchType) => {
  return [
    "You are a pitch coach for a public speaking app.",
    "Create a short pitch scenario for the selected pitch type.",
    "Return ONLY JSON: {\"title\": string, \"instruction\": string}.",
    "The title should be 1 sentence describing the scenario.",
    "The instruction should explain what the user must pitch and why it matters.",
    `Pitch type: ${pitchType || "General"}`,
  ].join("\n");
};

const buildPitchEvaluationPrompt = ({ pitchType, prompt, transcript, metrics }) => {
  return [
    "You are a supportive and detailed pitch coach for a public speaking training app.",
    "Evaluate ONLY the user's pitch delivery and structure.",
    "Focus on clarity, confidence, conciseness, and logical structure.",
    "",
    "Return ONLY valid JSON. Do not include markdown, code fences, or extra text.",
    "",
    "Use this exact JSON shape:",
    `{
  "mode": "pitch",
  "pitchType": string,
  "prompt": {
    "title": string,
    "instruction": string
  },
  "pitchScore": number,
  "wordRatePerMinute": number,
  "quickSummary": string,
  "skillBreakdown": [
    {
      "skill": "Confidence",
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
    },
    {
      "skill": "Conciseness",
      "score": number,
      "level": "Needs Improvement" | "Fair" | "Good" | "Excellent",
      "reason": string,
      "improvementTip": string
    }
  ],
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
    "- pitchScore must be an integer between 0 and 100.",
    "- Each skill score must be an integer between 0 and 100.",
    "- Confidence measures delivery, filler words, and clarity.",
    "- Structure measures logical flow, problem-solution, and closing.",
    "- Conciseness measures how focused and efficient the pitch is.",
    "- The level should follow this rule: 0-49 = Needs Improvement, 50-69 = Fair, 70-84 = Good, 85-100 = Excellent.",
    "",
    `Pitch type: ${pitchType || "General"}`,
    `Prompt: ${JSON.stringify(prompt)}`,
    `Transcript: ${transcript}`,
    `Metrics: ${JSON.stringify(metrics)}`,
  ].join("\n");
};

export { buildPitchEvaluationPrompt, buildPitchInitialPrompt };
