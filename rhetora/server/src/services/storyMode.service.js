import { transcribeBuffer } from "./deepgram.service.js";
import { callLLM } from "./llm.service.js";
import { buildStoryModeEvaluationPrompt } from "../prompts/storyMode.prompt.js";

const evaluateStoryModeSession = async (file, { episodeTitle }) => {
  const result = await transcribeBuffer(file);
  
  const prompt = buildStoryModeEvaluationPrompt({
    episodeTitle,
    transcript: result.transcript,
    metrics: result.metrics,
  });

  const evaluation = await callLLM(prompt);

  return {
    evaluation,
    transcript: result.transcript,
    metrics: result.metrics,
  };
};

export { evaluateStoryModeSession };
