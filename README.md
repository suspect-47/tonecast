# Inbox Parade

Inbox Parade is a dependency-free Chrome extension demo that turns a Gmail tab
into a full-screen, playful mail experience. Clicking the extension action
toggles an isolated `demo.html` iframe over Gmail; clicking it again, pressing
Escape, or asking the parent frame to close removes the experience cleanly.

The Gmail integration is intentionally local and read-only. When launched, it extracts only
the sender, subject, snippet, time, and unread state from message rows already
rendered in the current Gmail tab. By default that metadata stays inside the
tab and extension iframe: there is no Gmail API, OAuth flow, analytics, or
external AI call. The optional ElevenLabs bridge sends a displayed narration
line only after the user presses Play. If Gmail's current markup cannot be
read, the parade falls back to eight fictional sample messages.

## Run the extension

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode**.
3. Click **Load unpacked** and select this directory.
4. Open [Gmail](https://mail.google.com/).
5. Click the Inbox Parade extension icon.

Click the icon again or press Escape to return to Gmail. The keyboard shortcut
is **Command+Shift+Y** on macOS and **Ctrl+Shift+Y** elsewhere.

For a quick visual preview without installing the extension, serve this folder
locally and open `demo.html`. That standalone view includes a fictional inbox
and the same Start the Parade interaction.

## Files

- `manifest.json` declares the Manifest V3 extension, temporary `activeTab`
  access, the scripting permission, and the demo's web-accessible resources.
- `service-worker.js` responds to the extension action and injects
  `content.js` into the active Gmail tab.
- `content.js` owns the reversible full-screen iframe overlay and the small,
  local-only visible-row Gmail adapter.
- `demo.html`, `styles.css`, and `app.js` contain the visual experience.
- `IDEA.md` is the living product document and evolution log.

No build step, package manager, or external dependency is required.

## Embedded close contract

The iframe URL includes `?embedded=1`, so the demo can adapt its chrome when it
is running over Gmail. An in-demo close control can remove the overlay with:

```js
window.parent.postMessage({ type: "INBOX_PARADE_CLOSE" }, "*");
```

For convenience, the shell also accepts the type `inbox-parade:close` and
matching string payloads. Messages are accepted only from the injected iframe's
window.

## Permissions

- `activeTab` grants temporary access only after the user clicks the extension.
- `scripting` lets the service worker inject the toggle script into that tab.
- The action is limited to URLs under `https://mail.google.com/`.

If the icon is clicked elsewhere, its tab badge says `MAIL` as a reminder to
open Gmail.

## What the no-OAuth demo can and cannot do

The extension can sit on top of Gmail and read the rows currently present in
the page because `activeTab` grants temporary page access after an explicit
toolbar click. It identifies messages received today using Gmail's visible
clock-time convention and shows up to twelve of them.

This route is excellent for demonstrating the experience, but Gmail's private
HTML is not a stable product API. It may see only rows Gmail has loaded, and a
future Gmail redesign could require selector updates. Archive, snooze, labels,
and replies remain simulated. **Open in Gmail** is real: it closes the overlay
and opens the selected visible row. A durable public version would use the
Gmail API after a separate OAuth and privacy review.

## API keys

No API key is required for the extension, animation, local rule-based sorting,
or browser-provided character voices. An LLM key would only be needed for
optional semantic summaries and uncertain classification.

ElevenLabs studio voices are supported through `voice-server.mjs`. The key is
never placed in the extension, browser storage, source code, or Git. The bridge
binds only to `127.0.0.1`, discovers the voices available to the account,
assigns distinct voices to the character personas, streams audio on demand, and
falls back to the private browser voice if unavailable.

### Start ElevenLabs studio voices

If a key has ever been pasted into chat or source code, revoke it first. Create
a new ElevenLabs key restricted to voice-read and text-to-speech access, and set
a small credit quota.

In a terminal opened to this folder, place the replacement key in the
git-ignored `.env` file and start the bridge with:

```sh
node --env-file=.env voice-server.mjs
```

Do not commit `.env` or paste the replacement key into chat. The server prints
only status, persona, character count, and latency—it never logs the spoken
text.

Reload the unpacked extension after the manifest changes, open Gmail, and press
**Command+Shift+Y**. The detail panel shows `11LABS` when the bridge is ready.
Choose **Cast this sender as** to remember a local persona for that sender:

- Deadline Fox — dramatic boss energy
- Warm Cat — friendly coworker
- Client Owl — polished client
- Freelance Frog — energetic freelancer
- Finance Bot — precise money mail
- Newsletter Noodle — whimsical reading
- Personal Pigeon — gentle friends and family
- System Bot — neutral automated updates

When ElevenLabs is active, pressing Play sends only the displayed one-line
preview through the local bridge to ElevenLabs. That line contains the visible
sender display name and subject so the character can introduce the message.
Gmail is never modified; raw message bodies, snippets, email addresses,
attachments, threads, and API keys are not sent to ElevenLabs.
