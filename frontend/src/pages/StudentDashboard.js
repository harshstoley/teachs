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
  const [sideOpen, setSideOpen] = useState(false);
  const [doubt, setDoubt] = useState({ subject: '', question: '' });
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
    try { await api.post('/student/doubt', doubt); showMsg('Doubt submitted!'); setDoubt({ subject:'', question:'' }); } catch { showMsg('Failed.'); }
  };

  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--navy)' }}><div className="spinner"/></div>;

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', flexDirection:'column' }}>
      {/* Top Bar */}
      <div style={{ background:'var(--navy)', height:60, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={() => setSideOpen(!sideOpen)} style={{ background:'rgba(255,255,255,0.1)', border:'none', borderRadius:8, padding:'6px 10px', color:'var(--white)', fontSize:'1.1rem', display:'none' }} className="mob-menu-btn">☰</button>
          <span style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', fontWeight:700, color:'var(--white)' }}>Teach<span style={{ color:'var(--gold)' }}>s</span></span>
          <span style={{ fontSize:'0.75rem', color:'var(--slate)', display:'none' }} className="mob-hide">Student Portal</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ color:'var(--slate2)', fontSize:'0.88rem' }}>👋 {user?.name?.split(' ')[0]}</span>
          <button onClick={logout} style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, padding:'6px 14px', color:'var(--white)', fontSize:'0.85rem', cursor:'pointer' }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', width:'100%', padding:'24px 16px' }}>
        {/* Announcement */}
        {data?.announcements?.[0] && (
          <div className="alert alert-info" style={{ marginBottom:20 }}>📢 <strong>{data.announcements[0].title}:</strong> {data.announcements[0].message}</div>
        )}
        {msg && <div className="alert alert-success" style={{ marginBottom:20 }}>{msg}</div>}

        {/* Tabs */}
        <div className="tab-scroll" style={{ marginBottom:24 }}>
          {TABS.map(t => <button key={t} onClick={() => setActive(t)} className={`tab-btn${active===t?' active':''}`}>{t}</button>)}
        </div>

        {/* OVERVIEW */}
        {active==='Overview' && data && (
          <div>
            <h3 style={{ marginBottom:4 }}>Hello, {user?.name?.split(' ')[0]} 👋</h3>
            <p style={{ color:'var(--text2)', marginBottom:24, fontSize:'0.9rem' }}>Here's your learning summary</p>
            <div className="grid-4" style={{ marginBottom:24 }}>
              {[
                { label:'My Teachers', value:data.teachers?.length||0, icon:'👨‍🏫', bg:'#e8f4fd' },
                { label:'Class', value:data.profile?.student_class?`Class ${data.profile.student_class}`:'N/A', icon:'📚', bg:'#e8fdf4' },
                { label:'Tests Taken', value:data.testResults?.length||0, icon:'📝', bg:'#fdf4e8' },
                { label:'Classes/Week', value:data.schedule?.length||0, icon:'📅', bg:'#f4e8fd' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="stat-icon" style={{ background:s.bg }}>{s.icon}</div>
                  <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
                </div>
              ))}
            </div>
            <div className="grid-2">
              <div className="card-flat">
                <h4 style={{ marginBottom:16, color:'var(--text)' }}>My Teachers</h4>
                {data.teachers?.length ? data.teachers.map(t => (
                  <div key={t.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid rgba(30,49,80,0.06)' }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--gold)', fontWeight:700, fontSize:'1rem' }}>{t.teacher_name[0]}</div>
                    <div><div style={{ fontWeight:600, fontSize:'0.9rem' }}>{t.teacher_name}</div><div style={{ fontSize:'0.78rem', color:'var(--gold)' }}>{t.subject}</div></div>
                  </div>
                )) : <p style={{ color:'var(--text2)', fontSize:'0.9rem' }}>No teachers assigned yet.</p>}
              </div>
              <div className="card-flat">
                <h4 style={{ marginBottom:16, color:'var(--text)' }}>Weekly Schedule</h4>
                {data.schedule?.length ? data.schedule.map(s => (
                  <div key={s.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(30,49,80,0.06)' }}>
                    <div><div style={{ fontWeight:600, fontSize:'0.875rem' }}>{s.subject}</div><div style={{ fontSize:'0.78rem', color:'var(--text2)' }}>{s.teacher_name}</div></div>
                    <div style={{ textAlign:'right' }}>
                      <span className="badge badge-gold" style={{ fontSize:'0.68rem' }}>{DAY[s.day_of_week]}</span>
                      <div style={{ fontSize:'0.75rem', color:'var(--text2)', marginTop:2 }}>{s.start_time?.slice(0,5)}</div>
                    </div>
                  </div>
                )) : <p style={{ color:'var(--text2)', fontSize:'0.9rem' }}>No schedule yet.</p>}
              </div>
            </div>
          </div>
        )}

        {/* SCHEDULE */}
        {active==='Schedule' && (
          <div className="card-flat" style={{ padding:24 }}>
            <h3 style={{ marginBottom:20 }}>My Weekly Schedule</h3>
            {!tabData ? <div className="spinner" style={{ margin:'0 auto' }}/> : tabData.length===0 ? <p style={{ color:'var(--text2)' }}>No schedule assigned yet.</p> : (
              <div className="table-wrap">
                <table><thead><tr><th>Day</th><th>Subject</th><th>Teacher</th><th>Time</th><th>Duration</th></tr></thead>
                <tbody>{tabData.map(s => <tr key={s.id}><td><strong>{DAY[s.day_of_week]}</strong></td><td>{s.subject}</td><td>{s.teacher_name}</td><td>{s.start_time?.slice(0,5)}</td><td>{s.duration_min} min</td></tr>)}</tbody></table>
              </div>
            )}
          </div>
        )}

        {/* HOMEWORK */}
        {active==='Homework' && (
          <div className="card-flat" style={{ padding:24 }}>
            <h3 style={{ marginBottom:20 }}>Homework</h3>
            {!tabData ? <div className="spinner" style={{ margin:'0 auto' }}/> : tabData.length===0 ? <p style={{ color:'var(--text2)' }}>No homework yet.</p> : (
              <div style={{ display:'grid', gap:14 }}>
                {tabData.map(hw => (
                  <div key={hw.id} style={{ padding:18, border:'1px solid rgba(30,49,80,0.08)', borderRadius:12, borderLeft:`4px solid ${hw.status==='submitted'?'var(--success)':hw.status==='graded'?'var(--teal)':'var(--gold)'}` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                      <h4 style={{ fontSize:'0.95rem', fontFamily:'var(--font-body)', fontWeight:600 }}>{hw.title}</h4>
                      <span className={`badge ${hw.status==='submitted'?'badge-success':hw.status==='graded'?'badge-teal':'badge-amber'}`}>{hw.status}</span>
                    </div>
                    {hw.description && <p style={{ fontSize:'0.875rem', marginBottom:8, color:'var(--text2)' }}>{hw.description}</p>}
                    <div style={{ fontSize:'0.78rem', color:'var(--text2)' }}>Due: {hw.due_date?new Date(hw.due_date).toLocaleDateString('en-IN'):'No deadline'} · {hw.teacher_name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROGRESS */}
        {active==='Progress' && (
          <div className="card-flat" style={{ padding:24 }}>
            <h3 style={{ marginBottom:20 }}>Progress Reports</h3>
            {!tabData ? <div className="spinner" style={{ margin:'0 auto' }}/> : tabData.length===0 ? <p style={{ color:'var(--text2)' }}>No reports yet.</p> : (
              <div className="table-wrap"><table><thead><tr><th>Date</th><th>Subject</th><th>Score</th><th>Teacher</th><th>Remarks</th></tr></thead>
              <tbody>{tabData.map(p => <tr key={p.id}><td>{new Date(p.report_date).toLocaleDateString('en-IN')}</td><td>{p.subject}</td><td><strong style={{ color:p.score>=80?'var(--success)':p.score>=50?'var(--gold)':'var(--error)' }}>{p.score}%</strong></td><td>{p.teacher_name}</td><td>{p.remarks}</td></tr>)}</tbody></table></div>
            )}
          </div>
        )}

        {/* TESTS */}
        {active==='Tests' && (
          <div className="card-flat" style={{ padding:24 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h3>Test Results</h3>
              <Link to="/practice-tests" className="btn btn-primary btn-sm" style={{ background:'var(--gold)', color:'var(--navy)', padding:'8px 16px', borderRadius:8, fontWeight:700, fontSize:'0.85rem' }}>Take Test →</Link>
            </div>
            {!tabData ? <div className="spinner" style={{ margin:'0 auto' }}/> : tabData.length===0 ? <p style={{ color:'var(--text2)' }}>No tests taken yet.</p> : (
              <div className="table-wrap"><table><thead><tr><th>Test</th><th>Subject</th><th>Score</th><th>Date</th></tr></thead>
              <tbody>{tabData.map(r => { const pct=r.total>0?Math.round((r.score/r.total)*100):0; return <tr key={r.id}><td>{r.title}</td><td>{r.subject}</td><td><strong style={{ color:pct>=80?'var(--success)':pct>=50?'var(--gold)':'var(--error)' }}>{r.score}/{r.total} ({pct}%)</strong></td><td style={{ fontSize:'0.82rem' }}>{new Date(r.created_at).toLocaleDateString('en-IN')}</td></tr>; })}</tbody></table></div>
            )}
          </div>
        )}

        {/* ATTENDANCE */}
        {active==='Attendance' && (
          <div className="card-flat" style={{ padding:24 }}>
            <h3 style={{ marginBottom:20 }}>Attendance</h3>
            {!tabData ? <div className="spinner" style={{ margin:'0 auto' }}/> : tabData.length===0 ? <p style={{ color:'var(--text2)' }}>No records yet.</p> : (
              <div className="table-wrap"><table><thead><tr><th>Date</th><th>Subject</th><th>Status</th><th>Teacher</th></tr></thead>
              <tbody>{tabData.map(a => <tr key={a.id}><td>{new Date(a.class_date).toLocaleDateString('en-IN')}</td><td>{a.subject}</td><td><span className={`badge ${a.status==='present'?'badge-success':a.status==='late'?'badge-amber':'badge-error'}`}>{a.status}</span></td><td>{a.teacher_name}</td></tr>)}</tbody></table></div>
            )}
          </div>
        )}

        {/* DOUBTS */}
        {active==='Doubts' && (
          <div className="grid-2">
            <div className="card-flat" style={{ padding:24 }}>
              <h3 style={{ marginBottom:18 }}>Submit Doubt</h3>
              <form onSubmit={submitDoubt}>
                <div className="form-group"><label className="form-label">Subject</label><input value={doubt.subject} onChange={e => setDoubt({...doubt,subject:e.target.value})} className="form-input" placeholder="e.g. Mathematics"/></div>
                <div className="form-group"><label className="form-label">Your Question *</label><textarea value={doubt.question} onChange={e => setDoubt({...doubt,question:e.target.value})} className="form-input" rows={4} required placeholder="Describe your doubt..."/></div>
                <button type="submit" style={{ background:'var(--navy)', color:'var(--white)', border:'none', borderRadius:10, padding:'12px 24px', fontWeight:700, cursor:'pointer', width:'100%', fontFamily:'var(--font-body)' }}>Submit</button>
              </form>
            </div>
            <div className="card-flat" style={{ padding:24 }}>
              <h3 style={{ marginBottom:18 }}>My Doubts</h3>
              {!tabData ? <div className="spinner" style={{ margin:'0 auto' }}/> : tabData.length===0 ? <p style={{ color:'var(--text2)' }}>No doubts yet.</p> : (
                <div style={{ display:'grid', gap:12 }}>
                  {tabData.map(d => (
                    <div key={d.id} style={{ padding:14, border:'1px solid rgba(30,49,80,0.08)', borderRadius:10 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                        <span className="badge badge-navy">{d.subject}</span>
                        <span className={`badge ${d.status==='answered'?'badge-success':'badge-amber'}`}>{d.status}</span>
                      </div>
                      <p style={{ fontSize:'0.875rem', fontWeight:600, marginBottom:d.answer?8:0 }}>{d.question}</p>
                      {d.answer && <div style={{ padding:'8px 12px', background:'rgba(212,168,83,0.08)', borderRadius:8, borderLeft:'3px solid var(--gold)', fontSize:'0.85rem', color:'var(--text2)' }}><strong>Answer:</strong> {d.answer}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* NOTES */}
        {active==='Notes' && (
          <div className="card-flat" style={{ padding:24 }}>
            <h3 style={{ marginBottom:20 }}>Study Notes</h3>
            {!tabData ? <div className="spinner" style={{ margin:'0 auto' }}/> : tabData.length===0 ? <p style={{ color:'var(--text2)' }}>No notes yet.</p> : (
              <div className="grid-3">
                {tabData.map(n => (
                  <div key={n.id} className="card" style={{ padding:20 }}>
                    <span className="badge badge-gold" style={{ marginBottom:10 }}>{n.subject}</span>
                    <h4 style={{ fontSize:'0.95rem', marginBottom:8, fontFamily:'var(--font-body)', fontWeight:600 }}>{n.title}</h4>
                    <p style={{ fontSize:'0.83rem', color:'var(--text2)' }}>{n.content?.slice(0,100)}...</p>
                    <div style={{ fontSize:'0.75rem', color:'var(--slate)', marginTop:10 }}>By {n.teacher_name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`.mob-menu-btn{display:none!important}@media(max-width:600px){.mob-menu-btn{display:block!important}}`}</style>
    </div>
  );
}
