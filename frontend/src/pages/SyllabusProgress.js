/**
 * SyllabusProgress.js
 * Drop-in component for StudentDashboard.js
 *
 * USAGE — add to StudentDashboard:
 *   import SyllabusProgress from './SyllabusProgress';
 *   Add 'Syllabus' to the TABS array
 *   Add case: if (activeTab === 'Syllabus') return <SyllabusProgress />;
 */
import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const STATUS_COLOR = { not_started: '#94a3b8', in_progress: '#F5A623', completed: '#22c55e' };
const STATUS_LABEL = { not_started: 'Not Started', in_progress: 'In Progress', completed: 'Done ✓' };

function CircleProgress({ pct, size = 64, stroke = 7, color = '#0099B2' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s' }} />
      <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle"
        transform={`rotate(90, ${size / 2}, ${size / 2})`}
        style={{ fontSize: size * 0.22, fontWeight: 800, fill: color, fontFamily: 'sans-serif' }}>
        {pct}%
      </text>
    </svg>
  );
}

export default function SyllabusProgress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/student/syllabus')
      .then(r => {
        setData(r.data);
        const exp = {};
        r.data.subjects?.forEach(s => { exp[s.id] = true; });
        setExpandedSubjects(exp);
      })
      .catch(() => setError('Failed to load syllabus.'))
      .finally(() => setLoading(false));
  }, []);

  const card = { background: 'white', borderRadius: 16, padding: 24, border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div className="spinner" /></div>;
  if (error)   return <div style={{ ...card, color: '#dc2626' }}>{error}</div>;

  const { subjects = [], recentTopics = [] } = data || {};

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      {/* Subject overview cards */}
      {subjects.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', color: 'var(--text3)', padding: 48 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>📚</div>
          <div style={{ fontWeight: 600 }}>No syllabus added yet</div>
          <div style={{ fontSize: '0.82rem', marginTop: 6 }}>Your teacher will add chapters and topics here.</div>
        </div>
      ) : (
        <>
          {/* Subject overview circles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {subjects.map(sub => {
              const pct = sub.total > 0 ? Math.round((sub.completed / sub.total) * 100) : 0;
              return (
                <div key={sub.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }} onClick={() => setExpandedSubjects(p => ({ ...p, [sub.id]: !p[sub.id] }))}>
                  <CircleProgress pct={pct} color={pct >= 80 ? '#22c55e' : pct >= 40 ? '#0099B2' : '#F5A623'} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#1B3A6B', fontSize: '0.95rem' }}>{sub.subject_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 3 }}>{sub.completed}/{sub.total} topics done</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>by {sub.teacher_name}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed syllabus tree */}
          <div style={card}>
            <h4 style={{ marginBottom: 20, color: '#1B3A6B' }}>📖 Detailed Progress</h4>
            {subjects.map(sub => {
              const pct = sub.total > 0 ? Math.round((sub.completed / sub.total) * 100) : 0;
              return (
                <div key={sub.id} style={{ marginBottom: 20 }}>
                  {/* Subject header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '10px 14px', background: '#1B3A6B', borderRadius: 10, color: 'white', cursor: 'pointer' }} onClick={() => setExpandedSubjects(p => ({ ...p, [sub.id]: !p[sub.id] }))}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{expandedSubjects[sub.id] ? '▾' : '▸'} {sub.subject_name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 90, height: 6, background: 'rgba(255,255,255,0.25)', borderRadius: 3 }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: '#F5A623', borderRadius: 3, transition: 'width 0.4s' }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, opacity: 0.9 }}>{pct}%</span>
                    </div>
                  </div>

                  {expandedSubjects[sub.id] && (sub.chapters || []).map(chapter => {
                    const chPct = chapter.total > 0 ? Math.round((chapter.completed / chapter.total) * 100) : 0;
                    return (
                      <div key={chapter.id} style={{ marginLeft: 16, marginBottom: 12, background: '#f8fafc', borderRadius: 10, padding: 14 }}>
                        {/* Chapter header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.87rem', color: '#1B3A6B' }}>📖 {chapter.chapter_name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 70, height: 5, background: '#e2e8f0', borderRadius: 3 }}>
                              <div style={{ width: `${chPct}%`, height: '100%', background: '#0099B2', borderRadius: 3, transition: 'width 0.4s' }} />
                            </div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 600 }}>{chapter.completed}/{chapter.total}</span>
                          </div>
                        </div>

                        {/* Subtopics */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {(chapter.subtopics || []).map(st => (
                            <span key={st.id} style={{
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                              background: 'white',
                              border: `1.5px solid ${STATUS_COLOR[st.status]}`,
                              borderRadius: 20, padding: '3px 10px',
                              fontSize: '0.78rem', color: '#334155',
                            }}>
                              <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLOR[st.status], flexShrink: 0, display: 'inline-block' }} />
                              {st.subtopic_name}
                              <span style={{ fontSize: '0.68rem', color: STATUS_COLOR[st.status], fontWeight: 700 }}>{STATUS_LABEL[st.status]}</span>
                            </span>
                          ))}
                          {(chapter.subtopics || []).length === 0 && <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>No subtopics yet</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Recent class topics */}
      {recentTopics.length > 0 && (
        <div style={card}>
          <h4 style={{ marginBottom: 16, color: '#1B3A6B' }}>🕐 Recently Taught Topics</h4>
          {recentTopics.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '10px 0', borderBottom: '1px solid var(--border)', alignItems: 'flex-start' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0099B2', marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>{t.topic_taught}</div>
                {t.sub_topic && <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 2 }}>{t.sub_topic}</div>}
                <div style={{ fontSize: '0.73rem', color: 'var(--text3)', marginTop: 3 }}>{t.subject} · {t.class_date} · {t.teacher_name}</div>
              </div>
              {t.class_rating && (
                <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: '50%', background: t.class_rating >= 4 ? '#22c55e' : t.class_rating === 3 ? '#F5A623' : '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.82rem' }}>
                  {t.class_rating}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
