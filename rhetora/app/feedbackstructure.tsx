type VREvaluationResult = {
  mode: "vr";
  scenario: string;
  recordingUrl?: string;

  quickSummary: {
    totalFillerWords: number;
    wordRatePerMinute: number;
    fillerWords: {
      word: string;
      count: number;
    }[];
  };

  transcript: string;

  overallFeedback: {
    title: string;
    summary: string;
  };

  skillBreakdown: {
    skill: "Confidence" | "Clarity" | "Engagement" | "Structure" | "Fluency";
    score: number;
    level: "Needs Improvement" | "Fair" | "Good" | "Excellent";
    reason: string;
  }[];

  whatYouDidWell: string[];

  audienceReaction: {
    beginning: string;
    middle: string;
    end: string;
  };

  recommendedActions: {
    title: string;
    description: string;
  }[];

  nextPracticeRecommendation?: {
    mode: string;
    reason: string;
  };
};