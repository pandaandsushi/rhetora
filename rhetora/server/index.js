import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";

dotenv.config();

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});
const PORT = process.env.PORT || 5050;
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const GOOGLE_AI_MODEL = process.env.GOOGLE_AI_MODEL || "gemini-2.5-flash";

const defaultParams = {
  model: process.env.DEEPGRAM_MODEL || "nova-3",
  smart_format: process.env.DEEPGRAM_SMART_FORMAT || "true",
  filler_words: process.env.DEEPGRAM_FILLER_WORDS || "true",
  utterances: process.env.DEEPGRAM_UTTERANCES || "true",
  punctuate: process.env.DEEPGRAM_PUNCTUATE || "true",
};

const defaultFillerWords = [
  "um",
  "uh",
  "like",
  "so",
  "right",
  "actually",
  "basically",
  "literally",
  "you know",
  "i mean",
];

const parseModelJson = (text) => {
  if (!text) {
    return null;
  }

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) {
    return null;
  }

  const sliced = text.slice(start, end + 1);
  try {
    return JSON.parse(sliced);
  } catch {
    return null;
  }
};

const buildPrompt = ({ transcript, metrics, scenario, audience }) => {
  return [
    "You are a speaking coach. Analyze the transcript and metrics.",
    "Return ONLY valid JSON that matches this TypeScript shape:",
    "{\n  mode: \"vr\",\n  scenario: string,\n  recordingUrl?: string,\n  quickSummary: { totalFillerWords: number, wordRatePerMinute: number, fillerWords: { word: string, count: number }[] },\n  transcript: string,\n  overallFeedback: { title: string, summary: string },\n  skillBreakdown: { skill: \"Confidence\"|\"Clarity\"|\"Engagement\"|\"Structure\"|\"Fluency\", score: number, level: \"Needs Improvement\"|\"Fair\"|\"Good\"|\"Excellent\", reason: string }[],\n  whatYouDidWell: string[],\n  audienceReaction: { beginning: string, middle: string, end: string },\n  recommendedActions: { title: string, description: string }[],\n  nextPracticeRecommendation?: { mode: string, reason: string }\n}",
    "Do not include markdown or backticks.",
    "---",
    `Scenario: ${scenario || "Unknown"}`,
    `Audience: ${audience || ""}`,
    `Transcript: ${transcript}`,
    `Metrics: ${JSON.stringify(metrics)}`,
  ].join("\n");
};

const callGemini = async (prompt) => {
  if (!GOOGLE_AI_API_KEY) {
    throw new Error("GOOGLE_AI_API_KEY is not set");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GOOGLE_AI_MODEL}:generateContent?key=${GOOGLE_AI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "LLM request failed");
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  const parsed = parseModelJson(text);

  if (!parsed) {
    throw new Error("LLM did not return valid JSON");
  }

  return parsed;
};

const transcribeBuffer = async (file) => {
  if (!DEEPGRAM_API_KEY) {
    throw new Error("DEEPGRAM_API_KEY is not set");
  }

  const query = new URLSearchParams(defaultParams).toString();
  const response = await fetch(`https://api.deepgram.com/v1/listen?${query}`, {
    method: "POST",
    headers: {
      Authorization: `Token ${DEEPGRAM_API_KEY}`,
      "Content-Type": file.mimetype || "audio/m4a",
    },
    body: file.buffer,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Deepgram request failed");
  }

  const data = await response.json();
  const alternative = data?.results?.channels?.[0]?.alternatives?.[0];
  const words = alternative?.words ?? [];
  const transcript = alternative?.transcript ?? "";
  const durationSeconds = data?.metadata?.duration ?? words[words.length - 1]?.end ?? 0;

  const totalWords = words.length;
  const wordRatePerMinute = durationSeconds > 0
    ? Math.round((totalWords / durationSeconds) * 60)
    : 0;

  const fillerWordCounts = new Map();
  const fillerSet = new Set(defaultFillerWords.map((word) => word.toLowerCase()));

  for (const word of words) {
    const raw = word?.word ?? word?.punctuated_word ?? "";
    const normalized = raw.toLowerCase().replace(/[^a-z\s]/g, "").trim();

    if (normalized && fillerSet.has(normalized)) {
      fillerWordCounts.set(
        normalized,
        (fillerWordCounts.get(normalized) || 0) + 1,
      );
    }
  }

  const fillerWords = Array.from(fillerWordCounts.entries()).map(([word, count]) => ({
    word,
    count,
  }));
  const totalFillerWords = fillerWords.reduce((sum, item) => sum + item.count, 0);

  return {
    transcript,
    words,
    utterances: alternative?.utterances ?? data?.results?.utterances ?? [],
    metrics: {
      durationSeconds,
      totalWords,
      wordRatePerMinute,
      totalFillerWords,
      fillerWords,
    },
    raw: {
      request: defaultParams,
    },
  };
};

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
    "You are a storytelling coach.",
    "Evaluate the user's storytelling based on the conversation.",
    "Return ONLY JSON with this shape:",
    "{\n  mode: \"storytelling\",\n  genre: string,\n  storyScore: number,\n  wordRatePerMinute: number,\n  storyRecap: string[],\n  whatYouDidWell: string[],\n  structureAnalysis: { title: string, description: string }[],\n  recommendedActions: string[]\n}",
    "Keep storyScore between 0-100.",
    `Genre: ${genre || "general"}`,
    `Metrics: ${JSON.stringify(metrics)}`,
    "---",
    formattedTurns,
  ].join("\n");
};

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Missing audio file" });
    }
    const result = await transcribeBuffer(req.file);
    console.log("=== DEEPGRAM TRANSCRIPT ===");
    console.log(result.transcript);

    console.log("=== SPEECH METRICS ===");
    console.log(result.metrics);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error?.message ?? "Unknown error" });
  }
});

app.post("/evaluate", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Missing audio file" });
    }

    const scenario = req.body?.scenario || "";
    const audience = req.body?.audience || "";

    const result = await transcribeBuffer(req.file);
    const prompt = buildPrompt({
      transcript: result.transcript,
      metrics: result.metrics,
      scenario,
      audience,
    });
    const feedback = await callGemini(prompt);

    return res.json({
      feedback,
      transcript: result.transcript,
      metrics: result.metrics,
    });
  } catch (error) {
    return res.status(500).json({ error: error?.message ?? "Unknown error" });
  }
});

app.post("/storytelling/initial", async (req, res) => {
  try {
    const { genre } = req.body || {};
    const prompt = buildStoryInitialPrompt(genre);
    const result = await callGemini(prompt);
    console.log("=== STORY OPENING ===");
    console.log(result.text);
    return res.json({ text: result.text });
  } catch (error) {
    return res.status(500).json({ error: error?.message ?? "Unknown error" });
  }
});

app.post("/storytelling/turn", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Missing audio file" });
    }

    const genre = req.body?.genre || "";
    const currentTurn = Number(req.body?.currentTurn || "1");
    const maxTurns = Number(req.body?.maxTurns || "1");
    const rawTurns = req.body?.turns || "[]";
    const turns = JSON.parse(rawTurns);

    const result = await transcribeBuffer(req.file);
    const userTurn = {
      id: `user-${Date.now()}`,
      speaker: "user",
      text: result.transcript,
      transcript: result.transcript,
      createdAt: new Date().toISOString(),
    };
    console.log(`=== USER TURN ${currentTurn} ===`);
    console.log(userTurn.text);
    const nextTurns = [...turns, userTurn];

    if (currentTurn >= maxTurns) {
      console.log("=== STORY END ===");
      console.log(nextTurns);
      return res.json({
        turns: nextTurns,
        transcript: result.transcript,
        nextPrompt: null,
        metrics: result.metrics,
      });
    }

    const prompt = buildStoryContinuationPrompt({ genre, turns: nextTurns });
    const continuation = await callGemini(prompt);
    const aiTurn = {
      id: `ai-${Date.now()}`,
      speaker: "ai",
      text: continuation.text,
      createdAt: new Date().toISOString(),
    };
    console.log("=== STORY CONTINUATION ===");
    console.log(continuation.text);

    return res.json({
      turns: [...nextTurns, aiTurn],
      transcript: result.transcript,
      nextPrompt: continuation.text,
      metrics: result.metrics,
    });
  } catch (error) {
    return res.status(500).json({ error: error?.message ?? "Unknown error" });
  }
});

app.post("/storytelling/evaluate", async (req, res) => {
  try {
    const { turns = [], genre = "" } = req.body || {};
    const metrics = req.body?.metrics || {};
    const prompt = buildStoryEvaluationPrompt({ genre, turns, metrics });
    const result = await callGemini(prompt);
    console.log("=== STORY EVALUATION ===");
    console.log(result.text);
    return res.json({ evaluation: result });
  } catch (error) {
    return res.status(500).json({ error: error?.message ?? "Unknown error" });
  }
});

app.listen(PORT, () => {
  console.log(`Rhetora backend listening on port ${PORT}`);
});
