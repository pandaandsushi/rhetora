import { transcribeBuffer } from "./deepgram.service.js";
import { callLLM } from "./llm.service.js";
import { buildVrPrompt } from "../prompts/vr.prompt.js";

const evaluateVrSession = async (file, { scenario, audience, speakingPrompt, speakingContext, llmOptions = {} }) => {
  const result = await transcribeBuffer(file);
  const prompt = buildVrPrompt({
    transcript: result.transcript,
    metrics: result.metrics,
    scenario,
    audience,
    speakingPrompt,
    speakingContext,
  });
  const feedback = await callLLM(prompt, llmOptions);

  return {
    feedback,
    transcript: result.transcript,
    metrics: result.metrics,
  };
};

export { evaluateVrSession };
