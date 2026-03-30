import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

export default function TestDetail() {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    api.get(`/tests/${id}`).then(r => {
      setTest(r.data);
      setTimeLeft((r.data.duration_min || 30) * 60);
      document.title = `${r.data.title} | Teachs Practice Test`;
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!timeLeft || submitted) return;
    const t = setInterval(() => setTimeLeft(prev => {
      if (prev <= 1) { clearInterval(t); submitTest(); return 0; }
      return prev - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [timeLeft, submitted]);

  const submitTest = useCallback(async () => {
    if (submitted) return;
    setSubmitted(true);
    try {
      const res = await api.post(`/tests/${id}/submit`, { answers });
      setResult(res.data);
      const sol = await api.get(`/tests/${id}/solutions`);
      setSolutions(sol.data);
    } catch (err) { console.error('Submit error', err); }
  }, [id, answers, submitted]);

  const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><div className="spinner" /></div>;
  if (!test) return <div style={{ textAlign: 'center', padding: 80 }}><h2>Test not found</h2><Link to="/practice-tests" className="btn btn-primary" style={{ marginTop: 20 }}>Back to Tests</Link></div>;

  if (submitted && result) {
    const pct = result.percentage;
    const color = pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--amber)' : 'var(--error)';
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚'}</div>
          <h2 style={{ color: 'var(--ink)', marginBottom: 8 }}>Test Completed!</h2>
          <div style={{ fontSize: '3rem', fontWeight: 800, color, fontFamily: 'var(--font-body)', lineHeight: 1 }}>{pct}%</div>
          <div style={{ color: 'var(--ink-lighter)', marginTop: 4 }}>{result.score} / {result.total} correct</div>
        </div>

        {solutions.length > 0 && (
          <div>
            <h3 style={{ marginBottom: 24 }}>Answer Review & Solutions</h3>
            {solutions.map((q, i) => {
              const userAns = answers[q.id];
              const isCorrect = userAns === q.correct_answer;
              return (
                <div key={q.id} style={{ marginBottom: 24, padding: 24, borderRadius: 12, border: `2px solid ${isCorrect ? 'rgba(56,161,105,0.3)' : 'rgba(229,62,62,0.3)'}`, background: isCorrect ? 'rgba(56,161,105,0.05)' : 'rgba(229,62,62,0.05)' }}>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: isCorrect ? 'var(--success)' : 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--ink)' }}>{q.question_text}</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                    {['a','b','c','d'].map(opt => {
                      const val = q[`option_${opt}`];
                      const isUser = userAns === opt.toUpperCase();
                      const isCorrectOpt = q.correct_answer === opt.toUpperCase();
                      return (
                        <div key={opt} style={{ padding: '8px 12px', borderRadius: 8, fontSize: '0.875rem', border: `1px solid ${isCorrectOpt ? 'var(--success)' : isUser && !isCorrectOpt ? 'var(--error)' : 'var(--border)'}`, background: isCorrectOpt ? 'rgba(56,161,105,0.1)' : isUser && !isCorrectOpt ? 'rgba(229,62,62,0.1)' : 'white', color: isCorrectOpt ? 'var(--success)' : isUser && !isCorrectOpt ? 'var(--error)' : 'var(--ink-light)', fontWeight: isCorrectOpt || isUser ? 600 : 400 }}>
                          <span style={{ fontWeight: 700, marginRight: 6 }}>{opt.toUpperCase()}.</span>{val}
                        </div>
                      );
                    })}
                  </div>
                  {q.solution && <div style={{ padding: '10px 14px', background: 'rgba(0,153,178,0.08)', borderRadius: 8, fontSize: '0.85rem', color: 'var(--teal)', borderLeft: '3px solid var(--teal)' }}><strong>💡 Solution:</strong> {q.solution}</div>}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
          <Link to="/practice-tests" className="btn btn-outline">← More Tests</Link>
          <Link to="/pricing" className="btn btn-primary">Book a Class with a Teacher →</Link>
        </div>
      </div>
    );
  }

  const questions = test.questions || [];
  const answered = Object.keys(answers).length;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
      {/* Header */}
      <div style={{ background: 'var(--ink)', borderRadius: 16, padding: '24px 32px', marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: 'white', marginBottom: 4 }}>{test.title}</h2>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{test.subject} · {test.chapter} · {questions.length} Questions</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: timeLeft < 300 ? '#fc8181' : 'var(--teal)', fontFamily: 'var(--font-body)' }}>{fmt(timeLeft)}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Time Left</div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem', color: 'var(--ink-lighter)' }}>
          <span>{answered}/{questions.length} answered</span>
          <span>{test.total_marks} marks</span>
        </div>
        <div style={{ height: 6, background: 'var(--border)', borderRadius: 3 }}>
          <div style={{ height: '100%', background: 'var(--teal)', borderRadius: 3, width: `${(answered / questions.length) * 100}%`, transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Questions */}
      {questions.map((q, i) => (
        <div key={q.id} style={{ marginBottom: 28, padding: 24, borderRadius: 12, border: `2px solid ${answers[q.id] ? 'var(--teal)' : 'var(--border)'}`, background: 'white' }}>
          <p style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: 16 }}><span style={{ color: 'var(--teal)', marginRight: 8 }}>Q{i + 1}.</span>{q.question_text}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {['a','b','c','d'].map(opt => {
              const val = q[`option_${opt}`];
              if (!val) return null;
              const selected = answers[q.id] === opt.toUpperCase();
              return (
                <button key={opt} onClick={() => setAnswers({ ...answers, [q.id]: opt.toUpperCase() })} style={{
                  padding: '10px 14px', borderRadius: 10, textAlign: 'left', fontSize: '0.875rem', cursor: 'pointer',
                  border: `2px solid ${selected ? 'var(--teal)' : 'var(--border)'}`,
                  background: selected ? 'rgba(0,153,178,0.08)' : 'var(--ice)',
                  color: selected ? 'var(--teal)' : 'var(--ink-light)', fontWeight: selected ? 600 : 400,
                  fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                }}>
                  <span style={{ fontWeight: 700, marginRight: 6 }}>{opt.toUpperCase()}.</span>{val}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
        <Link to="/practice-tests" className="btn btn-ghost">← Cancel</Link>
        <button onClick={submitTest} className="btn btn-primary btn-lg" disabled={answered === 0}>
          Submit Test ({answered}/{questions.length} answered)
        </button>
      </div>
    </div>
  );
}
