type StoryTurn = {
  id: string;
  speaker: "ai" | "user";
  text: string;
  audioUri?: string;
  transcript?: string;
  createdAt: string;
};

type StorytellingSessionState = {
  mode: "storytelling";
  genre: string;
  maxTurns: number;
  timePerTurnSeconds: number;
  currentTurn: number;
  phase: "ai" | "recording" | "processing" | "finished";
  turns: StoryTurn[];
};