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

### Example curl

```bash
curl -X POST http://localhost:5050/transcribe \
   -F "audio=@./sample.m4a"

curl -X POST http://localhost:5050/evaluate \
   -F "audio=@./sample.m4a" \
   -F "scenario=vr-podium" \
   -F "audience=Large (51-200)"
```
