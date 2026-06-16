import { transcribeBuffer } from "./deepgram.service.js";
import { callLLM } from "./llm.service.js";
import { buildSpeechMetrics } from "../utils/speechMetrics.js";
import {
  buildFillerFreeQuestionPrompt,
  buildFillerFreeEvaluationPrompt,
} from "../prompts/fillerFree.prompt.js";

const FALLBACK_QUESTIONS = [
  "Describe a place you love to visit and what makes it special.",
  "What is one skill you have always wanted to learn and why?",
  "What is your favorite way to spend your free time?",
  "Tell me about a memorable meal you have had recently.",
  "What does your ideal weekend look like?",
  "Describe a book, movie, or show that you recently enjoyed.",
  "What is something you are currently looking forward to?",
  "Talk about a hobby that you enjoy and how you got into it.",
  "What is one thing you would change about your daily routine?",
  "Describe your favorite season and why you enjoy it.",
  "What is a goal you have for the next year and how do you plan to achieve it?",
  "Tell me about a person who has had a positive impact on your life.",
  "What is a recent accomplishment you are proud of and why?",
  "What is something new you have learned recently and how did you learn it?",
  "What is your favorite type of music and how does it make you feel?",
];

// Fallback evaluation when Gemini is unavailable but Deepgram succeeded
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
  const index = Math.floor(Math.random() * FALLBACK_QUESTIONS.length);
  return { question: FALLBACK_QUESTIONS[index] };
};

const evaluateFillerFree = async ({ file, fillerWords, question, llmOptions = {} }) => {
  const result = await transcribeBuffer(file);
  const { transcript, words } = result;

  const durationSeconds = result.metrics.durationSeconds;
  const metrics = buildSpeechMetrics(words, durationSeconds, fillerWords);

  const fillerCounts = {};
  for (const item of metrics.fillerWords) {
    fillerCounts[item.word] = item.count;
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
    console.warn("[FillerFree] LLM evaluation failed, using fallback:", error?.message);
    evaluation = buildFallbackEvaluation();
  }

  return {
    transcript,
    fillerCounts,
    wordRatePerMinute: metrics.wordRatePerMinute,
    totalFillerWords: metrics.totalFillerWords,
    evaluation,
  };
};

export { getFillerFreeQuestion, evaluateFillerFree };
