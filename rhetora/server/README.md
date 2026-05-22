# Rhetora Backend

## Setup

1. Copy `.env.example` to `.env` and set `DEEPGRAM_API_KEY`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start server:
   ```bash
   npm run dev
   ```

## Endpoints

- `GET /health`
- `POST /transcribe` (multipart/form-data, field `audio`)
- `POST /evaluate` (multipart/form-data, field `audio`)
- `POST /storytelling/initial` (JSON body: `{ genre }`)
- `POST /storytelling/turn` (multipart/form-data, field `audio` + `genre`, `currentTurn`, `maxTurns`, `turns`)
- `POST /storytelling/evaluate` (JSON body: `{ turns, genre, metrics }`)

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
```
