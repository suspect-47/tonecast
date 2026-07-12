"use client";

import { useState } from "react";

const githubUrl = "https://github.com/suspect-47/tonecast";

const profiles = [
  { label: "Deadpan", glyph: "◔", className: "deadpan" },
  { label: "High energy", glyph: "✦", className: "energy" },
  { label: "Warm wit", glyph: "☻", className: "warm" },
];

export default function Home() {
  const [activeProfile, setActiveProfile] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const active = profiles[activeProfile];

  return (
    <main>
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="ToneCast home">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>ToneCast</span>
        </a>
        <a className="nav-link" href={githubUrl} target="_blank" rel="noreferrer">
          View on GitHub <span aria-hidden="true">↗</span>
        </a>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" /> Gmail’s most dramatic sidekick</p>
          <h1>Make your inbox<br /><em>worth listening to.</em></h1>
          <p className="hero-lede">
            ToneCast rewrites everyday email with a little more personality — then performs it back in a voice built for the moment.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href={githubUrl} target="_blank" rel="noreferrer">
              Get ToneCast <span aria-hidden="true">→</span>
            </a>
            <a className="button button-quiet" href="#how-it-works">
              See how it works <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="micro-copy">Chrome extension · Gmail overlay · voice playback</p>
        </div>

        <div className="hero-stage" aria-label="ToneCast email transformation demo">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="demo-card">
            <div className="demo-topbar">
              <span className="mail-badge">✉</span>
              <span>New message</span>
              <span className="demo-more">•••</span>
            </div>
            <div className="demo-meta">
              <span>To</span><strong>Praneel</strong>
            </div>
            <div className="demo-subject">We loved the vision. The vibes need more ARR.</div>
            <p className="demo-body">
              We loved your startup: real problem, strong team, working product. Frankly, that level of substance is refreshing.
            </p>
            <div className="demo-divider" />
            <div className="tonecast-panel">
              <div className="panel-title"><span className="tiny-mark">↯</span> ToneCast</div>
              <div className="profile-row" role="group" aria-label="Choose a demonstration profile">
                {profiles.map((profile, index) => (
                  <button
                    className={`profile-pill ${profile.className} ${index === activeProfile ? "selected" : ""}`}
                    key={profile.label}
                    onClick={() => setActiveProfile(index)}
                    type="button"
                  >
                    <span>{profile.glyph}</span>{profile.label}
                  </button>
                ))}
              </div>
              <div className="player-row">
                <button
                  className={`play-button ${isPlaying ? "playing" : ""}`}
                  onClick={() => setIsPlaying((value) => !value)}
                  type="button"
                  aria-pressed={isPlaying}
                >
                  <span aria-hidden="true">{isPlaying ? "Ⅱ" : "▶"}</span>
                  {isPlaying ? "Playing" : "Hear it"}
                </button>
                <div className={`sound-wave ${isPlaying ? "moving" : ""}`} aria-label={`${active.label} voice preview`}>
                  {[7, 14, 20, 12, 24, 17, 10, 19, 9, 15, 21, 11].map((height, index) => (
                    <i key={index} style={{ height }} />
                  ))}
                </div>
                <span className="timer">00:18</span>
              </div>
            </div>
          </div>
          <div className="floating-note note-top">written in your voice <span>✦</span></div>
          <div className="floating-note note-bottom">heard in theirs <span>↗</span></div>
        </div>
      </section>

      <section className="marquee" aria-label="ToneCast capabilities">
        <div>
          <span>REWRITE THE ENERGY</span><b>✦</b><span>KEEP THE INTENT</span><b>✦</b><span>HEAR THE DELIVERY</span><b>✦</b><span>REWRITE THE ENERGY</span><b>✦</b><span>KEEP THE INTENT</span><b>✦</b>
        </div>
      </section>

      <section className="features shell" id="how-it-works">
        <div className="section-heading">
          <p className="eyebrow">Tiny ritual. Big energy.</p>
          <h2>Your email, with<br />a <em>better entrance.</em></h2>
        </div>
        <div className="feature-grid">
          <article className="feature-card card-one">
            <span className="number">01</span>
            <div className="feature-icon">⌁</div>
            <h3>Catch the draft</h3>
            <p>ToneCast lives inside Gmail, ready whenever a normal sentence deserves a better second act.</p>
          </article>
          <article className="feature-card card-two">
            <span className="number">02</span>
            <div className="feature-icon">✎</div>
            <h3>Choose the energy</h3>
            <p>Pick a personality, adjust the intensity, and keep every date, ask, and important detail intact.</p>
          </article>
          <article className="feature-card card-three">
            <span className="number">03</span>
            <div className="feature-icon">◖</div>
            <h3>Press play</h3>
            <p>Hear the finished draft in a matching voice profile before your email ever leaves the building.</p>
          </article>
        </div>
      </section>

      <section className="quote-band">
        <div className="shell quote-wrap">
          <p className="quote-mark">“</p>
          <blockquote>For when “per my last email” needs a soundtrack.</blockquote>
          <p className="quote-byline">— ToneCast, probably</p>
        </div>
      </section>

      <section className="closing shell">
        <div>
          <p className="eyebrow"><span className="live-dot" /> Built for the inbox plot twist</p>
          <h2>Give your next<br />email a <em>voice.</em></h2>
        </div>
        <a className="button button-primary button-large" href={githubUrl} target="_blank" rel="noreferrer">
          Explore the project <span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer className="footer shell">
        <a className="brand" href="#top"><span className="brand-mark small" aria-hidden="true"><i /><i /><i /></span><span>ToneCast</span></a>
        <p>Draft boldly. Review kindly.</p>
        <a href={githubUrl} target="_blank" rel="noreferrer">suspect-47/tonecast ↗</a>
      </footer>
    </main>
  );
}
