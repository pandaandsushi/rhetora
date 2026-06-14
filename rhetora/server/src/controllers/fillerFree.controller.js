import { getFillerFreeQuestion, evaluateFillerFree } from "../services/fillerFree.service.js";
import { getLlmOptionsFromRequest } from "../utils/llmOptions.js";

const getQuestion = async (req, res) => {
  try {
    const llmOptions = getLlmOptionsFromRequest(req);
    const result = await getFillerFreeQuestion(llmOptions);
    return res.json(result);
  } catch (error) {
    console.error("[FillerFree] getQuestion error:", error);
    return res.status(500).json({ error: error?.message ?? "Unknown error" });
  }
};

const evaluate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Missing audio file" });
    }

    const question = req.body?.question ?? "";
    let fillerWords = [];

    try {
      const raw = req.body?.fillerWords;
      if (raw) {
        fillerWords = JSON.parse(raw);
      }
    } catch {
      fillerWords = [];
    }

    const result = await evaluateFillerFree({
      file: req.file,
      fillerWords,
      question,
      llmOptions: getLlmOptionsFromRequest(req),
    });

    console.log("[FillerFree] Evaluation complete");
    console.log("Transcript:", result.transcript);
    console.log("Filler counts:", result.fillerCounts);

    return res.json(result);
  } catch (error) {
    console.error("[FillerFree] evaluate error:", error);
    return res.status(500).json({ error: error?.message ?? "Unknown error" });
  }
};

export { getQuestion, evaluate };
