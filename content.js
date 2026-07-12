(() => {
  const OVERLAY_ID = "inbox-parade-extension-overlay";
  const STATE_KEY = "__INBOX_PARADE_EXTENSION_STATE__";
  const CLOSE_MESSAGE_TYPES = new Set([
    "INBOX_PARADE_CLOSE",
    "inbox-parade:close",
  ]);
  const READY_MESSAGE_TYPES = new Set([
    "INBOX_PARADE_READY",
    "inbox-parade:ready",
  ]);
  const OPEN_MESSAGE_TYPES = new Set([
    "INBOX_PARADE_OPEN_MESSAGE",
    "inbox-parade:open-message",
  ]);

  const existingState = window[STATE_KEY];
  if (existingState?.close) {
    existingState.close();
    return;
  }

  const orphanedOverlay = document.getElementById(OVERLAY_ID);
  if (orphanedOverlay) {
    orphanedOverlay.remove();
    return;
  }

  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Inbox Parade");
  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    zIndex: "2147483647",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    background: "transparent",
    opacity: "0",
    transition: "opacity 180ms ease-out",
  });

  const frame = document.createElement("iframe");
  frame.src = chrome.runtime.getURL("demo.html?embedded=1");
  frame.title = "Inbox Parade interactive demo";
  frame.allow = "autoplay";
  frame.tabIndex = 0;
  Object.assign(frame.style, {
    display: "block",
    width: "100%",
    height: "100%",
    border: "0",
    background: "transparent",
  });

  overlay.append(frame);
  document.documentElement.append(overlay);

  const previousFocus = document.activeElement;
  const previousBodyInert = document.body.inert;
  const previousBodyAriaHidden = document.body.getAttribute("aria-hidden");
  const rowByMessageId = new Map();
  const extraction = extractVisibleGmailMessages();
  document.body.inert = true;
  document.body.setAttribute("aria-hidden", "true");

  let closed = false;

  function close() {
    if (closed) {
      return;
    }

    closed = true;
    window.removeEventListener("keydown", handleKeydown, true);
    window.removeEventListener("message", handleMessage);
    overlay.remove();
    document.body.inert = previousBodyInert;
    if (previousBodyAriaHidden === null) {
      document.body.removeAttribute("aria-hidden");
    } else {
      document.body.setAttribute("aria-hidden", previousBodyAriaHidden);
    }
    if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
      previousFocus.focus({ preventScroll: true });
    }

    if (window[STATE_KEY]?.close === close) {
      delete window[STATE_KEY];
    }
  }

  function handleKeydown(event) {
    if (event.key !== "Escape") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    close();
  }

  function handleMessage(event) {
    const messageType =
      typeof event.data === "string" ? event.data : event.data?.type;

    if (
      event.source === frame.contentWindow &&
      CLOSE_MESSAGE_TYPES.has(messageType)
    ) {
      close();
      return;
    }

    if (
      event.source === frame.contentWindow &&
      READY_MESSAGE_TYPES.has(messageType)
    ) {
      sendVisibleMessages();
      return;
    }

    if (
      event.source === frame.contentWindow &&
      OPEN_MESSAGE_TYPES.has(messageType)
    ) {
      const row = rowByMessageId.get(String(event.data?.messageId || ""));
      if (!row) {
        return;
      }
      close();
      requestAnimationFrame(() => row.click());
    }
  }

  function sendVisibleMessages() {
    if (!frame.contentWindow) {
      return;
    }

    frame.contentWindow.postMessage(
      {
        type: "INBOX_PARADE_DATA",
        source: extraction.status,
        messages: extraction.messages,
      },
      "*",
    );
  }

  function extractVisibleGmailMessages() {
    const selectors = [
      "tr.zA",
      "[role='main'] tr[role='link']",
      "[role='main'] tr[data-legacy-thread-id]",
    ];
    const rows = [...new Set(selectors.flatMap((selector) => [...document.querySelectorAll(selector)]))];
    const todayRows = [];
    const otherRows = [];

    rows.forEach((row, index) => {
      const subjectNode = row.querySelector(".bog, [data-thread-id] .bog, [role='link'] [data-legacy-thread-id]");
      const senderNode = row.querySelector(".yW span[email], .yX.xY span[email], [data-hovercard-id], .yW span, .yX.xY span");
      const snippetNode = row.querySelector(".y2");
      const timeNode = row.querySelector(".xW span[title], .xW span, td.xW, [data-tooltip*='AM'], [data-tooltip*='PM']");

      const sender = cleanText(senderNode?.getAttribute("name") || senderNode?.textContent);
      const senderIdentity = cleanText(
        senderNode?.getAttribute("email") || senderNode?.getAttribute("data-hovercard-id") || sender,
      ).toLowerCase();
      const subject = cleanText(subjectNode?.textContent);
      const snippet = cleanText(snippetNode?.textContent).replace(/^\s*[-–—]\s*/, "");
      const time = cleanText(timeNode?.textContent || timeNode?.getAttribute("title"));

      if (!sender || !subject) {
        return;
      }

      const combined = `${sender} ${subject} ${snippet}`.toLowerCase();
      const category = classifyMessage(combined);
      const messageId = row.getAttribute("data-legacy-thread-id") || row.getAttribute("data-thread-id") || `visible-gmail-${index}-${hashText(`${sender}-${subject}`)}`;
      const record = {
        id: messageId,
        sender,
        senderKey: hashText(senderIdentity),
        subject,
        snippet,
        time: time || "Today",
        unread: row.classList.contains("zE") || Number.parseInt(getComputedStyle(senderNode || row).fontWeight, 10) >= 600,
        category,
      };
      rowByMessageId.set(String(messageId), row);

      if (/\b\d{1,2}:\d{2}\b|\b(?:AM|PM)\b/i.test(time)) {
        todayRows.push(record);
      } else {
        otherRows.push(record);
      }
    });

    // Gmail renders today's messages with a clock time and older messages with a date.
    // If that signal is unavailable in a layout variant, use the visible rows rather
    // than returning an empty parade.
    const hasRecognizableDates = otherRows.some((message) => message.time !== "Today");
    if (todayRows.length) {
      return { status: "visible-gmail", messages: todayRows.slice(0, 12) };
    }

    // If Gmail clearly rendered older dates and no clock times, today is empty.
    // Only use all visible rows when a layout variant gave us no date signal at all.
    if (hasRecognizableDates) {
      return { status: "empty-today", messages: [] };
    }
    if (otherRows.length) {
      return { status: "visible-gmail", messages: otherRows.slice(0, 12) };
    }
    return { status: rows.length ? "could-not-read" : "could-not-read", messages: [] };
  }

  function classifyMessage(text) {
    if (/\b(receipt|invoice|payment|charged|billing|order|refund|statement)\b/.test(text)) return "money";
    if (/calendar|meeting|schedule|tomorrow|today at|invite|appointment|zoom|session/.test(text)) return "plans";
    if (/approval|approve|deadline|urgent|review|by \d|action required|needs your/.test(text)) return "needs";
    if (/newsletter|weekly|digest|roundup|no-?reply|unsubscribe|all checks passed|notification/.test(text)) return "fyi";
    if (/\?|quick question|thoughts|can you|could you|are you/.test(text)) return "quick";
    return "fyi";
  }

  function cleanText(value = "") {
    return String(value).replace(/\s+/g, " ").trim();
  }

  function hashText(value) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
    }
    return hash.toString(36);
  }

  window[STATE_KEY] = { close };
  window.addEventListener("keydown", handleKeydown, true);
  window.addEventListener("message", handleMessage);

  frame.addEventListener("load", sendVisibleMessages, { once: true });

  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
  });
})();
