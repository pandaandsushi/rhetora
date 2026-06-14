import { transcribeBuffer } from "./deepgram.service.js";
import { callLLM } from "./llm.service.js";
import {
  buildStoryInitialPrompt,
  buildStoryContinuationPrompt,
  buildStoryEvaluationPrompt,
} from "../prompts/storytelling.prompt.js";

const getInitialStoryPrompt = async (genre, llmOptions = {}) => {
  const prompt = buildStoryInitialPrompt(genre);
  const result = await callLLM(prompt, llmOptions);
  return { text: result.text };
};

const processStoryTurn = async ({ file, genre, currentTurn, maxTurns, turns, llmOptions = {} }) => {
  const result = await transcribeBuffer(file);
  const userTurn = {
    id: `user-${Date.now()}`,
    speaker: "user",
    text: result.transcript,
    transcript: result.transcript,
    createdAt: new Date().toISOString(),
  };

  const nextTurns = [...turns, userTurn];

  if (currentTurn >= maxTurns) {
    return {
      turns: nextTurns,
      transcript: result.transcript,
      nextPrompt: null,
      metrics: result.metrics,
    };
  }

  const prompt = buildStoryContinuationPrompt({ genre, turns: nextTurns });
  const continuation = await callLLM(prompt, llmOptions);
  const aiTurn = {
    id: `ai-${Date.now()}`,
    speaker: "ai",
    text: continuation.text,
    createdAt: new Date().toISOString(),
  };

  return {
    turns: [...nextTurns, aiTurn],
    transcript: result.transcript,
    nextPrompt: continuation.text,
    metrics: result.metrics,
  };
};

const evaluateStory = async ({ turns, genre, metrics, llmOptions = {} }) => {
  const prompt = buildStoryEvaluationPrompt({ genre, turns, metrics });
  const result = await callLLM(prompt, llmOptions);
  return { evaluation: result };
};

export { getInitialStoryPrompt, processStoryTurn, evaluateStory };
