import http from "node:http";
import { Readable } from "node:stream";

const HOST = "127.0.0.1";
const PORT = Number.parseInt(process.env.INBOX_PARADE_VOICE_PORT || "8787", 10);
const API_KEY = process.env.ELEVENLABS_API_KEY;
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || "eleven_flash_v2_5";
const ZERO_RETENTION = process.env.ELEVENLABS_ZERO_RETENTION === "true";
const MAX_BODY_BYTES = 8 * 1024;
const MAX_TEXT_LENGTH = 320;
const MAX_DAILY_CHARACTERS = Number.parseInt(process.env.INBOX_PARADE_DAILY_CHARACTERS || "10000", 10);
const MAX_CONCURRENT_TTS = 2;
const REQUESTS_PER_MINUTE = 12;

const configuredOrigins = new Set(
  String(process.env.INBOX_PARADE_ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
);

const personas = {
  deadline_fox: {
    label: "Deadline Fox",
    description: "Dramatic boss energy—assertive, theatrical, never abusive.",
    character: "Blaze",
    terms: ["authoritative", "deep", "commanding", "dramatic", "narration", "middle-aged"],
    settings: { stability: 0.48, similarity_boost: 0.78, style: 0.62, use_speaker_boost: true, speed: 0.94 },
  },
  warm_coworker: {
    label: "Warm Coworker",
    description: "Friendly, conversational, and reassuring.",
    character: "Ember",
    terms: ["friendly", "warm", "conversational", "casual", "soft", "social media"],
    settings: { stability: 0.58, similarity_boost: 0.76, style: 0.28, use_speaker_boost: true, speed: 1.0 },
  },
  polished_client: {
    label: "Polished Client",
    description: "Composed, articulate, and professional.",
    character: "Peep",
    terms: ["professional", "polished", "articulate", "calm", "corporate", "informative"],
    settings: { stability: 0.72, similarity_boost: 0.78, style: 0.2, use_speaker_boost: true, speed: 0.94 },
  },
  freelance_frog: {
    label: "Freelance Frog",
    description: "Bright, optimistic, and quick-moving.",
    character: "Zip",
    terms: ["energetic", "youthful", "bright", "upbeat", "conversational", "animated"],
    settings: { stability: 0.4, similarity_boost: 0.72, style: 0.58, use_speaker_boost: true, speed: 1.1 },
  },
  finance_bot: {
    label: "Finance Bot",
    description: "Precise, measured, and pleasantly robotic.",
    character: "Beep",
    terms: ["precise", "neutral", "crisp", "informative", "deep", "news"],
    settings: { stability: 0.82, similarity_boost: 0.7, style: 0.08, use_speaker_boost: false, speed: 0.9 },
  },
  newsletter_noodle: {
    label: "Newsletter Noodle",
    description: "Whimsical radio-host energy for leisurely reads.",
    character: "Noodle",
    terms: ["expressive", "animated", "quirky", "upbeat", "social media", "narration"],
    settings: { stability: 0.46, similarity_boost: 0.72, style: 0.55, use_speaker_boost: true, speed: 1.04 },
  },
  personal_pigeon: {
    label: "Personal Pigeon",
    description: "Gentle and unhurried for friends and family.",
    character: "Pippa",
    terms: ["gentle", "warm", "soft", "calm", "conversational", "storytelling"],
    settings: { stability: 0.78, similarity_boost: 0.74, style: 0.12, use_speaker_boost: true, speed: 0.9 },
  },
  neutral_bot: {
    label: "System Bot",
    description: "Clear and restrained for automated updates.",
    character: "Bolt",
    terms: ["neutral", "clear", "informative", "crisp", "news", "professional"],
    settings: { stability: 0.86, similarity_boost: 0.68, style: 0.04, use_speaker_boost: false, speed: 0.96 },
  },
};

let voiceCatalog = [];
let personaAssignments = {};
let lastVoiceRefreshAt = null;
let lastUpstreamOkAt = null;
let voicesError = null;
let activeTtsRequests = 0;
let dailyCharacterCount = 0;
let dailyCharacterDate = new Date().toISOString().slice(0, 10);
const rateBuckets = new Map();

if (!API_KEY) {
  console.error("Inbox Parade voice bridge: ELEVENLABS_API_KEY is not configured.");
  process.exit(1);
}

await refreshVoices();

const server = http.createServer(async (request, response) => {
  const startedAt = Date.now();
  const requestId = Math.random().toString(36).slice(2, 9);
  const origin = String(request.headers.origin || "");

  try {
    if (!isAllowedHost(request.headers.host) || !isAllowedOrigin(origin)) {
      return sendJson(response, 403, { ok: false, error: "Origin not allowed" }, "");
    }

    applyCors(response, origin);
    if (request.method === "OPTIONS") {
      response.writeHead(204, {
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Inbox-Parade-Client",
        "Access-Control-Max-Age": "600",
      });
      return response.end();
    }

    const url = new URL(request.url || "/", `http://${HOST}:${PORT}`);
    if (request.method === "GET" && url.pathname === "/health") {
      return sendJson(response, voicesError ? 503 : 200, {
        ok: !voicesError,
        service: "inbox-parade-voice-bridge",
        modelId: MODEL_ID,
        voicesReady: voiceCatalog.length > 0,
        personaCount: Object.keys(personaAssignments).length,
        upstreamLastOkAt: lastUpstreamOkAt,
        privacy: { storesText: false, diskCache: false },
      }, origin);
    }

    if (request.method === "GET" && url.pathname === "/personas") {
      if (Date.now() - Number(lastVoiceRefreshAt || 0) > 30 * 60 * 1000) {
        await refreshVoices();
      }
      return sendJson(response, voicesError ? 503 : 200, {
        ok: !voicesError,
        version: 1,
        modelId: MODEL_ID,
        refreshedAt: lastVoiceRefreshAt,
        personas: Object.entries(personas).map(([id, persona]) => ({
          id,
          label: persona.label,
          description: persona.description,
          character: persona.character,
          voiceName: personaAssignments[id]?.name || null,
        })),
      }, origin);
    }

    if (request.method === "POST" && url.pathname === "/tts") {
      if (request.headers["x-inbox-parade-client"] !== "v1") {
        return sendJson(response, 400, { ok: false, error: "Missing client header" }, origin);
      }
      if (!String(request.headers["content-type"] || "").startsWith("application/json")) {
        return sendJson(response, 415, { ok: false, error: "JSON required" }, origin);
      }
      if (!allowRate(origin, request.socket.remoteAddress || "local")) {
        response.setHeader("Retry-After", "60");
        return sendJson(response, 429, { ok: false, error: "Voice rate limit reached" }, origin);
      }
      if (activeTtsRequests >= MAX_CONCURRENT_TTS) {
        response.setHeader("Retry-After", "2");
        return sendJson(response, 429, { ok: false, error: "Voice studio is busy" }, origin);
      }

      const body = await readJsonBody(request);
      const personaId = String(body.personaId || "");
      const persona = personas[personaId];
      const assignment = personaAssignments[personaId];
      const text = sanitizeText(body.text);

      if (!persona || !assignment) {
        return sendJson(response, 400, { ok: false, error: "Unknown voice persona" }, origin);
      }
      if (!text || text.length > MAX_TEXT_LENGTH) {
        return sendJson(response, 400, { ok: false, error: `Text must be 1-${MAX_TEXT_LENGTH} characters` }, origin);
      }

      resetDailyBudgetIfNeeded();
      if (dailyCharacterCount + text.length > MAX_DAILY_CHARACTERS) {
        return sendJson(response, 429, { ok: false, error: "Daily voice preview budget reached" }, origin);
      }

      activeTtsRequests += 1;
      dailyCharacterCount += text.length;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      request.once("aborted", () => controller.abort());
      response.once("close", () => {
        if (!response.writableEnded) controller.abort();
      });

      try {
        const query = new URLSearchParams({ output_format: "mp3_44100_128" });
        if (ZERO_RETENTION) query.set("enable_logging", "false");
        const upstream = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(assignment.voice_id)}/stream?${query}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "xi-api-key": API_KEY,
            },
            body: JSON.stringify({
              text,
              model_id: MODEL_ID,
              voice_settings: persona.settings,
            }),
            signal: controller.signal,
          },
        );

        if (!upstream.ok || !upstream.body) {
          console.warn(`[${requestId}] tts upstream status=${upstream.status} persona=${personaId} chars=${text.length}`);
          return sendJson(response, 502, { ok: false, error: "Voice generation failed" }, origin);
        }

        lastUpstreamOkAt = new Date().toISOString();
        response.writeHead(200, {
          "Content-Type": upstream.headers.get("content-type") || "audio/mpeg",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
          "X-Inbox-Parade-Persona": personaId,
          "X-Inbox-Parade-Voice": encodeURIComponent(assignment.name || "ElevenLabs voice"),
          Vary: "Origin",
        });
        await new Promise((resolve, reject) => {
          const audioStream = Readable.fromWeb(upstream.body);
          audioStream.once("error", reject);
          response.once("finish", resolve);
          audioStream.pipe(response);
        });
        console.info(`[${requestId}] tts ok persona=${personaId} chars=${text.length} latencyMs=${Date.now() - startedAt}`);
      } finally {
        clearTimeout(timeout);
        activeTtsRequests -= 1;
      }
      return;
    }

    return sendJson(response, 404, { ok: false, error: "Not found" }, origin);
  } catch (error) {
    const status = error?.code === "BODY_TOO_LARGE" ? 413 : 500;
    console.warn(`[${requestId}] request failed status=${status} latencyMs=${Date.now() - startedAt}`);
    if (!response.headersSent) sendJson(response, status, { ok: false, error: "Voice bridge request failed" }, origin);
    else response.destroy();
  }
});

server.listen(PORT, HOST, () => {
  console.info(`Inbox Parade voice bridge ready at http://${HOST}:${PORT}`);
  console.info(`Loaded ${voiceCatalog.length} available voices and ${Object.keys(personaAssignments).length} persona casts.`);
  if (!configuredOrigins.size) {
    console.warn("Development CORS mode: localhost and chrome-extension origins are allowed. Set INBOX_PARADE_ALLOWED_ORIGINS for an exact allowlist.");
  }
});

async function refreshVoices() {
  try {
    const voices = [];
    let nextPageToken = null;
    for (let page = 0; page < 5; page += 1) {
      const query = new URLSearchParams({ page_size: "100", include_total_count: "false" });
      if (nextPageToken) query.set("next_page_token", nextPageToken);
      const response = await fetch(`https://api.elevenlabs.io/v2/voices?${query}`, {
        headers: { "xi-api-key": API_KEY },
      });
      if (!response.ok) throw new Error(`voice catalog status ${response.status}`);
      const data = await response.json();
      voices.push(...(Array.isArray(data.voices) ? data.voices : []));
      if (!data.has_more || !data.next_page_token) break;
      nextPageToken = data.next_page_token;
    }
    if (!voices.length) throw new Error("voice catalog empty");
    voiceCatalog = voices;
    personaAssignments = castPersonas(voices);
    lastVoiceRefreshAt = Date.now();
    lastUpstreamOkAt = new Date().toISOString();
    voicesError = null;
  } catch (error) {
    voicesError = error instanceof Error ? error.message : "voice catalog unavailable";
    console.warn(`Inbox Parade voice bridge could not load voices: ${voicesError}`);
  }
}

function castPersonas(voices) {
  const assignments = {};
  const used = new Set();
  for (const [personaId, persona] of Object.entries(personas)) {
    const envVoiceId = process.env[`ELEVENLABS_VOICE_${personaId.toUpperCase()}`];
    const explicit = envVoiceId && voices.find((voice) => voice.voice_id === envVoiceId);
    if (explicit) {
      assignments[personaId] = explicit;
      used.add(explicit.voice_id);
      continue;
    }
    const ranked = [...voices].sort((left, right) => {
      const difference = voiceScore(right, persona) - voiceScore(left, persona);
      return difference || String(left.voice_id).localeCompare(String(right.voice_id));
    });
    const selected = ranked.find((voice) => !used.has(voice.voice_id)) || ranked[0];
    assignments[personaId] = selected;
    used.add(selected.voice_id);
  }
  return assignments;
}

function voiceScore(voice, persona) {
  const labels = voice.labels && typeof voice.labels === "object" ? Object.values(voice.labels).join(" ") : "";
  const text = `${voice.name || ""} ${voice.description || ""} ${labels} ${voice.category || ""}`.toLowerCase();
  return persona.terms.reduce((score, term, index) => score + (text.includes(term) ? Math.max(2, 8 - index) : 0), 0);
}

function isAllowedHost(host = "") {
  return host === `${HOST}:${PORT}` || host === `localhost:${PORT}`;
}

function isAllowedOrigin(origin) {
  if (configuredOrigins.size) return configuredOrigins.has(origin);
  return origin.startsWith("chrome-extension://") || origin === "http://127.0.0.1:4173" || origin === "http://localhost:4173";
}

function applyCors(response, origin) {
  if (origin) response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Vary", "Origin");
}

function sendJson(response, status, data, origin) {
  applyCors(response, origin);
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(JSON.stringify(data));
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        const error = new Error("body too large");
        error.code = "BODY_TOO_LARGE";
        reject(error);
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch {
        reject(new Error("invalid json"));
      }
    });
    request.on("error", reject);
  });
}

function sanitizeText(value) {
  return String(value || "")
    .normalize("NFC")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/https?:\/\/\S+/gi, "a link")
    .replace(/\s+/g, " ")
    .trim();
}

function allowRate(origin, address) {
  const key = `${origin}:${address}`;
  const now = Date.now();
  const bucket = (rateBuckets.get(key) || []).filter((time) => now - time < 60000);
  if (bucket.length >= REQUESTS_PER_MINUTE) return false;
  bucket.push(now);
  rateBuckets.set(key, bucket);
  return true;
}

function resetDailyBudgetIfNeeded() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== dailyCharacterDate) {
    dailyCharacterDate = today;
    dailyCharacterCount = 0;
  }
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
