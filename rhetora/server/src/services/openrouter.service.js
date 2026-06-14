import {
  OPENROUTER_API_KEY,
  OPENROUTER_MODEL,
  OPENROUTER_SITE_URL,
  OPENROUTER_APP_NAME,
} from "../config/env.js";
import parseModelJson from "../utils/parseModelJson.js";

const callOpenRouter = async (prompt, options = {}) => {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  const model = options.model || OPENROUTER_MODEL;
  const headers = {
    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": OPENROUTER_SITE_URL || "http://localhost:8081",
    "X-Title": OPENROUTER_APP_NAME || "Rhetora",
  };

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a public speaking coach. Return ONLY valid JSON. Do not include markdown, code fences, explanations, comments, or any text outside the JSON object.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[OpenRouter] HTTP error:", response.status, errorText);
    throw new Error(`OpenRouter request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  console.log("=== OpenRouter RAW RESPONSE ===");
  console.log(JSON.stringify(data, null, 2));

  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    const reason = data?.error?.message || data?.choices?.[0]?.finish_reason || "No content in response";
    throw new Error(`OpenRouter returned empty content: ${reason}`);
  }

  const parsed = parseModelJson(text);

  if (!parsed) {
    console.error("[OpenRouter] Could not parse JSON from response:", text);
    throw new Error("OpenRouter did not return valid JSON");
  }

  return parsed;
};

export { callOpenRouter };
