import React, { useState, useEffect } from 'react';
import './App.css';
import LandingHero from './components/LandingHero';
import ChatAssistant from './components/ChatAssistant';
import TimelinePage from './components/TimelinePage';
import QuizPage from './components/QuizPage';
import ComparePage from './components/ComparePage';
import Navbar from './components/Navbar';

export default function App() {
  const [view, setView] = useState('home'); // home | chat | timeline | quiz | compare
  const [country, setCountry] = useState('India');
  const [electionData, setElectionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/election-data')
      .then(r => r.json())
      .then(d => { setElectionData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="splash">
      <div className="splash-inner">
        <div className="splash-icon">🗳️</div>
        <div className="splash-text">Loading ElectionGuide...</div>
        <div className="splash-bar"><div className="splash-fill" /></div>
      </div>
    </div>
  );

  return (
    <div className="app">
      {view !== 'home' && (
        <Navbar view={view} setView={setView} country={country} setCountry={setCountry} />
      )}

      {view === 'home' && (
        <LandingHero setView={setView} setCountry={setCountry} />
      )}
      {view === 'chat' && (
        <ChatAssistant country={country} setCountry={setCountry} electionData={electionData} />
      )}
      {view === 'timeline' && (
        <TimelinePage country={country} electionData={electionData} />
      )}
      {view === 'quiz' && (
        <QuizPage electionData={electionData} />
      )}
      {view === 'compare' && (
        <ComparePage electionData={electionData} />
      )}
    </div>
  );
}
