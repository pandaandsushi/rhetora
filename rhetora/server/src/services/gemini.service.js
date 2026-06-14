import { GOOGLE_AI_API_KEY, GOOGLE_AI_MODEL } from "../config/env.js";
import parseModelJson from "../utils/parseModelJson.js";

const callGemini = async (prompt, options = {}) => {
  if (!GOOGLE_AI_API_KEY) {
    throw new Error("GOOGLE_AI_API_KEY is not set");
  }

  const model = options.model || GOOGLE_AI_MODEL;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GOOGLE_AI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "LLM request failed");
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  
  console.log("=== GEMINI RAW RESPONSE ===");
  console.log(text);
  
  const parsed = parseModelJson(text);

  if (!parsed) {
    throw new Error("LLM did not return valid JSON");
  }

  return parsed;
};

export { callGemini };
