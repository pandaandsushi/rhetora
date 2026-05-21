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

app.use(cors());

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

app.listen(PORT, () => {
  console.log(`Rhetora backend listening on port ${PORT}`);
});
