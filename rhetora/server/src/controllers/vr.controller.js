import { evaluateVrSession } from "../services/vrFeedback.service.js";

const evaluateVr = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Missing audio file" });
    }

    const scenario = req.body?.scenario || "";
    const audience = req.body?.audience || "";

    const result = await evaluateVrSession(req.file, { scenario, audience });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error?.message ?? "Unknown error" });
  }
};

export { evaluateVr };
