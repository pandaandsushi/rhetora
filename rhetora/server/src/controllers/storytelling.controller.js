import {
  evaluateStory,
  getInitialStoryPrompt,
  processStoryTurn,
} from "../services/storytelling.service.js";

const getInitialStory = async (req, res) => {
  try {
    const { genre } = req.body || {};
    const result = await getInitialStoryPrompt(genre);
    console.log("=== STORY OPENING ===");
    console.log(result.text);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error?.message ?? "Unknown error" });
  }
};

const submitStoryTurn = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Missing audio file" });
    }

    const genre = req.body?.genre || "";
    const currentTurn = Number(req.body?.currentTurn || "1");
    const maxTurns = Number(req.body?.maxTurns || "1");
    const rawTurns = req.body?.turns || "[]";
    let turns = [];

    try {
      turns = JSON.parse(rawTurns);
    } catch {
      return res.status(400).json({ error: "Invalid turns payload" });
    }

    const result = await processStoryTurn({
      file: req.file,
      genre,
      currentTurn,
      maxTurns,
      turns,
    });

    console.log(`=== USER TURN ${currentTurn} ===`);
    console.log(result.transcript);

    if (!result.nextPrompt) {
      console.log("=== STORY END ===");
      console.log(result.turns);
    } else {
      console.log("=== STORY CONTINUATION ===");
      console.log(result.nextPrompt);
    }

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error?.message ?? "Unknown error" });
  }
};

const evaluateStorySession = async (req, res) => {
  try {
    const { turns = [], genre = "" } = req.body || {};
    const metrics = req.body?.metrics || {};
    const result = await evaluateStory({ turns, genre, metrics });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error?.message ?? "Unknown error" });
  }
};

export { getInitialStory, submitStoryTurn, evaluateStorySession };
