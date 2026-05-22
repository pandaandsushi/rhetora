import { evaluatePitch, getPitchPrompt } from "../services/pitch.service.js";

const getPitchPromptController = async (req, res) => {
  try {
    const { pitchType } = req.body || {};
    const result = await getPitchPrompt(pitchType);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error?.message ?? "Unknown error" });
  }
};

const evaluatePitchController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Missing audio file" });
    }

    const pitchType = req.body?.pitchType || "General";
    const promptTitle = req.body?.promptTitle || "";
    const promptInstruction = req.body?.promptInstruction || "";

    const prompt = {
      title: promptTitle,
      instruction: promptInstruction,
    };

    const result = await evaluatePitch({
      file: req.file,
      pitchType,
      prompt,
    });

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error?.message ?? "Unknown error" });
  }
};

export { evaluatePitchController, getPitchPromptController };
