# Rhetora

Rhetora is a mobile-first speaking practice and evaluation app (built with Expo React Native) and a companion Node.js backend for transcription and LLM evaluation. It provides VR/phone recording flows, per-turn storytelling, Pitch Lab, and planned filler-free realtime detection using Deepgram + Gemini (Google AI Studio).

**Quick Highlights**
- **Frontend:** Expo-managed React Native app with audio recording (expo-av), file storage (expo-file-system), camera preview, and optional Viro VR screens.
- **Backend:** Node.js + Express modular API (server/src) wrapping Deepgram (transcription) and Gemini (LLM evaluation) services.
- **Key features:** VR recording + evaluation, per-turn storytelling with LLM continuations, Pitch Lab prompts and evaluation, skill radar visualizations, and planned filler-free realtime detection.


**Repository Structure**
- **App frontend:** [rhetora/app/_layout.tsx](rhetora/app/_layout.tsx#L1) — the main screens live in `rhetora/app/` (storytelling, pitch-lab, practice, VR screens).
- **UI components:** [rhetora/components/practice-camera-panel.tsx](rhetora/components/practice-camera-panel.tsx#L1) and [rhetora/components/skill-radar.tsx](rhetora/components/skill-radar.tsx#L1).
- **Assets & constants:** `rhetora/assets/`, `rhetora/constants/`, `rhetora/data/`.
- **Server launcher:** [rhetora/server/index.js](rhetora/server/index.js#L1) — entry that loads `server/src`.
- **Server app (modular):** [rhetora/server/src/server.js](rhetora/server/src/server.js#L1) and [rhetora/server/src/app.js](rhetora/server/src/app.js#L1).
	- Controllers: `server/src/controllers/` (transcription, storytelling, pitch, vr)
	- Routes: `server/src/routes/` (health, transcription, storytelling, pitch, vr)
	- Services: `server/src/services/` (deepgram.service.js, gemini.service.js, storytelling.service.js, pitch.service.js)
	- Prompts: `server/src/prompts/` (LLM prompt templates)
	- Utils: `server/src/utils/` (parseModelJson, speechMetrics)

**Key Frontend Screens**
- Storytelling session: `rhetora/app/storytelling-session.tsx` — per-turn recording, timer, and submit flow.
- Storytelling evaluation: `rhetora/app/storytelling-evaluation.tsx` — shows normalized evaluation, radar, and recommendations.
- Pitch Lab session & evaluation: `rhetora/app/pitch-lab-session.tsx`, `rhetora/app/pitch-lab-evaluation.tsx`.
- Practice & camera: `rhetora/components/practice-camera-panel.tsx` — includes `micMonitorEnabled` to avoid recording conflicts.

**Backend Endpoints (summary)**
- `POST /transcribe` — multipart upload for one-off transcription.
- `POST /storytelling/initial` — get initial LLM continuation prompt.
- `POST /storytelling/turn` — upload a single turn audio (multipart) and receive intermediate results.
- `POST /storytelling/evaluate` — request full evaluation over turns.
- `POST /filler-free/question` — request question from LLM.
- `POST /filler-free/evaluate` — request full evalutaion over submitted audio.
- `POST /pitch/initial` — generate a pitch prompt.
- `POST /pitch/evaluate` — upload pitch audio for evaluation.
- `GET /health` — healthcheck.

Check the server routes in `server/src/routes/` for exact request shapes and controllers in `server/src/controllers/` for behavior.

Development
---------

Prerequisites
- Node.js (recommended >=18)
- Yarn or npm
- Expo CLI (for frontend) — to run the managed app

Environment
- Copy `.env.example` (if present) to `.env` in `rhetora/server/` and set:
	- `PORT` — server port (default 5050)
	- `DEEPGRAM_API_KEY` — Deepgram REST/WebSocket key
	- `GOOGLE_AI_API_KEY` — Google AI Studio (Gemini) API key
	- `GOOGLE_AI_MODEL` — model to use for LLM evaluations (e.g., `gemini-2.5-flash`)

Run the backend (development)
```bash
cd rhetora/server
npm install
npm run dev   # or `node src/server.js` (uses server/src)
```

Run the frontend (Expo)
```bash
cd rhetora
npm install
npx expo start
# Use Expo Go for quick iteration, or build native for Viro/VR features.
```

Notes on native/Viro
- Viro VR integration uses `@viro-community/react-viro` and requires an actual native build (Expo bare or custom dev client). The Expo managed flow will work for most screens, but to run Viro scenes you must build native binaries and install them on device.

