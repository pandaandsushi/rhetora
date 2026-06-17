export type SkillKey =
  | "fillerWords"
  | "structure"
  | "criticalThinking"
  | "confidence"
  | "conciseness"
  | "fluency";

export type PeriodKey = "daily" | "weekly" | "monthly" | "yearly";

export type SkillProgressPoint = {
  label: string;
  score: number;
};

export type SkillProgressRange = {
  id: string;
  label: string;
  points: SkillProgressPoint[];
  overview: string[];
};

export type SkillProgressData = {
  dailyRanges: SkillProgressRange[];
  weeklyRanges: SkillProgressRange[];
  monthlyRanges: SkillProgressRange[];
  yearlyRanges: SkillProgressRange[];
};

export const periodTabs: { key: PeriodKey; label: string }[] = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

export const skillTabs: { key: SkillKey; label: string }[] = [
  { key: "fillerWords", label: "Filler Words" },
  { key: "structure", label: "Structure" },
  { key: "criticalThinking", label: "Critical Thinking" },
  { key: "confidence", label: "Confidence" },
  { key: "conciseness", label: "Conciseness" },
  { key: "fluency", label: "Fluency" },
];

export const skillProgressData: Record<SkillKey, SkillProgressData> = {
  fillerWords: {
    dailyRanges: [
      {
        id: "fillerWords-daily-week1",
        label: "21 May 2024 to 27 May 2024",
        points: [
          { label: "21", score: 52 },
          { label: "22", score: 58 },
          { label: "23", score: 62 },
          { label: "24", score: 66 },
          { label: "25", score: 70 },
          { label: "26", score: 74 },
          { label: "27", score: 78 },
        ],
        overview: [
          "Your filler word control improved during the selected period.",
          "The biggest improvement happened near the end of the range.",
        ],
      },
      {
        id: "fillerWords-daily-week2",
        label: "14 May 2024 to 20 May 2024",
        points: [
          { label: "14", score: 48 },
          { label: "15", score: 50 },
          { label: "16", score: 55 },
          { label: "17", score: 58 },
          { label: "18", score: 60 },
          { label: "19", score: 63 },
          { label: "20", score: 65 },
        ],
        overview: [
          "Your filler word usage was more frequent early in the week.",
          "Scores improved steadily from mid-week onward.",
        ],
      },
    ],
    weeklyRanges: [
      {
        id: "fillerWords-weekly-may2024",
        label: "May 2024",
        points: [
          { label: "W1", score: 55 },
          { label: "W2", score: 64 },
          { label: "W3", score: 72 },
          { label: "W4", score: 78 },
        ],
        overview: ["Your filler word score improved steadily each week."],
      },
      {
        id: "fillerWords-weekly-apr2024",
        label: "April 2024",
        points: [
          { label: "W1", score: 48 },
          { label: "W2", score: 53 },
          { label: "W3", score: 58 },
          { label: "W4", score: 62 },
        ],
        overview: ["April showed gradual filler word reduction week by week."],
      },
    ],
    monthlyRanges: [
      {
        id: "fillerWords-monthly-2024",
        label: "2024",
        points: [
          { label: "Jan", score: 50 },
          { label: "Feb", score: 55 },
          { label: "Mar", score: 60 },
          { label: "Apr", score: 70 },
          { label: "May", score: 78 },
        ],
        overview: ["Your long-term filler word progress shows a positive trend."],
      },
      {
        id: "fillerWords-monthly-2023",
        label: "2023",
        points: [
          { label: "Jan", score: 38 },
          { label: "Feb", score: 42 },
          { label: "Mar", score: 45 },
          { label: "Apr", score: 48 },
          { label: "May", score: 50 },
        ],
        overview: ["2023 marked the early stages of your filler word improvement."],
      },
    ],
    yearlyRanges: [
      {
        id: "fillerWords-yearly-all",
        label: "2022 to 2026",
        points: [
          { label: "2022", score: 45 },
          { label: "2023", score: 55 },
          { label: "2024", score: 68 },
          { label: "2025", score: 73 },
          { label: "2026", score: 80 },
        ],
        overview: ["Your yearly progress shows consistent improvement."],
      },
    ],
  },

  structure: {
    dailyRanges: [
      {
        id: "structure-daily-week1",
        label: "21 May 2024 to 27 May 2024",
        points: [
          { label: "21", score: 60 },
          { label: "22", score: 63 },
          { label: "23", score: 67 },
          { label: "24", score: 70 },
          { label: "25", score: 73 },
          { label: "26", score: 75 },
          { label: "27", score: 79 },
        ],
        overview: ["Your structure became clearer across the selected days."],
      },
      {
        id: "structure-daily-week2",
        label: "14 May 2024 to 20 May 2024",
        points: [
          { label: "14", score: 55 },
          { label: "15", score: 58 },
          { label: "16", score: 60 },
          { label: "17", score: 62 },
          { label: "18", score: 64 },
          { label: "19", score: 66 },
          { label: "20", score: 68 },
        ],
        overview: ["Structure scores climbed gradually throughout the week."],
      },
    ],
    weeklyRanges: [
      {
        id: "structure-weekly-may2024",
        label: "May 2024",
        points: [
          { label: "W1", score: 62 },
          { label: "W2", score: 66 },
          { label: "W3", score: 72 },
          { label: "W4", score: 78 },
        ],
        overview: ["Your weekly structure score increased gradually."],
      },
      {
        id: "structure-weekly-apr2024",
        label: "April 2024",
        points: [
          { label: "W1", score: 55 },
          { label: "W2", score: 59 },
          { label: "W3", score: 63 },
          { label: "W4", score: 67 },
        ],
        overview: ["April showed steady structure gains week over week."],
      },
    ],
    monthlyRanges: [
      {
        id: "structure-monthly-2024",
        label: "2024",
        points: [
          { label: "Jan", score: 56 },
          { label: "Feb", score: 61 },
          { label: "Mar", score: 65 },
          { label: "Apr", score: 72 },
          { label: "May", score: 78 },
        ],
        overview: ["Your structure is becoming more organized over time."],
      },
      {
        id: "structure-monthly-2023",
        label: "2023",
        points: [
          { label: "Jan", score: 42 },
          { label: "Feb", score: 46 },
          { label: "Mar", score: 49 },
          { label: "Apr", score: 52 },
          { label: "May", score: 55 },
        ],
        overview: ["2023 laid the groundwork for your structural improvement."],
      },
    ],
    yearlyRanges: [
      {
        id: "structure-yearly-all",
        label: "2022 to 2026",
        points: [
          { label: "2022", score: 50 },
          { label: "2023", score: 59 },
          { label: "2024", score: 67 },
          { label: "2025", score: 74 },
          { label: "2026", score: 80 },
        ],
        overview: ["Your yearly structure trend is improving."],
      },
    ],
  },

  criticalThinking: {
    dailyRanges: [
      {
        id: "criticalThinking-daily-week1",
        label: "21 May 2024 to 27 May 2024",
        points: [
          { label: "21", score: 58 },
          { label: "22", score: 60 },
          { label: "23", score: 64 },
          { label: "24", score: 63 },
          { label: "25", score: 69 },
          { label: "26", score: 72 },
          { label: "27", score: 76 },
        ],
        overview: ["Your ideas became deeper and more connected during the week."],
      },
      {
        id: "criticalThinking-daily-week2",
        label: "14 May 2024 to 20 May 2024",
        points: [
          { label: "14", score: 52 },
          { label: "15", score: 55 },
          { label: "16", score: 57 },
          { label: "17", score: 59 },
          { label: "18", score: 62 },
          { label: "19", score: 64 },
          { label: "20", score: 66 },
        ],
        overview: ["Critical thinking scores were building steadily this week."],
      },
    ],
    weeklyRanges: [
      {
        id: "criticalThinking-weekly-may2024",
        label: "May 2024",
        points: [
          { label: "W1", score: 60 },
          { label: "W2", score: 64 },
          { label: "W3", score: 70 },
          { label: "W4", score: 76 },
        ],
        overview: ["Your critical thinking improved through repeated practice."],
      },
      {
        id: "criticalThinking-weekly-apr2024",
        label: "April 2024",
        points: [
          { label: "W1", score: 52 },
          { label: "W2", score: 56 },
          { label: "W3", score: 59 },
          { label: "W4", score: 63 },
        ],
        overview: ["April showed consistent critical thinking growth."],
      },
    ],
    monthlyRanges: [
      {
        id: "criticalThinking-monthly-2024",
        label: "2024",
        points: [
          { label: "Jan", score: 52 },
          { label: "Feb", score: 57 },
          { label: "Mar", score: 62 },
          { label: "Apr", score: 70 },
          { label: "May", score: 76 },
        ],
        overview: ["Your reasoning and idea development improved over months."],
      },
      {
        id: "criticalThinking-monthly-2023",
        label: "2023",
        points: [
          { label: "Jan", score: 40 },
          { label: "Feb", score: 44 },
          { label: "Mar", score: 47 },
          { label: "Apr", score: 50 },
          { label: "May", score: 53 },
        ],
        overview: ["2023 marks the early foundation of your critical thinking journey."],
      },
    ],
    yearlyRanges: [
      {
        id: "criticalThinking-yearly-all",
        label: "2022 to 2026",
        points: [
          { label: "2022", score: 48 },
          { label: "2023", score: 56 },
          { label: "2024", score: 64 },
          { label: "2025", score: 72 },
          { label: "2026", score: 78 },
        ],
        overview: ["Your yearly critical thinking progress shows growth."],
      },
    ],
  },

  confidence: {
    dailyRanges: [
      {
        id: "confidence-daily-week1",
        label: "21 May 2024 to 27 May 2024",
        points: [
          { label: "21", score: 65 },
          { label: "22", score: 68 },
          { label: "23", score: 70 },
          { label: "24", score: 74 },
          { label: "25", score: 76 },
          { label: "26", score: 79 },
          { label: "27", score: 82 },
        ],
        overview: ["Your confidence improved as your delivery became steadier."],
      },
      {
        id: "confidence-daily-week2",
        label: "14 May 2024 to 20 May 2024",
        points: [
          { label: "14", score: 58 },
          { label: "15", score: 61 },
          { label: "16", score: 63 },
          { label: "17", score: 65 },
          { label: "18", score: 67 },
          { label: "19", score: 69 },
          { label: "20", score: 72 },
        ],
        overview: ["Confidence was climbing consistently throughout the week."],
      },
    ],
    weeklyRanges: [
      {
        id: "confidence-weekly-may2024",
        label: "May 2024",
        points: [
          { label: "W1", score: 66 },
          { label: "W2", score: 70 },
          { label: "W3", score: 76 },
          { label: "W4", score: 82 },
        ],
        overview: ["Your confidence increased across weekly sessions."],
      },
      {
        id: "confidence-weekly-apr2024",
        label: "April 2024",
        points: [
          { label: "W1", score: 58 },
          { label: "W2", score: 62 },
          { label: "W3", score: 66 },
          { label: "W4", score: 70 },
        ],
        overview: ["April showed a consistent confidence boost each week."],
      },
    ],
    monthlyRanges: [
      {
        id: "confidence-monthly-2024",
        label: "2024",
        points: [
          { label: "Jan", score: 60 },
          { label: "Feb", score: 64 },
          { label: "Mar", score: 70 },
          { label: "Apr", score: 76 },
          { label: "May", score: 82 },
        ],
        overview: ["Your confidence is becoming more stable over time."],
      },
      {
        id: "confidence-monthly-2023",
        label: "2023",
        points: [
          { label: "Jan", score: 46 },
          { label: "Feb", score: 50 },
          { label: "Mar", score: 53 },
          { label: "Apr", score: 56 },
          { label: "May", score: 59 },
        ],
        overview: ["Confidence scores in 2023 show your early-stage growth."],
      },
    ],
    yearlyRanges: [
      {
        id: "confidence-yearly-all",
        label: "2022 to 2026",
        points: [
          { label: "2022", score: 54 },
          { label: "2023", score: 63 },
          { label: "2024", score: 70 },
          { label: "2025", score: 78 },
          { label: "2026", score: 84 },
        ],
        overview: ["Your yearly confidence trend is strong."],
      },
    ],
  },

  conciseness: {
    dailyRanges: [
      {
        id: "conciseness-daily-week1",
        label: "21 May 2024 to 27 May 2024",
        points: [
          { label: "21", score: 50 },
          { label: "22", score: 54 },
          { label: "23", score: 57 },
          { label: "24", score: 61 },
          { label: "25", score: 64 },
          { label: "26", score: 67 },
          { label: "27", score: 70 },
        ],
        overview: ["Your answers became more focused across the week."],
      },
      {
        id: "conciseness-daily-week2",
        label: "14 May 2024 to 20 May 2024",
        points: [
          { label: "14", score: 44 },
          { label: "15", score: 47 },
          { label: "16", score: 49 },
          { label: "17", score: 51 },
          { label: "18", score: 53 },
          { label: "19", score: 55 },
          { label: "20", score: 57 },
        ],
        overview: ["Conciseness was gradually improving throughout the week."],
      },
    ],
    weeklyRanges: [
      {
        id: "conciseness-weekly-may2024",
        label: "May 2024",
        points: [
          { label: "W1", score: 52 },
          { label: "W2", score: 58 },
          { label: "W3", score: 64 },
          { label: "W4", score: 70 },
        ],
        overview: ["Your conciseness improved as your responses became more direct."],
      },
      {
        id: "conciseness-weekly-apr2024",
        label: "April 2024",
        points: [
          { label: "W1", score: 44 },
          { label: "W2", score: 47 },
          { label: "W3", score: 51 },
          { label: "W4", score: 54 },
        ],
        overview: ["April revealed room for conciseness growth, which you acted on."],
      },
    ],
    monthlyRanges: [
      {
        id: "conciseness-monthly-2024",
        label: "2024",
        points: [
          { label: "Jan", score: 48 },
          { label: "Feb", score: 53 },
          { label: "Mar", score: 58 },
          { label: "Apr", score: 65 },
          { label: "May", score: 70 },
        ],
        overview: ["Your conciseness improved over the selected months."],
      },
      {
        id: "conciseness-monthly-2023",
        label: "2023",
        points: [
          { label: "Jan", score: 36 },
          { label: "Feb", score: 39 },
          { label: "Mar", score: 42 },
          { label: "Apr", score: 45 },
          { label: "May", score: 48 },
        ],
        overview: ["2023 shows early conciseness training with gradual gains."],
      },
    ],
    yearlyRanges: [
      {
        id: "conciseness-yearly-all",
        label: "2022 to 2026",
        points: [
          { label: "2022", score: 44 },
          { label: "2023", score: 52 },
          { label: "2024", score: 60 },
          { label: "2025", score: 68 },
          { label: "2026", score: 72 },
        ],
        overview: ["Your yearly conciseness score is moving upward."],
      },
    ],
  },

  fluency: {
    dailyRanges: [
      {
        id: "fluency-daily-week1",
        label: "21 May 2024 to 27 May 2024",
        points: [
          { label: "21", score: 55 },
          { label: "22", score: 58 },
          { label: "23", score: 63 },
          { label: "24", score: 66 },
          { label: "25", score: 69 },
          { label: "26", score: 73 },
          { label: "27", score: 77 },
        ],
        overview: ["Your speech flow became smoother during the selected range."],
      },
      {
        id: "fluency-daily-week2",
        label: "14 May 2024 to 20 May 2024",
        points: [
          { label: "14", score: 49 },
          { label: "15", score: 52 },
          { label: "16", score: 54 },
          { label: "17", score: 56 },
          { label: "18", score: 58 },
          { label: "19", score: 61 },
          { label: "20", score: 64 },
        ],
        overview: ["Fluency showed a steady upward trend this week."],
      },
    ],
    weeklyRanges: [
      {
        id: "fluency-weekly-may2024",
        label: "May 2024",
        points: [
          { label: "W1", score: 57 },
          { label: "W2", score: 63 },
          { label: "W3", score: 70 },
          { label: "W4", score: 77 },
        ],
        overview: ["Your weekly fluency trend shows steady improvement."],
      },
      {
        id: "fluency-weekly-apr2024",
        label: "April 2024",
        points: [
          { label: "W1", score: 49 },
          { label: "W2", score: 53 },
          { label: "W3", score: 57 },
          { label: "W4", score: 61 },
        ],
        overview: ["April showed consistent fluency gains each week."],
      },
    ],
    monthlyRanges: [
      {
        id: "fluency-monthly-2024",
        label: "2024",
        points: [
          { label: "Jan", score: 51 },
          { label: "Feb", score: 56 },
          { label: "Mar", score: 62 },
          { label: "Apr", score: 70 },
          { label: "May", score: 77 },
        ],
        overview: ["Your speech is becoming smoother across months."],
      },
      {
        id: "fluency-monthly-2023",
        label: "2023",
        points: [
          { label: "Jan", score: 38 },
          { label: "Feb", score: 42 },
          { label: "Mar", score: 45 },
          { label: "Apr", score: 48 },
          { label: "May", score: 51 },
        ],
        overview: ["2023 shows the early stages of your fluency development."],
      },
    ],
    yearlyRanges: [
      {
        id: "fluency-yearly-all",
        label: "2022 to 2026",
        points: [
          { label: "2022", score: 46 },
          { label: "2023", score: 55 },
          { label: "2024", score: 63 },
          { label: "2025", score: 72 },
          { label: "2026", score: 79 },
        ],
        overview: ["Your yearly fluency trend shows consistent growth."],
      },
    ],
  },
};