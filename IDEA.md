# Inbox Parade

_Living product document — last updated 2026-07-12_

## One-line pitch

**Inbox Parade turns the daily inbox from a stressful spreadsheet into a playful cast of characters who explain what arrived and help you decide what deserves attention.**

Working title: **Inbox Parade**  
Alternate names worth testing: Mailroom Mischief, Inbox Pals, The Daily Mail Show, Mailbox Party.

## The original vision

The product begins as a Chrome extension used while Gmail is open. The user taps the extension and the ordinary Gmail mailbox slowly fades, dissolves, or pixelates away. In its place appears a fun, funky, cartoony world built from today's email.

Emails no longer look like rows in a table. They become distinct cartoon characters standing in a line, each with a recognizable personality, visual identity, voice, and reason for being there. The characters sort themselves into understandable groups, speak short summaries, and invite the user to interact with mail in a lighter, more human way.

The emotional goal is bigger than reskinning Gmail: checking email should feel like a short daily ritual or animated show rather than entering an administrative backlog.

## Product principles

1. **Delight before density.** The first moment should transform the emotional texture of the inbox.
2. **Clarity under the cartoon.** Every character must make the sender, subject, urgency, and next action easy to understand.
3. **A companion, not a replacement.** Gmail remains the source of truth, and the user can return to it instantly.
4. **Explain every sort.** The product says why an email is in a category instead of presenting opaque AI judgment.
5. **Privacy is part of the charm.** No surprise transmission of email content and no hidden background processing.
6. **User-controlled actions.** Characters may suggest; they do not silently send, delete, archive, or move real mail.
7. **Accessible fun.** Captions, keyboard support, contrast, and reduced-motion behavior are first-class features.

## Core interaction story

1. The user opens Gmail and clicks the Inbox Parade extension.
2. The extension control compresses like a physical button. A grid of colorful pixels spreads across the viewport as Gmail softens behind it.
3. The pixels clear to reveal a cheerful mailroom with a parade route and category stations.
4. Today's messages march in as characters. They introduce themselves visually and sort into stations with a short, readable explanation.
5. The most actionable character steps forward first and opens a speech bubble: a one-sentence summary, why it matters, and what the user can do next.
6. The user can select characters, filter by station, play a voice line, hide one from the temporary parade, move it to FYI in the parade, or open the corresponding original Gmail row.
7. As messages are hidden from this session’s parade, the scene gets calmer without implying that Gmail itself changed. Clearing a lane earns a small celebratory moment.
8. “Back to Gmail” reverses the transition and restores the familiar mailbox immediately.

The interaction should also work without animation or sound. The cartoon layer is additive, not required to understand or operate the experience.

## Design language

The visual reference is **Saturday-morning cartoon meets tiny mailroom**: joyful, tactile, slightly imperfect, and expressive without becoming visually noisy.

- Warm paper-cream environment with saturated category colors.
- Rounded forms, dark ink outlines, hard offset shadows, and subtle paper grain.
- A curved parade route rather than a corporate grid.
- Speech bubbles and physical props instead of dense metadata panels.
- Small moments of squash-and-stretch, blinking, waving, and hopping.
- System-rounded typography so the demo is self-contained and remains readable.
- Inline SVG or CSS characters rather than external art dependencies for the first demo.

The transition from Gmail should be reversible and non-destructive. The playful world is a full-screen layer; it should never depend on permanently rewriting Gmail's interface.

## Character and category system

Every message has two layers of identity:

- **Sender identity:** a stable body shape, palette, face, and signature accessory derived from the sender. Repeat senders should feel familiar over time.
- **Message role:** pose, expression, prop, and station reflect what this particular email is asking from the user.

The initial category set:

| Station | Meaning | Visual language | Example character energy |
| --- | --- | --- | --- |
| **Needs You** | Direct question, approval, deadline, or high-confidence required action | Coral/fire icon | Alert but helpful; clipboard, messenger bag |
| **Quick Wins** | Likely reply or task that can be completed quickly | Lime/lightning icon | Bouncy and encouraging; sneakers |
| **Plans** | Meetings, calendar changes, invitations, and scheduling | Violet/calendar icon | Organized and calm; calendar wings |
| **Money** | Receipts, invoices, orders, renewals, and financial notices | Cyan/coin icon | Precise and robotic; receipt printer |
| **FYI** | Newsletters, confirmations, automated status, and low-urgency reading | Yellow/rainbow icon | Relaxed and curious; sunglasses |

Starter cast for the demo:

- **Blaze**, a coral fox with a messenger bag — urgent requests.
- **Zip**, a green frog in sneakers — quick replies.
- **Peep**, a lavender calendar owl — plans and schedule changes.
- **Beep**, a cyan receipt robot — money and confirmations.
- **Noodle**, a yellow worm in sunglasses — newsletters and FYI mail.

Characters should never encode a moral judgment about the sender. “Urgent” means the message appears actionable, not that the person is aggressive. Users should be able to correct a category, and that correction should be treated as useful preference data in later versions.

## Voice strategy

Voice is personality, not a requirement to use the product.

### Demo phase

- Build short character lines locally from the sender, subject, and snippet already rendered in Gmail; use fictional sample lines only when extraction is unavailable.
- Prefer local browser speech synthesis or bundled prerecorded clips for a completely self-contained demo.
- Keep the spoken text visible in the speech bubble as captions.
- Give archetypes distinct pitch/rate/voice combinations without imitating real people.
- Generate speech only after the user presses Play; never autoplay a noisy inbox.

### ElevenLabs phase

- **Implemented as an optional local bridge for the demo.** It discovers the licensed voices already available to the user's ElevenLabs account and assigns a distinct voice to each archetype.
- Create or select original, licensed character voices rather than cloning senders.
- Send only a concise, user-visible narration line—not a raw message body or attachment.
- Make cloud narration explicitly opt-in, with a clear “this text will be sent” disclosure.
- Keep the ElevenLabs API key in the loopback bridge environment, never in the extension bundle, browser storage, source, or Git. A hosted product would replace the loopback bridge with an authenticated backend.
- Cache generated audio only in extension memory for the session and provide a browser-voice fallback.
- Allow a privacy mode that uses captions and local speech only.

The current voice cast is **Deadline Fox** (dramatic boss energy), **Warm Coworker**, **Polished Client**, **Freelance Frog**, **Finance Bot**, **Newsletter Noodle**, **Personal Pigeon**, and **System Bot**. Automatic casting uses visible message cues and the parade category. A user can override the cast for any sender; that choice is stored locally against a page-derived sender key rather than the raw email address and wins on later messages from the same sender. “Boss energy” describes the narrator's delivery, not the real sender's mood or intent.

The product should not make a private or serious message comedic without the user choosing that tone. Sensitive categories may use a calmer narrator and restrained animation.

## Privacy and trust decisions

Current non-negotiables:

- **The current demo is a real Manifest V3 Chrome extension overlay and remains read-only.** After an explicit toolbar click, `activeTab` allows it to inspect only the Gmail tab the user activated.
- Extraction happens locally from today's message rows that Gmail has already rendered. The demo reads only sender, subject, snippet, displayed time, and unread state; it does not fetch full messages or attachments.
- The default path has no Google OAuth flow, Gmail API access, cloud classifier, or message-content transmission. A fictional sample set appears if Gmail's selectors produce no usable rows.
- ElevenLabs is an optional, user-started loopback bridge. Only when Play is pressed does it receive and forward the same one-line narration shown in the UI. That line intentionally includes the visible sender display name and subject; it excludes raw bodies, snippets, email addresses, threads, and attachments.
- The ElevenLabs secret exists only in the bridge process environment. If a credential is pasted into chat or source, it is treated as exposed and must be revoked before use.
- **Hide from Parade**, **Move to FYI**, category changes, and reply previews affect only temporary parade state. They do not send, delete, archive, label, snooze, mark read, or otherwise mutate the real mailbox. **Open in Gmail** is the one real navigation action.
- Gmail remains hidden under or represented by a reversible visual layer; the original inbox is not permanently restyled.
- Any future real-mail integration starts with the minimum OAuth access needed and clearly explains why it is requested.
- Mail content is untrusted input. Raw email HTML is never inserted into the cartoon UI.
- Sorting output is a suggestion with a visible reason and a user correction path.
- No AI-generated output can cause a destructive or communicative action without an explicit user command and confirmation appropriate to the risk.
- Cloud AI and voice services are opt-in. The UI must reveal exactly what derived text leaves the device.
- Attachments are out of scope until their privacy and security model is deliberately designed.
- Analytics, if added, should measure product interactions rather than message content.

## Current demo scope

The demo is designed to prove the emotional transformation and interaction model through a working, local-only Chrome extension integration. It uses the visible Gmail page as input without becoming a Gmail API client.

Included:

- A working Manifest V3 extension launched from its toolbar action on Gmail.
- Temporary, user-initiated `activeTab` access rather than persistent broad page access.
- Local extraction of currently rendered rows identified as today's mail: sender, subject, snippet, displayed time, and unread state.
- A fictional sample-message fallback when Gmail is not open or its private row selectors fail.
- A full-screen, isolated overlay above the real Gmail tab.
- “Start the Parade” activation from the extension action.
- Pixel/fade transition into the cartoon mailroom.
- A responsive parade of unique email characters.
- Automatic sorting into the five stations above.
- Sender, subject, summary, sorting reason, and suggested action in a detail surface.
- Character selection, category filtering, and accessible keyboard interaction.
- Voice playback where the browser supports it, with captions.
- Optional ElevenLabs streaming voices through a `127.0.0.1` bridge, with eight sender-stable personas, local overrides, explicit cloud disclosure, in-memory audio caching, budget/rate limits, and automatic browser-speech fallback.
- Session-only **Hide from Parade**, **Move to FYI**, and reply-preview feedback, plus a real **Open in Gmail** row-opening handshake.
- A reversible return to the underlying Gmail inbox.
- Reduced-motion and mobile layouts.

Explicitly not included:

- Google OAuth, Gmail API authorization, or server-side retrieval of message data.
- Full message bodies, threads, labels, or attachments beyond the metadata currently visible in rendered rows.
- Real message mutations.
- Sending replies.
- Attachment parsing.
- Server-side AI classification or summarization.
- API secrets in the extension, repository, browser storage, or logs.
- A production-ready Chrome Web Store package.

## Path to a real Gmail extension

The safest evolution is incremental:

### Phase 1 — visible-inbox prototype

**Implemented in the current demo.** The Manifest V3 extension injects a self-contained overlay after the user clicks its toolbar action. With temporary `activeTab` access, it extracts only the metadata already rendered on the current Gmail screen and processes it locally. A sample fallback keeps the experience demoable if Gmail changes its private DOM, which is not a durable production interface.

### Phase 2 — read-only Gmail API

Add Google OAuth and retrieve today's messages through the Gmail API. Fetch the smallest useful set of headers/snippets, sort locally where possible, and open the original Gmail message for anything beyond the companion experience. Public distribution will require an OAuth consent flow, privacy policy, and potentially additional verification because inbox-reading scopes are sensitive or restricted.

### Phase 3 — explainable assistance

Introduce optional classification and summarization for ambiguous messages. Prefer on-device rules or models first; if a cloud model is used, show the derived text being sent and keep raw content exposure minimal. Add confidence states such as “Not sure—Plans or FYI?” rather than forcing every message into a confident category.

### Phase 4 — carefully scoped actions

Only after trust is established, request write access for specific features such as archive, mark read, apply label, or snooze. Use explicit actions, undo, and clear confirmation. Drafting and sending replies should be a separate permission and safety milestone.

## UX persona synthesis

This pass reviewed the extension through three complementary lenses:

### Novice and inbox-anxious

The playful transformation was immediately appealing, but realistic Gmail verbs and an invisible sample fallback made the demo feel more powerful—and therefore riskier—than it was. The first visit also presented too many equally prominent choices without explaining that each character represents one email. The resulting changes make provenance, safety, and the next action visible: an explicit live/sample source badge, a short first-run coach mark, sender-first character labels, and a persistent read-only trust strip. The former persistent “Done” behavior is now session-only **Hide from Parade**, so the extension cannot imply that an email was handled in Gmail.

### Accessibility and cognitive load

The core visual hierarchy was cheerful but busy, and keyboard users needed a more predictable path through an injected full-screen experience. The overlay now contains focus while open, restores focus to Gmail when closed, uses roving focus between characters, and announces live counts and state changes dynamically rather than with hard-coded totals. Motion remains additive: reduced-motion preferences suppress nonessential movement and preserve the same understandable content and controls.

### Playful motion and game feel

The first demo proved the art direction, but the cast needed more physical personality and clearer cause-and-effect. This pass adds a richer boot sequence, species-specific character movement, stamping and departure feedback for Parade-only hiding, animated station transitions, and ambient mailroom motion. These moments reinforce selection and progress without turning real email into an opaque game or changing the underlying mailbox.

### Decisions implemented from the audits

- **Source is always explicit.** Live Gmail rows and fictional samples have visibly different badges and copy; samples are never presented as silently extracted mail.
- **The first action is taught.** A coach mark explains that one character equals one email and points the user toward selecting a character, hearing its preview, or opening it in Gmail.
- **Identity starts with the sender.** Character labels prioritize the sender while keeping the playful character name secondary.
- **Read-only means read-only.** A persistent trust strip says that Gmail is not changed and that processing remains local to the tab.
- **Parade state cannot masquerade as mailbox state.** Hiding is session-only and named **Hide from Parade** rather than “Done,” “handled,” or “snoozed.”
- **Opening the source is real.** **Open in Gmail** now uses a parent-frame handshake to locate and activate the corresponding rendered Gmail row; when a match is unavailable, the interface reports that honestly.
- **Keyboard behavior is deliberate.** Focus is contained and restored, characters use roving focus, and announcements reflect the actual message count and current selection.
- **Animation communicates state.** Boot, species, stamp, station, and ambient animation provide delight and feedback, with reduced-motion safeguards throughout.
- **No LLM API key is required for this demo.** Local rules classify visible metadata, deterministic templates create short previews, and browser speech synthesis supplies voices. An LLM remains an optional future enhancement for ambiguous classification or richer summaries, subject to explicit consent and a clear data boundary; an ElevenLabs key would likewise belong in a backend, never in the extension.

## Success signals

For the demo:

- A new user understands the concept within ten seconds.
- The transition reliably produces a moment of delight.
- Users can identify what needs attention without opening every message.
- The sorting reasons feel understandable rather than magical.
- Users want to replay the entrance or meet the characters again.

For a future product:

- Users complete actionable mail with less perceived stress.
- Category corrections decrease as preferences are learned.
- Users retain control and understand when data leaves the device.
- The experience supports, rather than delays, real inbox work.

## Open product questions

1. Is this primarily a two-minute morning ritual, an alternate inbox used all day, or both?
2. Should each sender keep one permanent character, or should message intent sometimes override sender identity?
3. How many characters can appear before the parade becomes another overwhelming queue?
4. Should the initial sort organize by urgency, required effort, emotional tone, or a user-defined mix?
5. How playful should serious mail from healthcare, finance, legal, or family contexts become?
6. Does voice narration provide enough value to justify cloud processing, or should local/prerecorded voices remain the default?
7. Which first real action earns write access: archive, mark read, label, snooze, or draft reply?
8. Should completed characters disappear, move to a “resting room,” or stay visible as evidence of progress?
9. How should the product behave for accounts with hundreds of daily emails?
10. Is the strongest business model a consumer extension, a team wellbeing tool, or a character/IP platform?
11. How much customization should users have over category names, worlds, voices, and character styles?
12. What is the right fallback when classification confidence is low?

## Evolution log

### 2026-07-12

- Captured the founding concept: click a Chrome extension to pixelate a boring Gmail inbox into a lively, interactive cartoon mailbox.
- Chose **Inbox Parade** as the working title and centered the experience on email characters lining up and sorting themselves.
- Defined five understandable stations: Needs You, Quick Wins, Plans, Money, and FYI.
- Established the sender-plus-message-role character system and a starter cast of Blaze, Zip, Peep, Beep, and Noodle.
- Chose a reversible overlay as the intended product shape so Gmail stays the source of truth.
- Initially set the demo boundary to fictional messages and read-only, simulated interactions.
- Selected local browser speech or prerecorded lines as the demo-safe voice approach; positioned ElevenLabs as an opt-in later phase.
- Made explainable sorting, captions, reduced motion, user correction, and explicit control core product requirements.
- Outlined the progression from a visual demo to a Manifest V3 extension, read-only Gmail API access, optional AI assistance, and only later carefully scoped write actions.
- Implemented the first Chrome demo as a real Manifest V3 overlay on Gmail: a toolbar click grants temporary `activeTab` access, currently rendered rows for today's mail are read locally (sender, subject, snippet, displayed time, and unread state), and no OAuth or server is involved.
- Added fictional sample messages as a resilient fallback when Gmail's private selectors return no usable rows, while keeping every mailbox action simulated and non-mutating.
- Audited the experience through novice/inbox-anxious, accessibility/cognitive-load, and playful-motion personas; prioritized explicit provenance, a taught first action, honest read-only language, keyboard predictability, and motion that communicates state.
- Added live/sample source badges, a first-run coach mark, sender-first character labels, and a persistent local/read-only trust strip.
- Replaced persistent simulated completion with session-only **Hide from Parade** and connected **Open in Gmail** to a real parent-frame row-opening handshake.
- Added focus containment and restoration, roving character focus, dynamic live announcements, richer boot/species/stamp/station/ambient animation, and reduced-motion safeguards.
- Confirmed that the current experience requires no LLM API key: classification and previews remain local and deterministic. ElevenLabs is now an optional, explicitly triggered voice layer with a loopback secret boundary; a cloud LLM remains a possible future enhancement only for ambiguous sorting or richer summaries.
- Added the opt-in ElevenLabs voice bridge without putting a credential in the extension. It binds to loopback only, discovers account voices, streams speech on demand, applies rate and character budgets, and falls back to local browser speech.
- Defined eight voice-and-character personas and stable per-sender casting. Auto-casting uses explainable local rules; manual casting is remembered locally and takes precedence.
- Made the privacy boundary visible in the detail card: the exact narration line is captioned before playback, and only a Play press sends that line—containing display name and subject—to ElevenLabs.
- Chose not to use the credential pasted into chat. Exposed credentials must be revoked and replaced with a restricted, quota-limited key entered only into a hidden local terminal prompt.
