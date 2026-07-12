import { env } from "./config.js";
import { personaMap } from "./personas.js";
import { llmResponseSchema, type PossessRequest, type PossessResponse } from "./schema.js";

type OpenAICompatibleResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

const systemPrompt = `
You are ToneCast, a theatrical email possession engine.
Return only valid JSON.
Rewrite the user's draft into the requested persona while preserving the core meaning when preserveMeaning is true.
Keep the draft suitable for a Gmail compose box.
The response JSON must match:
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

export async function transformDraft(input: PossessRequest): Promise<PossessResponse> {
  const persona = personaMap.get(input.personaId);

  if (!persona) {
    throw new Error(`Unsupported persona: ${input.personaId}`);
  }

  const intensityDescriptor =
    input.intensity < 30
      ? "subtle influence"
      : input.intensity < 70
        ? "clear theatrical rewrite"
        : "full chaotic takeover";

  const userPrompt = JSON.stringify({
    task: "Rewrite this email draft for Gmail.",
    persona: {
      id: persona.id,
      label: persona.label,
      description: persona.description
    },
    guidance: {
      intensity: input.intensity,
      intensityDescriptor,
      preserveMeaning: input.preserveMeaning,
      targetAudience: "A human reading a Gmail email",
      uiEffects: {
        preferredTheme: persona.uiTheme,
        preferredAnimation: persona.animation,
        preferredSendLabel: persona.sendLabel
      }
    },
    draft: input.draft
  });

  if (env.LLM_PROVIDER !== "openai_compatible") {
    throw new Error(`Unsupported provider: ${env.LLM_PROVIDER}`);
  }

  const response = await fetch(env.LLM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.LLM_API_KEY}`
    },
    body: JSON.stringify({
      model: env.LLM_MODEL,
      temperature: 0.9,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM request failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as OpenAICompatibleResponse;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("LLM response did not contain message content");
  }

  return llmResponseSchema.parse(JSON.parse(content));
}
