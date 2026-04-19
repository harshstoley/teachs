import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import SyllabusProgress from './SyllabusProgress';

const TABS = ['Overview','Schedule','Homework','Progress','Tests','Attendance','Doubts','Notes','Syllabus'];
const DAY = ['','Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function isClassJoinable(dayOfWeek, startTime, durationMin) {
  if (!startTime) return false;
  const now = new Date();
  const jsDay = now.getDay();
  const dbDay = jsDay === 0 ? 7 : jsDay;
  if (dbDay !== parseInt(dayOfWeek)) return false;
  const [h, m] = startTime.split(':').map(Number);
  const startMin = h * 60 + m;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return nowMin >= startMin - 10 && nowMin <= startMin + parseInt(durationMin || 60);
}

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [active, setActive] = useState('Overview');
  const [data, setData] = useState(null);
  const [tabData, setTabData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doubt, setDoubt] = useState({ subject: '', question: '', teacher_id: '' });
  const [msg, setMsg] = useState('');
  const [, setTick] = useState(0);
  const [submitText, setSubmitText] = useState({});

  const showMsg = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  useEffect(() => {
    document.title = 'Student Dashboard | Teachs';
    api.get('/student/dashboard').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (active === 'Overview' || active === 'Syllabus') return;
    const ep = {
      Schedule: '/student/schedule',
      Homework: '/student/homework',
      Progress: '/student/progress',
      Tests: '/student/test-results',
      Attendance: '/student/attendance',
      Doubts: '/student/doubts',
      Notes: '/student/notes',
    };
    if (ep[active]) { setTabData(null); api.get(ep[active]).then(r => setTabData(r.data)).catch(() => setTabData([])); }
  }, [active]);

  const submitDoubt = async e => {
    e.preventDefault();
    if (!doubt.teacher_id) return showMsg('Please select a teacher');
    try {
      await api.post('/student/doubt', doubt);
      showMsg('Doubt submitted!');
      setDoubt({ subject: '', question: '', teacher_id: '' });
    } catch { showMsg('Failed.'); }
  };

  const submitHw = async (id) => {
    try {
      await api.post(`/student/homework/${id}/submit`, { submission_text: submitText[id] || '' });
      showMsg('Homework submitted!');
      api.get('/student/homework').then(r => setTabData(r.data));
    } catch { showMsg('Failed.'); }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--ink)', flexDirection: 'column', gap: 16 }}>
      <div className="spinner" style={{ width: 48, height: 48 }} />
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>Loading your dashboard…</p>
    </div>
  );

  const card = { background: 'white', borderRadius: 16, padding: 22, border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' };
  const myTeachers = data?.teachers || [];

  const JoinBtn = ({ item }) => {
    if (!item.meet_link) return null;
    if (!isClassJoinable(item.day_of_week, item.start_time, item.duration_min)) return null;
    return (
      <a href={item.meet_link} target="_blank" rel="noreferrer" style={{ display: 'inline-block', padding: '6px 14px', background: '#0099B2', color: 'white', borderRadius: 8, fontWeight: 700, fontSize: '0.78rem', textDecoration: 'none', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
        🔴 Join Class
      </a>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <div style={{ background: 'var(--ink)', height: 66, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(59,114,245,0.15)', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'white', textDecoration: 'none' }}>Teach<span style={{ color: 'var(--amber2)' }}>s</span></Link>
          <div style={{ height: 20, width: 1, background: 'rgba(255,255,255,0.12)' }} />
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Student Portal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'rgba(59,114,245,0.15)', border: '1px solid rgba(59,114,245,0.25)', borderRadius: 10, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--sapphire) 0%, var(--sky) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>{user?.name?.[0]}</div>
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.87rem', fontWeight: 500 }}>{user?.name?.split(' ')[0]}</span>
          </div>
          <button onClick={logout} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '8px 16px', color: 'rgba(255,255,255,0.65)', fontSize: '0.84rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 1120, margin: '0 auto', width: '100%', padding: '28px 20px' }}>
        {data?.announcements?.[0] && (
          <div style={{ background: 'rgba(59,114,245,0.08)', border: '1px solid rgba(59,114,245,0.20)', borderRadius: 12, padding: '14px 18px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.87rem', color: 'var(--sapphire)' }}>
            📢 <strong>{data.announcements[0].title}:</strong> <span style={{ color: 'var(--text2)' }}>{data.announcements[0].message}</span>
          </div>
        )}

        {msg && <div className="alert alert-success" style={{ marginBottom: 20 }}>{msg}</div>}

        {/* Tabs */}
        <div className="tab-scroll" style={{ marginBottom: 28 }}>
          {TABS.map(t => <button key={t} onClick={() => setActive(t)} className={`tab-btn${active === t ? ' active' : ''}`}>{t}</button>)}
        </div>

        {/* OVERVIEW */}
        {active === 'Overview' && data && (
          <div>
            <div style={{ background: 'linear-gradient(135deg, var(--sapphire) 0%, var(--ink2) 100%)', borderRadius: 20, padding: '24px 28px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(59,114,245,0.15)' }} />
              <h3 style={{ color: 'white', marginBottom: 4, fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>Hello, {user?.name?.split(' ')[0]}! 👋</h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.87rem' }}>Here's your learning summary for today.</p>
              {data.profile?.enrollment_no && (
                <div style={{ display: 'inline-block', marginTop: 10, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 14px', borderRadius: 100, fontSize: '0.78rem', color: 'white' }}>
                  ID: {data.profile.enrollment_no}
                </div>
              )}
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 14, marginBottom: 24 }}>
              {[
                { label: 'My Teachers', val: myTeachers.length, icon: '👩‍🏫' },
                { label: 'Classes/Week', val: data.schedule?.length || 0, icon: '📅' },
                { label: 'Pending HW', val: data.testResults?.length || 0, icon: '📝' },
                { label: 'Class', val: data.profile?.student_class ? `Class ${data.profile.student_class}` : '—', icon: '🎓' },
              ].map(({ label, val, icon }) => (
                <div key={label} style={{ ...card, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--sapphire)' }}>{val}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Teachers */}
            {myTeachers.length > 0 && (
              <div style={{ ...card, marginBottom: 20 }}>
                <h4 style={{ marginBottom: 14, color: 'var(--text)' }}>My Teachers</h4>
                {myTeachers.map(t => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{t.teacher_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{t.subject} · {t.qualification}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upcoming classes */}
            {data.schedule?.length > 0 && (
              <div style={card}>
                <h4 style={{ marginBottom: 14, color: 'var(--text)' }}>📅 Upcoming Classes</h4>
                {data.schedule.slice(0, 4).map(s => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.87rem', color: 'var(--text)' }}>{s.teacher_name} · {s.subject}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text3)' }}>{DAY[s.day_of_week]} {s.start_time?.slice(0, 5)} · {s.duration_min} min</div>
                    </div>
                    <JoinBtn item={s} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SCHEDULE */}
        {active === 'Schedule' && (
          <div style={card}>
            <h4 style={{ marginBottom: 16, color: 'var(--text)' }}>My Schedule</h4>
            {!tabData ? <div className="spinner" style={{ margin: '24px auto' }} /> :
              tabData.length === 0 ? <p style={{ color: 'var(--text3)' }}>No classes scheduled yet.</p> :
                tabData.map(s => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{s.teacher_name} · {s.subject}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 2 }}>{DAY[s.day_of_week]} · {s.start_time?.slice(0, 5)} · {s.duration_min} min</div>
                    </div>
                    <JoinBtn item={s} />
                  </div>
                ))
            }
          </div>
        )}

        {/* HOMEWORK */}
        {active === 'Homework' && (
          <div style={card}>
            <h4 style={{ marginBottom: 16, color: 'var(--text)' }}>My Homework</h4>
            {!tabData ? <div className="spinner" style={{ margin: '24px auto' }} /> :
              tabData.length === 0 ? <p style={{ color: 'var(--text3)' }}>No homework assigned yet.</p> :
                tabData.map(h => (
                  <div key={h.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text)' }}>{h.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 2 }}>{h.teacher_name} · {h.subject} · Due: {h.due_date || '—'}</div>
                        {h.description && <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginTop: 4 }}>{h.description}</div>}
                      </div>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, background: h.status === 'graded' ? 'rgba(34,197,94,0.1)' : h.status === 'submitted' ? 'rgba(59,114,245,0.1)' : 'rgba(245,166,35,0.1)', color: h.status === 'graded' ? '#16a34a' : h.status === 'submitted' ? 'var(--sapphire)' : '#b45309' }}>{h.status}</span>
                    </div>
                    {h.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input value={submitText[h.id] || ''} onChange={e => setSubmitText(p => ({ ...p, [h.id]: e.target.value }))} className="form-input" placeholder="Write your answer or note..." style={{ flex: 1, fontSize: '0.82rem' }} />
                        <button onClick={() => submitHw(h.id)} style={{ padding: '7px 14px', background: '#1B3A6B', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.82rem' }}>Submit</button>
                      </div>
                    )}
                    {h.grade && <div style={{ marginTop: 6, fontSize: '0.8rem', color: '#16a34a', fontWeight: 700 }}>Grade: {h.grade}</div>}
                  </div>
                ))
            }
          </div>
        )}

        {/* PROGRESS */}
        {active === 'Progress' && (
          <div style={card}>
            <h4 style={{ marginBottom: 16, color: 'var(--text)' }}>Progress Reports</h4>
            {!tabData ? <div className="spinner" style={{ margin: '24px auto' }} /> :
              tabData.length === 0 ? <p style={{ color: 'var(--text3)' }}>No progress reports yet.</p> :
                tabData.map((p, i) => (
                  <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text)' }}>{p.subject} · {p.teacher_name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{p.report_date}</div>
                        {p.remarks && <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginTop: 4 }}>{p.remarks}</div>}
                      </div>
                      {p.score && <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--sapphire)' }}>{p.score}</div>}
                    </div>
                  </div>
                ))
            }
          </div>
        )}

        {/* TESTS */}
        {active === 'Tests' && (
          <div style={card}>
            <h4 style={{ marginBottom: 16, color: 'var(--text)' }}>Test Results</h4>
            {!tabData ? <div className="spinner" style={{ margin: '24px auto' }} /> :
              tabData.length === 0 ? <p style={{ color: 'var(--text3)' }}>No test results yet.</p> :
                tabData.map(t => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{t.title || t.test_title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{t.subject} · {t.created_at?.slice(0, 10)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--sapphire)' }}>{t.score}/{t.total}</div>
                      {t.remarks && <div style={{ fontSize: '0.73rem', color: 'var(--text3)' }}>{t.remarks}</div>}
                    </div>
                  </div>
                ))
            }
          </div>
        )}

        {/* ATTENDANCE */}
        {active === 'Attendance' && (
          <div style={card}>
            <h4 style={{ marginBottom: 16, color: 'var(--text)' }}>Attendance History</h4>
            {!tabData ? <div className="spinner" style={{ margin: '24px auto' }} /> :
              tabData.length === 0 ? <p style={{ color: 'var(--text3)' }}>No attendance records yet.</p> :
                tabData.map((a, i) => (
                  <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text)' }}>{a.class_date} · {a.subject}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{a.teacher_name}</div>
                        {a.topic_taught && <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginTop: 4 }}>📖 {a.topic_taught}{a.sub_topic ? ` — ${a.sub_topic}` : ''}</div>}
                        {a.homework_given && <div style={{ fontSize: '0.77rem', color: '#b45309', marginTop: 2 }}>📝 HW: {a.homework_given}</div>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {a.class_rating && <div style={{ width: 28, height: 28, borderRadius: '50%', background: a.class_rating >= 4 ? '#22c55e' : a.class_rating === 3 ? '#F5A623' : '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.8rem' }}>{a.class_rating}</div>}
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, background: a.status === 'present' ? 'rgba(34,197,94,0.1)' : 'rgba(220,38,38,0.1)', color: a.status === 'present' ? '#16a34a' : '#dc2626' }}>{a.status}</span>
                      </div>
                    </div>
                  </div>
                ))
            }
          </div>
        )}

        {/* DOUBTS */}
        {active === 'Doubts' && (
          <div style={{ display: 'grid', gap: 20 }}>
            <div style={{ ...card, maxWidth: 540 }}>
              <h4 style={{ marginBottom: 16, color: 'var(--text)' }}>Ask a Doubt</h4>
              <form onSubmit={submitDoubt}>
                <div className="form-group">
                  <label className="form-label">Teacher *</label>
                  <select value={doubt.teacher_id} onChange={e => setDoubt({ ...doubt, teacher_id: e.target.value })} className="form-input" required>
                    <option value="">Select Teacher</option>
                    {myTeachers.map(t => <option key={t.teacher_id} value={t.teacher_id}>{t.teacher_name} · {t.subject}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Subject</label><input value={doubt.subject} onChange={e => setDoubt({ ...doubt, subject: e.target.value })} className="form-input" placeholder="Subject" /></div>
                <div className="form-group"><label className="form-label">Question *</label><textarea value={doubt.question} onChange={e => setDoubt({ ...doubt, question: e.target.value })} className="form-input" rows={3} placeholder="Describe your doubt clearly..." required /></div>
                <button type="submit" style={{ background: 'linear-gradient(135deg, var(--sapphire) 0%, var(--sky) 100%)', color: 'white', fontWeight: 700, padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', width: '100%' }}>Submit Doubt</button>
              </form>
            </div>

            <div style={card}>
              <h4 style={{ marginBottom: 14, color: 'var(--text)' }}>My Doubts</h4>
              {!tabData ? <div className="spinner" style={{ margin: '24px auto' }} /> :
                tabData?.length === 0 ? <p style={{ color: 'var(--text3)' }}>No doubts submitted yet.</p> :
                  tabData?.map(d => (
                    <div key={d.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.87rem', color: 'var(--text)' }}>{d.question}</div>
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, background: d.status === 'answered' ? 'rgba(34,197,94,0.1)' : 'rgba(245,166,35,0.1)', color: d.status === 'answered' ? '#16a34a' : '#b45309' }}>{d.status}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{d.teacher_name} · {d.subject}</div>
                      {d.answer && <div style={{ marginTop: 8, fontSize: '0.83rem', color: '#16a34a', background: 'rgba(34,197,94,0.07)', padding: '8px 12px', borderRadius: 8 }}>✓ {d.answer}</div>}
                    </div>
                  ))
              }
            </div>
          </div>
        )}

        {/* NOTES */}
        {active === 'Notes' && (
          <div style={card}>
            <h4 style={{ marginBottom: 16, color: 'var(--text)' }}>Notes from Teachers</h4>
            {!tabData ? <div className="spinner" style={{ margin: '24px auto' }} /> :
              tabData.length === 0 ? <p style={{ color: 'var(--text3)' }}>No notes yet.</p> :
                tabData.map(n => (
                  <div key={n.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text)' }}>{n.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 2 }}>{n.teacher_name} · {n.subject} · {n.created_at?.slice(0, 10)}</div>
                    {n.content && <div style={{ fontSize: '0.83rem', color: 'var(--text2)', marginTop: 6, lineHeight: 1.6 }}>{n.content}</div>}
                  </div>
                ))
            }
          </div>
        )}

        {/* SYLLABUS — new tab */}
        {active === 'Syllabus' && <SyllabusProgress />}

      </div>
    </div>
  );
}
