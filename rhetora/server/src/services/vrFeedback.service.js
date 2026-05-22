import { transcribeBuffer } from "./deepgram.service.js";
import { callLLM } from "./llm.service.js";
import { buildVrPrompt } from "../prompts/vr.prompt.js";

const evaluateVrSession = async (file, { scenario, audience }) => {
  const result = await transcribeBuffer(file);
  const prompt = buildVrPrompt({
    transcript: result.transcript,
    metrics: result.metrics,
    scenario,
    audience,
  });
  const feedback = await callLLM(prompt);

  return {
    feedback,
    transcript: result.transcript,
    metrics: result.metrics,
  };
};

export { evaluateVrSession };
