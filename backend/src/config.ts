import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: new URL("../../.env", import.meta.url).pathname });

const envSchema = z.object({
  PORT: z.string().default("8787"),
  ALLOWED_ORIGIN: z.string().default("*"),
  LLM_PROVIDER: z.enum(["openai_compatible"]).default("openai_compatible"),
  LLM_API_URL: z.string().url(),
  LLM_API_KEY: z.string().min(1),
  LLM_MODEL: z.string().min(1),
  ELEVENLABS_API_KEY: z.string().min(1),
  ELEVENLABS_VOICE_ID: z.string().min(1)
});

export const env = envSchema.parse(process.env);
