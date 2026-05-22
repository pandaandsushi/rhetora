import { transcribeBuffer } from "../services/deepgram.service.js";

const transcribeAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Missing audio file" });
    }

    const result = await transcribeBuffer(req.file);
    console.log("=== DEEPGRAM TRANSCRIPT ===");
    console.log(result.transcript);
    console.log("=== SPEECH METRICS ===");
    console.log(result.metrics);

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error?.message ?? "Unknown error" });
  }
};

export { transcribeAudio };
