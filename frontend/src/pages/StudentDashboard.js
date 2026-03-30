import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TABS = ['Overview','Schedule','Homework','Progress','Tests','Attendance','Doubts','Notes'];
const DAY = ['','Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const dark = { background:'#152238', border:'1px solid rgba(212,168,83,0.15)', borderRadius:14 };
const inp = { width:'100%', padding:'11px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(212,168,83,0.2)', borderRadius:10, color:'#fff', fontSize:'0.9rem', fontFamily:'var(--font-body)', outline:'none' };

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [active, setActive] = useState('Overview');
  const [data, setData] = useState(null);
  const [tabData, setTabData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doubt, setDoubt] = useState({ subject:'', question:'', teacher_id:'' });
  const [msg, setMsg] = useState({ text:'', type:'' });
  const showMsg = (text, type='success') => { setMsg({text,type}); setTimeout(()=>setMsg({text:'',type:''}),3000); };

  useEffect(() => {
    document.title = 'Student Dashboard | Teachs';
    api.get('/student/dashboard').then(r => setData(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  useEffect(() => {
    if (active === 'Overview') return;
    const ep = { Schedule:'/student/schedule', Homework:'/student/homework', Progress:'/student/progress', Tests:'/student/test-results', Attendance:'/student/attendance', Doubts:'/student/doubts', Notes:'/student/notes' };
    if (ep[active]) { setTabData(null); api.get(ep[active]).then(r=>setTabData(r.data)).catch(()=>setTabData([])); }
  }, [active]);

  const submitDoubt = async e => {
    e.preventDefault();
    if (!doubt.question) return showMsg('Please write your question','error');
    if (!doubt.teacher_id) return showMsg('Please select a teacher','error');
    try { await api.post('/student/doubt', doubt); showMsg('Doubt submitted!'); setDoubt({subject:'',question:'',teacher_id:''}); } catch { showMsg('Failed.','error'); }
  };

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'var(--navy)'}}><div className="spinner"/></div>;

  const myTeachers = data?.teachers || [];

  return (
    <div style={{ minHeight:'100vh', background:'var(--navy)' }}>
      {/* Top Bar */}
      <div style={{ background:'#0a1628', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px', position:'sticky', top:0, zIndex:50, borderBottom:'1px solid rgba(212,168,83,0.12)' }}>
        <span style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', fontWeight:700, color:'#fff' }}>Teach<span style={{color:'var(--gold)'}}>s</span></span>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{color:'var(--slate2)',fontSize:'0.85rem'}}>👋 {user?.name?.split(' ')[0]}</span>
          <button onClick={logout} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:8,padding:'6px 12px',color:'#fff',fontSize:'0.8rem',cursor:'pointer',fontFamily:'var(--font-body)'}}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'20px 14px' }}>
        {data?.announcements?.[0] && <div className="alert alert-info" style={{marginBottom:16,background:'rgba(212,168,83,0.08)',border:'1px solid rgba(212,168,83,0.2)',color:'var(--gold)'}}>📢 {data.announcements[0].message}</div>}
        {msg.text && <div className={`alert alert-${msg.type}`} style={{marginBottom:16}}>{msg.text}</div>}

        {/* Tabs */}
        <div className="tab-scroll" style={{marginBottom:20,background:'#152238',border:'1px solid rgba(212,168,83,0.12)'}}>
          {TABS.map(t=><button key={t} onClick={()=>setActive(t)} style={{padding:'8px 14px',borderRadius:8,border:'none',cursor:'pointer',whiteSpace:'nowrap',background:active===t?'var(--gold)':'transparent',color:active===t?'var(--navy)':'var(--slate2)',fontWeight:active===t?700:400,fontSize:'0.84rem',transition:'all 0.15s',flexShrink:0,fontFamily:'var(--font-body)'}}>{t}</button>)}
        </div>

        {/* OVERVIEW */}
        {active==='Overview' && data && (
          <div>
            <h3 style={{color:'#fff',marginBottom:4}}>Hello, {user?.name?.split(' ')[0]} 👋</h3>
            <p style={{color:'var(--slate)',marginBottom:20,fontSize:'0.875rem'}}>Here's your learning summary</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12,marginBottom:20}}>
              {[{label:'My Teachers',value:myTeachers.length,icon:'👨‍🏫'},{label:'Class',value:data.profile?.student_class?`Class ${data.profile.student_class}`:'N/A',icon:'📚'},{label:'Tests Taken',value:data.testResults?.length||0,icon:'📝'},{label:'Classes/Week',value:data.schedule?.length||0,icon:'📅'}].map(s=>(
                <div key={s.label} style={{...dark,padding:'16px 14px',display:'flex',alignItems:'center',gap:12}}>
                  <div style={{fontSize:'1.4rem'}}>{s.icon}</div>
                  <div><div style={{fontSize:'1.3rem',fontWeight:800,color:'#fff',lineHeight:1,fontFamily:'var(--font-body)'}}>{s.value}</div><div style={{fontSize:'0.72rem',color:'var(--slate)',marginTop:2}}>{s.label}</div></div>
                </div>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>
              <div style={{...dark,padding:20}}>
                <h4 style={{color:'#fff',marginBottom:14,fontFamily:'var(--font-body)',fontWeight:700,fontSize:'0.95rem'}}>My Teachers</h4>
                {myTeachers.length ? myTeachers.map(t=>(
                  <div key={t.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{width:38,height:38,borderRadius:'50%',background:'rgba(212,168,83,0.15)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--gold)',fontWeight:700}}>{t.teacher_name[0]}</div>
                    <div><div style={{fontWeight:600,fontSize:'0.875rem',color:'#fff'}}>{t.teacher_name}</div><div style={{fontSize:'0.75rem',color:'var(--gold)'}}>{t.subject}</div></div>
                  </div>
                )) : <p style={{color:'var(--slate)',fontSize:'0.875rem'}}>No teachers assigned yet.</p>}
              </div>
              <div style={{...dark,padding:20}}>
                <h4 style={{color:'#fff',marginBottom:14,fontFamily:'var(--font-body)',fontWeight:700,fontSize:'0.95rem'}}>Weekly Schedule</h4>
                {data.schedule?.length ? data.schedule.map(s=>(
                  <div key={s.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                    <div><div style={{fontWeight:600,fontSize:'0.875rem',color:'#fff'}}>{s.subject}</div><div style={{fontSize:'0.75rem',color:'var(--slate)'}}>{s.teacher_name}</div></div>
                    <div style={{textAlign:'right'}}><span style={{background:'rgba(212,168,83,0.12)',color:'var(--gold)',padding:'2px 8px',borderRadius:100,fontSize:'0.68rem',fontWeight:700}}>{DAY[s.day_of_week]}</span><div style={{fontSize:'0.72rem',color:'var(--slate)',marginTop:2}}>{s.start_time?.slice(0,5)}</div></div>
                  </div>
                )) : <p style={{color:'var(--slate)',fontSize:'0.875rem'}}>No schedule yet.</p>}
              </div>
            </div>
          </div>
        )}

        {/* SCHEDULE */}
        {active==='Schedule' && (
          <div style={{...dark,padding:20}}>
            <h3 style={{color:'#fff',marginBottom:18,fontFamily:'var(--font-body)',fontWeight:700}}>My Weekly Schedule</h3>
            {!tabData ? <div className="spinner" style={{margin:'0 auto',borderTopColor:'var(--gold)'}}/> : tabData.length===0 ? <p style={{color:'var(--slate)'}}>No schedule assigned yet.</p> : (
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',minWidth:400}}>
                  <thead><tr>{['Day','Date','Subject','Teacher','Time','Duration'].map(h=><th key={h} style={{padding:'10px 12px',background:'#0f1e35',textAlign:'left',fontSize:'0.75rem',fontWeight:700,color:'var(--slate2)',textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</th>)}</tr></thead>
                  <tbody>{tabData.map(s=><tr key={s.id}><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'#fff',fontWeight:600}}>{DAY[s.day_of_week]}</td><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--slate2)',fontSize:'0.82rem'}}>Weekly</td><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--gold)'}}>{s.subject}</td><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--slate2)'}}>{s.teacher_name}</td><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--slate2)'}}>{s.start_time?.slice(0,5)}</td><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--slate2)'}}>{s.duration_min} min</td></tr>)}</tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* HOMEWORK */}
        {active==='Homework' && (
          <div style={{...dark,padding:20}}>
            <h3 style={{color:'#fff',marginBottom:18,fontFamily:'var(--font-body)',fontWeight:700}}>Homework</h3>
            {!tabData ? <div className="spinner" style={{margin:'0 auto',borderTopColor:'var(--gold)'}}/> : tabData.length===0 ? <p style={{color:'var(--slate)'}}>No homework assigned yet.</p> : (
              <div style={{display:'grid',gap:12}}>
                {tabData.map(hw=>(
                  <div key={hw.id} style={{background:'#0f1e35',border:`1px solid ${hw.status==='submitted'?'rgba(42,138,94,0.4)':hw.status==='graded'?'rgba(0,153,178,0.4)':'rgba(212,168,83,0.25)'}`,borderRadius:12,padding:'16px 18px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8,flexWrap:'wrap',gap:8}}>
                      <h4 style={{color:'#fff',fontFamily:'var(--font-body)',fontWeight:700,fontSize:'0.95rem'}}>{hw.title}</h4>
                      <span style={{background:hw.status==='submitted'?'rgba(42,138,94,0.15)':hw.status==='graded'?'rgba(0,153,178,0.15)':'rgba(212,168,83,0.15)',color:hw.status==='submitted'?'#5BC8A0':hw.status==='graded'?'var(--teal)':'var(--gold)',padding:'3px 10px',borderRadius:100,fontSize:'0.7rem',fontWeight:700,textTransform:'uppercase'}}>{hw.status}</span>
                    </div>
                    {hw.description && <p style={{fontSize:'0.85rem',color:'var(--slate2)',marginBottom:8,lineHeight:1.6}}>{hw.description}</p>}
                    <div style={{fontSize:'0.75rem',color:'var(--slate)'}}>Due: {hw.due_date?new Date(hw.due_date).toLocaleDateString('en-IN'):'No deadline'} · {hw.teacher_name}</div>
                    {hw.grade && <div style={{marginTop:8,fontWeight:700,color:'var(--gold)'}}>Grade: {hw.grade}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROGRESS */}
        {active==='Progress' && (
          <div style={{...dark,padding:20}}>
            <h3 style={{color:'#fff',marginBottom:18,fontFamily:'var(--font-body)',fontWeight:700}}>Progress Reports</h3>
            {!tabData ? <div className="spinner" style={{margin:'0 auto',borderTopColor:'var(--gold)'}}/> : tabData.length===0 ? <p style={{color:'var(--slate)'}}>No reports yet.</p> : (
              <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',minWidth:400}}>
                <thead><tr>{['Date','Subject','Score','Teacher','Remarks'].map(h=><th key={h} style={{padding:'10px 12px',background:'#0f1e35',textAlign:'left',fontSize:'0.75rem',fontWeight:700,color:'var(--slate2)',textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
                <tbody>{tabData.map(p=><tr key={p.id}><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--slate2)',fontSize:'0.82rem'}}>{new Date(p.report_date).toLocaleDateString('en-IN')}</td><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--gold)'}}>{p.subject}</td><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)'}}><strong style={{color:p.score>=80?'#5BC8A0':p.score>=50?'var(--gold)':'#e74c3c'}}>{p.score}%</strong></td><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--slate2)'}}>{p.teacher_name}</td><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--slate2)',fontSize:'0.82rem'}}>{p.remarks}</td></tr>)}</tbody>
              </table></div>
            )}
          </div>
        )}

        {/* TESTS */}
        {active==='Tests' && (
          <div style={{...dark,padding:20}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18,flexWrap:'wrap',gap:10}}>
              <h3 style={{color:'#fff',fontFamily:'var(--font-body)',fontWeight:700}}>Test Results</h3>
              <Link to="/practice-tests" style={{background:'var(--gold)',color:'var(--navy)',fontWeight:700,padding:'8px 16px',borderRadius:8,fontSize:'0.85rem'}}>Take Test →</Link>
            </div>
            {!tabData ? <div className="spinner" style={{margin:'0 auto',borderTopColor:'var(--gold)'}}/> : tabData.length===0 ? <p style={{color:'var(--slate)'}}>No tests taken yet.</p> : (
              <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',minWidth:350}}>
                <thead><tr>{['Test','Subject','Score','Date'].map(h=><th key={h} style={{padding:'10px 12px',background:'#0f1e35',textAlign:'left',fontSize:'0.75rem',fontWeight:700,color:'var(--slate2)',textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
                <tbody>{tabData.map(r=>{const pct=r.total>0?Math.round((r.score/r.total)*100):0;return<tr key={r.id}><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'#fff',fontWeight:600,fontSize:'0.875rem'}}>{r.title}</td><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--gold)'}}>{r.subject}</td><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)'}}><strong style={{color:pct>=80?'#5BC8A0':pct>=50?'var(--gold)':'#e74c3c'}}>{r.score}/{r.total} ({pct}%)</strong></td><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)',fontSize:'0.78rem',color:'var(--slate)'}}>{new Date(r.created_at).toLocaleDateString('en-IN')}</td></tr>;})}</tbody>
              </table></div>
            )}
          </div>
        )}

        {/* ATTENDANCE */}
        {active==='Attendance' && (
          <div style={{...dark,padding:20}}>
            <h3 style={{color:'#fff',marginBottom:18,fontFamily:'var(--font-body)',fontWeight:700}}>Attendance</h3>
            {!tabData ? <div className="spinner" style={{margin:'0 auto',borderTopColor:'var(--gold)'}}/> : tabData.length===0 ? <p style={{color:'var(--slate)'}}>No records yet.</p> : (
              <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',minWidth:350}}>
                <thead><tr>{['Date','Subject','Status','Teacher'].map(h=><th key={h} style={{padding:'10px 12px',background:'#0f1e35',textAlign:'left',fontSize:'0.75rem',fontWeight:700,color:'var(--slate2)',textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
                <tbody>{tabData.map(a=><tr key={a.id}><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--slate2)',fontSize:'0.82rem'}}>{new Date(a.class_date).toLocaleDateString('en-IN')}</td><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--gold)'}}>{a.subject}</td><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)'}}><span style={{background:a.status==='present'?'rgba(42,138,94,0.15)':a.status==='late'?'rgba(212,168,83,0.15)':'rgba(192,57,43,0.15)',color:a.status==='present'?'#5BC8A0':a.status==='late'?'var(--gold)':'#e74c3c',padding:'3px 10px',borderRadius:100,fontSize:'0.7rem',fontWeight:700}}>{a.status}</span></td><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--slate2)'}}>{a.teacher_name}</td></tr>)}</tbody>
              </table></div>
            )}
          </div>
        )}

        {/* DOUBTS - with teacher selection */}
        {active==='Doubts' && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>
            <div style={{...dark,padding:20}}>
              <h3 style={{color:'#fff',marginBottom:18,fontFamily:'var(--font-body)',fontWeight:700}}>Ask a Doubt</h3>
              <form onSubmit={submitDoubt}>
                <div style={{marginBottom:14}}>
                  <label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Select Teacher *</label>
                  <select value={doubt.teacher_id} onChange={e=>setDoubt({...doubt,teacher_id:e.target.value})} style={inp} required>
                    <option value="">-- Choose your teacher --</option>
                    {myTeachers.map(t=><option key={t.id} value={t.teacher_id||t.id}>{t.teacher_name} ({t.subject})</option>)}
                  </select>
                </div>
                <div style={{marginBottom:14}}>
                  <label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Subject</label>
                  <input value={doubt.subject} onChange={e=>setDoubt({...doubt,subject:e.target.value})} placeholder="e.g. Mathematics" style={inp}/>
                </div>
                <div style={{marginBottom:16}}>
                  <label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Your Question *</label>
                  <textarea value={doubt.question} onChange={e=>setDoubt({...doubt,question:e.target.value})} rows={4} required placeholder="Describe your doubt in detail..." style={{...inp,resize:'vertical'}}/>
                </div>
                <button type="submit" style={{width:'100%',padding:'12px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-body)',fontSize:'0.9rem'}}>Submit Doubt</button>
              </form>
            </div>
            <div style={{...dark,padding:20}}>
              <h3 style={{color:'#fff',marginBottom:18,fontFamily:'var(--font-body)',fontWeight:700}}>My Doubts</h3>
              {!tabData ? <div className="spinner" style={{margin:'0 auto',borderTopColor:'var(--gold)'}}/> : tabData.length===0 ? <p style={{color:'var(--slate)'}}>No doubts submitted yet.</p> : (
                <div style={{display:'grid',gap:12}}>
                  {tabData.map(d=>(
                    <div key={d.id} style={{background:'#0f1e35',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:'14px 16px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,flexWrap:'wrap',gap:6}}>
                        <div style={{display:'flex',gap:6'}}>
                          <span style={{background:'rgba(212,168,83,0.12)',color:'var(--gold)',padding:'2px 10px',borderRadius:100,fontSize:'0.68rem',fontWeight:700}}>{d.subject||'General'}</span>
                        </div>
                        <span style={{background:d.status==='answered'?'rgba(42,138,94,0.15)':'rgba(212,168,83,0.12)',color:d.status==='answered'?'#5BC8A0':'var(--gold)',padding:'2px 10px',borderRadius:100,fontSize:'0.68rem',fontWeight:700}}>{d.status}</span>
                      </div>
                      <p style={{fontSize:'0.875rem',fontWeight:600,color:'#fff',marginBottom:d.answer?8:0}}>{d.question}</p>
                      {d.answer && <div style={{padding:'8px 12px',background:'rgba(42,138,94,0.08)',borderRadius:8,borderLeft:'3px solid #5BC8A0',fontSize:'0.83rem',color:'var(--slate2)'}}><strong style={{color:'#5BC8A0'}}>Answer:</strong> {d.answer}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* NOTES */}
        {active==='Notes' && (
          <div style={{...dark,padding:20}}>
            <h3 style={{color:'#fff',marginBottom:18,fontFamily:'var(--font-body)',fontWeight:700}}>Study Notes</h3>
            {!tabData ? <div className="spinner" style={{margin:'0 auto',borderTopColor:'var(--gold)'}}/> : tabData.length===0 ? <p style={{color:'var(--slate)'}}>No notes yet.</p> : (
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:14}}>
                {tabData.map(n=>(
                  <div key={n.id} style={{background:'#0f1e35',border:'1px solid rgba(212,168,83,0.12)',borderRadius:12,padding:'18px 16px'}}>
                    <span style={{background:'rgba(212,168,83,0.12)',color:'var(--gold)',padding:'2px 10px',borderRadius:100,fontSize:'0.68rem',fontWeight:700,display:'inline-block',marginBottom:10}}>{n.subject}</span>
                    <h4 style={{color:'#fff',fontSize:'0.9rem',marginBottom:8,fontFamily:'var(--font-body)',fontWeight:700}}>{n.title}</h4>
                    <p style={{fontSize:'0.82rem',color:'var(--slate2)',lineHeight:1.6}}>{n.content?.slice(0,120)}...</p>
                    <div style={{fontSize:'0.72rem',color:'var(--slate)',marginTop:10}}>By {n.teacher_name}</div>
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
