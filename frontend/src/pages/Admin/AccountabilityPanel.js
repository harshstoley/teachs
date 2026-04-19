/**
 * AccountabilityPanel.js
 * Drop-in component for AdminDashboard.js
 *
 * USAGE — add to AdminDashboard:
 *   import AccountabilityPanel from './AccountabilityPanel';
 *   Add 'Accountability' to the admin TABS array
 *   Add case: if (activeTab === 'Accountability') return <AccountabilityPanel />;
 */
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

function StatBar({ value, max, color = '#0099B2', height = 8 }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height, background: '#e2e8f0', borderRadius: height }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: height, transition: 'width 0.5s' }} />
      </div>
      <span style={{ fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 700, minWidth: 30, textAlign: 'right' }}>{pct}%</span>
    </div>
  );
}

export default function AccountabilityPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [error, setError] = useState(null);

  const load = (d) => {
    setLoading(true);
    api.get(`/admin/accountability?days=${d}`)
      .then(r => { setData(r.data); setError(null); })
      .catch(() => setError('Failed to load accountability data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(days); }, [days]);

  const card = { background: 'white', borderRadius: 16, padding: 24, border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' };

  const teachers = data?.teachers || [];
  const totalAtt = teachers.reduce((a, t) => a + t.attendance_total, 0);
  const totalWithTopic = teachers.reduce((a, t) => a + t.attendance_with_topic, 0);
  const lowAttWarnings = teachers.filter(t => t.low_attendance_students?.length > 0);

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      {/* Header controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ margin: 0, color: '#1B3A6B', fontFamily: 'var(--font-heading)' }}>🎯 Accountability Dashboard</h3>
          {data && <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text3)' }}>Showing data from {data.since} to today</p>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[7, 14, 30].map(d => (
            <button key={d} onClick={() => setDays(d)} style={{ padding: '7px 16px', borderRadius: 8, border: `1.5px solid ${days === d ? '#1B3A6B' : 'var(--border)'}`, background: days === d ? '#1B3A6B' : 'white', color: days === d ? 'white' : 'var(--text2)', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.82rem' }}>
              Last {d}d
            </button>
          ))}
        </div>
      </div>

      {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div className="spinner" /></div>}
      {error && <div style={{ ...card, color: '#dc2626' }}>{error}</div>}

      {!loading && !error && (
        <>
          {/* Summary stat row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
            {[
              { label: 'Active Teachers', val: teachers.length, color: '#1B3A6B', icon: '👩‍🏫' },
              { label: 'Classes Held', val: totalAtt, color: '#0099B2', icon: '✅' },
              { label: 'Topics Filled', val: totalWithTopic, color: '#22c55e', icon: '📖' },
              { label: 'Fill Rate', val: `${totalAtt > 0 ? Math.round((totalWithTopic / totalAtt) * 100) : 0}%`, color: totalWithTopic / totalAtt >= 0.9 ? '#22c55e' : '#F5A623', icon: '📊' },
              { label: 'Low Att. Alerts', val: lowAttWarnings.length, color: lowAttWarnings.length > 0 ? '#dc2626' : '#22c55e', icon: '⚠️' },
            ].map(({ label, val, color, icon }) => (
              <div key={label} style={{ ...card, textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', marginBottom: 4 }}>{icon}</div>
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color }}>{val}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Per-teacher table */}
          <div style={card}>
            <h4 style={{ marginBottom: 20, color: '#1B3A6B' }}>Teacher-by-Teacher Breakdown</h4>

            {teachers.length === 0 ? (
              <p style={{ color: 'var(--text3)', fontSize: '0.88rem' }}>No active teachers found.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9' }}>
                      {['Teacher', 'Students', 'Classes', 'Topics Filled', 'Fill Rate', 'Syllabus Coverage', 'Alerts'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--text2)', whiteSpace: 'nowrap', borderBottom: '2px solid var(--border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map(t => {
                      const fillOk = t.topic_fill_rate >= 90;
                      const syllOk = t.syllabus_pct >= 50;
                      return (
                        <tr key={t.teacher_id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px 12px' }}>
                            <div style={{ fontWeight: 700, color: 'var(--text)' }}>{t.teacher_name}</div>
                          </td>
                          <td style={{ padding: '12px 12px', textAlign: 'center', fontWeight: 700, color: '#1B3A6B' }}>{t.student_count}</td>
                          <td style={{ padding: '12px 12px', textAlign: 'center', fontWeight: 700, color: t.attendance_total > 0 ? 'var(--text)' : '#dc2626' }}>
                            {t.attendance_total === 0 ? <span style={{ color: '#dc2626' }}>0 ⚠️</span> : t.attendance_total}
                          </td>
                          <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                            <span style={{ color: fillOk ? '#22c55e' : '#F5A623', fontWeight: 700 }}>{t.attendance_with_topic}</span>
                            <span style={{ color: 'var(--text3)', fontSize: '0.78rem' }}> / {t.attendance_total}</span>
                          </td>
                          <td style={{ padding: '12px 12px', minWidth: 130 }}>
                            <StatBar value={t.topic_fill_rate} max={100} color={fillOk ? '#22c55e' : t.topic_fill_rate >= 60 ? '#F5A623' : '#dc2626'} />
                          </td>
                          <td style={{ padding: '12px 12px', minWidth: 130 }}>
                            {t.syllabus_total > 0
                              ? <StatBar value={t.syllabus_pct} max={100} color={syllOk ? '#0099B2' : '#F5A623'} />
                              : <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>No syllabus</span>
                            }
                          </td>
                          <td style={{ padding: '12px 12px' }}>
                            {t.low_attendance_students?.length > 0
                              ? <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.78rem' }}>⚠️ {t.low_attendance_students.length} student{t.low_attendance_students.length > 1 ? 's' : ''}</span>
                              : <span style={{ color: '#22c55e', fontSize: '0.78rem', fontWeight: 600 }}>✓ OK</span>
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Low attendance student detail */}
          {lowAttWarnings.length > 0 && (
            <div style={{ ...card, borderLeft: '4px solid #dc2626' }}>
              <h4 style={{ marginBottom: 16, color: '#dc2626' }}>⚠️ Low Attendance Students (below 70% in last 30 days)</h4>
              {lowAttWarnings.map(t => (
                <div key={t.teacher_id} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1B3A6B', marginBottom: 6 }}>Teacher: {t.teacher_name}</div>
                  {t.low_attendance_students.map((s, i) => {
                    const attPct = s.classes_total > 0 ? Math.round((s.present / s.classes_total) * 100) : 0;
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '7px 12px', background: '#fff5f5', borderRadius: 8, marginBottom: 4 }}>
                        <div style={{ fontWeight: 600, flex: 1, fontSize: '0.85rem' }}>{s.student_name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 700 }}>{s.present}/{s.classes_total} classes · {attPct}%</div>
                        <div style={{ width: 60 }}><StatBar value={attPct} max={100} color="#dc2626" height={6} /></div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* Syllabus coverage bar chart */}
          {teachers.some(t => t.syllabus_total > 0) && (
            <div style={card}>
              <h4 style={{ marginBottom: 20, color: '#1B3A6B' }}>📚 Syllabus Coverage by Teacher</h4>
              {teachers.filter(t => t.syllabus_total > 0).map(t => (
                <div key={t.teacher_id} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>{t.teacher_name}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{t.syllabus_completed}/{t.syllabus_total} sub-topics</span>
                  </div>
                  <div style={{ width: '100%', height: 14, background: '#e2e8f0', borderRadius: 7 }}>
                    <div style={{ width: `${t.syllabus_pct}%`, height: '100%', background: 'linear-gradient(90deg, #1B3A6B, #0099B2)', borderRadius: 7, transition: 'width 0.5s' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
