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
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Groq request failed");
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  const parsed = parseModelJson(text);

  if (!parsed) {
    throw new Error("Groq did not return valid JSON");
  }

  return parsed;
};

export { callGroq };
