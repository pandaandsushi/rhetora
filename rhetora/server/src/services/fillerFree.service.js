import { transcribeBuffer } from "./deepgram.service.js";
import { callLLM } from "./llm.service.js";
import { buildSpeechMetrics } from "../utils/speechMetrics.js";
import {
  buildFillerFreeQuestionPrompt,
  buildFillerFreeEvaluationPrompt,
} from "../prompts/fillerFree.prompt.js";

const FALLBACK_QUESTIONS = [
  "What is your favorite way to spend your free time?",
  "Describe a place you love to visit and what makes it special.",
  "What is one skill you have always wanted to learn and why?",
  "Tell me about a memorable meal you have had recently.",
  "What does your ideal weekend look like?",
  "Describe a book, movie, or show that you recently enjoyed.",
  "What is something you are currently looking forward to?",
  "Talk about a hobby that you enjoy and how you got into it.",
  "What is one thing you would change about your daily routine?",
  "Describe your favorite season and why you enjoy it.",
];
const USE_HARDCODED_LLM_TEST_INPUT = true;

const HARDCODED_FILLER_FREE_TEST_INPUT = {
  question: "What is your favorite hobby and why do you enjoy it?",
  transcript:
    "My favorite hobby is playing video games. Like, I find it really relaxing and a great way to unwind after a long day. I especially enjoy story-driven games that allow me to immerse myself in different worlds and narratives. Well, sometimes I play with friends, which adds a fun social aspect to it. Currently, I'm playing Stardew Valley, and it's been a fantastic experience. Well yeah, I love to get to know the characters and build up my farm.",
  metrics: {
    durationSeconds: 47,
    wordRatePerMinute: 102,
    totalFillerWords: 2,
    fillerWords: [
      { word: "um", count: 1 },
      { word: "like", count: 1 },
    ],
  },
};
const buildFallbackEvaluation = () => ({
  quickSummary:
    "Great effort! AI evaluation is temporarily unavailable, but your filler word counts and transcript are accurate. Review the example tips below to improve your fluency.",
  skillBreakdown: [
    {
      skill: "Fluency",
      score: 65,
      level: "Fair",
      reason: "Evaluation unavailable — example score shown.",
      improvementTip:
        "Practice pausing silently instead of using filler sounds like 'um' or 'uh'.",
    },
    {
      skill: "Conciseness",
      score: 70,
      level: "Good",
      reason: "Evaluation unavailable — example score shown.",
      improvementTip:
        "Focus each sentence on one clear idea and remove unnecessary transitions.",
    },
    {
      skill: "Confidence",
      score: 68,
      level: "Fair",
      reason: "Evaluation unavailable — example score shown.",
      improvementTip:
        "Slow down slightly and commit to each word. Confidence comes from deliberate speech.",
    },
  ],
  recommendedActions: [
    {
      title: "Replace fillers with pauses",
      description:
        "Instead of saying 'um' or 'uh', try pausing briefly. Pauses make you sound more confident and give your listener time to absorb your words.",
    },
    {
      title: "Slow down slightly",
      description:
        "Fillers often appear when you are thinking quickly. Slowing down gives you more control and reduces the urge to fill silence with sounds.",
    },
    {
      title: "Use cleaner transitions",
      description:
        "Take a short pause before starting a new idea instead of using 'like' or 'you know' as bridges between thoughts.",
    },
  ],
});

const getRandomFallbackQuestion = () => {
  const index = Math.floor(Math.random() * FALLBACK_QUESTIONS.length);
  return FALLBACK_QUESTIONS[index];
};

const getFillerFreeQuestion = async (llmOptions = {}) => {
  try {
    console.log("[FillerFree] Generating question with LLM...");
    const prompt = buildFillerFreeQuestionPrompt();
    const result = await callLLM(prompt, llmOptions);
    return { question: result.question ?? getRandomFallbackQuestion() };
  } catch (error) {
    console.warn("[FillerFree] LLM question generation failed, using fallback:", error?.message);
    return { question: getRandomFallbackQuestion() };
  }
};

const evaluateFillerFree = async ({
  file,
  fillerWords,
  question,
  llmOptions = {},
}) => {
  let transcript;
  let metrics;
  let fillerCounts = {};

  if (USE_HARDCODED_LLM_TEST_INPUT) {
    transcript = HARDCODED_FILLER_FREE_TEST_INPUT.transcript;
    metrics = HARDCODED_FILLER_FREE_TEST_INPUT.metrics;
    question = HARDCODED_FILLER_FREE_TEST_INPUT.question;

    for (const item of metrics.fillerWords) {
      fillerCounts[item.word] = item.count;
    }

    console.log("[FillerFree] Using hardcoded LLM comparison input");
  } else {
    const result = await transcribeBuffer(file);
    const { words } = result;

    transcript = result.transcript;

    const durationSeconds = result.metrics.durationSeconds;
    metrics = buildSpeechMetrics(words, durationSeconds, fillerWords);

    for (const item of metrics.fillerWords) {
      fillerCounts[item.word] = item.count;
    }
  }

  let evaluation;
  try {
    const prompt = buildFillerFreeEvaluationPrompt({
      question,
      transcript,
      fillerCounts,
      metrics,
    });

    evaluation = await callLLM(prompt, llmOptions);
  } catch (error) {
    console.warn(
      "[FillerFree] LLM evaluation failed, using fallback:",
      error?.message
    );
    evaluation = buildFallbackEvaluation();
  }

  return {
    question,
    transcript,
    fillerCounts,
    wordRatePerMinute: metrics.wordRatePerMinute,
    totalFillerWords: metrics.totalFillerWords,
    evaluation,
  };
};

export { getFillerFreeQuestion, evaluateFillerFree };
