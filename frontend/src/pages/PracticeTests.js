import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const SUBJECTS = ['All', 'Mathematics', 'Science', 'English', 'Social Studies'];
const CLASSES = ['All', ...Array.from({ length: 10 }, (_, i) => String(i + 1))];

export default function PracticeTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classFilter, setClassFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Practice Tests | Teachs – Class-wise Chapter-wise Tests with Solutions';
    api.get('/tests').then(r => setTests(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = tests.filter(t => {
    const classMatch = classFilter === 'All' || String(t.class_no) === classFilter;
    const subjectMatch = subjectFilter === 'All' || t.subject === subjectFilter;
    return classMatch && subjectMatch;
  });

  const grouped = filtered.reduce((acc, t) => {
    const key = `Class ${t.class_no}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  const handleStart = (testId) => {
    if (!user) return navigate('/login');
    navigate(`/practice-tests/${testId}`);
  };

  return (
    <div>
      <section style={{ background: 'var(--ink)', padding: '100px 0 72px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="badge badge-teal" style={{ marginBottom: 16 }}>Free Practice Tests</span>
          <h1 style={{ color: 'white', marginBottom: 16 }}>100+ Practice Tests</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 520, margin: '0 auto', fontSize: '1.05rem' }}>
            Class 1–10 · Subject-wise · Chapter-wise · With Complete Solutions
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filters */}
          <div style={{ background: 'var(--ice)', borderRadius: 16, padding: '24px 28px', marginBottom: 40, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 8, display: 'block' }}>FILTER BY CLASS</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {CLASSES.map(c => (
                  <button key={c} onClick={() => setClassFilter(c)} className="btn btn-sm" style={{
                    background: classFilter === c ? 'var(--navy)' : 'white',
                    color: classFilter === c ? 'white' : 'var(--ink)',
                    border: '1px solid var(--border)', padding: '6px 14px',
                  }}>{c === 'All' ? 'All' : `Class ${c}`}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 8, display: 'block' }}>FILTER BY SUBJECT</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {SUBJECTS.map(s => (
                  <button key={s} onClick={() => setSubjectFilter(s)} className="btn btn-sm" style={{
                    background: subjectFilter === s ? 'var(--teal)' : 'white',
                    color: subjectFilter === s ? 'white' : 'var(--ink)',
                    border: '1px solid var(--border)', padding: '6px 14px',
                  }}>{s}</button>
                ))}
              </div>
            </div>
          </div>

          {!user && (
            <div className="alert alert-info" style={{ marginBottom: 32 }}>
              📝 <strong>Login required to take tests.</strong> <Link to="/login">Sign in</Link> or <Link to="/signup">create an account</Link> to access full tests with solutions.
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-lighter)' }}>No tests found for selected filters.</div>
          ) : (
            Object.entries(grouped).map(([cls, clsTests]) => (
              <div key={cls} style={{ marginBottom: 48 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                    {cls.replace('Class ', '')}
                  </div>
                  <h3 style={{ color: 'var(--ink)' }}>{cls}</h3>
                  <span className="badge badge-teal">{clsTests.length} tests</span>
                </div>
                <div className="grid-3">
                  {clsTests.map(test => (
                    <div key={test.id} className="card" style={{ padding: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <span className="badge badge-navy">{test.subject}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--ink-lighter)' }}>⏱ {test.duration_min} min</span>
                      </div>
                      <h4 style={{ fontSize: '1rem', marginBottom: 6, color: 'var(--ink)' }}>{test.title}</h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--teal)', fontWeight: 600, marginBottom: 16 }}>{test.chapter}</p>
                      <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: '0.8rem', color: 'var(--ink-lighter)' }}>
                        <span>📋 {test.question_count} Questions</span>
                        <span>📊 {test.total_marks} Marks</span>
                      </div>
                      <button onClick={() => handleStart(test.id)} className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
                        {user ? 'Start Test →' : 'Login to Start'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
