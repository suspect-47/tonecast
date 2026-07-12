import cors from "cors";
import express from "express";
import { env } from "./config.js";
import { personas } from "./personas.js";
import { possessRequestSchema } from "./schema.js";
import { transformDraft } from "./llm.js";
import { synthesizeVoice } from "./voice.js";

const app = express();

app.use(cors({ origin: env.ALLOWED_ORIGIN === "*" ? true : env.ALLOWED_ORIGIN.split(",") }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    provider: env.LLM_PROVIDER,
    personas: personas.map(({ id, label, description }) => ({ id, label, description }))
  });
});

app.post("/api/possess", async (req, res) => {
  try {
    const input = possessRequestSchema.parse(req.body);
    const result = await transformDraft(input);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

app.post("/api/voice", async (req, res) => {
  try {
    const { text } = req.body as { text?: string };

    if (!text || !text.trim()) {
      res.status(400).json({ error: "Text is required" });
      return;
    }

    const result = await synthesizeVoice(text.trim());
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

app.listen(Number(env.PORT), () => {
  console.log(`ToneCast backend listening on http://localhost:${env.PORT}`);
});
