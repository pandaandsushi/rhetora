import { evaluateVrSession } from "../services/vrFeedback.service.js";
import { getLlmOptionsFromRequest } from "../utils/llmOptions.js";

const evaluateVr = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Missing audio file" });
    }

    const scenario = req.body?.scenario || "";
    const audience = req.body?.audience || "";
    const speakingPrompt = req.body?.speakingPrompt || "";
    const speakingContext = req.body?.speakingContext || "";
    const llmOptions = getLlmOptionsFromRequest(req);

    const result = await evaluateVrSession(req.file, {
      scenario,
      audience,
      speakingPrompt,
      speakingContext,
      llmOptions,
    });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error?.message ?? "Unknown error" });
  }
};

export { evaluateVr };
