import React, { useState, useEffect } from 'react';
import './LandingHero.css';

const features = [
  { icon: '💬', title: 'AI Chat Assistant', desc: 'Ask anything about elections in plain English' },
  { icon: '📋', title: 'Visual Timeline', desc: 'Step-by-step election process explorer' },
  { icon: '🧩', title: 'Knowledge Quiz', desc: 'Test your civic knowledge interactively' },
  { icon: '⚖️', title: 'India vs USA', desc: 'Side-by-side system comparison' },
];

const facts = [
  "India's 2024 election had 968 million eligible voters 🇮🇳",
  "The US Electoral College has 538 total electors 🇺🇸",
  "India uses over 5.5 million EVMs per general election 🗳️",
  "A US candidate needs 270 electoral votes to win 🏛️",
  "India's MCC activates the moment election dates are announced 📋",
];

export default function LandingHero({ setView, setCountry }) {
  const [factIdx, setFactIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setFactIdx(i => (i + 1) % facts.length);
        setVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-wrap">
      {/* Background grid */}
      <div className="hero-grid" aria-hidden="true" />
      {/* Glow orbs */}
      <div className="orb orb1" aria-hidden="true" />
      <div className="orb orb2" aria-hidden="true" />

      <div className="hero-content">
        <div className="hero-badge badge badge-blue">⚡ PromptWars Virtual · Challenge 2</div>

        <h1 className="hero-title">
          Demystifying<br />
          <span className="hero-gradient">Democracy</span>
        </h1>

        <p className="hero-sub">
          Your interactive guide to understanding how elections work —<br />
          from nomination to inauguration, India &amp; USA explained simply.
        </p>

        <div className="hero-fact-box">
          <span className="fact-label">💡 Did you know?</span>
          <span className={`fact-text ${visible ? 'visible' : ''}`}>{facts[factIdx]}</span>
        </div>

        <div className="hero-actions">
          <button className="btn btn-primary hero-cta" onClick={() => setView('chat')}>
            <span>💬</span> Ask the AI Assistant
          </button>
          <button className="btn btn-outline" onClick={() => setView('timeline')}>
            <span>📋</span> Explore Timeline
          </button>
        </div>

        <div className="hero-countries">
          <span className="country-tag" onClick={() => { setCountry('India'); setView('timeline'); }}>
            🇮🇳 Indian Elections
          </span>
          <span className="country-tag" onClick={() => { setCountry('USA'); setView('timeline'); }}>
            🇺🇸 US Elections
          </span>
        </div>

        <div className="hero-features">
          {features.map(f => (
            <div key={f.title} className="hero-feature-card" onClick={() => setView(
              f.title.includes('Chat') ? 'chat' :
              f.title.includes('Timeline') ? 'timeline' :
              f.title.includes('Quiz') ? 'quiz' : 'compare'
            )}>
              <div className="hf-icon">{f.icon}</div>
              <div className="hf-info">
                <div className="hf-title">{f.title}</div>
                <div className="hf-desc">{f.desc}</div>
              </div>
              <div className="hf-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
