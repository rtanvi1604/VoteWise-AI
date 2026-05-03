const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Load election data once at startup
const electionData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'election-data.json'), 'utf-8')
);

// ── Call Gemini API (no SDK needed — pure https) ──────────────────────────────
function callGemini(prompt) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return reject(new Error('GEMINI_API_KEY is not set.'));

    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 600 }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) resolve(text.trim());
          else reject(new Error('No text in Gemini response: ' + data));
        } catch (e) {
          reject(new Error('Failed to parse Gemini response: ' + data));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Build knowledge context from JSON data ────────────────────────────────────
function buildContext(country) {
  const d = electionData.countries[country] || electionData.countries['India'];
  const steps = d.steps.map(s =>
    `Step ${s.step}: ${s.title} — ${s.description} (Key fact: ${s.keyFact || 'N/A'})`
  ).join('\n');
  const faqs = d.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');
  const facts = (d.funFacts || []).join(' | ');
  return `COUNTRY: ${d.country}\nDESCRIPTION: ${d.description}\nFUN FACTS: ${facts}\n\nELECTION STEPS:\n${steps}\n\nFAQs:\n${faqs}`;
}

// ── Build the full prompt ─────────────────────────────────────────────────────
function buildPrompt(userMessage, country) {
  return `You are ElectionGuide, a friendly civic education AI specializing in election processes for India and the USA.

PERSONALITY:
- Clear, warm, encouraging — you make democracy feel accessible to everyone
- Use simple language, avoid jargon unless you explain it immediately
- Be concise (under 200 words) but complete and accurate
- Use 1-2 emojis max per response
- If asked something completely unrelated to elections/civics/government, say: "I specialize in election education! Ask me about voting, candidates, timelines, how results work, or how governments are formed."

KNOWLEDGE BASE (${country}):
${buildContext(country)}

ADDITIONAL GENERAL KNOWLEDGE (always answer these accurately):
- India holds State Assembly (Vidhan Sabha) elections every 5 years per state — managed by ECI
- Chief Ministers lead state governments; they are elected by members of the state legislative assembly, not directly by voters
- India has 28 states + 8 Union Territories, each with its own legislature
- Panchayat (village-level) elections happen every 5 years in India
- India's President is elected every 5 years by an Electoral College of MPs and state MLAs (not public vote)
- India's Rajya Sabha: 245 members, 6-year staggered terms, mostly elected by state assemblies
- US House of Representatives terms: 2 years. US Senate terms: 6 years (1/3 elected every 2 years)
- US midterm elections occur every 2 years (between Presidential elections)
- US local elections (mayors, governors) vary by state — typically every 2 or 4 years
- Voter turnout in India's 2024 election: ~66.3%. US 2020: ~66.8%
- India's election spending cap: Rs 95 lakh per Lok Sabha candidate (2024)
- The concept of NOTA (None Of The Above) exists in Indian elections since 2013

User's question: ${userMessage}

Answer helpfully, accurately, and conversationally. Do NOT say you cannot answer election-related questions — use your general knowledge when needed.`;
}

// ── API Routes ─────────────────────────────────────────────────────────────────
app.get('/api/election-data', (req, res) => res.json(electionData));

app.get('/api/quiz', (req, res) => res.json(electionData.quiz || []));

app.get('/api/models', (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;

  https.get(
    `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
    (resp) => {
      let data = '';
      resp.on('data', chunk => data += chunk);
      resp.on('end', () => res.send(data));
    }
  );
});

app.post('/api/chat', async (req, res) => {
  const { message, country } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: 'Message is required' });

  const selectedCountry = (country === 'USA' || country === 'India') ? country : 'India';

  try {
    const aiReply = await callGemini(buildPrompt(message.trim(), selectedCountry));
    res.json({ type: 'ai', response: { body: aiReply }, country: selectedCountry });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({
      type: 'error',
      response: { title: 'AI Error', body: 'Could not reach Gemini: ' + err.message }
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ ElectionGuide running on http://localhost:${PORT}`);
  console.log(process.env.GEMINI_API_KEY
    ? '🤖 Gemini AI connected!'
    : '⚠️  WARNING: GEMINI_API_KEY not set — chat will fail!');
});
