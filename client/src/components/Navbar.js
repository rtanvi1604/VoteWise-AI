import React from 'react';
import './Navbar.css';

const navItems = [
  { id: 'chat', label: '💬 Ask AI', },
  { id: 'timeline', label: '📋 Timeline' },
  { id: 'quiz', label: '🧩 Quiz' },
  { id: 'compare', label: '⚖️ Compare' },
];

export default function Navbar({ view, setView, country, setCountry }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button className="nav-logo" onClick={() => setView('home')}>
          <span className="nav-logo-icon">🗳️</span>
          <span className="nav-logo-text">ElectionGuide</span>
        </button>

        <div className="nav-links">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-link ${view === item.id ? 'active' : ''}`}
              onClick={() => setView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="nav-country">
          <button
            className={`country-btn ${country === 'India' ? 'active' : ''}`}
            onClick={() => setCountry('India')}
          >🇮🇳 India</button>
          <button
            className={`country-btn ${country === 'USA' ? 'active' : ''}`}
            onClick={() => setCountry('USA')}
          >🇺🇸 USA</button>
        </div>
      </div>
    </nav>
  );
}
