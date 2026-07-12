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

const COMPOSE_SELECTOR = "div[role='dialog'] div[aria-label='Message Body'], div[role='textbox'][g_editable='true']";
const SUBJECT_INPUT_SELECTOR = "input[name='subjectbox']";
const PANEL_CLASS = "tonecast-panel";
const ORIGIN_DATA_KEY = "tonecastOriginalDraft";
const SUBJECT_DATA_KEY = "tonecastOriginalSubject";
const PANEL_ATTR = "data-tonecast-mounted";

const personaOptions: Persona[] = [
  {
    id: "movie_trailer",
    label: "Movie Trailer",
    description: "Routine requests become a blockbuster teaser."
  },
  {
    id: "furious_chef",
    label: "Furious Chef",
    description: "Every sentence arrives fully pan-seared."
  },
  {
    id: "ancient_wizard",
    label: "Ancient Wizard",
    description: "Calendars become prophecy."
  },
  {
    id: "pirate_captain",
    label: "Pirate Captain",
    description: "Inbox mutiny, but polite enough to send."
  },
  {
    id: "sports_commentator",
    label: "Sports Commentator",
    description: "Status updates narrated like a final."
  }
];

boot();

function boot() {
  const observer = new MutationObserver(() => {
    for (const compose of findComposeTargets()) {
      mountPanel(compose);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  for (const compose of findComposeTargets()) {
    mountPanel(compose);
  }
}

function findComposeTargets(): HTMLElement[] {
  return Array.from(document.querySelectorAll(COMPOSE_SELECTOR)).filter(
    (node): node is HTMLElement => node instanceof HTMLElement
  );
}

function mountPanel(composeBody: HTMLElement) {
  const container = composeBody.closest("div[role='dialog']") ?? composeBody.parentElement;

  if (!container || container.querySelector(`.${PANEL_CLASS}`)) {
    return;
  }

  composeBody.setAttribute(PANEL_ATTR, "true");

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

  possessButton.addEventListener("click", async () => {
    setBusy(panel, true);
    try {
      await possessDraft({
        composeBody,
        panel,
        personaId: personaSelect.value,
        intensity: Number(intensityInput.value),
        commentary
      });
    } finally {
      setBusy(panel, false);
    }
  });

  exorciseButton.addEventListener("click", () => {
    restoreDraft(composeBody, commentary);
    clearTheme(panel);
  });

  playVoiceButton.addEventListener("click", async () => {
    setBusy(panel, true);
    try {
      await playVoice(composeBody, commentary);
    } finally {
      setBusy(panel, false);
    }
  });

  controls.append(possessButton, exorciseButton, playVoiceButton);
  panel.append(title, personaSelect, intensityLabel, intensityInput, controls, commentary);
  container.insertBefore(panel, container.firstChild);
}

function createButton(label: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.className = "tonecast-button";
  button.type = "button";
  button.textContent = label;
  return button;
}

async function possessDraft(args: {
  composeBody: HTMLElement;
  panel: HTMLElement;
  personaId: string;
  intensity: number;
  commentary: HTMLElement;
}) {
  const { composeBody, panel, personaId, intensity, commentary } = args;
  const draft = getComposeText(composeBody);

  if (!draft.trim()) {
    commentary.textContent = "Write something first so the spirits have material.";
    return;
  }

  saveOriginal(composeBody);

  const backendBaseUrl = await getBackendBaseUrl();
  const response = await fetch(`${backendBaseUrl}/api/possess`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      draft,
      personaId,
      intensity,
      preserveMeaning: true
    })
  });

  const data = (await response.json()) as PossessResponse | { error: string };

  if (!response.ok || "error" in data) {
    commentary.textContent = "Possession failed. Check the backend logs and env config.";
    return;
  }

  setComposeText(composeBody, data.transformedDraft);
  setSubject(composeBody, data.subjectSuggestion);
  commentary.textContent = data.commentary;
  applyTheme(panel, data.uiEffects);
}

function restoreDraft(composeBody: HTMLElement, commentary: HTMLElement) {
  const originalDraft = composeBody.dataset[ORIGIN_DATA_KEY];
  const originalSubject = composeBody.dataset[SUBJECT_DATA_KEY];

  if (!originalDraft) {
    commentary.textContent = "Nothing to exorcise yet.";
    return;
  }

  setComposeText(composeBody, originalDraft);

  if (typeof originalSubject === "string") {
    setSubject(composeBody, originalSubject);
  }

  commentary.textContent = "Draft restored to its pre-possession state.";
}

async function playVoice(composeBody: HTMLElement, commentary: HTMLElement) {
  const text = getComposeText(composeBody).trim();

  if (!text) {
    commentary.textContent = "No possessed monologue available to perform.";
    return;
  }

  const backendBaseUrl = await getBackendBaseUrl();
  const response = await fetch(`${backendBaseUrl}/api/voice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  const data = (await response.json()) as
    | { audioBase64: string; mimeType: string }
    | { error: string };

  if (!response.ok || "error" in data) {
    commentary.textContent = "Voice playback failed. Verify ElevenLabs credentials.";
    return;
  }

  const audio = new Audio(`data:${data.mimeType};base64,${data.audioBase64}`);
  audio.play().catch(() => {
    commentary.textContent = "Browser blocked playback. Interact with Gmail and try again.";
  });
}

function getComposeText(composeBody: HTMLElement): string {
  return composeBody.innerText.replace(/\u00a0/g, " ").trim();
}

function setComposeText(composeBody: HTMLElement, text: string) {
  composeBody.focus();
  document.execCommand("selectAll", false);
  document.execCommand("insertText", false, text);
  composeBody.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }));
}

function saveOriginal(composeBody: HTMLElement) {
  if (!composeBody.dataset[ORIGIN_DATA_KEY]) {
    composeBody.dataset[ORIGIN_DATA_KEY] = getComposeText(composeBody);
  }

  if (!composeBody.dataset[SUBJECT_DATA_KEY]) {
    composeBody.dataset[SUBJECT_DATA_KEY] = getSubject(composeBody);
  }
}

function getSubject(composeBody: HTMLElement): string {
  const dialog = composeBody.closest("div[role='dialog']");
  const subjectInput = dialog?.querySelector(SUBJECT_INPUT_SELECTOR);
  return subjectInput instanceof HTMLInputElement ? subjectInput.value : "";
}

function setSubject(composeBody: HTMLElement, subject: string) {
  const dialog = composeBody.closest("div[role='dialog']");
  const subjectInput = dialog?.querySelector(SUBJECT_INPUT_SELECTOR);

  if (!(subjectInput instanceof HTMLInputElement)) {
    return;
  }

  subjectInput.value = subject;
  subjectInput.dispatchEvent(new Event("input", { bubbles: true }));
  subjectInput.dispatchEvent(new Event("change", { bubbles: true }));
}

function setBusy(panel: HTMLElement, busy: boolean) {
  panel.toggleAttribute("data-tonecast-busy", busy);
}

function applyTheme(panel: HTMLElement, effects: UiEffects) {
  panel.setAttribute("data-tonecast-theme", effects.theme);
  panel.setAttribute("data-tonecast-animation", effects.animation);
  const sendButton = panel.parentElement?.querySelector("div[role='button'][data-tooltip^='Send'], div[role='button'][aria-label^='Send']");

  if (sendButton instanceof HTMLElement) {
    sendButton.dataset.tonecastOriginalLabel ||= sendButton.textContent ?? "Send";
    sendButton.textContent = effects.sendLabel;
  }
}

function clearTheme(panel: HTMLElement) {
  panel.removeAttribute("data-tonecast-theme");
  panel.removeAttribute("data-tonecast-animation");
  const sendButton = panel.parentElement?.querySelector("div[role='button'][data-tooltip^='Send'], div[role='button'][aria-label^='Send']");

  if (sendButton instanceof HTMLElement && sendButton.dataset.tonecastOriginalLabel) {
    sendButton.textContent = sendButton.dataset.tonecastOriginalLabel;
  }
}

async function getBackendBaseUrl(): Promise<string> {
  const stored = await chrome.storage.sync.get({ backendBaseUrl: "http://localhost:8787" });
  return typeof stored.backendBaseUrl === "string"
    ? stored.backendBaseUrl
    : "http://localhost:8787";
}
