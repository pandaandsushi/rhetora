import { Router } from "express";
import upload from "../middleware/upload.js";
import { evaluateSession } from "../controllers/storyMode.controller.js";

const router = Router();

router.post("/story-mode/evaluate", upload.single("audio"), evaluateSession);
export default router;
