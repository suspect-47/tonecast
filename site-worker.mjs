const page = String.raw`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="ToneCast makes every email worth listening to." />
    <title>ToneCast — Make every email worth listening to</title>
    <style>
      :root { --ink:#151029; --muted:#665e7b; --violet:#6a37df; --pink:#fb6d98; --cream:#fffaf4; --line:#e9e1f4; }
      * { box-sizing:border-box; } body { margin:0; color:var(--ink); background:var(--cream); font:16px/1.5 Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      .shell { overflow:hidden; } nav, main, footer { width:min(1120px, calc(100% - 40px)); margin:auto; } nav { height:82px; display:flex; align-items:center; justify-content:space-between; } .brand { display:flex; align-items:center; gap:10px; font-weight:850; font-size:24px; letter-spacing:-1px; } .mark { display:grid; place-items:center; width:37px; height:37px; color:white; background:linear-gradient(135deg,#8c5fff,#f76b99); border-radius:12px; font-size:19px; } .pill, .button { border:0; font:inherit; font-weight:750; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; } .pill { color:#fff; background:var(--ink); padding:11px 17px; border-radius:999px; }
      .hero { position:relative; padding:68px 0 96px; display:grid; grid-template-columns:1.05fr .95fr; gap:54px; align-items:center; } .eyebrow { display:inline-flex; border:1px solid #d8c9f5; color:#5931b3; border-radius:999px; padding:7px 12px; font-size:13px; font-weight:800; background:#f4edff; } h1 { max-width:690px; margin:17px 0; font-size:clamp(48px,6vw,78px); line-height:.99; letter-spacing:-.07em; } .gradient { background:linear-gradient(100deg,#7a3ee3,#f46f99); -webkit-background-clip:text; color:transparent; } .lead { max-width:555px; color:var(--muted); font-size:19px; } .actions { display:flex; gap:13px; flex-wrap:wrap; margin-top:28px; } .button { padding:14px 20px; border-radius:13px; } .primary { color:white; background:linear-gradient(100deg,#6633d8,#ed6194); box-shadow:0 14px 24px #9354bd44; } .secondary { color:var(--ink); background:white; border:1px solid var(--line); }
      .demo { background:#fff; border:1px solid var(--line); border-radius:26px; box-shadow:0 24px 60px #35235a1a; padding:22px; transform:rotate(2deg); } .window { display:flex; gap:6px; margin-bottom:19px; } .dot { width:9px; height:9px; border-radius:50%; background:#f1c2d1; } .dot:nth-child(2){background:#f5d486}.dot:nth-child(3){background:#b9dfc2}.label { color:var(--muted); font-size:12px; letter-spacing:.08em; text-transform:uppercase; font-weight:800; } .subject { margin:6px 0 14px; font-size:20px; font-weight:800; } .email { padding:16px; border-radius:15px; background:#fcf9ff; border:1px solid #f0eafa; color:#504866; font-size:14px; } .demo-footer { display:flex; gap:10px; align-items:center; justify-content:space-between; margin-top:16px; } .voice { display:flex; gap:9px; align-items:center; font-weight:800; font-size:13px; } .avatar { width:29px; height:29px; display:grid; place-items:center; border-radius:50%; background:#f7d8e6; } .listen { padding:9px 12px; color:#5a31b5; background:#f3ecff; border:0; border-radius:10px; cursor:pointer; font-weight:800; }
      .profile-section { padding:74px 0; background:#171028; color:#fff; } .profile-section .label { color:#bdb1d8; } h2 { margin:7px 0 25px; font-size:clamp(34px,4vw,50px); line-height:1.05; letter-spacing:-.05em; } .profiles { display:grid; grid-template-columns:repeat(3,1fr); gap:13px; } .profile { min-height:124px; padding:18px; color:#eae2fb; text-align:left; border:1px solid #372c50; border-radius:17px; background:#211932; cursor:pointer; font:inherit; } .profile.active { color:#21103e; background:linear-gradient(135deg,#f3dcff,#ffc6d9); border-color:#ffc6d9; } .profile strong,.profile span { display:block; } .profile strong { margin-bottom:5px; font-size:17px; } .profile span { color:inherit; opacity:.75; font-size:13px; } .rewrite { margin-top:23px; display:flex; justify-content:space-between; align-items:center; gap:20px; padding:19px; background:#2a213e; border-radius:17px; } .rewrite p { margin:2px 0 0; color:#c7bcd9; font-size:14px; }
      .features { padding:86px 0; } .feature-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; } .feature { padding:24px; min-height:208px; background:#fff; border:1px solid var(--line); border-radius:20px; } .icon { display:grid; place-items:center; width:41px; height:41px; margin-bottom:17px; background:#f3ecff; border-radius:12px; font-size:20px; } .feature h3 { margin:0 0 8px; font-size:20px; letter-spacing:-.03em; }.feature p { margin:0; color:var(--muted); }
      .cta { margin:0 auto 77px; padding:44px; text-align:center; color:#fff; background:linear-gradient(120deg,#6131ce,#ed6797); border-radius:27px; }.cta h2 { margin:0 0 13px; }.cta p { margin:0 auto 22px; max-width:500px; color:#f7edff; }.cta .secondary { border:0; }
      footer { padding:24px 0 38px; display:flex; justify-content:space-between; color:var(--muted); font-size:14px; } footer a { color:inherit; }
      @media (max-width:760px) { nav,main,footer { width:min(100% - 32px,1120px); } nav { height:70px; }.pill { display:none; }.hero { grid-template-columns:1fr; padding:38px 0 62px; gap:35px; }.demo { transform:none; }.profiles,.feature-grid { grid-template-columns:1fr; }.rewrite { align-items:flex-start; flex-direction:column; }.cta { padding:34px 20px; } footer { gap:10px; flex-direction:column; } }
    </style>
  </head>
  <body>
    <div class="shell">
      <nav><div class="brand"><span class="mark">✦</span> ToneCast</div><a class="pill" href="https://github.com/suspect-47/tonecast">View on GitHub ↗</a></nav>
      <main>
        <section class="hero">
          <div><span class="eyebrow">Email, with a personality</span><h1>Make every inbox <span class="gradient">worth listening to.</span></h1><p class="lead">ToneCast rewrites your Gmail drafts in a voice that fits the moment, then gives you a playable voice preview.</p><div class="actions"><a class="button primary" href="#demo">Try the demo ↓</a><a class="button secondary" href="https://github.com/suspect-47/tonecast">Explore the build ↗</a></div></div>
          <aside class="demo" aria-label="ToneCast email preview"><div class="window"><i class="dot"></i><i class="dot"></i><i class="dot"></i></div><div class="label">Before</div><div class="subject">Project update</div><div class="email">Hi team — sharing a quick update on where the project stands. We hit a few bumps, but we are still making progress.</div><div class="demo-footer"><div class="voice"><span class="avatar">✨</span><span>Recast in Tiny Chaos</span></div><button class="listen" data-speak>▶ Hear it</button></div></aside>
        </section>
      </main>
      <section class="profile-section" id="demo"><div style="width:min(1120px,calc(100% - 40px));margin:auto"><div class="label">Pick the energy</div><h2>Say it your way.<br/>Or someone else’s.</h2><div class="profiles" role="group" aria-label="Voice styles"><button class="profile active" data-profile="Tiny Chaos"><strong>✨ Tiny Chaos</strong><span>Playful, punchy, delightfully unhinged.</span></button><button class="profile" data-profile="Polished Popstar"><strong>🎤 Polished Popstar</strong><span>Confident, magnetic, main-character energy.</span></button><button class="profile" data-profile="🪨 Deadpan Pro"><strong>🪨 Deadpan Pro</strong><span>Dry, direct, absurdly composed.</span></button></div><div class="rewrite"><div><strong id="result-title">Tiny Chaos rewrote your draft</strong><p id="result-copy">"Quick update: the project is alive, caffeinated, and stubbornly moving forward."</p></div><button class="button primary" id="rewrite">Recast email ✦</button></div></div></section>
      <main><section class="features"><div class="label" style="color:#6a37df">Built for the glorious inbox</div><h2>From draft to encore.</h2><div class="feature-grid"><article class="feature"><div class="icon">✍️</div><h3>Paste your draft</h3><p>Drop in an email subject and body, with no complicated setup.</p></article><article class="feature"><div class="icon">🎭</div><h3>Choose a voice</h3><p>Pick an original style profile that fits the recipient and moment.</p></article><article class="feature"><div class="icon">🔊</div><h3>Play it back</h3><p>Turn the new draft into a voice preview before you hit send.</p></article></div></section><section class="cta"><h2>Your email has a better voice.</h2><p>Turn routine messages into a memorable moment—right from the inbox.</p><a class="button secondary" href="https://github.com/suspect-47/tonecast">See ToneCast on GitHub ↗</a></section></main>
      <footer><span>© 2026 ToneCast. Built for the hackathon.</span><a href="https://github.com/suspect-47/tonecast">suspect-47/tonecast ↗</a></footer>
    </div>
    <script>
      const tones = {
        'Tiny Chaos': 'Quick update: the project is alive, caffeinated, and stubbornly moving forward.',
        'Polished Popstar': 'Update: the project is making a confident, camera-ready entrance into its next chapter.',
        '🪨 Deadpan Pro': 'Update: work occurred. Progress was observed. The project remains technically operational.'
      };
      let active = 'Tiny Chaos';
      const title = document.querySelector('#result-title'); const copy = document.querySelector('#result-copy');
      document.querySelectorAll('[data-profile]').forEach(button => button.addEventListener('click', () => { active = button.dataset.profile; document.querySelectorAll('[data-profile]').forEach(x => x.classList.toggle('active', x === button)); title.textContent = active + ' rewrote your draft'; copy.textContent = '"' + tones[active] + '"'; }));
      document.querySelector('#rewrite').addEventListener('click', () => { copy.textContent = '"' + tones[active] + '"'; });
      document.querySelectorAll('[data-speak]').forEach(button => button.addEventListener('click', () => { if (!('speechSynthesis' in window)) return; window.speechSynthesis.cancel(); const note = new SpeechSynthesisUtterance('Quick update: the project is alive, caffeinated, and stubbornly moving forward.'); note.rate = 1.05; window.speechSynthesis.speak(note); button.textContent = 'Playing…'; setTimeout(() => button.textContent = '▶ Hear it', 2800); }));
    </script>
  </body>
</html>`;

export default {
  fetch() {
    return new Response(page, {
      headers: {
        "content-type": "text/html; charset=UTF-8",
        "cache-control": "public, max-age=300",
        "x-content-type-options": "nosniff",
      },
    });
  },
};
