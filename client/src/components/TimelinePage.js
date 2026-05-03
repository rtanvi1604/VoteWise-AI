import React, { useState } from 'react';
import './TimelinePage.css';

export default function TimelinePage({ country, electionData }) {
  const [activeStep, setActiveStep] = useState(null);
  const data = electionData?.countries?.[country];

  if (!data) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      <div className="tl-header">
        <div>
          <h2 className="section-title">
            {country === 'India' ? '🇮🇳' : '🇺🇸'} {data.country} Election Timeline
          </h2>
          <p className="section-sub">{data.description}</p>
        </div>
      </div>

      {/* Fun Facts Ticker */}
      <div className="facts-bar">
        <span className="facts-label">⚡ Quick Facts</span>
        <div className="facts-scroll">
          {data.funFacts?.map((f, i) => (
            <span key={i} className="facts-item">{f}</span>
          ))}
        </div>
      </div>

      {/* Step-by-step accordion timeline */}
      <div className="timeline">
        {data.steps.map((step, idx) => (
          <div
            key={step.step}
            className={`tl-step ${activeStep === step.step ? 'open' : ''}`}
            onClick={() => setActiveStep(activeStep === step.step ? null : step.step)}
          >
            <div className="tl-connector">
              <div className="tl-dot">{step.step}</div>
              {idx < data.steps.length - 1 && <div className="tl-line" />}
            </div>
            <div className="tl-card">
              <div className="tl-card-header">
                <div className="tl-card-title">{step.title}</div>
                <div className="tl-card-meta">
                  <span className="badge badge-blue">{step.duration}</span>
                  <span className="tl-chevron">{activeStep === step.step ? '▲' : '▼'}</span>
                </div>
              </div>
              {activeStep === step.step && (
                <div className="tl-card-body">
                  <p className="tl-desc">{step.description}</p>
                  {step.keyFact && (
                    <div className="key-fact">
                      <span className="kf-icon">💡</span>
                      <span className="kf-text">{step.keyFact}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h3 className="faq-title">❓ Frequently Asked Questions</h3>
        <div className="faq-list">
          {data.faqs?.map(faq => (
            <FaqItem key={faq.id} faq={faq} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
      <div className="faq-q">
        <span>{faq.question}</span>
        <span className="faq-chevron">{open ? '▲' : '▼'}</span>
      </div>
      {open && <div className="faq-a">{faq.answer}</div>}
    </div>
  );
}
