import { transcribeBuffer } from "./deepgram.service.js";
import { callLLM } from "./llm.service.js";
import { buildPitchEvaluationPrompt, buildPitchInitialPrompt } from "../prompts/pitch.prompt.js";

const getPitchPrompt = async (pitchType, llmOptions = {}) => {
  const prompt = buildPitchInitialPrompt(pitchType);
  const result = await callLLM(prompt, llmOptions);
  return { prompt: result };
};

const evaluatePitch = async ({ file, pitchType, prompt, llmOptions = {} }) => {
  const result = await transcribeBuffer(file);
  const evalPrompt = buildPitchEvaluationPrompt({
    pitchType,
    prompt,
    transcript: result.transcript,
    metrics: result.metrics,
  });
  const feedback = await callLLM(evalPrompt, llmOptions);

  return {
    evaluation: {
      ...feedback,
      pitchType,
      prompt,
      transcript: result.transcript,
      wordRatePerMinute: result.metrics.wordRatePerMinute,
    },
    metrics: result.metrics,
  };
};

export { evaluatePitch, getPitchPrompt };
