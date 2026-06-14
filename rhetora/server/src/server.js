import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import app from "./app.js";
import { PORT, DEEPGRAM_API_KEY, DEEPGRAM_PARAMS } from "./config/env.js";

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/filler-free/stream" });

const normalizeWord = (word) => word.toLowerCase().replace(/[^a-z\s]/g, "").trim();

wss.on("connection", (ws, req) => {
  console.log("[FillerFree WS] Client connected");

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const fillerWordsParam = url.searchParams.get("fillerWords") ?? "";
  const fillerSet = new Set(
    fillerWordsParam
      .split(",")
      .map((w) => w.trim().toLowerCase())
      .filter(Boolean)
  );

  console.log("[FillerFree WS] Tracking filler words:", [...fillerSet]);

  const dgParams = new URLSearchParams({
    model: DEEPGRAM_PARAMS.model,
    smart_format: "true",
    filler_words: "true",
    punctuate: "true",
    encoding: "linear16",
    sample_rate: "16000",
    channels: "1",
    interim_results: "true",
  });

  const dgWs = new WebSocket(
    `wss://api.deepgram.com/v1/listen?${dgParams.toString()}`,
    {
      headers: {
        Authorization: `Token ${DEEPGRAM_API_KEY}`,
      },
    }
  );

  const fillerCounts = {};

  dgWs.on("open", () => {
    console.log("[FillerFree WS] Deepgram WS open");
    ws.send(JSON.stringify({ type: "ready" }));
  });

  dgWs.on("message", (data) => {
    try {
      const msg = JSON.parse(data.toString());
      const alternative = msg?.channel?.alternatives?.[0];
      const words = alternative?.words ?? [];

      const detectedInChunk = {};
      for (const w of words) {
        const raw = w?.word ?? w?.punctuated_word ?? "";
        const normalized = normalizeWord(raw);
        if (normalized && fillerSet.has(normalized)) {
          detectedInChunk[normalized] = (detectedInChunk[normalized] ?? 0) + 1;
        }
      }

      if (msg.is_final && Object.keys(detectedInChunk).length > 0) {
        for (const [word, count] of Object.entries(detectedInChunk)) {
          fillerCounts[word] = (fillerCounts[word] ?? 0) + count;
        }
        ws.send(
          JSON.stringify({
            type: "filler_update",
            fillerCounts: { ...fillerCounts },
          })
        );
      }

      if (msg.is_final && alternative?.transcript) {
        ws.send(
          JSON.stringify({
            type: "transcript",
            text: alternative.transcript,
            isFinal: true,
          })
        );
      }
    } catch (e) {
      console.warn("[FillerFree WS] Failed to parse Deepgram msg", e);
    }
  });

  dgWs.on("error", (err) => {
    console.error("[FillerFree WS] Deepgram error:", err.message);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "error", message: err.message }));
    }
  });

  dgWs.on("close", () => {
    console.log("[FillerFree WS] Deepgram WS closed");
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "done", fillerCounts: { ...fillerCounts } }));
    }
  });

  ws.on("message", (data, isBinary) => {
    if (isBinary && dgWs.readyState === WebSocket.OPEN) {
      dgWs.send(data);
    } else if (!isBinary) {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === "close") {
          if (dgWs.readyState === WebSocket.OPEN) {
            dgWs.send(JSON.stringify({ type: "CloseStream" }));
          }
        }
      } catch {
      }
    }
  });

  ws.on("close", () => {
    console.log("[FillerFree WS] Client disconnected");
    if (dgWs.readyState === WebSocket.OPEN) {
      dgWs.send(JSON.stringify({ type: "CloseStream" }));
      dgWs.close();
    }
  });

  ws.on("error", (err) => {
    console.error("[FillerFree WS] Client WS error:", err.message);
    if (dgWs.readyState === WebSocket.OPEN) {
      dgWs.close();
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Rhetora backend listening on port ${PORT} (HTTP + WebSocket)`);
});
