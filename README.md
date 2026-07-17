# ToneCast

ToneCast is a local MVP for a Gmail-overlay Chrome extension that rewrites drafts into theatrical personas, restores the original draft, and performs the result with ElevenLabs voice playback.

## What it includes

- Gmail compose overlay injected by a Chrome extension
- Persona selector, intensity slider, `Possess`, `Exorcise`, and `Play Voice`
- Backend orchestration layer for LLM rewriting and ElevenLabs TTS
- Structured JSON response contract for transformed text and UI effects
- Provider interface for the rewrite model so API keys stay server-side

## Project layout

- `backend/`: Express API for rewrite orchestration and voice generation
- `extension/`: Manifest V3 extension with Gmail DOM integration
- `scripts/build-extension.mjs`: Bundles extension assets into `extension/dist`

## Environment

Create `.env` in the project root:

```env
PORT=8787
ALLOWED_ORIGIN=*
LLM_PROVIDER=openai_compatible
LLM_API_URL=https://api.openai.com/v1/chat/completions
LLM_API_KEY=replace-me
LLM_MODEL=gpt-4.1-mini
ELEVENLABS_API_KEY=replace-me
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

If your "Email" LLM is a different provider, keep `LLM_PROVIDER=openai_compatible` and point `LLM_API_URL` plus `LLM_MODEL` to that provider's OpenAI-compatible chat endpoint. The extension never receives those secrets.

## Local development

```bash
npm install
npm run build
npm run dev
```

Then:

1. Load `extension/dist` as an unpacked extension in Chrome.
2. Open Gmail.
3. Start composing an email and use the ToneCast controls.

The backend runs on `http://localhost:8787` by default.

## Landing page

ToneCast also includes a responsive marketing page at the repository root. Run it locally with:

```bash
npm run dev:site
```

Build an OpenNext-compatible deployment bundle with:

```bash
npm run build:site
```

## Sauna App (keyless hosted backend)

A hosted port of the backend lives in `sauna-app/` and runs as a Sauna App. It calls Sauna's LLM and ElevenLabs proxies directly, so it needs **no OpenAI or ElevenLabs API keys**. Live demo/playground: https://tonecast-4vqtt7s5.sauna.new/

### Personas (12)
Movie Trailer, Furious Chef, Ancient Wizard, Pirate Captain, Sports Commentator, Noir Detective, Shakespearean Bard, Gen Z Hype, Zen Master, and three standup comedians: **Standup: Gen X**, **Standup: Millennial**, **Standup: Gen Z**. Each maps to a distinct ElevenLabs voice.

### Voice notes
The extension can attach a **voice note** of the message to the email. A "Voice of" selector chooses whether to voice the **original draft** or the **possessed version**. Attach attempts a Gmail drag-drop and always saves the MP3 to Downloads as a fallback.

### Reliable Gmail attach (InboxSDK)
The extension uses [InboxSDK](https://www.inboxsdk.com/) for a stable Gmail compose lifecycle and reliable attachment via `composeView.attachFiles()`.

Setup:
1. Register a free app id at https://www.inboxsdk.com/register and set `INBOXSDK_APP_ID` in `extension/src/content.ts`.
2. `npm run build:extension` — bundles InboxSDK and copies `pageWorld.js` into `extension/dist`.
3. Load `extension/dist` unpacked in Chrome.

MV3 note: `pageWorld.js` ships as a web-accessible resource and is injected into the page's MAIN world by the background service worker (on the `inboxsdk__injectPageWorld` message), which needs the `scripting` permission.
