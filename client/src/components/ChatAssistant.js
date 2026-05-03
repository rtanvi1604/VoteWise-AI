import React, { useState, useEffect, useRef } from 'react';
import './ChatAssistant.css';

const SUGGESTIONS = {
  India: [
    "Show me the election timeline",
    "How does Chief Minister election work?",
    "For how many years does state assembly election occur?",
    "What is the Model Code of Conduct?",
    "What is an EVM and VVPAT?",
    "Who can vote in Indian elections?",
    "What happens after results are declared?",
    "Difference between Lok Sabha and Rajya Sabha?",
  ],
  USA: [
    "Show me the US election timeline",
    "How does the Electoral College work?",
    "What is a swing state?",
    "Who can vote in US elections?",
    "What is a primary election?",
    "Can a candidate win without the popular vote?",
    "How does Inauguration Day work?",
    "What is a Super PAC?",
  ]
};

function TypingIndicator() {
  return (
    <div className="message bot typing-msg">
      <div className="msg-avatar">🗳️</div>
      <div className="msg-bubble typing-bubble">
        <span /><span /><span />
      </div>
    </div>
  );
}

function MessageBubble({ msg }) {
  if (msg.role === 'user') {
    return (
      <div className="message user">
        <div className="msg-bubble user-bubble">{msg.text}</div>
        <div className="msg-avatar user-avatar">👤</div>
      </div>
    );
  }

  const { type, response } = msg;

  // AI response — plain text body
  if (type === 'ai') {
    return (
      <div className="message bot">
        <div className="msg-avatar">🗳️</div>
        <div className="msg-bubble bot-bubble">
          <div className="ai-badge">✨ AI</div>
          <div className="msg-body">{response.body}</div>
        </div>
      </div>
    );
  }

  if (type === 'timeline') {
    return (
      <div className="message bot">
        <div className="msg-avatar">🗳️</div>
        <div className="msg-bubble bot-bubble">
          <div className="msg-title">{response.title}</div>
          <div className="msg-body">{response.body}</div>
          <div className="mini-timeline">
            {response.steps?.map(s => (
              <div key={s.step} className="mini-step">
                <div className="mini-step-num">{s.step}</div>
                <div className="mini-step-info">
                  <div className="mini-step-title">{s.title}</div>
                  <div className="mini-step-desc">{s.description?.substring(0, 100)}…</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'step') {
    return (
      <div className="message bot">
        <div className="msg-avatar">🗳️</div>
        <div className="msg-bubble bot-bubble">
          <div className="step-badge">Step {response.step}</div>
          <div className="msg-title">{response.title}</div>
          <div className="msg-body">{response.body}</div>
        </div>
      </div>
    );
  }

  if (type === 'fallback') {
    return (
      <div className="message bot">
        <div className="msg-avatar">🗳️</div>
        <div className="msg-bubble bot-bubble">
          <div className="msg-title">{response.title}</div>
          <div className="msg-body">{response.body}</div>
          {response.suggestions && (
            <div className="fallback-suggestions">
              <div className="fallback-label">Try asking:</div>
              {response.suggestions.map(s => (
                <div key={s} className="fallback-chip">{s}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="message bot">
      <div className="msg-avatar">🗳️</div>
      <div className="msg-bubble bot-bubble">
        {response.title && <div className="msg-title">{response.title}</div>}
        <div className="msg-body">{response.body}</div>
        {response.extra && <div className="msg-extra">{response.extra}</div>}
      </div>
    </div>
  );
}

const WELCOME = {
  role: 'bot',
  type: 'info',
  response: {
    title: '👋 Welcome to ElectionGuide!',
    body: "I'm your AI-powered election education assistant. Ask me anything about elections in India or the USA — state assemblies, Chief Ministers, EVMs, the Electoral College, voter eligibility, and much more. I can answer in plain English!"
  }
};

export default function ChatAssistant({ country, setCountry }) {
  const [messages, setMessages] = useState([WELCOME]);
  // rawHistory stores {role, text} for sending to the API as conversation context
  const [rawHistory, setRawHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCountry, setActiveCountry] = useState(country);
  const bottomRef = useRef(null);

  useEffect(() => { setActiveCountry(country); }, [country]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const sendMessage = async (text) => {
    const query = (text || input).trim();
    if (!query) return;
    setInput('');

    const userMsg = { role: 'user', text: query };
    setMessages(m => [...m, userMsg]);
    setRawHistory(h => [...h, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          country: activeCountry,
          history: rawHistory  // send full conversation history for context
        })
      });
      const data = await res.json();
      const botMsg = { role: 'bot', type: data.type, response: data.response, country: data.country,
        // store plain text for history
        text: data.response?.body || data.response?.title || ''
      };
      setMessages(m => [...m, botMsg]);
      setRawHistory(h => [...h, { role: 'bot', text: botMsg.text }]);
    } catch {
      const errMsg = { role: 'bot', type: 'info', response: { title: 'Connection error', body: 'Could not reach the server. Please try again.' }, text: '' };
      setMessages(m => [...m, errMsg]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const switchCountry = (c) => {
    setActiveCountry(c);
    setCountry(c);
    setRawHistory([]);
    setMessages([{
      role: 'bot', type: 'info',
      response: { title: `Switched to ${c === 'India' ? '🇮🇳 India' : '🇺🇸 USA'}`, body: `Now answering questions about ${c === 'India' ? 'Indian elections — Lok Sabha, state assemblies, Chief Ministers, ECI' : 'US Presidential and Congressional elections'}. Ask me anything!` }
    }]);
  };

  const suggestions = SUGGESTIONS[activeCountry] || SUGGESTIONS.India;

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="chat-header-info">
          <h2 className="chat-title">💬 Election AI Assistant</h2>
          <p className="chat-subtitle">Powered by Gemini AI — ask anything about elections</p>
        </div>
        <div className="chat-country-toggle">
          <button className={`cct ${activeCountry === 'India' ? 'active' : ''}`} onClick={() => switchCountry('India')}>🇮🇳 India</button>
          <button className={`cct ${activeCountry === 'USA' ? 'active' : ''}`} onClick={() => switchCountry('USA')}>🇺🇸 USA</button>
        </div>
      </div>

      <div className="chat-body">
        <div className="messages-area">
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        <div className="suggestions-row">
          {suggestions.map(s => (
            <button key={s} className="suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>
          ))}
        </div>

        <div className="chat-input-row">
          <input
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Ask about ${activeCountry === 'India' ? 'Indian' : 'US'} elections — anything!`}
            disabled={loading}
          />
          <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
            {loading ? '⏳' : '→'}
          </button>
        </div>
      </div>
    </div>
  );
}
