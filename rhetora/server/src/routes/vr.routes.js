import { Router } from "express";
import upload from "../middleware/upload.js";
import { evaluateVr } from "../controllers/vr.controller.js";

const router = Router();

router.post("/evaluate", upload.single("audio"), evaluateVr);

export default router;
