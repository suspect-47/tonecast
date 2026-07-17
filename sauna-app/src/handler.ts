import type { AppHandler } from "@sauna/apps-runtime";
import { personas, personaMap, isPersonaId, type PersonaConfig } from "./personas";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

type PossessResult = {
  transformedDraft: string;
  subjectSuggestion: string;
  commentary: string;
  uiEffects: { sendLabel: string; theme: string; animation: string };
};

const SYSTEM_PROMPT = `
You are ToneCast, a theatrical email possession engine.
Rewrite the user's draft into the requested persona while preserving the core
meaning when preserveMeaning is true. Keep the result suitable for a Gmail
compose box (plain text, no markdown).
Respond with ONLY a single JSON object, no prose, no code fences, matching:
{
  "transformedDraft": string,
  "subjectSuggestion": string,
  "commentary": string,
  "uiEffects": {
    "sendLabel": string,
    "theme": string,
    "animation": "glow" | "shake" | "smoke" | "wave" | "pulse"
  }
}
`.trim();

function extractJson(text: string): unknown {
  const trimmed = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      throw new Error("LLM did not return JSON");
    }
    return JSON.parse(trimmed.slice(start, end + 1));
  }
}

async function transformDraft(input: {
  draft: string;
  persona: PersonaConfig;
  intensity: number;
  preserveMeaning: boolean;
}): Promise<PossessResult> {
  const { draft, persona, intensity, preserveMeaning } = input;
  const intensityDescriptor =
    intensity < 30 ? "subtle influence" : intensity < 70 ? "clear theatrical rewrite" : "full chaotic takeover";

  const userPrompt = JSON.stringify({
    task: "Rewrite this email draft for Gmail.",
    persona: { id: persona.id, label: persona.label, description: persona.description },
    guidance: {
      intensity,
      intensityDescriptor,
      preserveMeaning,
      targetAudience: "A human reading a Gmail email",
      uiEffects: {
        preferredTheme: persona.uiTheme,
        preferredAnimation: persona.animation,
        preferredSendLabel: persona.sendLabel,
      },
    },
    draft,
  });

  const res = await fetch("https://sauna.local/v1/llms/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "balanced",
      instructions: SYSTEM_PROMPT,
      input: userPrompt,
    }),
  });

  if (!res.ok) {
    throw new Error(`LLM request failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { output_text?: string };
  const content = data.output_text;
  if (!content) throw new Error("LLM response had no output_text");

  const parsed = extractJson(content) as Partial<PossessResult>;
  const animations = ["glow", "shake", "smoke", "wave", "pulse"];
  const animation =
    parsed.uiEffects && animations.includes(parsed.uiEffects.animation)
      ? parsed.uiEffects.animation
      : persona.animation;

  return {
    transformedDraft: parsed.transformedDraft?.trim() || draft,
    subjectSuggestion: parsed.subjectSuggestion?.trim() || persona.label,
    commentary: parsed.commentary?.trim() || persona.description,
    uiEffects: {
      sendLabel: parsed.uiEffects?.sendLabel?.trim() || persona.sendLabel,
      theme: parsed.uiEffects?.theme?.trim() || persona.uiTheme,
      animation,
    },
  };
}

async function synthesizeVoice(text: string, voiceId: string): Promise<{ audioBase64: string; mimeType: string }> {
  const res = await fetch(`https://sauna.local/v1/elevenlabs/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.35, similarity_boost: 0.7, style: 0.55, use_speaker_boost: true },
    }),
  });

  if (!res.ok) {
    throw new Error(`ElevenLabs request failed: ${res.status} ${await res.text()}`);
  }

  const bytes = new Uint8Array(await res.arrayBuffer());
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return { audioBase64: btoa(binary), mimeType: "audio/mpeg" };
}

const personaCatalog = () => personas.map(({ id, label, description }) => ({ id, label, description }));

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (path === "/api/health" && request.method === "GET") {
      return json({ ok: true, provider: "sauna", personas: personaCatalog() });
    }

    if (path === "/api/possess" && request.method === "POST") {
      try {
        const body = (await request.json()) as {
          draft?: string;
          personaId?: string;
          intensity?: number;
          preserveMeaning?: boolean;
        };
        if (!body.draft || !body.draft.trim()) return json({ error: "Draft is required" }, 400);
        if (!body.personaId || !isPersonaId(body.personaId)) return json({ error: "Unknown personaId" }, 400);
        const intensity = typeof body.intensity === "number" ? Math.max(0, Math.min(100, body.intensity)) : 65;
        const result = await transformDraft({
          draft: body.draft,
          persona: personaMap.get(body.personaId)!,
          intensity,
          preserveMeaning: body.preserveMeaning ?? true,
        });
        return json(result);
      } catch (error) {
        return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
      }
    }

    if (path === "/api/voice" && request.method === "POST") {
      try {
        const body = (await request.json()) as { text?: string; personaId?: string };
        if (!body.text || !body.text.trim()) return json({ error: "Text is required" }, 400);
        const voiceId =
          body.personaId && isPersonaId(body.personaId)
            ? personaMap.get(body.personaId)!.voiceId
            : "ys3XeJJA4ArWMhRpcX1D";
        const result = await synthesizeVoice(body.text.trim(), voiceId);
        return json(result);
      } catch (error) {
        return json({ error: error instanceof Error ? error.message : "Unknown error" }, 400);
      }
    }

    return json({ error: "Not found" }, 404);
  },
} satisfies AppHandler;
