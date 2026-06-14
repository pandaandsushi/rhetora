# Rhetora Backend

## Setup

1. Copy `.env.example` to `.env` and set `DEEPGRAM_API_KEY`.
2. Configure at least one LLM provider key (`GOOGLE_AI_API_KEY`, `GROQ_API_KEY`, or `OPENROUTER_API_KEY`).
3. Optional: set default LLM routing in `.env`:
   - `LLM_PROVIDER=auto|gemini|groq|openrouter`
   - `LLM_FALLBACK_ORDER=gemini,groq,openrouter` (used when provider is `auto`)
   - `OPENROUTER_MODEL=deepseek-v4-flash:free`
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start server:
   ```bash
   npm run dev
   ```

## LLM Provider/Model Selection

All LLM-backed endpoints now support request-level overrides via any of:

- JSON/multipart fields: `llmProvider`, `llmModel`
- Query params: `?llmProvider=openrouter&llmModel=deepseek-v4-flash:free`
- Headers: `x-llm-provider`, `x-llm-model`

Supported providers: `gemini`, `groq`, `openrouter`, `auto`.

Examples:

```bash
curl -X POST http://localhost:5050/storytelling/initial \
  -H "Content-Type: application/json" \
  -d '{"genre":"horror","llmProvider":"openrouter","llmModel":"deepseek-v4-flash:free"}'

curl -X POST "http://localhost:5050/pitch/initial?llmProvider=groq&llmModel=llama-3.3-70b-versatile" \
  -H "Content-Type: application/json" \
  -d '{"pitchType":"Product Idea"}'
```

## Endpoints

- `GET /health`
- `POST /transcribe` (multipart/form-data, field `audio`)
- `POST /evaluate` (multipart/form-data, field `audio`)
- `POST /storytelling/initial` (JSON body: `{ genre }`)
- `POST /storytelling/turn` (multipart/form-data, field `audio` + `genre`, `currentTurn`, `maxTurns`, `turns`)
- `POST /storytelling/evaluate` (JSON body: `{ turns, genre, metrics }`)
- `POST /pitch/initial` (JSON body: `{ pitchType }`)
- `POST /pitch/evaluate` (multipart/form-data, field `audio` + `pitchType`, `promptTitle`, `promptInstruction`)

### Example curl

```bash
curl -X POST http://localhost:5050/transcribe \
   -F "audio=@./sample.m4a"

curl -X POST http://localhost:5050/evaluate \
   -F "audio=@./sample.m4a" \
   -F "scenario=vr-podium" \
   -F "audience=Large (51-200)"

curl -X POST http://localhost:5050/storytelling/initial \
   -H "Content-Type: application/json" \
   -d '{"genre":"horror"}'

curl -X POST http://localhost:5050/storytelling/turn \
   -F "audio=@./sample.m4a" \
   -F "genre=horror" \
   -F "currentTurn=1" \
   -F "maxTurns=3" \
   -F "turns=[]"

curl -X POST http://localhost:5050/storytelling/evaluate \
   -H "Content-Type: application/json" \
   -d '{"genre":"horror","turns":[],"metrics":{}}'

curl -X POST http://localhost:5050/pitch/initial \
   -H "Content-Type: application/json" \
   -d '{"pitchType":"Product Idea"}'

curl -X POST http://localhost:5050/pitch/evaluate \
   -F "audio=@./sample.m4a" \
   -F "pitchType=Product Idea" \
   -F "promptTitle=Pitch a productivity app" \
   -F "promptInstruction=Explain what it does and why it matters" \
   -F "llmProvider=openrouter" \
   -F "llmModel=deepseek-v4-flash:free"
```
