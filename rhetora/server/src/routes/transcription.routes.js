import { Router } from "express";
import upload from "../middleware/upload.js";
import { transcribeAudio } from "../controllers/transcription.controller.js";

const router = Router();

router.post("/transcribe", upload.single("audio"), transcribeAudio);

export default router;
