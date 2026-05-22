import { Router } from "express";
import upload from "../middleware/upload.js";
import { getQuestion, evaluate } from "../controllers/fillerFree.controller.js";

const router = Router();

router.post("/filler-free/question", getQuestion);
router.post("/filler-free/evaluate", upload.single("audio"), evaluate);

export default router;
