import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import LeadCaptureModal, { hasGuestAccess } from '../components/LeadCaptureModal';

const SUBJECTS = ['All', 'Mathematics', 'Science', 'English', 'Social Studies'];
const CLASSES = ['All', ...Array.from({ length: 10 }, (_, i) => String(i + 1))];

export default function PracticeTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classFilter, setClassFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [pendingTestId, setPendingTestId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Practice Tests | Teachs – Class-wise Chapter-wise Tests';
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
    // Logged in users go directly
    if (user) return navigate(`/practice-tests/${testId}`);
    // Already filled lead form → go directly
    if (hasGuestAccess()) return navigate(`/practice-tests/${testId}`);
    // First time → show modal
    setPendingTestId(testId);
    setShowModal(true);
  };

  const onLeadSuccess = () => {
    setShowModal(false);
    if (pendingTestId) navigate(`/practice-tests/${pendingTestId}`);
  };

  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>

      {/* Lead Capture Modal */}
      {showModal && (
        <LeadCaptureModal
          actionLabel={`Practice Test #${pendingTestId}`}
          onSuccess={onLeadSuccess}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* HERO */}
      <section style={{ paddingTop: 'calc(var(--nav-height) + 60px)', paddingBottom: 56, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(212,168,83,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,83,0.03) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', position: 'relative', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.25)', color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 700, padding: '5px 14px', borderRadius: 100, marginBottom: 20, letterSpacing: '0.5px' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
            FREE PRACTICE TESTS
          </div>
          <h1 style={{ color: 'white', marginBottom: 14 }}>100+ <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Practice</em> Tests</h1>
          <p style={{ color: 'var(--slate2)', maxWidth: 480, margin: '0 auto', lineHeight: 1.75 }}>
            Class 1–10 · Subject-wise · Chapter-wise · With Complete Solutions
          </p>
        </div>
      </section>

      {/* FILTERS */}
      <div style={{ background: 'var(--navy2)', borderTop: '1px solid rgba(212,168,83,0.1)', borderBottom: '1px solid rgba(212,168,83,0.1)', padding: '16px 20px', overflowX: 'auto' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--slate)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Class</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CLASSES.map(c => (
                <button key={c} onClick={() => setClassFilter(c)} style={{
                  padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.8rem',
                  background: classFilter === c ? 'var(--gold)' : 'rgba(255,255,255,0.06)',
                  color: classFilter === c ? 'var(--navy)' : 'var(--slate2)',
                  fontWeight: classFilter === c ? 700 : 400, fontFamily: 'var(--font-body)',
                }}>{c === 'All' ? 'All' : `Cl ${c}`}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--slate)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Subject</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {SUBJECTS.map(s => (
                <button key={s} onClick={() => setSubjectFilter(s)} style={{
                  padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.8rem',
                  background: subjectFilter === s ? 'var(--teal)' : 'rgba(255,255,255,0.06)',
                  color: subjectFilter === s ? 'white' : 'var(--slate2)',
                  fontWeight: subjectFilter === s ? 700 : 400, fontFamily: 'var(--font-body)',
                }}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TESTS GRID */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div className="spinner" style={{ margin: '0 auto', borderTopColor: 'var(--gold)' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--navy2)', borderRadius: 20, border: '1px solid rgba(212,168,83,0.1)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🔍</div>
            <h3 style={{ color: 'white', marginBottom: 8 }}>No tests found</h3>
            <p style={{ color: 'var(--slate2)' }}>Try different filters.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([cls, clsTests]) => (
            <div key={cls} style={{ marginBottom: 56 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(212,168,83,0.12)', border: '1px solid rgba(212,168,83,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, fontFamily: 'var(--font-body)' }}>
                  {cls.replace('Class ', '')}
                </div>
                <h3 style={{ color: 'white', margin: 0 }}>{cls}</h3>
                <span style={{ background: 'rgba(0,153,178,0.15)', color: 'var(--teal)', padding: '3px 10px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700 }}>{clsTests.length} tests</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(260px,100%),1fr))', gap: 16 }}>
                {clsTests.map(test => (
                  <div key={test.id} style={{ background: 'var(--navy2)', borderRadius: 16, padding: '22px 18px', border: '1px solid rgba(212,168,83,0.1)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,168,83,0.35)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,168,83,0.1)'; e.currentTarget.style.transform = ''; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <span style={{ background: 'rgba(0,153,178,0.12)', color: 'var(--teal)', padding: '3px 10px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 700 }}>{test.subject}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate)' }}>⏱ {test.duration_min}m</span>
                    </div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: 6, color: 'white', fontFamily: 'var(--font-body)', fontWeight: 700 }}>{test.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 600, marginBottom: 14 }}>{test.chapter}</p>
                    <div style={{ display: 'flex', gap: 14, marginBottom: 18, fontSize: '0.78rem', color: 'var(--slate)' }}>
                      <span>📋 {test.question_count} Qs</span>
                      <span>📊 {test.total_marks} Marks</span>
                    </div>
                    <button onClick={() => handleStart(test.id)} style={{
                      width: '100%', padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: 'var(--gold)', color: 'var(--navy)',
                      fontWeight: 700, fontSize: '0.88rem', fontFamily: 'var(--font-body)',
                      transition: 'all 0.2s',
                    }}>
                      Start Test →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* CTA */}
      <div style={{ background: 'var(--navy2)', borderTop: '1px solid rgba(212,168,83,0.1)', padding: '48px 20px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', marginBottom: 10 }}>Want Personalized Tutoring?</h2>
        <p style={{ color: 'var(--slate2)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>Get a dedicated teacher for structured lessons and weekly tests.</p>
        <Link to="/pricing" style={{ display: 'inline-block', background: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, padding: '13px 28px', borderRadius: 10, textDecoration: 'none', fontSize: '0.95rem' }}>View Plans →</Link>
      </div>
    </div>
  );
}
