import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TABS = ['Overview','Schedule','Homework','Progress','Tests','Attendance','Doubts','Notes'];
const DAY = ['','Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [active, setActive] = useState('Overview');
  const [data, setData] = useState(null);
  const [tabData, setTabData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doubt, setDoubt] = useState({ subject: '', question: '', teacher_id: '' });
  const [msg, setMsg] = useState('');
  const showMsg = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  useEffect(() => {
    document.title = 'Student Dashboard | Teachs';
    api.get('/student/dashboard').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (active === 'Overview') return;
    const ep = { Schedule:'/student/schedule', Homework:'/student/homework', Progress:'/student/progress', Tests:'/student/test-results', Attendance:'/student/attendance', Doubts:'/student/doubts', Notes:'/student/notes' };
    if (ep[active]) { setTabData(null); api.get(ep[active]).then(r => setTabData(r.data)).catch(() => setTabData([])); }
  }, [active]);

  const submitDoubt = async e => {
    e.preventDefault();
    if (!doubt.teacher_id) return showMsg('Please select a teacher');
    try { await api.post('/student/doubt', doubt); showMsg('Doubt submitted!'); setDoubt({ subject:'', question:'', teacher_id:'' }); } catch { showMsg('Failed.'); }
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--ink)', flexDirection: 'column', gap: 16 }}>
      <div className="spinner" style={{ width: 48, height: 48 }}/>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>Loading your dashboard…</p>
    </div>
  );

  const card = { background: 'white', borderRadius: 16, padding: 22, border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' };

  const myTeachers = data?.teachers || [];

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      {/* Top Bar */}
      <div style={{ background:'var(--ink)', height:66, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', position:'sticky', top:0, zIndex:50, borderBottom: '1px solid rgba(59,114,245,0.15)', backdropFilter: 'blur(12px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <Link to="/" style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:700, color:'white', textDecoration: 'none' }}>Teach<span style={{ color:'var(--amber2)' }}>s</span></Link>
          <div style={{ height: 20, width: 1, background: 'rgba(255,255,255,0.12)' }} />
          <span style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.35)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Student Portal</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ background: 'rgba(59,114,245,0.15)', border: '1px solid rgba(59,114,245,0.25)', borderRadius: 10, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--sapphire) 0%, var(--sky) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>{user?.name?.[0]}</div>
            <span style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.87rem', fontWeight: 500 }}>{user?.name?.split(' ')[0]}</span>
          </div>
          <button onClick={logout} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'8px 16px', color:'rgba(255,255,255,0.65)', fontSize:'0.84rem', cursor:'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth:1120, margin:'0 auto', width:'100%', padding:'28px 20px' }}>
        {data?.announcements?.[0] && (
          <div style={{ background: 'rgba(59,114,245,0.08)', border: '1px solid rgba(59,114,245,0.20)', borderRadius: 12, padding: '14px 18px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.87rem', color: 'var(--sapphire)' }}>
            📢 <strong>{data.announcements[0].title}:</strong> <span style={{ color: 'var(--text2)' }}>{data.announcements[0].message}</span>
          </div>
        )}
        {msg && <div className="alert alert-success" style={{ marginBottom:20 }}>{msg}</div>}

        {/* Tabs */}
        <div className="tab-scroll" style={{ marginBottom:28 }}>
          {TABS.map(t => <button key={t} onClick={() => setActive(t)} className={`tab-btn${active===t?' active':''}`}>{t}</button>)}
        </div>

        {/* OVERVIEW */}
        {active==='Overview' && data && (
          <div>
            <div style={{ background: 'linear-gradient(135deg, var(--sapphire) 0%, var(--ink2) 100%)', borderRadius: 20, padding: '24px 28px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(59,114,245,0.15)' }} />
              <h3 style={{ color: 'white', marginBottom: 4, fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>Hello, {user?.name?.split(' ')[0]}! 👋</h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.87rem' }}>Here's your learning summary for today.</p>
            </div>
            <div className="grid-4" style={{ marginBottom:24 }}>
              {[
                { label:'My Teachers', value:myTeachers.length, icon:'👨‍🏫', bg:'rgba(59,114,245,0.10)', border:'rgba(59,114,245,0.20)' },
                { label:'Class', value:data.profile?.student_class?`Class ${data.profile.student_class}`:'N/A', icon:'📚', bg:'rgba(11,122,94,0.10)', border:'rgba(11,122,94,0.20)' },
                { label:'Tests Taken', value:data.testResults?.length||0, icon:'📝', bg:'rgba(200,130,10,0.10)', border:'rgba(200,130,10,0.20)' },
                { label:'Classes/Week', value:data.schedule?.length||0, icon:'📅', bg:'rgba(26,58,143,0.10)', border:'rgba(26,58,143,0.20)' },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: 16, padding: '18px 16px', border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 13, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', boxShadow: 'var(--shadow-xs)' }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1, fontFamily: 'var(--font-body)' }}>{s.value}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 3, fontWeight: 500 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid-2">
              <div style={card}>
                <h4 style={{ marginBottom:18, color:'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(59,114,245,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>👨‍🏫</span>
                  My Teachers
                </h4>
                {myTeachers.length ? myTeachers.map(t => (
                  <div key={t.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
                    <div style={{ width:42, height:42, borderRadius:'50%', background:'linear-gradient(135deg, var(--sapphire) 0%, var(--sky) 100%)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'1.05rem' }}>{t.teacher_name[0]}</div>
                    <div>
                      <div style={{ fontWeight:600, fontSize:'0.92rem', color: 'var(--text)' }}>{t.teacher_name}</div>
                      <div style={{ fontSize:'0.75rem', color:'var(--emerald2)', fontWeight: 600 }}>{t.subject}</div>
                    </div>
                  </div>
                )) : <p style={{ color:'var(--text3)', fontSize:'0.88rem' }}>No teachers assigned yet.</p>}
              </div>
              <div style={card}>
                <h4 style={{ marginBottom:18, color:'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(11,122,94,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>📅</span>
                  Weekly Schedule
                </h4>
                {data.schedule?.length ? data.schedule.map(s => (
                  <div key={s.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:'0.88rem', color: 'var(--text)' }}>{s.subject}</div>
                      <div style={{ fontSize:'0.75rem', color:'var(--text2)' }}>{s.teacher_name}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <span className="badge badge-sapphire" style={{ fontSize:'0.68rem' }}>{DAY[s.day_of_week]}</span>
                      <div style={{ fontSize:'0.72rem', color:'var(--text3)', marginTop:3 }}>{s.start_time?.slice(0,5)}</div>
                    </div>
                  </div>
                )) : <p style={{ color:'var(--text3)', fontSize:'0.88rem' }}>No schedule yet.</p>}
              </div>
            </div>
          </div>
        )}

        {/* DOUBTS — with teacher selection */}
        {active==='Doubts' && (
          <div>
            <div style={card}>
              <h4 style={{ marginBottom:20, color:'var(--text)' }}>Submit a Doubt</h4>
              <form onSubmit={submitDoubt}>
                {/* Teacher selector — NEW */}
                <div className="form-group">
                  <label className="form-label">Select Teacher *</label>
                  <select value={doubt.teacher_id} onChange={e => setDoubt({...doubt, teacher_id:e.target.value})} className="form-input" required>
                    <option value="">-- Choose your teacher --</option>
                    {myTeachers.map(t => (
                      <option key={t.id} value={t.teacher_id || t.id}>{t.teacher_name} ({t.subject})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input value={doubt.subject} onChange={e => setDoubt({...doubt, subject:e.target.value})} className="form-input" placeholder="e.g. Mathematics" />
                </div>
                <div className="form-group">
                  <label className="form-label">Your Question *</label>
                  <textarea value={doubt.question} onChange={e => setDoubt({...doubt, question:e.target.value})} className="form-input" placeholder="Describe your doubt clearly..." required />
                </div>
                <button type="submit" style={{ background: 'linear-gradient(135deg, var(--sapphire) 0%, var(--sapphire2) 100%)', color:'white', fontWeight:700, padding:'12px 24px', borderRadius:10, border:'none', cursor:'pointer', fontFamily:'var(--font-body)' }}>Submit Doubt →</button>
              </form>
            </div>
            {tabData && (
              <div style={{ ...card, marginTop: 20 }}>
                <h4 style={{ marginBottom:16 }}>Previous Doubts</h4>
                {tabData.length === 0 ? <p style={{ color:'var(--text3)', fontSize:'0.88rem' }}>No doubts submitted yet.</p> :
                  tabData.map(d => (
                    <div key={d.id} style={{ padding:'14px 0', borderBottom:'1px solid var(--border)' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, flexWrap:'wrap', gap:6 }}>
                        <div style={{ display:'flex', gap:6 }}>
                          <span className="badge badge-sapphire">{d.subject || 'General'}</span>
                          {d.teacher_name && <span style={{ fontSize:'0.75rem', color:'var(--text3)' }}>→ {d.teacher_name}</span>}
                        </div>
                        <span className={`badge ${d.status==='answered' ? 'badge-emerald' : 'badge-amber'}`}>{d.status==='answered' ? '✓ Answered' : '⏳ Pending'}</span>
                      </div>
                      <p style={{ fontSize:'0.87rem', color:'var(--text2)', marginBottom: d.answer ? 8 : 0 }}>{d.question}</p>
                      {d.answer && <div style={{ background:'var(--lavender)', borderRadius:8, padding:'10px 14px', fontSize:'0.84rem', color:'var(--sapphire)', borderLeft:'3px solid var(--sky)' }}><strong>Answer:</strong> {d.answer}</div>}
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        )}

        {/* Generic tabs */}
        {!['Overview','Doubts'].includes(active) && (
          <div style={card}>
            <h4 style={{ marginBottom:20, color:'var(--text)' }}>{active}</h4>
            {!tabData ? (
              <div style={{ display:'flex', justifyContent:'center', padding:32 }}><div className="spinner"/></div>
            ) : tabData.length === 0 ? (
              <div style={{ textAlign:'center', padding:40, color:'var(--text3)' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:12 }}>📭</div>
                <p>No {active.toLowerCase()} data available yet.</p>
              </div>
            ) : (
              <div>
                {tabData.map((item, i) => (
                  <div key={i} style={{ padding:'12px 0', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
                    <div>
                      {item.subject && <div style={{ fontWeight:600, fontSize:'0.9rem', color:'var(--text)' }}>{item.subject}</div>}
                      {item.title && <div style={{ fontWeight:600, fontSize:'0.9rem', color:'var(--text)' }}>{item.title}</div>}
                      {item.description && <div style={{ fontSize:'0.82rem', color:'var(--text2)', marginTop:3 }}>{item.description}</div>}
                      {item.remarks && <div style={{ fontSize:'0.82rem', color:'var(--text2)', marginTop:3 }}>{item.remarks}</div>}
                      {item.content && <div style={{ fontSize:'0.82rem', color:'var(--text2)', marginTop:3 }}>{item.content}</div>}
                      {item.teacher_name && <div style={{ fontSize:'0.75rem', color:'var(--text3)', marginTop:3 }}>Teacher: {item.teacher_name}</div>}
                    </div>
                    <div style={{ textAlign:'right' }}>
                      {item.score !== undefined && <span className="badge badge-emerald">Score: {item.score}%</span>}
                      {item.status && <span className={`badge ${item.status==='present'?'badge-emerald':item.status==='submitted'?'badge-sapphire':'badge-error'}`}>{item.status}</span>}
                      {item.grade && <div style={{ fontWeight:700, color:'var(--sapphire)', fontSize:'0.88rem' }}>Grade: {item.grade}</div>}
                      {item.due_date && <div style={{ fontSize:'0.75rem', color:'var(--text3)', marginTop:4 }}>Due: {item.due_date?.slice(0,10)}</div>}
                      {item.class_date && <div style={{ fontSize:'0.75rem', color:'var(--text3)' }}>{item.class_date?.slice(0,10)}</div>}
                      {item.day_of_week && <div style={{ fontSize:'0.75rem', color:'var(--text3)' }}>{DAY[item.day_of_week]} {item.start_time?.slice(0,5)}</div>}
                    </div>
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
