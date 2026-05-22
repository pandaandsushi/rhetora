import { transcribeBuffer } from "./deepgram.service.js";
import { callGemini } from "./gemini.service.js";
import { buildPitchEvaluationPrompt, buildPitchInitialPrompt } from "../prompts/pitch.prompt.js";

const getPitchPrompt = async (pitchType) => {
  const prompt = buildPitchInitialPrompt(pitchType);
  const result = await callGemini(prompt);
  return { prompt: result };
};

const evaluatePitch = async ({ file, pitchType, prompt }) => {
  const result = await transcribeBuffer(file);
  const evalPrompt = buildPitchEvaluationPrompt({
    pitchType,
    prompt,
    transcript: result.transcript,
    metrics: result.metrics,
  });
  const feedback = await callGemini(evalPrompt);

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
