const buildPitchInitialPrompt = (pitchType) => {
  return [
    "You are a pitch coach for a public speaking training app.",
    "Create a concise, beginner-friendly pitch scenario based on the selected pitch type.",
    "The main prompt should be short and easy to understand.",
    "Do not make the scenario too long. Put extra guidance only inside structured tips.",
    "",
    "Return ONLY valid JSON. Do not include markdown, backticks, explanations, or extra text.",
    "",
    "Use this exact JSON shape:",
    `{
  "title": string,
  "instruction": string,
  "tips": {
    "hook": string,
    "problem": string,
    "solution": string,
    "value": string,
    "closing": string
  }
}`,
    "",
    "Field rules:",
    "- title: One short sentence describing what the user is pitching.",
    "- instruction: One short instruction telling the user what to explain.",
    "- tips.hook: Suggest how the user can open the pitch.",
    "- tips.problem: Suggest the problem the user should mention.",
    "- tips.solution: Suggest how to introduce the product, startup, or personal value.",
    "- tips.value: Suggest the benefit or reason the audience should care.",
    "- tips.closing: Suggest how to end the pitch with a clear call-to-action.",
    "",
    "Pitch type guidance:",
    "- If pitch type is Product Idea, create a simple product example and describe the product mainly through the tips.",
    "- If pitch type is Startup Idea, create a simple startup example and describe the startup mainly through the tips.",
    "- If pitch type is Personal Pitch, create a realistic self-introduction scenario and describe the user's strengths mainly through the tips.",
    "",
    "Keep all fields concise.",
    "Use common and easy examples suitable for students or young professionals.",
    "Avoid complex industries, technical jargon, and overly futuristic ideas.",
    "",
    `Pitch type: ${pitchType || "General"}`,
  ].join("\n");
};

const buildPitchEvaluationPrompt = ({ pitchType, prompt, transcript, metrics }) => {
  return [
    "You are a supportive and detailed pitch coach for a public speaking training app.",
    "Evaluate ONLY the user's pitch delivery and structure.",
    "Focus on clarity, confidence, conciseness, and logical structure.",
    "Use the title, instruction, and tips only as context. Do not penalize the user for not following every tip exactly.",    "",
    "Return ONLY valid JSON. Do not include markdown, code fences, or extra text.",
    "",
    "Use this exact JSON shape:",
    `{
  "mode": "pitch",
  "pitchType": string,
  "prompt": {
    "title": string,
    "instruction": string,
    "tips": {
      "hook": string,
      "problem": string,
      "solution": string,
      "value": string,
      "closing": string
    }
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
    `Prompt details: ${JSON.stringify(prompt)}`,
    `Transcript: ${transcript}`,
    `Metrics: ${JSON.stringify(metrics)}`,
  ].join("\n");
};

export { buildPitchEvaluationPrompt, buildPitchInitialPrompt };
