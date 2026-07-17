---
name: tonecast
description: Theatrical email possession engine. Rewrites drafts into dramatic personas and performs them aloud, keyless via Sauna's LLM + ElevenLabs.
manifest_version: 1
enabled: true
visibility: public
---

# ToneCast (Sauna App)

Hosted backend for the ToneCast Gmail extension, ported from the Express server.
It rewrites an email draft into a theatrical persona and synthesizes a voice
performance — using **Sauna's own LLM and ElevenLabs proxies**, so no OpenAI or
ElevenLabs API keys are needed. Everything is metered to the app owner's Sauna
credits.

## Endpoints

- `GET  /api/health` — liveness + persona catalog.
- `POST /api/possess` — `{ draft, personaId, intensity (0-100), preserveMeaning? }`
  → `{ transformedDraft, subjectSuggestion, commentary, uiEffects }`.
- `POST /api/voice` — `{ text, personaId? }` → `{ audioBase64, mimeType }`.
- `GET  /` — a browser demo/playground (works without the extension).

## Notes

- `visibility: public` makes the API anonymous so the Gmail content script can
  call it with no Sauna session. Anyone with the URL can spend the owner's
  credits — acceptable for an MVP demo; add owner-key gating before real use.
- LLM tier is `balanced` (creative rewrite); voice defaults per-persona.
