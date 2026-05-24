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
  label: string;
  points: SkillProgressPoint[];
  overview: string[];
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

export const skillProgressData: Record<
  SkillKey,
  Record<PeriodKey, SkillProgressRange>
> = {
  fillerWords: {
    daily: {
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
    weekly: {
      label: "May 2024",
      points: [
        { label: "W1", score: 55 },
        { label: "W2", score: 64 },
        { label: "W3", score: 72 },
        { label: "W4", score: 78 },
      ],
      overview: ["Your filler word score improved steadily each week."],
    },
    monthly: {
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
    yearly: {
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
  },

  structure: {
    daily: {
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
    weekly: {
      label: "May 2024",
      points: [
        { label: "W1", score: 62 },
        { label: "W2", score: 66 },
        { label: "W3", score: 72 },
        { label: "W4", score: 78 },
      ],
      overview: ["Your weekly structure score increased gradually."],
    },
    monthly: {
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
    yearly: {
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
  },

  criticalThinking: {
    daily: {
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
    weekly: {
      label: "May 2024",
      points: [
        { label: "W1", score: 60 },
        { label: "W2", score: 64 },
        { label: "W3", score: 70 },
        { label: "W4", score: 76 },
      ],
      overview: ["Your critical thinking improved through repeated practice."],
    },
    monthly: {
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
    yearly: {
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
  },

  confidence: {
    daily: {
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
    weekly: {
      label: "May 2024",
      points: [
        { label: "W1", score: 66 },
        { label: "W2", score: 70 },
        { label: "W3", score: 76 },
        { label: "W4", score: 82 },
      ],
      overview: ["Your confidence increased across weekly sessions."],
    },
    monthly: {
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
    yearly: {
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
  },

  conciseness: {
    daily: {
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
    weekly: {
      label: "May 2024",
      points: [
        { label: "W1", score: 52 },
        { label: "W2", score: 58 },
        { label: "W3", score: 64 },
        { label: "W4", score: 70 },
      ],
      overview: ["Your conciseness improved as your responses became more direct."],
    },
    monthly: {
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
    yearly: {
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
  },

  fluency: {
    daily: {
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
    weekly: {
      label: "May 2024",
      points: [
        { label: "W1", score: 57 },
        { label: "W2", score: 63 },
        { label: "W3", score: 70 },
        { label: "W4", score: 77 },
      ],
      overview: ["Your weekly fluency trend shows steady improvement."],
    },
    monthly: {
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
    yearly: {
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
  },
};