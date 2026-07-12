(() => {
  "use strict";

  const categories = {
    all: {
      label: "All shown",
      shortLabel: "All Shown",
      description: "Every visible character in this parade.",
      icon: "✦",
      color: "#ffd55c",
    },
    needs: {
      label: "Needs You",
      shortLabel: "Needs You",
      description: "Direct questions, deadlines, and approvals.",
      icon: "!",
      color: "#ff6b61",
    },
    quick: {
      label: "Quick Wins",
      shortLabel: "Quick Wins",
      description: "Tiny replies that clear satisfying space.",
      icon: "⚡",
      color: "#b8e65c",
    },
    plans: {
      label: "Plans",
      shortLabel: "Plans",
      description: "Meetings, dates, and places to be.",
      icon: "▦",
      color: "#9d84f4",
    },
    money: {
      label: "Money",
      shortLabel: "Money",
      description: "Receipts, invoices, and useful paper trails.",
      icon: "$",
      color: "#63cfe3",
    },
    rejections: {
      label: "Plot Twists",
      shortLabel: "Plot Twists",
      description: "Job and investor passes, bundled gently.",
      icon: "♪",
      color: "#ff9fc9",
    },
    fyi: {
      label: "FYI",
      shortLabel: "FYI",
      description: "Good news and leisurely reads.",
      icon: "☀",
      color: "#ffd55c",
    },
  };

  const replyStyleProfile = {
    label: "Your usual direct, warm style",
    greeting: "Hey",
    length: "brief-to-medium",
    warmth: "warm",
    directness: "high",
    emoji: "rare",
    signoff: "usually omitted in quick replies",
  };

  const originalMessages = [
    {
      id: "maya-launch",
      sender: "Maya Chen",
      senderInitials: "MC",
      subject: "Can you review the launch deck by 3?",
      snippet: "I added the new story slides and would love one last set of eyes…",
      time: "9:42 AM",
      unread: true,
      category: "needs",
      sceneType: "boss_deadline",
      relationship: "boss",
      character: "Blaze",
      kind: "fox",
      prop: "📣",
      body: "#ff735d",
      belly: "#ffe0c7",
      accent: "#ffd55c",
      summary: "Tiny deadline approaching! Maya needs your eyes on the launch deck before three.",
      spoken: "Tiny deadline approaching! Maya needs your eyes on the launch deck before three.",
      reason: "It asks you directly for a time-sensitive review.",
      primary: "Draft a reply",
      voice: { index: 2, pitch: 1.18, rate: 1.08 },
    },
    {
      id: "ana-budget",
      sender: "Ana Ruiz",
      senderInitials: "AR",
      subject: "Approval needed: event budget",
      snippet: "Everything is ready to book once the revised total gets a thumbs-up…",
      time: "9:18 AM",
      unread: true,
      category: "needs",
      character: "Ember",
      kind: "cat",
      prop: "📋",
      body: "#ff9f5a",
      belly: "#fff0cf",
      accent: "#ff9fc9",
      summary: "Ana needs one clear yes before the event budget can march forward.",
      spoken: "Approval checkpoint! Ana needs one clear yes before the event budget can march forward.",
      reason: "The project is waiting for your approval before it can proceed.",
      primary: "Review budget",
      voice: { index: 5, pitch: 1.04, rate: 0.96 },
    },
    {
      id: "nia-logo",
      sender: "Nia Patel",
      senderInitials: "NP",
      subject: "One quick question about the logo",
      snippet: "Should the tiny mark use coral or the darker ink color on cream?",
      time: "8:51 AM",
      unread: true,
      category: "quick",
      sceneType: "freelance_project",
      character: "Zip",
      kind: "frog",
      prop: "⚡",
      body: "#75d86f",
      belly: "#dff7a6",
      accent: "#b8e65c",
      summary: "This looks like a two-minute color choice. Ribbit, answer, done.",
      spoken: "This looks like a two minute color choice. Ribbit, answer, done!",
      reason: "It contains one simple question with a short answer.",
      primary: "Quick reply",
      voice: { index: 7, pitch: 1.3, rate: 1.16 },
    },
    {
      id: "dad-dinner",
      sender: "Dad",
      senderInitials: "D",
      subject: "Sunday dinner?",
      snippet: "Thinking six-ish. I can make the spicy noodles if you are around.",
      time: "8:24 AM",
      unread: false,
      category: "quick",
      sceneType: "weekend_dinner",
      character: "Pippa",
      kind: "pigeon",
      prop: "💌",
      body: "#f29ac2",
      belly: "#ffe1ee",
      accent: "#ffd55c",
      summary: "A very important dinner bird requests one cheerful yes or no.",
      spoken: "A very important dinner bird requests one cheerful yes or no.",
      reason: "It is personal, easy to answer, and probably delightful.",
      primary: "Say yes",
      voice: { index: 1, pitch: 1.12, rate: 0.9 },
    },
    {
      id: "zoe-rooftop",
      sender: "Zoe Kim",
      senderInitials: "ZK",
      subject: "Rooftop birthday Saturday — you in?",
      snippet: "Eight o’clock in Silver Lake. Bring a jacket and your most unserious dance move.",
      time: "8:18 AM",
      unread: true,
      category: "plans",
      sceneType: "weekend_party",
      reason: "It is an explicit weekend party invitation asking for an RSVP.",
    },
    {
      id: "ari-dune",
      sender: "Ari Shah",
      senderInitials: "AS",
      subject: "Dune at IMAX Sunday?",
      snippet: "There is a 6:20 showing. I can grab the middle seats if you are down.",
      time: "8:10 AM",
      unread: true,
      category: "plans",
      sceneType: "weekend_movie",
      movieGenre: "sci-fi",
      reason: "It names a movie, format, day, time, and asks whether you want a seat.",
    },
    {
      id: "marcus-jam",
      sender: "Marcus Bell",
      senderInitials: "MB",
      subject: "Design jam moved to 10 tomorrow",
      snippet: "Same room, new start time. I updated the calendar invitation too.",
      time: "8:02 AM",
      unread: true,
      category: "plans",
      character: "Peep",
      kind: "owl",
      prop: "📅",
      body: "#a890ef",
      belly: "#ece4ff",
      accent: "#ff9fc9",
      summary: "Schedule shuffle! Tomorrow’s design jam now starts at ten.",
      spoken: "Schedule shuffle! Tomorrow's design jam now starts at ten.",
      reason: "It changes the time of an upcoming calendar event.",
      primary: "View calendar",
      voice: { index: 4, pitch: 0.86, rate: 0.88 },
    },
    {
      id: "rejection-choir-demo",
      sender: "The No-Thanks Chorus",
      senderInitials: "♪",
      subject: "3 application plot twists, bundled gently",
      snippet: "Two job applications and one early-stage investor pass arrived today.",
      time: "7:58 AM",
      unread: true,
      category: "rejections",
      sceneType: "job_rejection_bundle",
      bundleCount: 3,
      bundleBreakdown: "2 job applications · 1 investor pass",
      reason: "Three visible messages use explicit pass or not-moving-forward language, so the demo groups them instead of making you relive each one.",
      replyNeeded: false,
      nextAction: "No reply needed. Their loss; the next door is already making suspiciously promising noises.",
      chorusParts: [
        { personaId: "rejection_chorus", text: "Three applications returned polite no-thank-yous." },
        { personaId: "warm_coworker", text: "Annoying. Deep breath." },
        { personaId: "freelance_frog", text: "The hallway still has more doors. Next door!" },
      ],
    },
    {
      id: "cloudcart-receipt",
      sender: "CloudCart",
      senderInitials: "CC",
      subject: "Your July receipt is ready",
      snippet: "Receipt number 88314 for your monthly workspace plan is attached.",
      time: "7:45 AM",
      unread: false,
      category: "money",
      character: "Beep",
      kind: "robot",
      prop: "🧾",
      body: "#62cde3",
      belly: "#d8f8ff",
      accent: "#ffd55c",
      summary: "Receipt secured. No action needed unless the numbers look funny.",
      spoken: "Receipt secured. No action needed unless the numbers look funny. Beep boop.",
      reason: "It is a completed purchase receipt with no requested action.",
      primary: "File receipt",
      voice: { index: 6, pitch: 0.68, rate: 0.86 },
    },
    {
      id: "buildbot-checks",
      sender: "BuildBot",
      senderInitials: "BB",
      subject: "All checks passed on Project Comet",
      snippet: "The latest build completed successfully. Twelve checks passed.",
      time: "7:16 AM",
      unread: false,
      category: "fyi",
      character: "Bolt",
      kind: "bot",
      prop: "✓",
      body: "#5c9df2",
      belly: "#d9eaff",
      accent: "#b8e65c",
      summary: "Everything passed. Bolt brought excellent robot news and zero chores.",
      spoken: "Everything passed. I brought excellent robot news and zero chores.",
      reason: "It is a successful automated status update with no action required.",
      primary: "Celebrate quietly",
      voice: { index: 3, pitch: 0.78, rate: 1.02 },
    },
    {
      id: "tiny-design-weekly",
      sender: "Tiny Design Weekly",
      senderInitials: "TD",
      subject: "Buttons are having a comeback",
      snippet: "Issue 42: playful interfaces, chunky borders, and why delight matters…",
      time: "6:48 AM",
      unread: true,
      category: "fyi",
      character: "Noodle",
      kind: "noodle",
      prop: "✨",
      body: "#f2ca4c",
      belly: "#fff2a6",
      accent: "#ff9fc9",
      summary: "Fresh inspiration, zero urgency. Save this one for snack time.",
      spoken: "Fresh inspiration, zero urgency. Save this one for snack time.",
      reason: "It is a newsletter: interesting, optional, and not time-sensitive.",
      primary: "Save for later",
      voice: { index: 0, pitch: 1.42, rate: 0.93 },
    },
  ];

  const characterSkins = {
    needs: [
      { character: "Blaze", kind: "fox", prop: "📣", body: "#ff735d", belly: "#ffe0c7", accent: "#ffd55c", voice: { index: 2, pitch: 1.18, rate: 1.08 } },
      { character: "Ember", kind: "cat", prop: "📋", body: "#ff9f5a", belly: "#fff0cf", accent: "#ff9fc9", voice: { index: 5, pitch: 1.04, rate: 0.96 } },
    ],
    quick: [
      { character: "Zip", kind: "frog", prop: "⚡", body: "#75d86f", belly: "#dff7a6", accent: "#b8e65c", voice: { index: 7, pitch: 1.3, rate: 1.16 } },
      { character: "Pippa", kind: "pigeon", prop: "💌", body: "#f29ac2", belly: "#ffe1ee", accent: "#ffd55c", voice: { index: 1, pitch: 1.12, rate: 0.9 } },
    ],
    plans: [
      { character: "Peep", kind: "owl", prop: "📅", body: "#a890ef", belly: "#ece4ff", accent: "#ff9fc9", voice: { index: 4, pitch: 0.86, rate: 0.88 } },
    ],
    money: [
      { character: "Beep", kind: "robot", prop: "🧾", body: "#62cde3", belly: "#d8f8ff", accent: "#ffd55c", voice: { index: 6, pitch: 0.68, rate: 0.86 } },
    ],
    fyi: [
      { character: "Bolt", kind: "bot", prop: "✓", body: "#5c9df2", belly: "#d9eaff", accent: "#b8e65c", voice: { index: 3, pitch: 0.78, rate: 1.02 } },
      { character: "Noodle", kind: "noodle", prop: "✨", body: "#f2ca4c", belly: "#fff2a6", accent: "#ff9fc9", voice: { index: 0, pitch: 1.42, rate: 0.93 } },
    ],
  };

  const voicePersonas = {
    grandiose_host: {
      label: "Roaming Reporter · grandiose & wry",
      shortLabel: "Roaming Reporter",
      description: "An original pompous correspondent voice for deadline theatre.",
      ...characterSkins.needs[0],
      character: "Dispatch Fox",
      prop: "🎙️",
    },
    deadline_fox: {
      label: "Deadline Fox · dramatic boss energy",
      shortLabel: "Deadline Fox",
      description: "Assertive and theatrical, never hostile.",
      ...characterSkins.needs[0],
    },
    warm_coworker: {
      label: "Warm Cat · friendly coworker",
      shortLabel: "Warm Coworker",
      description: "Friendly, conversational, and reassuring.",
      ...characterSkins.needs[1],
    },
    polished_client: {
      label: "Client Owl · polished & calm",
      shortLabel: "Polished Client",
      description: "Composed and articulate for client updates.",
      ...characterSkins.plans[0],
      prop: "💼",
    },
    freelance_frog: {
      label: "Freelance Frog · bright & energetic",
      shortLabel: "Freelance Frog",
      description: "Fast, optimistic project energy.",
      ...characterSkins.quick[0],
    },
    rejection_chorus: {
      label: "Velvet Nope Choir · gentle chaos",
      shortLabel: "Velvet Nope Choir",
      description: "A sympathetic call-and-response for grouped passes.",
      character: "The Nope Choir",
      kind: "chorus",
      prop: "♪",
      body: "#df8ed0",
      belly: "#ffe2f5",
      accent: "#ffd55c",
      voice: { index: 5, pitch: 1.14, rate: 0.96 },
    },
    party_hype: {
      label: "Disco Pigeon · party radio",
      shortLabel: "Disco Pigeon",
      description: "Upbeat weekend energy without inventing plan details.",
      ...characterSkins.quick[1],
      character: "Disco Pigeon",
      prop: "🪩",
    },
    cinema_narrator: {
      label: "Projector Owl · cinematic",
      shortLabel: "Projector Owl",
      description: "A genre-aware cinema usher for movie plans.",
      ...characterSkins.plans[0],
      character: "Projector Owl",
      prop: "🍿",
    },
    finance_bot: {
      label: "Finance Bot · precise",
      shortLabel: "Finance Bot",
      description: "Measured delivery for receipts and money mail.",
      ...characterSkins.money[0],
    },
    newsletter_noodle: {
      label: "Newsletter Noodle · whimsical",
      shortLabel: "Newsletter Noodle",
      description: "Upbeat radio-host energy for leisurely reads.",
      ...characterSkins.fyi[1],
      prop: "📰",
    },
    personal_pigeon: {
      label: "Personal Pigeon · gentle",
      shortLabel: "Personal Pigeon",
      description: "Warm and unhurried for friends and family.",
      ...characterSkins.quick[1],
    },
    neutral_bot: {
      label: "System Bot · neutral",
      shortLabel: "System Bot",
      description: "Clear and restrained for automated updates.",
      ...characterSkins.fyi[0],
    },
  };

  const defaultPersonaByCategory = {
    needs: "warm_coworker",
    quick: "warm_coworker",
    plans: "polished_client",
    money: "finance_bot",
    rejections: "rejection_chorus",
    fyi: "newsletter_noodle",
  };

  const VOICE_PROXY_BASE = "http://127.0.0.1:8787";

  const embedded = new URLSearchParams(window.location.search).get("embedded") === "1";

  const state = {
    messages: originalMessages.map((message) => ({ ...message })),
    selectedId: originalMessages[0].id,
    activeCategory: "all",
    handledIds: new Set(),
    soundEnabled: readStoredBoolean("inbox-parade-sound", true),
    senderPersonaOverrides: readStoredObject("inbox-parade-sender-personas-v1", {}),
    voiceBackend: "checking",
    lastVoiceCheck: 0,
    remotePersonas: {},
    voiceCache: new Map(),
    activeAudio: null,
    activeAudioUrl: null,
    activeVoiceRequest: null,
    activeSpeechPart: null,
    voiceLoadingId: null,
    replyVisibleIds: new Set(),
    replyVariantIndexes: new Map(),
    source: embedded ? "loading" : "sample",
    coachVisible: true,
    isOpen: false,
    transitioning: false,
    speakingId: null,
    voices: [],
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const timings = reducedMotion
    ? { cover: 40, reveal: 70, finish: 100 }
    : { cover: 570, reveal: 440, finish: 520 };

  const elements = {
    fakeGmail: document.getElementById("fakeGmail"),
    fakeMessageList: document.getElementById("fakeMessageList"),
    launchButton: document.getElementById("launchButton"),
    pixelCurtain: document.getElementById("pixelCurtain"),
    pixelGrid: document.getElementById("pixelGrid"),
    paradeApp: document.getElementById("paradeApp"),
    arrivalCount: document.getElementById("arrivalCount"),
    todayLabel: document.getElementById("todayLabel"),
    sourceMode: document.getElementById("sourceMode"),
    characterTrack: document.getElementById("characterTrack"),
    progressText: document.getElementById("progressText"),
    progressFill: document.getElementById("progressFill"),
    progressCard: document.getElementById("progressCard"),
    filterIcon: document.getElementById("filterIcon"),
    filterTitle: document.getElementById("filterTitle"),
    filterDescription: document.getElementById("filterDescription"),
    stageSubtitle: document.getElementById("stageSubtitle"),
    stageTitle: document.getElementById("stageTitle"),
    detailPanel: document.getElementById("detailPanel"),
    detailAccent: document.getElementById("detailAccent"),
    detailCategory: document.getElementById("detailCategory"),
    detailTime: document.getElementById("detailTime"),
    senderAvatar: document.getElementById("senderAvatar"),
    detailSender: document.getElementById("detailSender"),
    detailUnread: document.getElementById("detailUnread"),
    detailSubject: document.getElementById("detailSubject"),
    characterName: document.getElementById("characterName"),
    detailSummary: document.getElementById("detailSummary"),
    voiceButton: document.getElementById("voiceButton"),
    voiceButtonLabel: document.getElementById("voiceButtonLabel"),
    voiceCaption: document.getElementById("voiceCaption"),
    voiceServiceStatus: document.getElementById("voiceServiceStatus"),
    replyReveal: document.getElementById("replyReveal"),
    replyRevealLabel: document.getElementById("replyRevealLabel"),
    replyTone: document.getElementById("replyTone"),
    replyText: document.getElementById("replyText"),
    copyReplyButton: document.getElementById("copyReplyButton"),
    tryReplyToneButton: document.getElementById("tryReplyToneButton"),
    personaControlLabel: document.getElementById("personaControlLabel"),
    personaSelect: document.getElementById("personaSelect"),
    detailReason: document.getElementById("detailReason"),
    moveSelect: document.getElementById("moveSelect"),
    primaryAction: document.getElementById("primaryAction"),
    doneButton: document.getElementById("doneButton"),
    snoozeButton: document.getElementById("snoozeButton"),
    openButton: document.getElementById("openButton"),
    trustTitle: document.getElementById("trustTitle"),
    trustCopy: document.getElementById("trustCopy"),
    backButton: document.getElementById("backButton"),
    replayButton: document.getElementById("replayButton"),
    resetDemoButton: document.getElementById("resetDemoButton"),
    stageCoach: document.getElementById("stageCoach"),
    dismissCoachButton: document.getElementById("dismissCoachButton"),
    soundButton: document.getElementById("soundButton"),
    toast: document.getElementById("toast"),
    confetti: document.getElementById("confetti"),
    liveRegion: document.getElementById("liveRegion"),
  };

  let toastTimer;
  let ambientTimer;

  init();

  function init() {
    document.body.classList.toggle("embedded", embedded);
    applyPersonasToMessages(state.messages);
    buildPixelGrid();
    renderFakeInbox();
    populateMoveOptions();
    populatePersonaOptions();
    updateDate();
    updateSoundControl();
    renderAll();
    bindEvents();
    loadVoices();
    checkVoiceBackend();
    scheduleAmbientDelight();

    if (embedded) {
      window.parent.postMessage({ type: "INBOX_PARADE_READY" }, "*");
      window.setTimeout(enterParade, reducedMotion ? 20 : 180);
    }
  }

  function readStoredBoolean(key, fallback) {
    try {
      const value = window.localStorage.getItem(key);
      return value === null ? fallback : value === "true";
    } catch {
      return fallback;
    }
  }

  function readStoredObject(key, fallback) {
    try {
      const value = JSON.parse(window.localStorage.getItem(key) || "null");
      return value && typeof value === "object" && !Array.isArray(value) ? value : fallback;
    } catch {
      return fallback;
    }
  }

  function storeState() {
    try {
      window.localStorage.setItem("inbox-parade-sound", String(state.soundEnabled));
      window.localStorage.setItem("inbox-parade-sender-personas-v1", JSON.stringify(state.senderPersonaOverrides));
    } catch {
      // The demo still works if storage is unavailable.
    }
  }

  function buildPixelGrid() {
    const colors = ["#ff6b61", "#ffd55c", "#63cfe3", "#9d84f4", "#b8e65c", "#ff9fc9", "#243047"];
    const fragment = document.createDocumentFragment();
    const rows = 8;
    const columns = 12;

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const pixel = document.createElement("span");
        const wave = column * 14 + Math.abs(row - 4) * 10 + ((row * 19 + column * 7) % 35);
        const reverseWave = (columns - column) * 11 + Math.abs(row - 3) * 8 + ((row * 13 + column * 17) % 28);
        pixel.className = "pixel";
        pixel.style.setProperty("--pixel-color", colors[(row * 3 + column * 5) % colors.length]);
        pixel.style.setProperty("--cover-delay", `${wave}ms`);
        pixel.style.setProperty("--reveal-delay", `${reverseWave}ms`);
        fragment.append(pixel);
      }
    }

    elements.pixelGrid.append(fragment);
  }

  function renderFakeInbox() {
    elements.fakeMessageList.innerHTML = state.messages
      .map(
        (message) => `
          <div class="fake-message-row ${message.unread ? "unread" : ""}">
            <span aria-hidden="true">□</span>
            <span aria-hidden="true">☆</span>
            <span>${escapeHtml(message.sender)}</span>
            <span class="subject">${escapeHtml(message.subject)} <span>— ${escapeHtml(message.snippet)}</span></span>
            <time>${escapeHtml(message.time)}</time>
          </div>`,
      )
      .join("");
  }

  function renderAll() {
    ensureSelectionIsVisible();
    renderCharacters();
    renderStations();
    renderProgress();
    renderSourceMode();
    renderFilterBanner();
    renderDetail();
    elements.stageCoach.classList.toggle("is-hidden", !state.coachVisible);
  }

  function visibleMessages() {
    return state.messages.filter(
      (message) =>
        !state.handledIds.has(message.id) &&
        (state.activeCategory === "all" || message.category === state.activeCategory),
    );
  }

  function ensureSelectionIsVisible() {
    const visible = visibleMessages();
    if (!visible.length) {
      return;
    }
    if (!visible.some((message) => message.id === state.selectedId)) {
      state.selectedId = visible[0].id;
    }
  }

  function renderCharacters() {
    const visible = visibleMessages();
    if (!visible.length) {
      elements.characterTrack.innerHTML = `
        <div class="empty-lane">
          <span aria-hidden="true">✦</span>
          <strong>This lane is sparkling clean.</strong>
          <small>Pick another station or reset the demo.</small>
        </div>`;
      return;
    }

    elements.characterTrack.innerHTML = visible
      .map((message, visibleIndex) => {
        const order = visibleIndex;
        const selected = message.id === state.selectedId;
        return `
          <button
            class="mail-character ${selected ? "is-selected" : ""} ${message.bundleCount ? "is-bundle" : ""}"
            type="button"
            data-message-id="${message.id}"
            style="--body:${message.body};--belly:${message.belly};--accent:${message.accent};--order:${order}"
            aria-label="Select and play recap for ${message.unread ? "unread" : "read"} email from ${escapeHtml(message.sender)}: ${escapeHtml(message.subject)}"
            aria-pressed="${selected}"
            tabindex="${selected ? "0" : "-1"}"
          >
            <span class="character-art toon--${message.kind}" aria-hidden="true">
              ${message.bundleCount ? `<b class="bundle-badge">${message.bundleCount}</b><i class="bundle-echo one"></i><i class="bundle-echo two"></i>` : ""}
              <span class="character-shadow"></span>
              <span class="toon-tail"></span>
              <span class="toon-ear left"></span><span class="toon-ear right"></span>
              <span class="toon-antenna"></span>
              <span class="toon-leg left"></span><span class="toon-leg right"></span>
              <span class="toon-body">
                <span class="toon-eye left"></span><span class="toon-eye right"></span>
                <span class="toon-mouth"></span><span class="toon-belly"></span>
              </span>
              <span class="toon-arm left"></span><span class="toon-arm right"></span>
              <span class="toon-prop">${message.prop}</span>
            </span>
            <span class="character-label"><strong>${escapeHtml(message.sender)}</strong><small>${escapeHtml(message.subject)}</small></span>
          </button>`;
      })
      .join("");
  }

  function renderStations() {
    const unhandled = state.messages.filter((message) => !state.handledIds.has(message.id));
    Object.keys(categories).forEach((categoryId) => {
      const count = categoryId === "all" ? unhandled.length : unhandled.filter((message) => message.category === categoryId).length;
      const counter = document.getElementById(`count-${categoryId}`);
      if (counter) counter.textContent = String(count);
    });

    document.querySelectorAll(".station").forEach((button) => {
      const active = button.dataset.category === state.activeCategory;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function renderProgress() {
    const handled = state.handledIds.size;
    const total = state.messages.length;
    elements.progressText.textContent = `${handled} of ${total} hidden`;
    elements.progressFill.style.width = `${(handled / total) * 100}%`;
    elements.progressCard.setAttribute("aria-valuemax", String(total));
    elements.progressCard.setAttribute("aria-valuenow", String(handled));
    elements.progressCard.setAttribute("aria-valuetext", `${handled} of ${total} hidden from the parade`);
    const remaining = total - handled;
    elements.arrivalCount.textContent = state.source === "visible-gmail"
      ? `${remaining} visible message${remaining === 1 ? "" : "s"}`
      : `${remaining} sample message${remaining === 1 ? "" : "s"}`;
  }

  function renderSourceMode() {
    const sourceCopy = {
      loading: { badge: "LOADING", subtitle: "Reading only the message rows visible in this Gmail tab…" },
      "visible-gmail": { badge: "LIVE · LOCAL", subtitle: "Sorted locally from the sender, subject, and preview text visible on this Gmail screen." },
      "empty-today": { badge: "NO TODAY MAIL · SAMPLE", subtitle: "No messages from today are visible on this Gmail screen, so this is the sample cast." },
      "could-not-read": { badge: "SAMPLE · GMAIL UNTOUCHED", subtitle: "We couldn’t read this Gmail layout, so these are sample messages. Gmail is untouched." },
      sample: { badge: "SAMPLE MAIL", subtitle: "Eight fictional arrivals for exploring the interaction safely." },
    }[state.source] || { badge: "SAMPLE MAIL", subtitle: "Fictional messages for exploring the interaction safely." };
    elements.sourceMode.textContent = sourceCopy.badge;
    elements.stageSubtitle.textContent = sourceCopy.subtitle;
    elements.paradeApp.dataset.source = state.source;
  }

  function renderFilterBanner() {
    const category = categories[state.activeCategory];
    elements.filterIcon.textContent = category.icon;
    elements.filterIcon.style.background = category.color;
    elements.filterTitle.textContent = category.label;
    elements.filterDescription.textContent = category.description;
  }

  function renderDetail() {
    const message = state.messages.find((item) => item.id === state.selectedId) || state.messages[0];
    const category = categories[message.category];
    const handled = state.handledIds.has(message.id);

    elements.detailPanel.style.setProperty("--detail-color", category.color);
    elements.detailAccent.style.background = category.color;
    elements.detailCategory.textContent = category.shortLabel;
    elements.detailCategory.style.background = category.color;
    elements.detailTime.textContent = message.time;
    elements.senderAvatar.textContent = message.senderInitials;
    elements.senderAvatar.style.background = message.accent;
    elements.detailSender.textContent = message.sender;
    elements.detailUnread.classList.toggle("is-read", !message.unread);
    elements.detailSubject.textContent = message.subject;
    elements.characterName.textContent = `${message.character} says`;
    elements.detailSummary.textContent = handled ? `${message.character} is hidden from this temporary parade. Gmail is unchanged.` : message.spoken;
    elements.detailReason.textContent = message.reason;
    elements.moveSelect.value = message.category;
    elements.personaControlLabel.textContent = `Cast ${message.sender} as`;
    elements.personaSelect.value = state.senderPersonaOverrides[message.senderKey] || "auto";
    elements.primaryAction.textContent = handled ? "Hidden here ✦" : previewPrimaryLabel(message.category);
    elements.primaryAction.style.background = category.color;
    elements.primaryAction.disabled = handled;
    elements.doneButton.disabled = handled;
    elements.doneButton.innerHTML = handled ? "<span>✓</span> Hidden here" : "<span>✓</span> Hide from parade";
    const usingStudioVoice = state.voiceBackend === "online";
    const loadingVoice = state.voiceLoadingId === message.id;
    elements.voiceButtonLabel.textContent = state.speakingId === message.id
      ? loadingVoice ? "Cooking up the voice…" : "Stop character voice"
      : usingStudioVoice ? "Play ElevenLabs voice" : "Play local character voice";
    elements.voiceButton.setAttribute("aria-pressed", String(state.speakingId === message.id));
    const remotePersona = state.remotePersonas[message.personaId];
    elements.voiceCaption.textContent = state.speakingId === message.id
      ? state.activeSpeechPart || message.spoken
      : `${voicePersonas[message.personaId].shortLabel}${remotePersona?.voiceName ? ` · ${remotePersona.voiceName}` : ""}`;
    elements.voiceButton.classList.toggle("is-speaking", state.speakingId === message.id);
    elements.voiceServiceStatus.textContent = usingStudioVoice ? "11LABS" : state.voiceBackend === "checking" ? "CONNECTING" : "LOCAL";
    elements.voiceServiceStatus.className = `voice-service-status ${usingStudioVoice ? "is-studio" : state.voiceBackend === "checking" ? "is-connecting" : "is-offline"}`;
    elements.trustTitle.textContent = usingStudioVoice ? "Read-only Gmail · cloud voice" : "Read-only parade · private voice";
    elements.trustCopy.textContent = usingStudioVoice
      ? "When you press Play, only this displayed one-line preview is sent through the local bridge to ElevenLabs."
      : "Gmail won’t change · Browser voice stays on this device";
    const replyVisible = state.replyVisibleIds.has(message.id);
    const replyVariant = currentReplyVariant(message);
    elements.replyReveal.hidden = !replyVisible;
    elements.replyReveal.classList.toggle("is-no-reply", message.replyNeeded === false);
    elements.replyRevealLabel.textContent = message.replyNeeded === false ? "NO REPLY NEEDED" : "QUICK REPLY · UNLOCKED";
    elements.replyTone.textContent = message.replyNeeded === false ? "A gentler next step" : replyStyleProfile.label;
    elements.replyText.textContent = message.replyNeeded === false ? message.nextAction : replyVariant;
    elements.copyReplyButton.hidden = message.replyNeeded === false;
    elements.tryReplyToneButton.hidden = message.replyNeeded === false;
    const canOpenRealMessage = state.source === "visible-gmail" && !message.bundleCount;
    elements.openButton.disabled = !canOpenRealMessage;
    elements.openButton.textContent = canOpenRealMessage ? "Open in Gmail ↗" : message.bundleCount ? "Grouped queue" : "Sample message";
  }

  function previewPrimaryLabel(category) {
    return {
      needs: "Preview reply idea",
      quick: "Preview quick reply",
      plans: "Preview calendar note",
      money: "Preview filing idea",
      rejections: "Hear the gentle chorus",
      fyi: "Preview save-for-later",
    }[category] || "Preview next step";
  }

  function populateMoveOptions() {
    elements.moveSelect.innerHTML = Object.entries(categories)
      .filter(([id]) => id !== "all")
      .map(([id, category]) => `<option value="${id}">${category.shortLabel}</option>`)
      .join("");
  }

  function populatePersonaOptions() {
    elements.personaSelect.innerHTML = [
      '<option value="auto">Auto character</option>',
      ...Object.entries(voicePersonas).map(
        ([id, persona]) => `<option value="${id}">${escapeHtml(persona.label)}</option>`,
      ),
    ].join("");
  }

  function applyPersonasToMessages(messages) {
    messages.forEach((message) => applyPersonaToMessage(message));
  }

  function applyPersonaToMessage(message) {
    message.senderKey = String(message.senderKey || stableHash(String(message.sender || "").toLowerCase()).toString(36));
    const override = state.senderPersonaOverrides[message.senderKey];
    const personaId = voicePersonas[override] ? override : inferPersonaId(message);
    message.personaId = personaId;
    Object.assign(message, voicePersonas[personaId]);
    message.spoken = buildPersonaSpokenLine(message, personaId);
    return message;
  }

  function buildPersonaSpokenLine(message, personaId) {
    const sender = String(message.sender || "A sender").trim();
    const subject = String(message.subject || "a new message").replace(/[.!?]+$/, "").trim();
    const lines = {
      deadline_fox: `Priority ping! ${sender} sent “${subject}.” Give it a look when you can.`,
      warm_coworker: `Friendly nudge from ${sender}: “${subject}.” We can handle this.`,
      polished_client: `A polished update has arrived from ${sender}, regarding “${subject}.”`,
      freelance_frog: `Fresh project ping! ${sender} sent “${subject}.” Hop to it when you're ready.`,
      finance_bot: `Money mail detected from ${sender}: “${subject}.” Numbers ready for review.`,
      newsletter_noodle: `Fresh inspiration from ${sender}: “${subject}.” Zero urgency, maximum noodle.`,
      personal_pigeon: `A little note from ${sender}: “${subject}.” Delivered gently.`,
      neutral_bot: `System update from ${sender}: “${subject}.” Beep. That is all.`,
    };
    return (lines[personaId] || lines.warm_coworker).slice(0, 320);
  }

  function inferPersonaId(message) {
    const sender = String(message.sender || "").toLowerCase();
    const text = `${message.sender || ""} ${message.subject || ""} ${message.snippet || ""}`.toLowerCase();
    if (/^(mom|mum|dad|grandma|grandpa|nana|papa|sister|brother)$/.test(sender.trim())) return "personal_pigeon";
    if (/\b(receipt|invoice|payment|charged|billing|statement|refund|order)\b/.test(text)) return "finance_bot";
    if (/newsletter|digest|roundup|edition|unsubscribe|weekly|daily/.test(text)) return "newsletter_noodle";
    if (/no-?reply|buildbot|checks passed|status update|security alert|notification/.test(text)) return "neutral_bot";
    if (/freelance|proposal|scope|milestone|deliverable|availability|portfolio|contract|brief/.test(text)) return "freelance_frog";
    return defaultPersonaByCategory[message.category] || "warm_coworker";
  }

  function changePersona(event) {
    const message = selectedMessage();
    const selectedPersona = event.target.value;
    if (selectedPersona === "auto") delete state.senderPersonaOverrides[message.senderKey];
    else if (voicePersonas[selectedPersona]) state.senderPersonaOverrides[message.senderKey] = selectedPersona;
    else return;

    state.messages
      .filter((item) => item.senderKey === message.senderKey)
      .forEach((item) => applyPersonaToMessage(item));
    storeState();
    stopSpeech();
    renderAll();
    replayEntrance(false);
    const updated = selectedMessage();
    showToast(`${updated.sender} is now cast as ${voicePersonas[updated.personaId].shortLabel}.`);
  }

  function updateDate() {
    elements.todayLabel.textContent = new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    }).format(new Date());
  }

  function bindEvents() {
    elements.launchButton?.addEventListener("click", enterParade);
    elements.backButton.addEventListener("click", exitParade);
    elements.replayButton.addEventListener("click", () => replayEntrance(true));
    elements.resetDemoButton.addEventListener("click", resetDemo);
    elements.dismissCoachButton.addEventListener("click", () => {
      state.coachVisible = false;
      elements.stageCoach.classList.add("is-hidden");
      selectedCharacterElement()?.focus({ preventScroll: true });
    });
    elements.soundButton.addEventListener("click", toggleSound);
    elements.voiceButton.addEventListener("click", playSelectedVoice);
    elements.copyReplyButton.addEventListener("click", copyQuickReply);
    elements.tryReplyToneButton.addEventListener("click", tryAnotherReplyTone);
    elements.doneButton.addEventListener("click", markSelectedDone);
    elements.primaryAction.addEventListener("click", runPrimaryAction);
    elements.snoozeButton.addEventListener("click", snoozeSelected);
    elements.openButton.addEventListener("click", openOriginal);
    elements.moveSelect.addEventListener("change", moveSelected);
    elements.personaSelect.addEventListener("change", changePersona);

    elements.characterTrack.addEventListener("click", (event) => {
      const character = event.target.closest(".mail-character");
      if (!character) return;
      const wasSpeaking = state.speakingId === character.dataset.messageId;
      selectMessage(character.dataset.messageId, true);
      if (wasSpeaking) return;
      if (!state.soundEnabled) {
        showToast("Voices are off. The character is selected without sending text for audio.");
        return;
      }
      window.setTimeout(() => {
        if (state.selectedId === character.dataset.messageId) void playSelectedVoice();
      }, reducedMotion ? 0 : 120);
    });

    document.querySelector(".station-dock").addEventListener("click", (event) => {
      const station = event.target.closest(".station");
      if (!station) return;
      setCategory(station.dataset.category);
    });

    window.addEventListener("keydown", handleKeyboard);
    window.addEventListener("message", receiveVisibleGmailData);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        state.speakingId = null;
        renderDetail();
      }
    });
  }

  function receiveVisibleGmailData(event) {
    if (!embedded || event.source !== window.parent || event.data?.type !== "INBOX_PARADE_DATA") {
      return;
    }

    const incoming = Array.isArray(event.data.messages) ? event.data.messages : [];
    const normalized = incoming.slice(0, 12).map(normalizeVisibleMessage).filter(Boolean);
    state.source = ["visible-gmail", "empty-today", "could-not-read"].includes(event.data.source)
      ? event.data.source
      : "could-not-read";
    if (!normalized.length) {
      state.messages = originalMessages.map((message) => ({ ...message }));
      applyPersonasToMessages(state.messages);
      state.handledIds.clear();
      state.activeCategory = "all";
      state.selectedId = state.messages[0].id;
      renderAll();
      if (state.isOpen) {
        showToast(state.source === "empty-today"
          ? "No messages from today are visible, so the sample cast came out to play."
          : "This Gmail layout could not be read. Showing clearly labeled sample mail instead.");
      }
      return;
    }

    state.source = "visible-gmail";
    originalMessages.splice(0, originalMessages.length, ...normalized.map((message) => ({ ...message })));
    state.messages = normalized;
    state.handledIds.clear();
    state.activeCategory = "all";
    state.selectedId = normalized[0].id;
    renderAll();

    if (state.isOpen) {
      replayEntrance(false);
      showToast(`${normalized.length} visible Gmail message${normalized.length === 1 ? "" : "s"} joined the parade.`);
    }
  }

  function normalizeVisibleMessage(message, index) {
    const sender = String(message?.sender || "").trim();
    const subject = String(message?.subject || "").trim();
    if (!sender || !subject) return null;

    const category = categories[message.category] && message.category !== "all" ? message.category : "fyi";
    const summary = buildLocalSummary(category, sender, subject);

    return applyPersonaToMessage({
      id: String(message.id || `visible-${index}-${stableHash(`${sender}-${subject}`)}`),
      sender,
      senderKey: String(message.senderKey || stableHash(sender.toLowerCase()).toString(36)),
      senderInitials: sender
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "M",
      subject,
      snippet: String(message.snippet || "").trim(),
      time: String(message.time || "Today").trim(),
      unread: Boolean(message.unread),
      category,
      summary,
      spoken: summary,
      reason: localReason(category),
      primary: localPrimary(category),
    });
  }

  function buildLocalSummary(category, sender, subject) {
    const cleanSubject = subject.replace(/[.!?]+$/, "");
    const templates = {
      needs: `Heads up! ${sender} has something that looks time-sensitive: ${cleanSubject}.`,
      quick: `A small reply from ${sender} could send “${cleanSubject}” happily on its way.`,
      plans: `Calendar creature incoming! ${sender} sent: ${cleanSubject}.`,
      money: `Paper trail secured from ${sender}: ${cleanSubject}.`,
      fyi: `No sirens here. ${sender} sent “${cleanSubject}” for whenever you have room.`,
    };
    return templates[category];
  }

  function localReason(category) {
    return {
      needs: "The visible subject includes review, approval, deadline, or action language.",
      quick: "The visible subject looks like a direct question or short response.",
      plans: "The visible subject mentions a schedule, meeting, date, or invitation.",
      money: "The visible subject resembles a receipt, invoice, payment, or order.",
      fyi: "The visible subject looks informational and does not request immediate action.",
    }[category];
  }

  function localPrimary(category) {
    return {
      needs: "Draft a reply",
      quick: "Quick reply",
      plans: "View calendar",
      money: "File receipt",
      fyi: "Save for later",
    }[category];
  }

  function stableHash(value) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
    }
    return hash;
  }

  function enterParade() {
    if (state.transitioning || state.isOpen) return;
    state.transitioning = true;
    elements.fakeGmail?.classList.add("is-dimming");
    startCover();

    window.setTimeout(() => {
      state.isOpen = true;
      document.body.classList.add("parade-open");
      elements.paradeApp.classList.add("is-active");
      elements.paradeApp.setAttribute("aria-hidden", "false");
      elements.fakeGmail?.classList.add("is-hidden");
      elements.fakeGmail?.setAttribute("aria-hidden", "true");
      renderAll();
      elements.paradeApp.classList.add("is-booting");
      window.setTimeout(() => elements.paradeApp.classList.add("chute-primed"), reducedMotion ? 0 : 120);
      window.setTimeout(() => elements.paradeApp.classList.add("cast-entering"), reducedMotion ? 0 : 260);
      window.setTimeout(() => elements.paradeApp.classList.add("is-ready"), reducedMotion ? 0 : 980);
      replayEntrance(false);
      startReveal();
    }, timings.cover);

    window.setTimeout(() => {
      finishCurtain();
      state.transitioning = false;
      elements.stageTitle.focus({ preventScroll: true });
      announce(`Inbox Parade opened with ${state.messages.length} ${state.source === "visible-gmail" ? "visible" : "sample"} messages. Choose a character for details. Press Escape to return to Gmail.`);
    }, timings.cover + timings.finish);
  }

  function exitParade() {
    if (state.transitioning || !state.isOpen) return;
    state.transitioning = true;
    stopSpeech();
    startCover();

    window.setTimeout(() => {
      if (embedded) {
        window.parent.postMessage({ type: "INBOX_PARADE_CLOSE" }, "*");
        return;
      }

      state.isOpen = false;
      document.body.classList.remove("parade-open");
      elements.paradeApp.classList.remove("is-active", "is-booting", "chute-primed", "cast-entering", "is-ready");
      elements.paradeApp.setAttribute("aria-hidden", "true");
      elements.fakeGmail?.classList.remove("is-hidden", "is-dimming");
      elements.fakeGmail?.setAttribute("aria-hidden", "false");
      startReveal();
    }, timings.cover);

    if (!embedded) {
      window.setTimeout(() => {
        finishCurtain();
        state.transitioning = false;
        elements.launchButton?.focus({ preventScroll: true });
      }, timings.cover + timings.finish);
    }
  }

  function startCover() {
    elements.pixelCurtain.classList.remove("is-revealing");
    elements.pixelCurtain.classList.add("is-active");
    void elements.pixelCurtain.offsetWidth;
    elements.pixelCurtain.classList.add("is-covering");
  }

  function startReveal() {
    elements.pixelCurtain.classList.add("is-revealing");
    elements.pixelCurtain.classList.remove("is-covering");
  }

  function finishCurtain() {
    elements.pixelCurtain.classList.remove("is-active", "is-covering", "is-revealing");
  }

  function replayEntrance(showReplayToast = true) {
    const characters = [...elements.characterTrack.querySelectorAll(".mail-character")];
    characters.forEach((character) => character.classList.remove("entering"));
    void elements.characterTrack.offsetWidth;
    characters.forEach((character) => character.classList.add("entering"));
    if (showReplayToast === true) showToast("The parade is marching in again! ✦");
  }

  function selectMessage(id, restoreFocus = false) {
    state.selectedId = id;
    state.coachVisible = false;
    stopSpeech();
    renderAll();
    elements.detailPanel.classList.remove("is-swapping");
    void elements.detailPanel.offsetWidth;
    elements.detailPanel.classList.add("is-swapping");
    window.setTimeout(() => elements.detailPanel.classList.remove("is-swapping"), reducedMotion ? 0 : 260);
    const selected = elements.characterTrack.querySelector(`[data-message-id="${CSS.escape(id)}"]`);
    selected?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest", inline: "center" });
    if (restoreFocus) selected?.focus({ preventScroll: true });
    if (restoreFocus && window.innerWidth < 861) {
      elements.detailPanel.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    }
    const message = selectedMessage();
    announce(`Selected ${message.sender}: ${message.subject}. ${categories[message.category].label}. ${message.unread ? "Unread" : "Read"}.`);
  }

  function selectedCharacterElement() {
    return elements.characterTrack.querySelector(`[data-message-id="${CSS.escape(state.selectedId)}"]`);
  }

  function setCategory(categoryId) {
    if (!categories[categoryId]) return;
    state.activeCategory = categoryId;
    state.coachVisible = false;
    stopSpeech();
    renderAll();
    const count = visibleMessages().length;
    showToast(count ? `${categories[categoryId].label}: ${count} character${count === 1 ? "" : "s"} on stage.` : `${categories[categoryId].label} is already clear!`);
  }

  function markSelectedDone() {
    const message = selectedMessage();
    if (!message || state.handledIds.has(message.id)) return;
    const character = elements.characterTrack.querySelector(`[data-message-id="${CSS.escape(message.id)}"]`);
    character?.classList.add("is-leaving");
    elements.detailPanel.classList.add("is-stamping");
    stopSpeech();

    window.setTimeout(() => {
      state.handledIds.add(message.id);
      elements.detailPanel.classList.remove("is-stamping");

      const remainingInLane = state.messages.filter(
        (item) => !state.handledIds.has(item.id) && (state.activeCategory === "all" || item.category === state.activeCategory),
      );
      if (!remainingInLane.length && state.activeCategory !== "all") {
        const clearedLane = categories[state.activeCategory].label;
        state.activeCategory = "all";
        showToast(`${clearedLane} is clear. The station crew is cheering!`);
      } else {
        showToast(`${message.character} hid it from this parade. Gmail is unchanged.`);
      }

      const next = visibleMessages()[0] || state.messages.find((item) => !state.handledIds.has(item.id));
      if (next) state.selectedId = next.id;
      renderAll();
      launchConfetti(state.handledIds.size === state.messages.length ? 48 : 16);

      if (state.handledIds.size === state.messages.length) {
        showToast("The whole mailroom is clear! Magnificent. ✦");
      }
    }, reducedMotion ? 10 : 480);
  }

  function moveSelected(event) {
    const message = selectedMessage();
    const categoryId = event.target.value;
    if (!message || !categories[categoryId] || categoryId === "all") return;
    message.category = categoryId;
    if (!state.senderPersonaOverrides[message.senderKey]) applyPersonaToMessage(message);
    state.activeCategory = categoryId;
    stopSpeech();
    renderAll();
    replayEntrance(false);
    const destination = document.querySelector(`.station[data-category="${CSS.escape(categoryId)}"]`);
    destination?.classList.add("is-bumping");
    window.setTimeout(() => destination?.classList.remove("is-bumping"), reducedMotion ? 0 : 520);
    showToast(`${message.character} hopped over to ${categories[categoryId].label}.`);
    announce(`${message.character} moved to ${categories[categoryId].label}.`);
  }

  function snoozeSelected() {
    const message = selectedMessage();
    if (!message) return;
    message.category = "fyi";
    if (!state.senderPersonaOverrides[message.senderKey]) applyPersonaToMessage(message);
    state.activeCategory = "all";
    stopSpeech();
    renderAll();
    showToast(`${message.character} moved to FYI in this parade only.`);
  }

  function runPrimaryAction() {
    const message = selectedMessage();
    if (!message || state.handledIds.has(message.id)) return;
    if (message.category === "rejections") {
      if (state.speakingId !== message.id) void playSelectedVoice();
      return;
    }
    const actions = {
      needs: "Preview idea: acknowledge the request and confirm when you can respond.",
      quick: "Preview idea: answer the one visible question in a short sentence.",
      plans: "Preview idea: double-check the date and add it to your calendar.",
      money: "Preview idea: keep this receipt with your other purchase records.",
      rejections: "No reply needed. The chorus has bundled these gently.",
      fyi: "Preview idea: save this for a calmer reading moment.",
    };
    showToast(actions[message.category]);
  }

  function currentReplyVariant(message) {
    const variants = Array.isArray(message.replyVariants) && message.replyVariants.length
      ? message.replyVariants
      : buildReplyVariants(message);
    const index = state.replyVariantIndexes.get(message.id) || 0;
    return variants[index % variants.length];
  }

  function tryAnotherReplyTone() {
    const message = selectedMessage();
    const variants = Array.isArray(message.replyVariants) && message.replyVariants.length
      ? message.replyVariants
      : buildReplyVariants(message);
    const nextIndex = ((state.replyVariantIndexes.get(message.id) || 0) + 1) % variants.length;
    state.replyVariantIndexes.set(message.id, nextIndex);
    renderDetail();
    showToast(nextIndex === 0 ? "Back to your usual direct tone." : "Trying a slightly more playful version.");
  }

  async function copyQuickReply() {
    const message = selectedMessage();
    if (!message || message.replyNeeded === false) return;
    const draft = currentReplyVariant(message);
    try {
      await navigator.clipboard.writeText(draft);
      showToast("Draft copied. Nothing was sent.");
    } catch {
      showToast(`Draft ready to copy: ${draft}`);
    }
  }

  function openOriginal() {
    const message = selectedMessage();
    if (state.source !== "visible-gmail") {
      showToast("This is sample mail, so there is no Gmail message to open.");
      return;
    }
    window.parent.postMessage({ type: "INBOX_PARADE_OPEN_MESSAGE", messageId: message.id }, "*");
  }

  function resetDemo() {
    stopSpeech();
    state.messages = originalMessages.map((message) => ({ ...message }));
    applyPersonasToMessages(state.messages);
    state.handledIds.clear();
    state.activeCategory = "all";
    state.selectedId = state.messages[0].id;
    renderAll();
    replayEntrance(false);
    showToast("Hidden characters are back. Gmail was never changed.");
  }

  function selectedMessage() {
    return state.messages.find((message) => message.id === state.selectedId) || state.messages[0];
  }

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    if (!state.soundEnabled) stopSpeech();
    storeState();
    updateSoundControl();
    showToast(state.soundEnabled ? "Character voices are on." : "Character voices are muted.");
  }

  function updateSoundControl() {
    elements.soundButton.setAttribute("aria-pressed", String(state.soundEnabled));
    elements.soundButton.querySelector(".sound-label").textContent = state.soundEnabled ? "Voices on" : "Voices off";
    elements.soundButton.querySelector(".sound-icon").textContent = state.soundEnabled ? "♪" : "×";
  }

  function loadVoices() {
    if (!("speechSynthesis" in window)) return;
    const refresh = () => {
      state.voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang?.toLowerCase().startsWith("en"));
    };
    refresh();
    window.speechSynthesis.addEventListener?.("voiceschanged", refresh);
  }

  async function checkVoiceBackend() {
    state.voiceBackend = "checking";
    state.lastVoiceCheck = Date.now();
    renderDetail();
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 1800);
    try {
      const health = await fetch(`${VOICE_PROXY_BASE}/health`, { signal: controller.signal });
      if (!health.ok) throw new Error("voice bridge unavailable");
      const personaResponse = await fetch(`${VOICE_PROXY_BASE}/personas`, { signal: controller.signal });
      if (!personaResponse.ok) throw new Error("voice cast unavailable");
      const payload = await personaResponse.json();
      state.remotePersonas = Object.fromEntries(
        (Array.isArray(payload.personas) ? payload.personas : []).map((persona) => [persona.id, persona]),
      );
      state.voiceBackend = "online";
    } catch {
      state.voiceBackend = "offline";
      state.remotePersonas = {};
    } finally {
      window.clearTimeout(timeout);
      renderDetail();
    }
  }

  async function playSelectedVoice() {
    const message = selectedMessage();
    if (!state.soundEnabled) {
      showToast("Character voices are muted—turn Voices on to hear the cast.");
      return;
    }
    if (state.speakingId === message.id) {
      stopSpeech();
      return;
    }

    stopSpeech();
    state.speakingId = message.id;
    renderDetail();

    if (state.voiceBackend !== "online" && Date.now() - state.lastVoiceCheck > 5000) await checkVoiceBackend();
    if (state.speakingId !== message.id) return;
    if (state.voiceBackend === "online" && state.speakingId === message.id) {
      try {
        await playStudioVoice(message);
        return;
      } catch (error) {
        if (error?.name === "AbortError" || state.speakingId !== message.id) return;
        showToast("ElevenLabs voice is unavailable—using the private browser voice instead.");
      }
    }

    playLocalVoice(message);
  }

  async function playStudioVoice(message) {
    const cacheKey = `${message.personaId}:${stableHash(message.spoken)}`;
    let blob = state.voiceCache.get(cacheKey);
    if (!blob) {
      state.activeVoiceRequest = new AbortController();
      const response = await fetch(`${VOICE_PROXY_BASE}/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Inbox-Parade-Client": "v1",
        },
        body: JSON.stringify({ personaId: message.personaId, text: message.spoken.slice(0, 320) }),
        signal: state.activeVoiceRequest.signal,
      });
      if (!response.ok || !String(response.headers.get("content-type") || "").startsWith("audio/")) {
        throw new Error("invalid studio voice response");
      }
      blob = await response.blob();
      state.voiceCache.set(cacheKey, blob);
    }

    if (state.speakingId !== message.id) return;
    state.activeAudioUrl = URL.createObjectURL(blob);
    state.activeAudio = new Audio(state.activeAudioUrl);
    state.activeAudio.onended = finishSpeech;
    state.activeAudio.onerror = () => {
      cleanupActiveAudio();
      if (state.speakingId === message.id) {
        showToast("Studio playback stumbled—switching to the private browser voice.");
        playLocalVoice(message);
      }
    };
    await state.activeAudio.play();
  }

  function playLocalVoice(message) {
    if (!("speechSynthesis" in window)) {
      showToast("This browser does not expose a local speech voice, but the caption is ready.");
      finishSpeech();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.spoken);
    const voiceOptions = state.voices;
    if (voiceOptions.length) utterance.voice = voiceOptions[message.voice.index % voiceOptions.length];
    utterance.pitch = message.voice.pitch;
    utterance.rate = message.voice.rate;
    utterance.volume = 0.95;
    utterance.onend = finishSpeech;
    utterance.onerror = finishSpeech;
    state.speakingId = message.id;
    renderDetail();
    window.speechSynthesis.speak(utterance);
  }

  function finishSpeech() {
    cleanupActiveAudio();
    state.activeVoiceRequest = null;
    state.speakingId = null;
    renderDetail();
  }

  function cleanupActiveAudio() {
    if (state.activeAudio) {
      state.activeAudio.pause();
      state.activeAudio.src = "";
      state.activeAudio = null;
    }
    if (state.activeAudioUrl) {
      URL.revokeObjectURL(state.activeAudioUrl);
      state.activeAudioUrl = null;
    }
  }

  function stopSpeech() {
    state.activeVoiceRequest?.abort();
    state.activeVoiceRequest = null;
    cleanupActiveAudio();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    state.speakingId = null;
    elements.voiceButton?.classList.remove("is-speaking");
    elements.voiceButton?.setAttribute("aria-pressed", "false");
    if (elements.voiceButtonLabel) elements.voiceButtonLabel.textContent = state.voiceBackend === "online" ? "Play ElevenLabs voice" : "Play local character voice";
  }

  function handleKeyboard(event) {
    const target = event.target;
    const isFormControl = target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement;

    if (event.key === "Escape" && state.isOpen) {
      event.preventDefault();
      exitParade();
      return;
    }

    if (!state.isOpen) return;

    if (event.key === "Tab") {
      const focusable = [...elements.paradeApp.querySelectorAll('button:not([disabled]), select:not([disabled]), [tabindex="0"]')]
        .filter((element) => element.getClientRects().length > 0);
      if (focusable.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
      return;
    }

    if (isFormControl) return;

    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if (!(target instanceof Element) || !target.closest(".character-track")) return;
    event.preventDefault();
    const visible = visibleMessages();
    if (!visible.length) return;
    const currentIndex = Math.max(0, visible.findIndex((message) => message.id === state.selectedId));
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + delta + visible.length) % visible.length;
    selectMessage(visible[nextIndex].id);
    elements.characterTrack.querySelector(`[data-message-id="${CSS.escape(visible[nextIndex].id)}"]`)?.focus();
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    announce(message);
    toastTimer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 2600);
  }

  function announce(message) {
    elements.liveRegion.textContent = "";
    window.requestAnimationFrame(() => {
      elements.liveRegion.textContent = message;
    });
  }

  function launchConfetti(pieceCount = 48) {
    const colors = ["#ff6b61", "#ffd55c", "#63cfe3", "#9d84f4", "#b8e65c", "#ff9fc9"];
    const fragment = document.createDocumentFragment();
    elements.confetti.innerHTML = "";
    for (let index = 0; index < pieceCount; index += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = `${(index * 37) % 100}%`;
      piece.style.setProperty("--piece-color", colors[index % colors.length]);
      piece.style.setProperty("--piece-delay", `${(index * 29) % 260}ms`);
      piece.style.setProperty("--piece-drift", `${((index * 17) % 140) - 70}px`);
      fragment.append(piece);
    }
    elements.confetti.append(fragment);
    window.setTimeout(() => {
      elements.confetti.innerHTML = "";
    }, 1800);
  }

  function scheduleAmbientDelight() {
    if (reducedMotion) return;
    window.clearInterval(ambientTimer);
    ambientTimer = window.setInterval(() => {
      if (!state.isOpen || document.hidden || state.transitioning) return;
      const candidates = [...elements.characterTrack.querySelectorAll(".mail-character:not(.is-selected)")];
      if (!candidates.length) return;
      const character = candidates[Math.floor(Date.now() / 1000) % candidates.length];
      character.classList.add("is-surprising");
      window.setTimeout(() => character.classList.remove("is-surprising"), 900);
    }, 6500);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
