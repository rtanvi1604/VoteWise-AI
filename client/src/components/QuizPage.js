import React, { useState, useEffect } from 'react';
import './QuizPage.css';

export default function QuizPage({ electionData }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(20);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    fetch('/api/quiz')
      .then(r => r.json())
      .then(d => {
        // Shuffle
        const shuffled = [...d].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
      });
  }, []);

  // Timer countdown
  useEffect(() => {
    if (done || selected !== null || timedOut || questions.length === 0) return;
    if (timer === 0) {
      setTimedOut(true);
      setAnswers(a => [...a, { q: questions[current], selected: -1, correct: false }]);
      return;
    }
    const t = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, done, selected, timedOut, current, questions]);

  const handleSelect = (idx) => {
    if (selected !== null || timedOut) return;
    setSelected(idx);
    const correct = idx === questions[current].answer;
    if (correct) setScore(s => s + 1);
    setAnswers(a => [...a, { q: questions[current], selected: idx, correct }]);
  };

  const next = () => {
    const nextIdx = current + 1;
    if (nextIdx >= questions.length) {
      setDone(true);
    } else {
      setCurrent(nextIdx);
      setSelected(null);
      setTimedOut(false);
      setTimer(20);
    }
  };

  const restart = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setAnswers([]);
    setTimer(20);
    setTimedOut(false);
  };

  if (questions.length === 0) return (
    <div className="page"><p style={{ color: 'var(--text2)' }}>Loading quiz...</p></div>
  );

  if (done) return <QuizResults score={score} total={questions.length} answers={answers} restart={restart} />;

  const q = questions[current];
  const progress = ((current) / questions.length) * 100;

  return (
    <div className="page quiz-page">
      <div className="quiz-header">
        <div className="quiz-meta">
          <span className="badge badge-gold">🧩 Election Quiz</span>
          <span className="quiz-progress-text">{current + 1} / {questions.length}</span>
        </div>
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="quiz-card">
        <div className="quiz-top">
          <div className="quiz-country-tag">{q.country === 'India' ? '🇮🇳 India' : '🇺🇸 USA'}</div>
          <div className={`quiz-timer ${timer <= 5 ? 'danger' : ''}`}>
            ⏱ {timer}s
          </div>
        </div>

        <div className="quiz-question">{q.question}</div>

        <div className="quiz-options">
          {q.options.map((opt, i) => {
            let cls = 'quiz-option';
            if (selected !== null || timedOut) {
              if (i === q.answer) cls += ' correct';
              else if (i === selected) cls += ' wrong';
              else cls += ' dimmed';
            }
            return (
              <button key={i} className={cls} onClick={() => handleSelect(i)}>
                <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {(selected !== null || timedOut) && (
          <div className="quiz-feedback">
            {timedOut ? (
              <div className="feedback-timeout">⏰ Time's up! The answer was: <strong>{q.options[q.answer]}</strong></div>
            ) : selected === q.answer ? (
              <div className="feedback-correct">✅ Correct!</div>
            ) : (
              <div className="feedback-wrong">❌ Incorrect. Correct: <strong>{q.options[q.answer]}</strong></div>
            )}
            <div className="feedback-explain">{q.explanation}</div>
            <button className="btn btn-primary" onClick={next}>
              {current + 1 < questions.length ? 'Next Question →' : 'See Results 🏆'}
            </button>
          </div>
        )}
      </div>

      <div className="quiz-score-live">Score: {score} / {current + (selected !== null || timedOut ? 1 : 0)}</div>
    </div>
  );
}

function QuizResults({ score, total, answers, restart }) {
  const pct = Math.round((score / total) * 100);
  const grade = pct >= 80 ? { label: '🏆 Expert', color: 'var(--gold)' }
    : pct >= 60 ? { label: '⭐ Good', color: 'var(--accent2)' }
    : pct >= 40 ? { label: '📚 Keep Learning', color: 'var(--text2)' }
    : { label: '🌱 Beginner', color: 'var(--red)' };

  return (
    <div className="page quiz-page">
      <div className="results-card">
        <div className="results-score-circle">
          <div className="rsc-inner">
            <div className="rsc-score">{score}<span>/{total}</span></div>
            <div className="rsc-pct">{pct}%</div>
          </div>
        </div>
        <div className="results-grade" style={{ color: grade.color }}>{grade.label}</div>
        <p className="results-msg">
          {pct >= 80 ? "Outstanding! You're a civic knowledge champion 🎉" :
           pct >= 60 ? "Great work! You have solid knowledge about elections." :
           pct >= 40 ? "Not bad! Review the timeline to strengthen your understanding." :
           "Keep exploring the ElectionGuide to build your knowledge!"}
        </p>

        <div className="results-breakdown">
          {answers.map((a, i) => (
            <div key={i} className={`rb-item ${a.correct ? 'rb-correct' : 'rb-wrong'}`}>
              <span className="rb-icon">{a.correct ? '✅' : '❌'}</span>
              <span className="rb-q">{a.q.question}</span>
              {!a.correct && (
                <span className="rb-ans">→ {a.q.options[a.q.answer]}</span>
              )}
            </div>
          ))}
        </div>

        <button className="btn btn-gold" onClick={restart} style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}>
          🔄 Play Again
        </button>
      </div>
    </div>
  );
}
