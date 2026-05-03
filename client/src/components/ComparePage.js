import React, { useState } from 'react';
import './ComparePage.css';

const COMPARE_ROWS = [
  { label: 'System Type', india: 'Parliamentary Democracy', usa: 'Presidential Republic' },
  { label: 'Head of Government', india: 'Prime Minister', usa: 'President' },
  { label: 'How Head is Elected', india: 'Indirectly — leader of Lok Sabha majority', usa: 'Indirectly — via Electoral College' },
  { label: 'Election System', india: 'First Past the Post (FPTP)', usa: 'Electoral College + FPTP per state' },
  { label: 'Legislature', india: 'Bicameral (Lok Sabha + Rajya Sabha)', usa: 'Bicameral (House + Senate)' },
  { label: 'Voting Method', india: 'Electronic Voting Machine (EVM)', usa: 'Varies by state (paper, optical scan, DRE)' },
  { label: 'Voter Registration', india: 'Automatic (Electoral Roll)', usa: 'Must self-register (varies by state)' },
  { label: 'Voting Age', india: '18+', usa: '18+' },
  { label: 'Election Frequency', india: 'Every 5 years (can be dissolved earlier)', usa: 'Every 4 years (fixed term)' },
  { label: 'Campaign Finance', india: 'ECI spending limits enforced', usa: 'No limits on Super PAC spending' },
  { label: 'Election Managed By', india: 'Election Commission of India (ECI)', usa: 'State Governments (50 separate systems)' },
  { label: 'Number of Parties', india: 'Multi-party (600+ registered)', usa: 'Dominant two-party system' },
  { label: 'Majority Required', india: '272 of 543 Lok Sabha seats', usa: '270 of 538 electoral votes' },
  { label: 'Polling Day', india: 'Multi-phase (spread over weeks)', usa: 'Single day (first Tue after first Mon in Nov)' },
  { label: 'Vote Counting', india: 'Centralized counting centers', usa: 'Decentralized by county/state' },
  { label: 'Independent Oversight', india: 'Strong ECI — very independent', usa: 'Varies; often partisan state officials' },
];

export default function ComparePage({ electionData }) {
  const [highlight, setHighlight] = useState(null);

  return (
    <div className="page compare-page">
      <h2 className="section-title">⚖️ India vs USA: Election Systems</h2>
      <p className="section-sub">A detailed side-by-side comparison of the world's two largest democracies</p>

      {/* Stat Cards */}
      <div className="compare-stat-grid">
        <div className="compare-country-header india">
          <div className="cch-flag">🇮🇳</div>
          <div>
            <div className="cch-name">India</div>
            <div className="cch-sub">World's largest democracy</div>
          </div>
          <div className="cch-stat">968M+ voters</div>
        </div>
        <div className="compare-vs">VS</div>
        <div className="compare-country-header usa">
          <div className="cch-flag">🇺🇸</div>
          <div>
            <div className="cch-name">USA</div>
            <div className="cch-sub">World's oldest democracy</div>
          </div>
          <div className="cch-stat">240M+ voters</div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="compare-table">
        <div className="ct-header">
          <div className="ct-label">Category</div>
          <div className="ct-col india-col">🇮🇳 India</div>
          <div className="ct-col usa-col">🇺🇸 USA</div>
        </div>
        {COMPARE_ROWS.map((row, i) => (
          <div
            key={row.label}
            className={`ct-row ${highlight === i ? 'highlighted' : ''} ${i % 2 === 0 ? 'even' : ''}`}
            onClick={() => setHighlight(highlight === i ? null : i)}
          >
            <div className="ct-label">{row.label}</div>
            <div className="ct-col india-col">{row.india}</div>
            <div className="ct-col usa-col">{row.usa}</div>
          </div>
        ))}
      </div>

      {/* Key Insight Cards */}
      <div className="insight-grid">
        <div className="insight-card">
          <div className="insight-icon">🏛️</div>
          <div className="insight-title">Parliamentary vs Presidential</div>
          <div className="insight-body">India's Prime Minister must maintain confidence of the Lok Sabha — they can be removed by a no-confidence vote mid-term. The US President serves a fixed 4-year term regardless of Congressional support, and can only be removed via impeachment.</div>
        </div>
        <div className="insight-card">
          <div className="insight-icon">🗳️</div>
          <div className="insight-title">EVMs vs Mixed Ballots</div>
          <div className="insight-body">India uses standardized EVMs with VVPAT across the entire country — one unified system. The US has 50 different state systems, with methods ranging from paper ballots to touchscreen machines. This decentralization leads to inconsistent experiences across states.</div>
        </div>
        <div className="insight-card">
          <div className="insight-icon">💰</div>
          <div className="insight-title">Campaign Finance</div>
          <div className="insight-body">India strictly caps candidate spending (₹95 lakh for Lok Sabha) and prohibits certain expenditures. The US allows unlimited spending by Super PACs (independent expenditure committees), making presidential elections billion-dollar campaigns.</div>
        </div>
        <div className="insight-card">
          <div className="insight-icon">📋</div>
          <div className="insight-title">Voter Registration</div>
          <div className="insight-body">In India, the ECI maintains electoral rolls and attempts to include all eligible citizens automatically. In the US, voters must proactively register — this is a significant barrier that contributes to lower turnout compared to many democracies.</div>
        </div>
      </div>
    </div>
  );
}
