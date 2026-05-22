import { DEEPGRAM_API_KEY, DEEPGRAM_PARAMS } from "../config/env.js";
import { buildSpeechMetrics } from "../utils/speechMetrics.js";

const transcribeBuffer = async (file) => {
  if (!DEEPGRAM_API_KEY) {
    throw new Error("DEEPGRAM_API_KEY is not set");
  }

  const query = new URLSearchParams(DEEPGRAM_PARAMS).toString();
  const response = await fetch(`https://api.deepgram.com/v1/listen?${query}`, {
    method: "POST",
    headers: {
      Authorization: `Token ${DEEPGRAM_API_KEY}`,
      "Content-Type": file.mimetype || "audio/m4a",
    },
    body: file.buffer,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Deepgram request failed");
  }

  const data = await response.json();
  const alternative = data?.results?.channels?.[0]?.alternatives?.[0];
  const words = alternative?.words ?? [];
  const transcript = alternative?.transcript ?? "";
  const durationSeconds = data?.metadata?.duration ?? words[words.length - 1]?.end ?? 0;

  const metrics = buildSpeechMetrics(words, durationSeconds);

  return {
    transcript,
    words,
    utterances: alternative?.utterances ?? data?.results?.utterances ?? [],
    metrics,
    raw: {
      request: DEEPGRAM_PARAMS,
    },
  };
};

export { transcribeBuffer };
