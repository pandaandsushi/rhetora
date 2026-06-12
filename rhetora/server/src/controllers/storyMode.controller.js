import { evaluateStoryModeSession } from "../services/storyMode.service.js";
import fs from "fs";

const evaluateSession = async (req, res) => {
  try {
    const file = req.file;
    const { episodeTitle } = req.body;

    if (!file) {
      return res.status(400).json({ error: "Audio file is required" });
    }

    if (!episodeTitle) {
      return res.status(400).json({ error: "episodeTitle is required" });
    }

    const fileBuffer = {
      buffer: file.buffer || fs.readFileSync(file.path),
      mimetype: file.mimetype,
    };

    const result = await evaluateStoryModeSession(fileBuffer, { episodeTitle });

    if (file.path) {
      fs.unlink(file.path, () => {});
    }

    res.json(result);
  } catch (error) {
    console.error("[StoryMode Controller] Error evaluating session:", error);
    res.status(500).json({ error: "Failed to evaluate session" });
  }
};

export { evaluateSession };
