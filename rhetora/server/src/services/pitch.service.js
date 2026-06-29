import { transcribeBuffer } from "./deepgram.service.js";
import { callLLM } from "./llm.service.js";
import { buildPitchEvaluationPrompt } from "../prompts/pitch.prompt.js";

const HARDCODED_PITCH_PROMPT = {
  title: "Context: You are pitching a mobile app that helps students improve their productivity.",
  instruction: "Question: Explain what the app does, who it helps, and why people should use it.",
  tips: {
    hook: "Start with a clear problem students face when managing time and assignments.",
    problem: "Describe why procrastination, deadlines, or distraction make studying harder.",
    solution: "Introduce the app as a simple tool that helps students plan and stay focused.",
    value: "Explain the main benefit in practical terms, such as saving time or reducing stress.",
    closing: "End with a direct invitation to try the app or join the beta.",
  },
};

const getPitchPrompt = async (pitchType, llmOptions = {}) => {
  return { prompt: HARDCODED_PITCH_PROMPT };
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
