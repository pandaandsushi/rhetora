import { GROQ_API_KEY, GROQ_MODEL } from "../config/env.js";
import parseModelJson from "../utils/parseModelJson.js";

const callGroq = async (prompt) => {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL || "llama-3.3-70b-versatile",
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
      response_format: {
        type: "json_object",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Groq request failed");
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;

  console.log("=== GROQ RAW RESPONSE ===");
  console.log(text);

  const parsed = parseModelJson(text);

  if (!parsed) {
    throw new Error("Groq did not return valid JSON");
  }

  return parsed;
};

export { callGroq };