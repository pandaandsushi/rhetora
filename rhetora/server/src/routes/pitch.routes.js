import { Router } from "express";
import upload from "../middleware/upload.js";
import { evaluatePitchController, getPitchPromptController } from "../controllers/pitch.controller.js";

const router = Router();

router.post("/pitch/initial", getPitchPromptController);
router.post("/pitch/evaluate", upload.single("audio"), evaluatePitchController);

export default router;
