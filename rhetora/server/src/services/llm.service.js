import { callGemini } from "./gemini.service.js";
import { callGroq } from "./groq.service.js";
import { callOpenRouter } from "./openrouter.service.js";
import { LLM_FALLBACK_ORDER, LLM_PROVIDER } from "../config/env.js";

const SUPPORTED_PROVIDERS = ["gemini", "groq", "openrouter"];

const normalizeProvider = (provider) => (provider || "").toString().trim().toLowerCase();

const parseFallbackProviders = (value) => {
  const sequence = (value || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .filter((item, index, arr) => arr.indexOf(item) === index)
    .filter((item) => SUPPORTED_PROVIDERS.includes(item));

  return sequence.length > 0 ? sequence : ["gemini", "groq", "openrouter"];
};

const callByProvider = async (provider, prompt, options) => {
  if (provider === "gemini") {
    return callGemini(prompt, options);
  }

  if (provider === "groq") {
    return callGroq(prompt, options);
  }

  if (provider === "openrouter") {
    return callOpenRouter(prompt, options);
  }

  throw new Error(`Unsupported LLM provider: ${provider}`);
};

const callLLM = async (prompt, options = {}) => {
  const requestedProvider = normalizeProvider(options.provider || LLM_PROVIDER || "auto");
  const selectedProvider = requestedProvider || "auto";

  if (selectedProvider !== "auto" && !SUPPORTED_PROVIDERS.includes(selectedProvider)) {
    throw new Error(
      `Unsupported llmProvider "${selectedProvider}". Supported providers: ${SUPPORTED_PROVIDERS.join(", ")}, auto`,
    );
  }

  if (selectedProvider !== "auto") {
    return callByProvider(selectedProvider, prompt, options);
  }

  const fallbackProviders = parseFallbackProviders(LLM_FALLBACK_ORDER);
  const failures = [];

  for (const provider of fallbackProviders) {
    try {
      const result = await callByProvider(provider, prompt, options);
      return result;
    } catch (error) {
      const message = error?.message || "Unknown error";
      failures.push(`${provider}: ${message}`);
      console.warn(`[LLM] ${provider} failed in auto mode:`, message);
    }
  }

  throw new Error(`All LLM providers failed. ${failures.join(" | ")}`);
};

export { callLLM };
