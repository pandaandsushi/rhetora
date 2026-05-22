import { Router } from "express";
import upload from "../middleware/upload.js";
import {
  evaluateStorySession,
  getInitialStory,
  submitStoryTurn,
} from "../controllers/storytelling.controller.js";

const router = Router();

router.post("/storytelling/initial", getInitialStory);
router.post("/storytelling/turn", upload.single("audio"), submitStoryTurn);
router.post("/storytelling/evaluate", evaluateStorySession);

export default router;
