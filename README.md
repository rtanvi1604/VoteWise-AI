# 🗳️ VoteWise AI — Demystifying Democracy

> **PromptWars Virtual by Google & Hack2Skill — Challenge 2**
> An interactive AI assistant that helps users understand election processes in India and the USA.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Google%20Cloud%20Run-blue)](https://election-guide-583470319869.asia-south1.run.app)
[![Built with](https://img.shields.io/badge/Built%20with-React%20%2B%20Node.js-green)](https://reactjs.org)

---

## 🌟 Features

| Feature | Description |
|---|---|
| 💬 **AI Chat Assistant** | Ask questions in plain English — intent-based matching returns relevant answers |
| 📋 **Interactive Timeline** | 9-step accordion-style election process explorer with key facts |
| 🧩 **Timed Quiz** | 8-question quiz with 20-second countdown, instant feedback & score tracking |
| ⚖️ **India vs USA Comparison** | 16-point side-by-side comparison table + insight cards |
| 🌏 **Dual Country Support** | Full data for both Indian (Lok Sabha) and US Presidential elections |
| 📱 **Fully Responsive** | Works seamlessly on mobile, tablet, and desktop |

---

## 🛠 Tech Stack

- **Frontend:** React 18, Custom CSS (no UI library — fully bespoke design)
- **Backend:** Node.js + Express
- **Data:** Static JSON (no database required)
- **Deployment:** Google Cloud Run (Docker containerized)
- **Fonts:** Sora + IBM Plex Mono (Google Fonts)

---

## 🚀 Run Locally

### Prerequisites
- Node.js 18+
- npm

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/USERNAME/VoteWise-AI.git
cd electionguide-assistant

# 2. Install all dependencies (installs both server + client)
npm install

# 3. Build the React frontend
npm run build

# 4. Start the server
npm start
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

### Development Mode (hot reload)
```bash
# Terminal 1 — start Express server
npm run dev:server

# Terminal 2 — start React dev server
npm run dev:client
```
The React dev server runs on port 3000 and proxies API calls to port 8080.

---

## 🐳 Docker

```bash
# Build the image
docker build -t electionguide .

# Run the container
docker run -p 8080:8080 electionguide
```

---

## ☁️ Deploy to Google Cloud Run

```bash
# 1. Login to Google Cloud
gcloud auth login

# 2. Set your project
gcloud config set project PROJECT_ID

# 3. Build and push the container
gcloud builds submit --tag gcr.io/PROJECT_ID/electionguide

# 4. Deploy to Cloud Run
gcloud run deploy electionguide \
  --image gcr.io/PROJECT_ID/electionguide \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 📁 Project Structure

```
electionguide/
├── server/
│   ├── index.js           # Express server + API routes + intent matching
│   └── election-data.json # All election data (steps, FAQs, quiz questions)
├── client/
│   ├── public/index.html
│   └── src/
│       ├── App.js         # Main app with view routing
│       ├── components/
│       │   ├── Navbar.js          # Sticky navigation
│       │   ├── LandingHero.js     # Home page with rotating facts
│       │   ├── ChatAssistant.js   # AI chat interface
│       │   ├── TimelinePage.js    # Accordion timeline + FAQ
│       │   ├── QuizPage.js        # Timed quiz with results
│       │   └── ComparePage.js     # India vs USA comparison
│       └── index.css      # Global CSS variables & base styles
├── Dockerfile             # Multi-stage Docker build
├── package.json
└── README.md
```

---

## 🎯 Unique Features

1. **Timed Quiz** with 20-second countdown per question — adds gamification
2. **Rotating Fun Facts** on the landing page that cycle every 4 seconds
3. **Intent-Based Chat** that maps keywords to relevant election data without any ML model — purely rule-based and fast
4. **Country Switch** mid-chat — resets context to the selected country seamlessly
5. **Comparison Table** with 16 detailed points comparing India and USA side-by-side
6. **Key Fact Callouts** in each timeline step — memorable highlights for each phase

---
## 📸 Application Screenshots

### VoteWise AI - Home Page 
![Dashboard](https://github.com/rtanvi1604/VoteWise-AI/blob/main/Screenshots%2FUI.png)

### Election AI Guide - ChatBot
![Chatbot](https://github.com/rtanvi1604/VoteWise-AI/blob/main/Screenshots%2FChatbot.png)

### Indian Election Timeline
![Timeline1](https://github.com/rtanvi1604/VoteWise-AI/blob/main/Screenshots%2FTimeline1.png)

![Timeline2](https://github.com/rtanvi1604/VoteWise-AI/blob/main/Screenshots%2FTimeline2.png)
- Each dropdown talks about the timeline and election period 

### Frequently Asked Questions 
![FAQ](https://github.com/rtanvi1604/VoteWise-AI/blob/main/Screenshots%2FFAQ.png)

### General Election Quiz
![Quiz1](https://github.com/rtanvi1604/VoteWise-AI/blob/main/Screenshots%2FQuiz1.png)

![Quiz2](https://github.com/rtanvi1604/VoteWise-AI/blob/main/Screenshots%2FQuiz2.png)
- Quiz score to know about your election knowledge

### India vs USA Election System 
![Comparison1](https://github.com/rtanvi1604/VoteWise-AI/blob/main/Screenshots%2FComparison1.png)

![Comparison2](https://github.com/rtanvi1604/VoteWise-AI/blob/main/Screenshots%2FComparison2.png)

---

## 👩‍💻 Author

**Tanvi R**  
B.Tech AI & Data Science, Panimalar Engineering College  
[LinkedIn](https://linkedin.com/in/YOUR_PROFILE) | [GitHub](https://github.com/rtanvi1604/VoteWise-AI.git)