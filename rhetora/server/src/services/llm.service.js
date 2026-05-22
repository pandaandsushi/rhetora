import { callGemini } from "./gemini.service.js";
import { callGroq } from "./groq.service.js";

/**
 * Calls the LLM with a Gemini → Groq cascade.
 * Throws only if both fail — callers should handle the throw
 * and apply their own domain-specific fallback data.
 */
const callLLM = async (prompt) => {
  // 1. Try Gemini
  try {
    const result = await callGemini(prompt);
    return result;
  } catch (geminiError) {
    console.warn("[LLM] Gemini failed, falling back to Groq:", geminiError?.message);
  }

  // 2. Try Groq
  try {
    const result = await callGroq(prompt);
    return result;
  } catch (groqError) {
    console.warn("[LLM] Groq also failed:", groqError?.message);
    throw new Error(`Both Gemini and Groq failed. Last error: ${groqError?.message}`);
  }
};

export { callLLM };
