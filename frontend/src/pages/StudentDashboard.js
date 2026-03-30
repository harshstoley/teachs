import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TABS = ['Overview', 'Schedule', 'Homework', 'Progress', 'Tests', 'Attendance', 'Doubts', 'Notes'];

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [data, setData] = useState(null);
  const [tabData, setTabData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doubt, setDoubt] = useState({ subject: '', question: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    document.title = 'Student Dashboard | Teachs';
    api.get('/student/dashboard').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'Overview') return;
    const endpoints = { Schedule: '/student/schedule', Homework: '/student/homework', Progress: '/student/progress', Tests: '/student/test-results', Attendance: '/student/attendance', Doubts: '/student/doubts', Notes: '/student/notes' };
    if (endpoints[activeTab]) {
      setTabData(null);
      api.get(endpoints[activeTab]).then(r => setTabData(r.data)).catch(() => setTabData([]));
    }
  }, [activeTab]);

  const submitDoubt = async e => {
    e.preventDefault();
    try {
      await api.post('/student/doubt', doubt);
      setMsg('Doubt submitted!');
      setDoubt({ subject: '', question: '' });
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('Failed to submit.'); }
  };

  const DAY = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><div className="spinner" /></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ice)' }}>
      {/* Top Bar */}
      <div style={{ background: 'var(--navy)', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'white', textDecoration: 'none' }}>
          Teach<span style={{ color: 'var(--teal)' }}>s</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>👋 {user?.name}</span>
          <button onClick={logout} className="btn btn-ghost btn-sm" style={{ color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Announcements */}
        {data?.announcements?.length > 0 && (
          <div className="alert alert-info" style={{ marginBottom: 24 }}>
            📢 <strong>{data.announcements[0].title}:</strong> {data.announcements[0].message}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto', marginBottom: 28, background: 'white', borderRadius: 12, padding: 6, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              background: activeTab === tab ? 'var(--navy)' : 'transparent',
              color: activeTab === tab ? 'white' : 'var(--ink-light)',
              fontWeight: activeTab === tab ? 600 : 400, fontSize: '0.875rem', transition: 'all 0.15s',
            }}>{tab}</button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'Overview' && data && (
          <div>
            <div className="grid-4" style={{ marginBottom: 28 }}>
              {[
                { label: 'My Teachers', value: data.teachers?.length || 0, icon: '👨‍🏫', color: '#e8f4fd' },
                { label: 'Class', value: data.profile?.student_class ? `Class ${data.profile.student_class}` : 'N/A', icon: '📚', color: '#e8fdf4' },
                { label: 'Tests Taken', value: data.testResults?.length || 0, icon: '📝', color: '#fdf4e8' },
                { label: 'Classes/Week', value: data.schedule?.length || 0, icon: '📅', color: '#f4e8fd' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="stat-icon" style={{ background: s.color, fontSize: '1.6rem' }}>{s.icon}</div>
                  <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Assigned Teachers */}
              <div className="card-flat" style={{ padding: 24 }}>
                <h4 style={{ marginBottom: 16 }}>My Teachers</h4>
                {data.teachers?.length ? data.teachers.map(t => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{t.teacher_name[0]}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.teacher_name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--teal)' }}>{t.subject}</div>
                    </div>
                  </div>
                )) : <p style={{ color: 'var(--ink-lighter)', fontSize: '0.9rem' }}>No teachers assigned yet.</p>}
              </div>

              {/* This Week's Schedule */}
              <div className="card-flat" style={{ padding: 24 }}>
                <h4 style={{ marginBottom: 16 }}>Weekly Schedule</h4>
                {data.schedule?.length ? data.schedule.map(s => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.subject}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--ink-lighter)' }}>{s.teacher_name}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-navy" style={{ fontSize: '0.72rem' }}>{DAY[s.day_of_week]}</span>
                      <div style={{ fontSize: '0.78rem', color: 'var(--ink-lighter)', marginTop: 2 }}>{s.start_time?.slice(0,5)}</div>
                    </div>
                  </div>
                )) : <p style={{ color: 'var(--ink-lighter)', fontSize: '0.9rem' }}>No schedule assigned yet.</p>}
              </div>

              {/* Recent Test Results */}
              <div className="card-flat" style={{ padding: 24 }}>
                <h4 style={{ marginBottom: 16 }}>Recent Test Results</h4>
                {data.testResults?.length ? data.testResults.map(r => {
                  const pct = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
                  return (
                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.test_title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--ink-lighter)' }}>{new Date(r.created_at).toLocaleDateString('en-IN')}</div>
                      </div>
                      <span style={{ fontWeight: 700, color: pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--amber)' : 'var(--error)', fontSize: '1rem' }}>{pct}%</span>
                    </div>
                  );
                }) : <p style={{ color: 'var(--ink-lighter)', fontSize: '0.9rem' }}>No tests taken yet. <Link to="/practice-tests">Take a test →</Link></p>}
              </div>

              {/* Profile Summary */}
              <div className="card-flat" style={{ padding: 24 }}>
                <h4 style={{ marginBottom: 16 }}>My Profile</h4>
                {[
                  ['Name', data.profile?.name],
                  ['Email', data.profile?.email],
                  ['Phone', data.profile?.phone || 'Not set'],
                  ['Class', data.profile?.student_class ? `Class ${data.profile.student_class}` : 'Not set'],
                  ['Parent', data.profile?.parent_name || 'Not set'],
                  ['Parent Phone', data.profile?.parent_phone || 'Not set'],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--ink-lighter)' }}>{label}</span>
                    <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'Schedule' && (
          <div className="card-flat" style={{ padding: 28 }}>
            <h3 style={{ marginBottom: 24 }}>My Weekly Schedule</h3>
            {!tabData ? <div className="spinner" style={{ margin: '0 auto' }} /> : tabData.length === 0 ? (
              <p style={{ color: 'var(--ink-lighter)' }}>No schedule assigned yet. Contact your admin.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Day</th><th>Subject</th><th>Teacher</th><th>Time</th><th>Duration</th></tr></thead>
                  <tbody>
                    {tabData.map(s => (
                      <tr key={s.id}>
                        <td><strong>{DAY[s.day_of_week]}</strong></td>
                        <td>{s.subject}</td>
                        <td>{s.teacher_name}</td>
                        <td>{s.start_time?.slice(0,5)}</td>
                        <td>{s.duration_min} min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Homework Tab */}
        {activeTab === 'Homework' && (
          <div className="card-flat" style={{ padding: 28 }}>
            <h3 style={{ marginBottom: 24 }}>Homework</h3>
            {!tabData ? <div className="spinner" style={{ margin: '0 auto' }} /> : tabData.length === 0 ? (
              <p style={{ color: 'var(--ink-lighter)' }}>No homework assigned yet.</p>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {tabData.map(hw => (
                  <div key={hw.id} style={{ padding: 20, border: '1px solid var(--border)', borderRadius: 12, borderLeft: `4px solid ${hw.status === 'submitted' ? 'var(--success)' : hw.status === 'graded' ? 'var(--teal)' : 'var(--amber)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontSize: '1rem', marginBottom: 4 }}>{hw.title}</h4>
                        <span className="badge badge-teal" style={{ fontSize: '0.72rem' }}>{hw.subject}</span>
                      </div>
                      <span className={`badge ${hw.status === 'submitted' ? 'badge-success' : hw.status === 'graded' ? 'badge-teal' : 'badge-amber'}`}>{hw.status}</span>
                    </div>
                    {hw.description && <p style={{ fontSize: '0.875rem', margin: '10px 0' }}>{hw.description}</p>}
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-lighter)', marginTop: 8 }}>
                      Due: {hw.due_date ? new Date(hw.due_date).toLocaleDateString('en-IN') : 'No deadline'} · Teacher: {hw.teacher_name}
                    </div>
                    {hw.grade && <div style={{ marginTop: 8, fontWeight: 700, color: 'var(--teal)' }}>Grade: {hw.grade}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'Progress' && (
          <div className="card-flat" style={{ padding: 28 }}>
            <h3 style={{ marginBottom: 24 }}>Progress Reports</h3>
            {!tabData ? <div className="spinner" style={{ margin: '0 auto' }} /> : tabData.length === 0 ? (
              <p style={{ color: 'var(--ink-lighter)' }}>No progress reports yet.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Date</th><th>Subject</th><th>Score</th><th>Teacher</th><th>Remarks</th></tr></thead>
                  <tbody>
                    {tabData.map(p => (
                      <tr key={p.id}>
                        <td>{new Date(p.report_date).toLocaleDateString('en-IN')}</td>
                        <td>{p.subject}</td>
                        <td><strong style={{ color: p.score >= 80 ? 'var(--success)' : p.score >= 50 ? 'var(--amber)' : 'var(--error)' }}>{p.score}%</strong></td>
                        <td>{p.teacher_name}</td>
                        <td style={{ maxWidth: 200 }}>{p.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tests Tab */}
        {activeTab === 'Tests' && (
          <div>
            <div className="card-flat" style={{ padding: 28, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3>My Test Results</h3>
                <Link to="/practice-tests" className="btn btn-primary btn-sm">Take New Test →</Link>
              </div>
              {!tabData ? <div className="spinner" style={{ margin: '0 auto' }} /> : tabData.length === 0 ? (
                <p style={{ color: 'var(--ink-lighter)' }}>No tests taken yet. <Link to="/practice-tests">Explore practice tests →</Link></p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Test</th><th>Subject</th><th>Class</th><th>Score</th><th>Date</th></tr></thead>
                    <tbody>
                      {tabData.map(r => {
                        const pct = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
                        return (
                          <tr key={r.id}>
                            <td>{r.title}</td>
                            <td>{r.subject}</td>
                            <td>Class {r.class_no}</td>
                            <td><strong style={{ color: pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--amber)' : 'var(--error)' }}>{r.score}/{r.total} ({pct}%)</strong></td>
                            <td>{new Date(r.created_at).toLocaleDateString('en-IN')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'Attendance' && (
          <div className="card-flat" style={{ padding: 28 }}>
            <h3 style={{ marginBottom: 24 }}>Attendance Record</h3>
            {!tabData ? <div className="spinner" style={{ margin: '0 auto' }} /> : tabData.length === 0 ? (
              <p style={{ color: 'var(--ink-lighter)' }}>No attendance records yet.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Date</th><th>Subject</th><th>Status</th><th>Teacher</th><th>Remarks</th></tr></thead>
                  <tbody>
                    {tabData.map(a => (
                      <tr key={a.id}>
                        <td>{new Date(a.class_date).toLocaleDateString('en-IN')}</td>
                        <td>{a.subject}</td>
                        <td><span className={`badge ${a.status === 'present' ? 'badge-success' : a.status === 'late' ? 'badge-amber' : 'badge-error'}`}>{a.status}</span></td>
                        <td>{a.teacher_name}</td>
                        <td>{a.remarks || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Doubts Tab */}
        {activeTab === 'Doubts' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div className="card-flat" style={{ padding: 28 }}>
              <h3 style={{ marginBottom: 20 }}>Submit a Doubt</h3>
              {msg && <div className="alert alert-success">{msg}</div>}
              <form onSubmit={submitDoubt}>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input value={doubt.subject} onChange={e => setDoubt({ ...doubt, subject: e.target.value })} className="form-input" placeholder="e.g. Mathematics" />
                </div>
                <div className="form-group">
                  <label className="form-label">Your Question *</label>
                  <textarea value={doubt.question} onChange={e => setDoubt({ ...doubt, question: e.target.value })} className="form-input" rows={4} placeholder="Describe your doubt in detail..." required />
                </div>
                <button type="submit" className="btn btn-primary">Submit Doubt</button>
              </form>
            </div>
            <div className="card-flat" style={{ padding: 28 }}>
              <h3 style={{ marginBottom: 20 }}>My Doubts</h3>
              {!tabData ? <div className="spinner" style={{ margin: '0 auto' }} /> : tabData.length === 0 ? (
                <p style={{ color: 'var(--ink-lighter)' }}>No doubts submitted yet.</p>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {tabData.map(d => (
                    <div key={d.id} style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span className="badge badge-navy">{d.subject}</span>
                        <span className={`badge ${d.status === 'answered' ? 'badge-success' : 'badge-amber'}`}>{d.status}</span>
                      </div>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: d.answer ? 8 : 0 }}>{d.question}</p>
                      {d.answer && <div style={{ padding: '8px 12px', background: 'rgba(0,153,178,0.08)', borderRadius: 8, borderLeft: '3px solid var(--teal)', fontSize: '0.85rem', color: 'var(--teal)' }}><strong>Answer:</strong> {d.answer}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'Notes' && (
          <div className="card-flat" style={{ padding: 28 }}>
            <h3 style={{ marginBottom: 24 }}>Study Notes</h3>
            {!tabData ? <div className="spinner" style={{ margin: '0 auto' }} /> : tabData.length === 0 ? (
              <p style={{ color: 'var(--ink-lighter)' }}>No notes available yet.</p>
            ) : (
              <div className="grid-3">
                {tabData.map(n => (
                  <div key={n.id} className="card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                      <span className="badge badge-teal">{n.subject}</span>
                      {n.is_public ? <span className="badge badge-navy">Shared</span> : null}
                    </div>
                    <h4 style={{ fontSize: '1rem', marginBottom: 6 }}>{n.title}</h4>
                    <p style={{ fontSize: '0.85rem', marginBottom: 12 }}>{n.content?.slice(0, 120)}{n.content?.length > 120 ? '...' : ''}</p>
                    <div style={{ fontSize: '0.78rem', color: 'var(--ink-lighter)' }}>By {n.teacher_name} · {new Date(n.created_at).toLocaleDateString('en-IN')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
