import cors from "cors";
import express from "express";

import healthRoutes from "./routes/health.routes.js";
import transcriptionRoutes from "./routes/transcription.routes.js";
import vrRoutes from "./routes/vr.routes.js";
import storytellingRoutes from "./routes/storytelling.routes.js";
import pitchRoutes from "./routes/pitch.routes.js";
import fillerFreeRoutes from "./routes/fillerFree.routes.js";
import storyModeRoutes from "./routes/storyMode.routes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.use(healthRoutes);
app.use(transcriptionRoutes);
app.use(vrRoutes);
app.use(storytellingRoutes);
app.use(pitchRoutes);
app.use(fillerFreeRoutes);
app.use(storyModeRoutes);

export default app;
