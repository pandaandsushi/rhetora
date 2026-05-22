import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5050;
export const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
export const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
export const GOOGLE_AI_MODEL = process.env.GOOGLE_AI_MODEL || "gemini-2.5-flash";

export const DEEPGRAM_PARAMS = {
  model: process.env.DEEPGRAM_MODEL || "nova-3",
  smart_format: process.env.DEEPGRAM_SMART_FORMAT || "true",
  filler_words: process.env.DEEPGRAM_FILLER_WORDS || "true",
  utterances: process.env.DEEPGRAM_UTTERANCES || "true",
  punctuate: process.env.DEEPGRAM_PUNCTUATE || "true",
};
