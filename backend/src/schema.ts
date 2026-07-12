import { z } from "zod";
import { personas, type PersonaId } from "./personas.js";

const personaIds = personas.map((persona) => persona.id) as [PersonaId, ...PersonaId[]];

export const possessRequestSchema = z.object({
  draft: z.string().min(1, "Draft is required"),
  personaId: z.enum(personaIds),
  intensity: z.number().min(0).max(100),
  preserveMeaning: z.boolean().default(true)
});

export const llmResponseSchema = z.object({
  transformedDraft: z.string().min(1),
  subjectSuggestion: z.string().min(1),
  commentary: z.string().min(1),
  uiEffects: z.object({
    sendLabel: z.string().min(1),
    theme: z.string().min(1),
    animation: z.enum(["glow", "shake", "smoke", "wave", "pulse"])
  })
});

export type PossessRequest = z.infer<typeof possessRequestSchema>;
export type PossessResponse = z.infer<typeof llmResponseSchema>;
