import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

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
  const windowStart = startMin - 10;
  const windowEnd = startMin + parseInt(durationMin || 60);
  return nowMin >= windowStart && nowMin <= windowEnd;
}

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [active, setActive] = useState('Overview');
  const [data, setData] = useState(null);
  const [tabData, setTabData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doubt, setDoubt] = useState({ subject:'', question:'', teacher_id:'' });
  const [msg, setMsg] = useState('');
  const [, setTick] = useState(0);

  // Homework upload state
  const [hwFiles, setHwFiles]     = useState({});
  const [hwTexts, setHwTexts]     = useState({});
  const [hwUploading, setHwUploading] = useState({});

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
    if (active === 'Overview') return;
    const ep = {
      Schedule:   '/student/schedule',
      Homework:   '/student/homework',
      Progress:   '/student/progress',
      Tests:      '/student/test-results',
      Attendance: '/student/attendance',
      Doubts:     '/student/doubts',
      Notes:      '/student/notes',
      Syllabus:   '/student/syllabus',
    };
    if (ep[active]) { setTabData(null); api.get(ep[active]).then(r => setTabData(r.data)).catch(() => setTabData([])); }
  }, [active]);

  const submitDoubt = async e => {
    e.preventDefault();
    if (!doubt.teacher_id) return showMsg('Please select a teacher');
    try {
      await api.post('/student/doubt', doubt);
      showMsg('Doubt submitted!');
      setDoubt({ subject:'', question:'', teacher_id:'' });
    } catch { showMsg('Failed.'); }
  };

  // Submit homework — file upload or text-only
  const submitHomework = async hwId => {
    const file = hwFiles[hwId];
    const text = hwTexts[hwId] || '';
    if (!file && !text.trim()) return showMsg('Please attach a file or write an answer.');
    setHwUploading(prev => ({ ...prev, [hwId]:true }));
    try {
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('submission_text', text);
        await api.post(`/student/homework/${hwId}/submit-file`, fd);
      } else {
        await api.post(`/student/homework/${hwId}/submit`, { submission_text: text });
      }
      showMsg('Homework submitted!');
      setHwFiles(prev => { const n={...prev}; delete n[hwId]; return n; });
      setHwTexts(prev => { const n={...prev}; delete n[hwId]; return n; });
      setTabData(null);
      api.get('/student/homework').then(r => setTabData(r.data)).catch(() => {});
    } catch { showMsg('Failed to submit.'); }
    finally { setHwUploading(prev => ({ ...prev, [hwId]:false })); }
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--ink)', flexDirection:'column', gap:16 }}>
      <div className="spinner" style={{ width:48, height:48 }}/>
      <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.85rem' }}>Loading your dashboard…</p>
    </div>
  );

  const card = { background:'white', borderRadius:16, padding:22, border:'1px solid var(--border)', boxShadow:'var(--shadow-xs)' };
  const myTeachers = data?.teachers || [];

  const JoinBtn = ({ item }) => {
    if (!item.meet_link) return null;
    if (!isClassJoinable(item.day_of_week, item.start_time, item.duration_min)) return null;
    return (
      <a href={item.meet_link} target="_blank" rel="noreferrer"
        style={{ display:'inline-block', padding:'6px 14px', background:'#0099B2', color:'white', borderRadius:8, fontWeight:700, fontSize:'0.78rem', textDecoration:'none', fontFamily:'var(--font-body)', whiteSpace:'nowrap' }}>
        🔴 Join Class
      </a>
    );
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column' }}>

      {/* Top Bar */}
      <div style={{ background:'var(--ink)', height:66, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', position:'sticky', top:0, zIndex:50, borderBottom:'1px solid rgba(59,114,245,0.15)', backdropFilter:'blur(12px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <Link to="/" style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:700, color:'white', textDecoration:'none' }}>Teach<span style={{ color:'var(--amber2)' }}>s</span></Link>
          <div style={{ height:20, width:1, background:'rgba(255,255,255,0.12)' }} />
          <span style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.35)', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase' }}>Student Portal</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ background:'rgba(59,114,245,0.15)', border:'1px solid rgba(59,114,245,0.25)', borderRadius:10, padding:'6px 14px', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg, var(--sapphire) 0%, var(--sky) 100%)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'0.85rem' }}>{user?.name?.[0]}</div>
            <span style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.87rem', fontWeight:500 }}>{user?.name?.split(' ')[0]}</span>
          </div>
          <button onClick={logout} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'8px 16px', color:'rgba(255,255,255,0.65)', fontSize:'0.84rem', cursor:'pointer', fontFamily:'var(--font-body)', transition:'all 0.2s' }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth:1120, margin:'0 auto', width:'100%', padding:'28px 20px' }}>
        {data?.announcements?.[0] && (
          <div style={{ background:'rgba(59,114,245,0.08)', border:'1px solid rgba(59,114,245,0.20)', borderRadius:12, padding:'14px 18px', marginBottom:22, display:'flex', alignItems:'center', gap:12, fontSize:'0.87rem', color:'var(--sapphire)' }}>
            📢 <strong>{data.announcements[0].title}:</strong> <span style={{ color:'var(--text2)' }}>{data.announcements[0].message}</span>
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
            <div style={{ background:'linear-gradient(135deg, var(--sapphire) 0%, var(--ink2) 100%)', borderRadius:20, padding:'24px 28px', marginBottom:24, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', right:-20, top:-20, width:120, height:120, borderRadius:'50%', background:'rgba(59,114,245,0.15)' }} />
              <h3 style={{ color:'white', marginBottom:4, fontFamily:'var(--font-display)', fontSize:'1.4rem' }}>Hello, {user?.name?.split(' ')[0]}! 👋</h3>
              <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.87rem' }}>Here's your learning summary for today.</p>
              {data.profile?.enrollment_no && (
                <div style={{ display:'inline-block', marginTop:10, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', padding:'4px 14px', borderRadius:100, fontSize:'0.78rem', color:'white', fontWeight:700, letterSpacing:'0.05em' }}>
                  🎓 Enrollment ID: {data.profile.enrollment_no}
                </div>
              )}
            </div>
            <div className="grid-4" style={{ marginBottom:24 }}>
              {[
                { label:'My Teachers',  value:myTeachers.length,           icon:'👨‍🏫', bg:'rgba(59,114,245,0.10)', border:'rgba(59,114,245,0.20)' },
                { label:'Class',        value:data.profile?.student_class?`Class ${data.profile.student_class}`:'N/A', icon:'📚', bg:'rgba(11,122,94,0.10)', border:'rgba(11,122,94,0.20)' },
                { label:'Tests Taken',  value:data.testResults?.length||0,  icon:'📝', bg:'rgba(200,130,10,0.10)', border:'rgba(200,130,10,0.20)' },
                { label:'Classes/Week', value:data.schedule?.length||0,    icon:'📅', bg:'rgba(26,58,143,0.10)',  border:'rgba(26,58,143,0.20)' },
              ].map(s => (
                <div key={s.label} style={{ background:s.bg, borderRadius:16, padding:'18px 16px', border:`1px solid ${s.border}`, display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:48, height:48, borderRadius:13, background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', boxShadow:'var(--shadow-xs)' }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize:'1.6rem', fontWeight:800, color:'var(--text)', lineHeight:1, fontFamily:'var(--font-body)' }}>{s.value}</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text3)', marginTop:3, fontWeight:500 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid-2">
              <div style={card}>
                <h4 style={{ marginBottom:18, color:'var(--text)', display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ width:28, height:28, borderRadius:8, background:'rgba(59,114,245,0.10)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem' }}>👨‍🏫</span>
                  My Teachers
                </h4>
                {myTeachers.length ? myTeachers.map(t => (
                  <div key={t.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
                    <div style={{ width:42, height:42, borderRadius:'50%', background:'linear-gradient(135deg, var(--sapphire) 0%, var(--sky) 100%)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'1.05rem' }}>{t.teacher_name[0]}</div>
                    <div>
                      <div style={{ fontWeight:600, fontSize:'0.92rem', color:'var(--text)' }}>{t.teacher_name}</div>
                      <div style={{ fontSize:'0.75rem', color:'#0b7a5e', fontWeight:600 }}>{t.subject}</div>
                    </div>
                  </div>
                )) : <p style={{ color:'var(--text3)', fontSize:'0.88rem' }}>No teachers assigned yet.</p>}
              </div>
              <div style={card}>
                <h4 style={{ marginBottom:18, color:'var(--text)', display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ width:28, height:28, borderRadius:8, background:'rgba(11,122,94,0.10)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem' }}>📅</span>
                  Weekly Schedule
                </h4>
                {data.schedule?.length ? data.schedule.map(s => (
                  <div key={s.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)', gap:8 }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:'0.88rem', color:'var(--text)' }}>{s.subject}</div>
                      <div style={{ fontSize:'0.75rem', color:'var(--text2)' }}>{s.teacher_name}</div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <JoinBtn item={s} />
                      <div style={{ textAlign:'right' }}>
                        <span className="badge badge-sapphire" style={{ fontSize:'0.68rem' }}>{DAY[s.day_of_week]}</span>
                        <div style={{ fontSize:'0.72rem', color:'var(--text3)', marginTop:3 }}>{s.start_time?.slice(0,5)}</div>
                      </div>
                    </div>
                  </div>
                )) : <p style={{ color:'var(--text3)', fontSize:'0.88rem' }}>No schedule yet.</p>}
              </div>
            </div>
          </div>
        )}

        {/* SCHEDULE TAB */}
        {active==='Schedule' && (
          <div style={card}>
            <h4 style={{ marginBottom:20, color:'var(--text)' }}>My Schedule</h4>
            {!tabData ? (
              <div style={{ display:'flex', justifyContent:'center', padding:32 }}><div className="spinner"/></div>
            ) : tabData.length === 0 ? (
              <div style={{ textAlign:'center', padding:40, color:'var(--text3)' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:12 }}>📭</div>
                <p>No schedule data available yet.</p>
              </div>
            ) : (
              tabData.map((s, i) => (
                <div key={i} style={{ padding:'12px 0', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:'0.9rem', color:'var(--text)' }}>{s.subject}</div>
                    {s.teacher_name && <div style={{ fontSize:'0.75rem', color:'var(--text3)', marginTop:2 }}>Teacher: {s.teacher_name}</div>}
                    <div style={{ fontSize:'0.75rem', color:'var(--text2)', marginTop:2 }}>{DAY[s.day_of_week]} · {s.start_time?.slice(0,5)} · {s.duration_min} min</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <JoinBtn item={s} />
                    <span className="badge badge-sapphire" style={{ fontSize:'0.68rem' }}>{DAY[s.day_of_week]}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* HOMEWORK TAB — file upload */}
        {active==='Homework' && (
          <div style={card}>
            <h4 style={{ marginBottom:20, color:'var(--text)' }}>My Homework</h4>
            {!tabData ? (
              <div style={{ display:'flex', justifyContent:'center', padding:32 }}><div className="spinner"/></div>
            ) : tabData.length===0 ? (
              <div style={{ textAlign:'center', padding:40, color:'var(--text3)' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:12 }}>📭</div>
                <p>No homework assigned yet.</p>
              </div>
            ) : (
              tabData.map(hw => (
                <div key={hw.id} style={{ padding:'16px 0', borderBottom:'1px solid var(--border)' }}>
                  {/* Header row */}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8, flexWrap:'wrap', gap:6 }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:'0.9rem', color:'var(--text)' }}>{hw.title}</div>
                      <div style={{ fontSize:'0.75rem', color:'var(--text3)', marginTop:2 }}>
                        {hw.teacher_name && <span>Teacher: {hw.teacher_name} · </span>}
                        {hw.subject && <span>{hw.subject}</span>}
                        {hw.due_date && <span> · Due: {hw.due_date?.slice(0,10)}</span>}
                      </div>
                      {hw.description && <p style={{ fontSize:'0.82rem', color:'var(--text2)', marginTop:4 }}>{hw.description}</p>}
                      {hw.grade && <div style={{ fontSize:'0.82rem', fontWeight:700, color:'#0b7a5e', marginTop:4 }}>Grade: {hw.grade}</div>}
                    </div>
                    <span className={`badge ${hw.status==='submitted'||hw.status==='graded'||hw.status==='completed'?'badge-emerald':'badge-amber'}`}>
                      {hw.status==='submitted'?'✓ Submitted':hw.status==='graded'?'⭐ Graded':hw.status==='completed'?'✓ Done':'⏳ Pending'}
                    </span>
                  </div>

                  {/* Existing file submission */}
                  {hw.file_url && (
                    <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(11,122,94,0.06)', border:'1px solid rgba(11,122,94,0.18)', borderRadius:8, padding:'8px 12px', marginBottom:8 }}>
                      <span>📎</span>
                      <a href={hw.file_url} target="_blank" rel="noreferrer" style={{ fontSize:'0.82rem', color:'#0b7a5e', fontWeight:600, textDecoration:'none' }}>View Submitted File</a>
                      {hw.original_filename && <span style={{ fontSize:'0.75rem', color:'var(--text3)' }}>({hw.original_filename})</span>}
                    </div>
                  )}
                  {hw.submission_text && !hw.file_url && (
                    <div style={{ fontSize:'0.8rem', color:'var(--sapphire)', background:'rgba(59,114,245,0.06)', padding:'6px 10px', borderRadius:8, marginBottom:8 }}>
                      Your answer: {hw.submission_text}
                    </div>
                  )}

                  {/* Upload form — only if pending */}
                  {(hw.status==='pending' || hw.status==='not_started') && (
                    <div style={{ marginTop:10, background:'rgba(59,114,245,0.04)', border:'1px solid rgba(59,114,245,0.12)', borderRadius:10, padding:'12px 14px' }}>
                      <div style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--text2)', marginBottom:8 }}>Submit Homework:</div>
                      <textarea
                        placeholder="Write your answer here (optional if attaching file)..."
                        value={hwTexts[hw.id]||''}
                        onChange={e => setHwTexts(prev => ({ ...prev, [hw.id]:e.target.value }))}
                        className="form-input"
                        rows={2}
                        style={{ marginBottom:10, fontSize:'0.82rem' }}
                      />
                      <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
                        <label style={{ cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:'0.82rem', color:'var(--sapphire)', fontWeight:600, background:'rgba(59,114,245,0.08)', border:'1px solid rgba(59,114,245,0.22)', borderRadius:7, padding:'6px 12px', whiteSpace:'nowrap' }}>
                          📎 {hwFiles[hw.id] ? hwFiles[hw.id].name : 'Attach File (Image/PDF)'}
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            style={{ display:'none' }}
                            onChange={e => setHwFiles(prev => ({ ...prev, [hw.id]:e.target.files[0] }))}
                          />
                        </label>
                        <button
                          onClick={() => submitHomework(hw.id)}
                          disabled={hwUploading[hw.id]}
                          style={{ padding:'7px 18px', background:'linear-gradient(135deg, var(--sapphire) 0%, var(--sapphire2) 100%)', color:'white', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'0.82rem', opacity:hwUploading[hw.id]?0.6:1 }}
                        >
                          {hwUploading[hw.id] ? 'Submitting…' : 'Submit →'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* DOUBTS — with teacher selection */}
        {active==='Doubts' && (
          <div>
            <div style={card}>
              <h4 style={{ marginBottom:20, color:'var(--text)' }}>Submit a Doubt</h4>
              <form onSubmit={submitDoubt}>
                <div className="form-group">
                  <label className="form-label">Select Teacher *</label>
                  <select value={doubt.teacher_id} onChange={e => setDoubt({ ...doubt, teacher_id:e.target.value })} className="form-input" required>
                    <option value="">-- Choose your teacher --</option>
                    {myTeachers.map(t => (
                      <option key={t.id} value={t.teacher_id || t.id}>{t.teacher_name} ({t.subject})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input value={doubt.subject} onChange={e => setDoubt({ ...doubt, subject:e.target.value })} className="form-input" placeholder="e.g. Mathematics" />
                </div>
                <div className="form-group">
                  <label className="form-label">Your Question *</label>
                  <textarea value={doubt.question} onChange={e => setDoubt({ ...doubt, question:e.target.value })} className="form-input" placeholder="Describe your doubt clearly..." required />
                </div>
                <button type="submit" style={{ background:'linear-gradient(135deg, var(--sapphire) 0%, var(--sapphire2) 100%)', color:'white', fontWeight:700, padding:'12px 24px', borderRadius:10, border:'none', cursor:'pointer', fontFamily:'var(--font-body)' }}>Submit Doubt →</button>
              </form>
            </div>
            {tabData && (
              <div style={{ ...card, marginTop:20 }}>
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

        {/* SYLLABUS TAB — read-only tree with progress */}
        {active==='Syllabus' && (
          <div>
            {!tabData ? (
              <div style={{ display:'flex', justifyContent:'center', padding:48 }}><div className="spinner"/></div>
            ) : tabData.length===0 ? (
              <div style={{ ...card, textAlign:'center', padding:48, color:'var(--text3)' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:12 }}>📚</div>
                <p>Your teacher hasn't added any syllabus yet.</p>
              </div>
            ) : (
              (() => {
                // Group by subject
                const subjects = {};
                tabData.forEach(item => {
                  if (!subjects[item.subject]) subjects[item.subject] = [];
                  subjects[item.subject].push(item);
                });
                return Object.entries(subjects).map(([subject, items]) => {
                  const pct = Math.round(items.filter(i => i.status==='completed').length / items.length * 100);
                  // Group by chapter
                  const chapters = {};
                  items.forEach(i => {
                    const c = i.chapter || 'General';
                    if (!chapters[c]) chapters[c] = [];
                    chapters[c].push(i);
                  });
                  return (
                    <div key={subject} style={{ ...card, marginBottom:16 }}>
                      {/* Subject header */}
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                        <h4 style={{ color:'var(--text)', margin:0, fontSize:'1rem' }}>📘 {subject}</h4>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:100, height:8, background:'rgba(0,0,0,0.08)', borderRadius:99, overflow:'hidden' }}>
                            <div style={{ width:`${pct}%`, height:'100%', background:'#0b7a5e', borderRadius:99, transition:'width 0.4s' }}/>
                          </div>
                          <span style={{ fontSize:'0.82rem', fontWeight:700, color:'#0b7a5e', minWidth:50 }}>{pct}% done</span>
                        </div>
                      </div>
                      {/* Chapters */}
                      {Object.entries(chapters).map(([chap, citems]) => {
                        const cpct = Math.round(citems.filter(i => i.status==='completed').length / citems.length * 100);
                        return (
                          <div key={chap} style={{ marginBottom:14 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                              <div style={{ fontSize:'0.77rem', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.07em' }}>📚 {chap}</div>
                              <span style={{ fontSize:'0.7rem', color:'var(--text3)' }}>{cpct}%</span>
                            </div>
                            {citems.map(item => (
                              <div key={item.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 0 7px 14px', borderLeft:'2px solid rgba(59,114,245,0.12)', marginBottom:2 }}>
                                <div style={{ fontSize:'0.84rem', color:'var(--text2)' }}>
                                  {item.topic && <span style={{ fontWeight:600, color:'var(--text)' }}>{item.topic}</span>}
                                  {item.subtopic && <span style={{ color:'var(--text3)' }}> → {item.subtopic}</span>}
                                  {!item.topic && !item.subtopic && <span style={{ color:'var(--text3)', fontStyle:'italic' }}>Chapter level</span>}
                                </div>
                                <span style={{
                                  fontSize:'0.72rem', fontWeight:700, padding:'2px 8px', borderRadius:20, whiteSpace:'nowrap',
                                  background: item.status==='completed'?'rgba(11,122,94,0.1)':item.status==='in_progress'?'rgba(200,130,10,0.1)':'rgba(0,0,0,0.06)',
                                  color: item.status==='completed'?'#0b7a5e':item.status==='in_progress'?'#b87a00':'var(--text3)'
                                }}>
                                  {item.status==='completed'?'✓ Done':item.status==='in_progress'?'↺ In Progress':'○ Not Started'}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  );
                });
              })()
            )}
          </div>
        )}

        {/* Generic tabs — NOT Overview, Schedule, Doubts, Homework, Syllabus */}
        {!['Overview','Schedule','Doubts','Homework','Syllabus'].includes(active) && (
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
