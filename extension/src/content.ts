import * as InboxSDK from "@inboxsdk/core";

// Register a free app id at https://www.inboxsdk.com/register and replace this.
// InboxSDK also initializes with a dev id (shows a small warning banner in Gmail).
const INBOXSDK_APP_ID = "sdk_tonecast_PLACEHOLDER";

interface StatusBarView {
  el: HTMLElement;
  destroy(): void;
  setHeight(newHeight: number): void;
}

// Minimal shape of the InboxSDK ComposeView surface we use.
interface ComposeView {
  getTextContent(): string;
  getHTMLContent(): string;
  getSubjectInput(): HTMLInputElement | null;
  setSubject(text: string): void;
  setBodyText(text: string): void;
  setBodyHTML(html: string): void;
  attachFiles(files: Blob[]): void;
  addStatusBar(opts?: { height?: number; orderHint?: number; addAboveNativeStatusBar?: boolean }): StatusBarView;
}

type Persona = {
  id: string;
  label: string;
  description: string;
};

type UiEffects = {
  sendLabel: string;
  theme: string;
  animation: string;
};

type PossessResponse = {
  transformedDraft: string;
  subjectSuggestion: string;
  commentary: string;
  uiEffects: UiEffects;
};

const PANEL_CLASS = "tonecast-panel";

const personaOptions: Persona[] = [
  { id: "movie_trailer", label: "Movie Trailer", description: "Routine requests become a blockbuster teaser." },
  { id: "furious_chef", label: "Furious Chef", description: "Every sentence arrives fully pan-seared." },
  { id: "ancient_wizard", label: "Ancient Wizard", description: "Calendars become prophecy." },
  { id: "pirate_captain", label: "Pirate Captain", description: "Inbox mutiny, but polite enough to send." },
  { id: "sports_commentator", label: "Sports Commentator", description: "Status updates narrated like a final." },
  { id: "noir_detective", label: "Noir Detective", description: "Every calendar invite hides a case." },
  { id: "shakespearean_bard", label: "Shakespearean Bard", description: "Iambic grandeur for petty updates." },
  { id: "gen_z_hype", label: "Gen Z Hype", description: "It's giving corporate, but slay." },
  { id: "zen_master", label: "Zen Master", description: "Dissolves urgency into calm clarity." },
  { id: "standup_genx", label: "Standup: Gen X", description: "Deadpan, cynical mic work — 90s callbacks, whatever." },
  { id: "standup_geny", label: "Standup: Millennial", description: "Self-deprecating burnout comedy about adulting." },
  { id: "standup_genz", label: "Standup: Gen Z", description: "Absurdist, chronically-online deadpan." }
];

void InboxSDK.load(2, INBOXSDK_APP_ID).then((sdk: any) => {
  sdk.Compose.registerComposeViewHandler((composeView: ComposeView) => {
    mountPanel(composeView);
  });
}).catch((error: unknown) => {
  console.error("[ToneCast] InboxSDK failed to load", error);
});

function mountPanel(composeView: ComposeView) {
  // Pre-possession state, preserved with formatting for a clean exorcise.
  let originalHtml: string | null = null;
  let originalText: string | null = null;
  let originalSubject: string | null = null;

  // Mount into a compose status bar: a non-editable region BELOW the body,
  // so the text input stays on top and native <select> dropdowns work.
  const statusBar = composeView.addStatusBar({ height: 175 });

  const panel = document.createElement("section");
  panel.className = PANEL_CLASS;

  const title = document.createElement("div");
  title.className = "tonecast-heading";
  title.textContent = "ToneCast";

  const personaSelect = document.createElement("select");
  personaSelect.className = "tonecast-select";
  for (const persona of personaOptions) {
    const option = document.createElement("option");
    option.value = persona.id;
    option.textContent = persona.label;
    personaSelect.append(option);
  }

  const intensityLabel = document.createElement("label");
  intensityLabel.className = "tonecast-intensity";
  intensityLabel.textContent = "Intensity";

  const intensityValue = document.createElement("span");
  intensityValue.textContent = "65";
  intensityLabel.append(` `, intensityValue);

  const intensityInput = document.createElement("input");
  intensityInput.type = "range";
  intensityInput.min = "0";
  intensityInput.max = "100";
  intensityInput.value = "65";
  intensityInput.className = "tonecast-range";
  intensityInput.addEventListener("input", () => {
    intensityValue.textContent = intensityInput.value;
  });

  const sourceLabel = document.createElement("label");
  sourceLabel.className = "tonecast-intensity";
  sourceLabel.textContent = "Voice of";

  const voiceSourceSelect = document.createElement("select");
  voiceSourceSelect.className = "tonecast-select";
  for (const opt of [
    { value: "possessed", label: "Possessed version" },
    { value: "original", label: "Original draft" }
  ]) {
    const o = document.createElement("option");
    o.value = opt.value;
    o.textContent = opt.label;
    voiceSourceSelect.append(o);
  }

  const commentary = document.createElement("p");
  commentary.className = "tonecast-commentary";
  commentary.textContent = personaOptions[0]?.description ?? "";

  personaSelect.addEventListener("change", () => {
    const selected = personaOptions.find((persona) => persona.id === personaSelect.value);
    commentary.textContent = selected?.description ?? "";
  });

  const controls = document.createElement("div");
  controls.className = "tonecast-controls";

  const possessButton = createButton("Possess");
  const exorciseButton = createButton("Exorcise");
  const playVoiceButton = createButton("Play Voice");
  const attachVoiceButton = createButton("Attach Voice Note");

  possessButton.addEventListener("click", async () => {
    setBusy(panel, true);
    try {
      await possessDraft();
    } finally {
      setBusy(panel, false);
    }
  });

  exorciseButton.addEventListener("click", () => {
    if (originalHtml === null) {
      commentary.textContent = "Nothing to exorcise yet.";
      return;
    }
    composeView.setBodyHTML(originalHtml);
    if (originalSubject !== null) composeView.setSubject(originalSubject);
    commentary.textContent = "Draft restored with its original formatting.";
    clearTheme(panel);
  });

  playVoiceButton.addEventListener("click", async () => {
    setBusy(panel, true);
    try {
      const text = getVoiceText(voiceSourceSelect.value);
      if (!text) {
        commentary.textContent = "Nothing to perform yet.";
        return;
      }
      commentary.textContent = "Performing…";
      const audio = await fetchVoice(text, personaSelect.value, commentary);
      if (!audio) return;
      const el = new Audio(`data:${audio.mimeType};base64,${audio.audioBase64}`);
      el.play().catch(() => {
        commentary.textContent = "Browser blocked playback. Click in Gmail and try again.";
      });
    } finally {
      setBusy(panel, false);
    }
  });

  attachVoiceButton.addEventListener("click", async () => {
    setBusy(panel, true);
    try {
      await attachVoiceNote();
    } finally {
      setBusy(panel, false);
    }
  });

  controls.append(possessButton, exorciseButton, playVoiceButton, attachVoiceButton);
  panel.append(
    title,
    personaSelect,
    intensityLabel,
    intensityInput,
    sourceLabel,
    voiceSourceSelect,
    controls,
    commentary
  );
  statusBar.el.append(panel);

  async function possessDraft() {
    const draft = composeView.getTextContent().trim();

    if (!draft) {
      commentary.textContent = "Write something first so the spirits have material.";
      return;
    }

    if (originalHtml === null) {
      originalHtml = composeView.getHTMLContent();
      originalText = draft;
      originalSubject = composeView.getSubjectInput()?.value ?? "";
    }

    const backendBaseUrl = await getBackendBaseUrl();
    const response = await fetch(`${backendBaseUrl}/api/possess`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        draft,
        personaId: personaSelect.value,
        intensity: Number(intensityInput.value),
        preserveMeaning: true
      })
    });

    const data = (await response.json()) as PossessResponse | { error: string };

    if (!response.ok || "error" in data) {
      commentary.textContent = "Possession failed. Check the backend logs.";
      return;
    }

    composeView.setBodyText(data.transformedDraft);
    composeView.setSubject(data.subjectSuggestion);
    commentary.textContent = data.commentary;
    applyTheme(panel, data.uiEffects);
  }

  function getVoiceText(source: string): string {
    if (source === "original") {
      return (originalText ?? composeView.getTextContent()).trim();
    }
    return composeView.getTextContent().trim();
  }

  async function attachVoiceNote() {
    const source = voiceSourceSelect.value;
    const text = getVoiceText(source);

    if (!text) {
      commentary.textContent = "Nothing to voice yet.";
      return;
    }

    commentary.textContent = "Recording voice note…";
    const audio = await fetchVoice(text, personaSelect.value, commentary);
    if (!audio) return;

    const blob = base64ToBlob(audio.audioBase64, audio.mimeType);
    const fileName = `tonecast-${personaSelect.value}-${source}.mp3`;
    const file = new File([blob], fileName, { type: audio.mimeType });

    try {
      composeView.attachFiles([file]);
      commentary.textContent = `Voice note (${source}) attached to your email.`;
    } catch (error) {
      console.error("[ToneCast] attachFiles failed", error);
      downloadBlob(blob, fileName);
      commentary.textContent = `Attach failed — saved the voice note (${source}) to Downloads instead.`;
    }
  }
}

function createButton(label: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.className = "tonecast-button";
  button.type = "button";
  button.textContent = label;
  return button;
}

async function fetchVoice(
  text: string,
  personaId: string,
  commentary: HTMLElement
): Promise<{ audioBase64: string; mimeType: string } | null> {
  const backendBaseUrl = await getBackendBaseUrl();
  const response = await fetch(`${backendBaseUrl}/api/voice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, personaId })
  });

  const data = (await response.json()) as
    | { audioBase64: string; mimeType: string }
    | { error: string };

  if (!response.ok || "error" in data) {
    commentary.textContent = "Voice generation failed. Try again.";
    return null;
  }

  return data;
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function setBusy(panel: HTMLElement, busy: boolean) {
  panel.toggleAttribute("data-tonecast-busy", busy);
}

function applyTheme(panel: HTMLElement, effects: UiEffects) {
  panel.setAttribute("data-tonecast-theme", effects.theme);
  panel.setAttribute("data-tonecast-animation", effects.animation);
}

function clearTheme(panel: HTMLElement) {
  panel.removeAttribute("data-tonecast-theme");
  panel.removeAttribute("data-tonecast-animation");
}

async function getBackendBaseUrl(): Promise<string> {
  const stored = await chrome.storage.sync.get({ backendBaseUrl: "https://tonecast-4vqtt7s5.sauna.new" });
  return typeof stored.backendBaseUrl === "string"
    ? stored.backendBaseUrl
    : "https://tonecast-4vqtt7s5.sauna.new";
}
