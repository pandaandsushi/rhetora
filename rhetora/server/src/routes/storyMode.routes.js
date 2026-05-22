import { Router } from "express";
import multer from "multer";
import { evaluateSession } from "../controllers/storyMode.controller.js";

const router = Router();
const upload = multer({ dest: "uploads/" }); // Using disk storage for reliability with large audio files

router.post("/story-mode/evaluate", upload.single("audio"), evaluateSession);
export default router;
