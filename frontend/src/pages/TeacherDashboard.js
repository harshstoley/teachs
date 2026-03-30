import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TABS = ['Overview','My Students','Schedule Class','Homework','Grade Homework','Progress','Attendance','Doubts','Notes','Feedback'];
const DAY = ['','Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const dark = { background:'#152238', border:'1px solid rgba(212,168,83,0.15)', borderRadius:14 };
const inp = { width:'100%', padding:'11px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(212,168,83,0.2)', borderRadius:10, color:'#fff', fontSize:'0.9rem', fontFamily:'var(--font-body)', outline:'none' };
const label = (text) => <label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>{text}</label>;

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [active, setActive] = useState('Overview');
  const [data, setData] = useState(null);
  const [students, setStudents] = useState([]);
  const [tabData, setTabData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text:'', type:'' });
  const showMsg = (text, type='success') => { setMsg({text,type}); setTimeout(()=>setMsg({text:'',type:''}),3000); };

  // Forms
  const [hwForm, setHwForm] = useState({ student_id:'', subject:'', title:'', description:'', due_date:'' });
  const [progForm, setProgForm] = useState({ student_id:'', subject:'', score:'', remarks:'', report_date:'' });
  const [attForm, setAttForm] = useState({ student_id:'', class_date:'', status:'present', subject:'' });
  const [noteForm, setNoteForm] = useState({ student_id:'', subject:'', title:'', content:'', is_public:false });
  const [fbForm, setFbForm] = useState({ student_id:'', subject:'', feedback:'', rating:5 });
  const [schedForm, setSchedForm] = useState({ student_id:'', subject:'', day_of_week:1, start_time:'17:00', duration_min:60, class_date:'' });
  const [gradeForm, setGradeForm] = useState({ hw_id:'', grade:'', remarks:'' });
  const [doubtAnswer, setDoubtAnswer] = useState({});

  useEffect(() => {
    document.title = 'Teacher Dashboard | Teachs';
    api.get('/teacher/dashboard').then(r => setData(r.data)).catch(()=>{}).finally(()=>setLoading(false));
    api.get('/teacher/students').then(r => setStudents(r.data)).catch(()=>{});
  }, []);

  useEffect(() => {
    if (active === 'Overview' || active === 'My Students') return;
    if (active === 'Doubts') { api.get('/teacher/doubts-for-me').then(r=>setTabData(r.data)).catch(()=>setTabData([])); return; }
    if (active === 'Grade Homework') { setTabData(null); api.get('/teacher/homework-submitted').then(r=>setTabData(r.data)).catch(()=>setTabData([])); return; }
    setTabData(null);
  }, [active]);

  const submit = async (endpoint, formData, resetFn, successMsg) => {
    try { await api.post(endpoint, formData); showMsg(successMsg); if(resetFn) resetFn(); } catch(err) { showMsg(err.response?.data?.error||'Failed.','error'); }
  };

  const answerDoubt = async id => {
    if (!doubtAnswer[id]) return showMsg('Please type an answer','error');
    try { await api.put(`/teacher/doubts/${id}`, { answer: doubtAnswer[id] }); showMsg('Doubt answered!'); api.get('/teacher/doubts-for-me').then(r=>setTabData(r.data)).catch(()=>{}); } catch { showMsg('Failed.','error'); }
  };

  const gradeHw = async e => {
    e.preventDefault();
    if (!gradeForm.hw_id) return showMsg('Select homework','error');
    try { await api.put(`/teacher/homework/${gradeForm.hw_id}/grade`, { grade: gradeForm.grade, remarks: gradeForm.remarks }); showMsg('Graded!'); setGradeForm({hw_id:'',grade:'',remarks:''}); } catch { showMsg('Failed.','error'); }
  };

  const StudentSelect = ({ value, onChange }) => (
    <select value={value} onChange={onChange} style={inp} required>
      <option value="">-- Select Student --</option>
      {students.map(s => <option key={`${s.id}-${s.subject}`} value={s.id}>{s.name} (Class {s.student_class}) – {s.subject}</option>)}
    </select>
  );

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'var(--navy)'}}><div className="spinner"/></div>;

  return (
    <div style={{ minHeight:'100vh', background:'var(--navy)' }}>
      <div style={{ background:'#0a1628', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px', position:'sticky', top:0, zIndex:50, borderBottom:'1px solid rgba(212,168,83,0.12)' }}>
        <span style={{fontFamily:'var(--font-display)',fontSize:'1.2rem',fontWeight:700,color:'#fff'}}>Teach<span style={{color:'var(--gold)'}}>s</span> <span style={{fontSize:'0.7rem',color:'var(--slate)',fontFamily:'var(--font-body)',fontWeight:400}}>Teacher</span></span>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{color:'var(--slate2)',fontSize:'0.85rem'}}>👨‍🏫 {user?.name?.split(' ')[0]}</span>
          <button onClick={logout} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:8,padding:'6px 12px',color:'#fff',fontSize:'0.8rem',cursor:'pointer',fontFamily:'var(--font-body)'}}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'20px 14px' }}>
        {msg.text && <div className={`alert alert-${msg.type}`} style={{marginBottom:16}}>{msg.text}</div>}

        <div className="tab-scroll" style={{marginBottom:20,background:'#152238',border:'1px solid rgba(212,168,83,0.12)'}}>
          {TABS.map(t=><button key={t} onClick={()=>setActive(t)} style={{padding:'8px 14px',borderRadius:8,border:'none',cursor:'pointer',whiteSpace:'nowrap',background:active===t?'var(--gold)':'transparent',color:active===t?'var(--navy)':'var(--slate2)',fontWeight:active===t?700:400,fontSize:'0.84rem',transition:'all 0.15s',flexShrink:0,fontFamily:'var(--font-body)'}}>{t}</button>)}
        </div>

        {/* OVERVIEW */}
        {active==='Overview' && data && (
          <div>
            <h3 style={{color:'#fff',marginBottom:4}}>Hello, {user?.name?.split(' ')[0]} 👨‍🏫</h3>
            <p style={{color:'var(--slate)',marginBottom:20,fontSize:'0.875rem'}}>Your teaching overview</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12,marginBottom:20}}>
              {[{label:'My Students',value:students.length,icon:'👨‍🎓'},{label:'Classes/Week',value:data.schedule?.length||0,icon:'📅'},{label:'Pending Doubts',value:data.pendingDoubts?.length||0,icon:'❓'},{label:'Homework Given',value:data.homework?.length||0,icon:'📝'}].map(s=>(
                <div key={s.label} style={{...dark,padding:'16px 14px',display:'flex',alignItems:'center',gap:12}}>
                  <div style={{fontSize:'1.4rem'}}>{s.icon}</div>
                  <div><div style={{fontSize:'1.3rem',fontWeight:800,color:'#fff',lineHeight:1,fontFamily:'var(--font-body)'}}>{s.value}</div><div style={{fontSize:'0.72rem',color:'var(--slate)',marginTop:2}}>{s.label}</div></div>
                </div>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>
              <div style={{...dark,padding:20}}>
                <h4 style={{color:'#fff',marginBottom:14,fontFamily:'var(--font-body)',fontWeight:700,fontSize:'0.95rem'}}>This Week's Schedule</h4>
                {data.schedule?.length ? data.schedule.map(s=>(
                  <div key={s.id} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:'0.875rem'}}>
                    <div><strong style={{color:'#fff'}}>{s.student_name}</strong> <span style={{color:'var(--gold)'}}>– {s.subject}</span></div>
                    <span style={{background:'rgba(212,168,83,0.12)',color:'var(--gold)',padding:'2px 8px',borderRadius:100,fontSize:'0.68rem',fontWeight:700}}>{DAY[s.day_of_week]} {s.start_time?.slice(0,5)}</span>
                  </div>
                )) : <p style={{color:'var(--slate)',fontSize:'0.875rem'}}>No schedule assigned.</p>}
              </div>
              <div style={{...dark,padding:20}}>
                <h4 style={{color:'#fff',marginBottom:14,fontFamily:'var(--font-body)',fontWeight:700,fontSize:'0.95rem'}}>Pending Doubts</h4>
                {data.pendingDoubts?.length ? data.pendingDoubts.map(d=>(
                  <div key={d.id} style={{padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{fontSize:'0.82rem',fontWeight:600,color:'var(--gold)',marginBottom:4}}>{d.student_name} – {d.subject}</div>
                    <p style={{fontSize:'0.82rem',color:'var(--slate2)',marginBottom:8}}>{d.question}</p>
                    <div style={{display:'flex',gap:8}}>
                      <input value={doubtAnswer[d.id]||''} onChange={e=>setDoubtAnswer({...doubtAnswer,[d.id]:e.target.value})} placeholder="Type answer..." style={{...inp,flex:1,padding:'7px 10px',fontSize:'0.82rem'}}/>
                      <button onClick={()=>answerDoubt(d.id)} style={{padding:'7px 14px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:8,cursor:'pointer',fontWeight:700,fontFamily:'var(--font-body)',fontSize:'0.82rem'}}>Answer</button>
                    </div>
                  </div>
                )) : <p style={{color:'#5BC8A0',fontSize:'0.875rem'}}>No pending doubts 🎉</p>}
              </div>
            </div>
          </div>
        )}

        {/* MY STUDENTS */}
        {active==='My Students' && (
          <div style={{...dark,padding:20}}>
            <h3 style={{color:'#fff',marginBottom:18,fontFamily:'var(--font-body)',fontWeight:700}}>My Students</h3>
            {students.length===0 ? <p style={{color:'var(--slate)'}}>No students assigned yet.</p> : (
              <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',minWidth:400}}>
                <thead><tr>{['Name','Class','Subject','Parent','Phone'].map(h=><th key={h} style={{padding:'10px 12px',background:'#0f1e35',textAlign:'left',fontSize:'0.75rem',fontWeight:700,color:'var(--slate2)',textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
                <tbody>{students.map((s,i)=><tr key={`${s.id}-${i}`}><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'#fff',fontWeight:600}}>{s.name}</td><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--slate2)'}}>Class {s.student_class}</td><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)'}}><span style={{background:'rgba(212,168,83,0.12)',color:'var(--gold)',padding:'2px 8px',borderRadius:100,fontSize:'0.7rem',fontWeight:700}}>{s.subject}</span></td><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--slate2)',fontSize:'0.82rem'}}>{s.parent_name||'-'}</td><td style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--slate2)',fontSize:'0.82rem'}}>{s.parent_phone||s.phone||'-'}</td></tr>)}</tbody>
              </table></div>
            )}
          </div>
        )}

        {/* SCHEDULE CLASS */}
        {active==='Schedule Class' && (
          <div style={{...dark,padding:20,maxWidth:520}}>
            <h3 style={{color:'#fff',marginBottom:18,fontFamily:'var(--font-body)',fontWeight:700}}>Schedule a Class</h3>
            <form onSubmit={e=>{e.preventDefault();submit('/teacher/schedule-class',schedForm,()=>setSchedForm({student_id:'',subject:'',day_of_week:1,start_time:'17:00',duration_min:60,class_date:''}),'Class scheduled!')}} style={{display:'grid',gap:14}}>
              <div>{label('Student *')}<StudentSelect value={schedForm.student_id} onChange={e=>setSchedForm({...schedForm,student_id:e.target.value})}/></div>
              <div>{label('Subject')}<input value={schedForm.subject} onChange={e=>setSchedForm({...schedForm,subject:e.target.value})} placeholder="e.g. Mathematics" style={inp}/></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div>{label('Class Date')}<input type="date" value={schedForm.class_date} onChange={e=>setSchedForm({...schedForm,class_date:e.target.value})} style={inp}/></div>
                <div>{label('Start Time')}<input type="time" value={schedForm.start_time} onChange={e=>setSchedForm({...schedForm,start_time:e.target.value})} style={inp}/></div>
                <div>{label('Day of Week')}<select value={schedForm.day_of_week} onChange={e=>setSchedForm({...schedForm,day_of_week:e.target.value})} style={inp}>{['','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].slice(1).map((d,i)=><option key={i+1} value={i+1}>{d}</option>)}</select></div>
                <div>{label('Duration (min)')}<input type="number" value={schedForm.duration_min} onChange={e=>setSchedForm({...schedForm,duration_min:e.target.value})} style={inp}/></div>
              </div>
              <button type="submit" style={{padding:'13px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-body)',fontSize:'0.95rem'}}>Schedule Class</button>
            </form>
          </div>
        )}

        {/* ASSIGN HOMEWORK */}
        {active==='Homework' && (
          <div style={{...dark,padding:20,maxWidth:520}}>
            <h3 style={{color:'#fff',marginBottom:18,fontFamily:'var(--font-body)',fontWeight:700}}>Assign Homework</h3>
            <form onSubmit={e=>{e.preventDefault();submit('/teacher/homework',hwForm,()=>setHwForm({student_id:'',subject:'',title:'',description:'',due_date:''}),'Homework assigned!')}} style={{display:'grid',gap:14}}>
              <div>{label('Student *')}<StudentSelect value={hwForm.student_id} onChange={e=>setHwForm({...hwForm,student_id:e.target.value})}/></div>
              <div>{label('Subject')}<input value={hwForm.subject} onChange={e=>setHwForm({...hwForm,subject:e.target.value})} style={inp}/></div>
              <div>{label('Title *')}<input value={hwForm.title} onChange={e=>setHwForm({...hwForm,title:e.target.value})} required style={inp} placeholder="Homework title"/></div>
              <div>{label('Description')}<textarea value={hwForm.description} onChange={e=>setHwForm({...hwForm,description:e.target.value})} rows={3} style={{...inp,resize:'vertical'}} placeholder="Instructions..."/></div>
              <div>{label('Due Date')}<input type="date" value={hwForm.due_date} onChange={e=>setHwForm({...hwForm,due_date:e.target.value})} style={inp}/></div>
              <button type="submit" style={{padding:'13px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-body)'}}>Assign Homework</button>
            </form>
          </div>
        )}

        {/* GRADE HOMEWORK */}
        {active==='Grade Homework' && (
          <div style={{display:'grid',gap:16}}>
            <div style={{...dark,padding:20,maxWidth:480}}>
              <h3 style={{color:'#fff',marginBottom:18,fontFamily:'var(--font-body)',fontWeight:700}}>Grade Submitted Homework</h3>
              {!tabData ? <div className="spinner" style={{margin:'20px auto',borderTopColor:'var(--gold)'}}/> : tabData.length===0 ? <p style={{color:'var(--slate)'}}>No submitted homework yet.</p> : (
                <form onSubmit={gradeHw} style={{display:'grid',gap:14}}>
                  <div>{label('Select Homework *')}
                    <select value={gradeForm.hw_id} onChange={e=>setGradeForm({...gradeForm,hw_id:e.target.value})} style={inp} required>
                      <option value="">-- Choose Homework --</option>
                      {tabData.map(hw=><option key={hw.id} value={hw.id}>{hw.student_name} – {hw.title}</option>)}
                    </select>
                  </div>
                  <div>{label('Grade')}<input value={gradeForm.grade} onChange={e=>setGradeForm({...gradeForm,grade:e.target.value})} placeholder="e.g. A, B+, 85%" style={inp}/></div>
                  <div>{label('Remarks')}<textarea value={gradeForm.remarks} onChange={e=>setGradeForm({...gradeForm,remarks:e.target.value})} rows={3} style={{...inp,resize:'vertical'}} placeholder="Feedback for student..."/></div>
                  <button type="submit" style={{padding:'12px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-body)'}}>Submit Grade</button>
                </form>
              )}
            </div>
            {tabData && tabData.length > 0 && (
              <div style={{...dark,padding:20}}>
                <h4 style={{color:'#fff',marginBottom:14,fontFamily:'var(--font-body)',fontWeight:700}}>Submitted Homework ({tabData.length})</h4>
                <div style={{display:'grid',gap:10}}>
                  {tabData.map(hw=>(
                    <div key={hw.id} style={{background:'#0f1e35',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:'12px 14px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4,flexWrap:'wrap',gap:6}}>
                        <span style={{color:'#fff',fontWeight:600,fontSize:'0.875rem'}}>{hw.student_name} – {hw.title}</span>
                        <span style={{background:'rgba(42,138,94,0.15)',color:'#5BC8A0',padding:'2px 8px',borderRadius:100,fontSize:'0.68rem',fontWeight:700}}>Submitted</span>
                      </div>
                      {hw.submission_text && <p style={{fontSize:'0.8rem',color:'var(--slate2)'}}>{hw.submission_text?.slice(0,100)}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PROGRESS */}
        {active==='Progress' && (
          <div style={{...dark,padding:20,maxWidth:520}}>
            <h3 style={{color:'#fff',marginBottom:18,fontFamily:'var(--font-body)',fontWeight:700}}>Add Progress Report</h3>
            <form onSubmit={e=>{e.preventDefault();submit('/teacher/progress',progForm,()=>setProgForm({student_id:'',subject:'',score:'',remarks:'',report_date:''}),'Progress report added!')}} style={{display:'grid',gap:14}}>
              <div>{label('Student *')}<StudentSelect value={progForm.student_id} onChange={e=>setProgForm({...progForm,student_id:e.target.value})}/></div>
              <div>{label('Subject')}<input value={progForm.subject} onChange={e=>setProgForm({...progForm,subject:e.target.value})} style={inp}/></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div>{label('Score (%)')}<input type="number" min="0" max="100" value={progForm.score} onChange={e=>setProgForm({...progForm,score:e.target.value})} style={inp} placeholder="85"/></div>
                <div>{label('Report Date')}<input type="date" value={progForm.report_date} onChange={e=>setProgForm({...progForm,report_date:e.target.value})} style={inp}/></div>
              </div>
              <div>{label('Remarks')}<textarea value={progForm.remarks} onChange={e=>setProgForm({...progForm,remarks:e.target.value})} rows={3} style={{...inp,resize:'vertical'}} placeholder="Teacher remarks for parents..."/></div>
              <button type="submit" style={{padding:'13px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-body)'}}>Save Report</button>
            </form>
          </div>
        )}

        {/* ATTENDANCE */}
        {active==='Attendance' && (
          <div style={{...dark,padding:20,maxWidth:480}}>
            <h3 style={{color:'#fff',marginBottom:18,fontFamily:'var(--font-body)',fontWeight:700}}>Mark Attendance</h3>
            <form onSubmit={e=>{e.preventDefault();submit('/teacher/attendance',attForm,null,'Attendance marked!')}} style={{display:'grid',gap:14}}>
              <div>{label('Student *')}<StudentSelect value={attForm.student_id} onChange={e=>setAttForm({...attForm,student_id:e.target.value})}/></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div>{label('Subject')}<input value={attForm.subject} onChange={e=>setAttForm({...attForm,subject:e.target.value})} style={inp}/></div>
                <div>{label('Date *')}<input type="date" value={attForm.class_date} onChange={e=>setAttForm({...attForm,class_date:e.target.value})} required style={inp}/></div>
              </div>
              <div>{label('Status')}<select value={attForm.status} onChange={e=>setAttForm({...attForm,status:e.target.value})} style={inp}><option value="present">Present</option><option value="absent">Absent</option><option value="late">Late</option></select></div>
              <button type="submit" style={{padding:'13px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-body)'}}>Mark Attendance</button>
            </form>
          </div>
        )}

        {/* DOUBTS */}
        {active==='Doubts' && (
          <div style={{...dark,padding:20}}>
            <h3 style={{color:'#fff',marginBottom:18,fontFamily:'var(--font-body)',fontWeight:700}}>Doubts From My Students</h3>
            {!tabData ? <div className="spinner" style={{margin:'20px auto',borderTopColor:'var(--gold)'}}/> : tabData.length===0 ? <p style={{color:'#5BC8A0'}}>No doubts yet 🎉</p> : (
              <div style={{display:'grid',gap:14}}>
                {tabData.map(d=>(
                  <div key={d.id} style={{background:'#0f1e35',border:`1px solid ${d.status==='answered'?'rgba(42,138,94,0.3)':'rgba(212,168,83,0.2)'}`,borderRadius:12,padding:'16px 18px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,flexWrap:'wrap',gap:6}}>
                      <div><span style={{color:'var(--gold)',fontWeight:700,fontSize:'0.875rem'}}>{d.student_name}</span> <span style={{color:'var(--slate)',fontSize:'0.78rem'}}>– {d.subject||'General'}</span></div>
                      <span style={{background:d.status==='answered'?'rgba(42,138,94,0.15)':'rgba(212,168,83,0.12)',color:d.status==='answered'?'#5BC8A0':'var(--gold)',padding:'2px 10px',borderRadius:100,fontSize:'0.68rem',fontWeight:700}}>{d.status}</span>
                    </div>
                    <p style={{color:'#fff',fontSize:'0.875rem',marginBottom:d.status==='pending'?12:0,fontWeight:500}}>{d.question}</p>
                    {d.answer && <div style={{padding:'8px 12px',background:'rgba(42,138,94,0.08)',borderRadius:8,borderLeft:'3px solid #5BC8A0',fontSize:'0.83rem',color:'var(--slate2)'}}><strong style={{color:'#5BC8A0'}}>Your Answer:</strong> {d.answer}</div>}
                    {d.status==='pending' && (
                      <div style={{display:'flex',gap:8}}>
                        <input value={doubtAnswer[d.id]||''} onChange={e=>setDoubtAnswer({...doubtAnswer,[d.id]:e.target.value})} placeholder="Type your answer..." style={{...inp,flex:1,padding:'9px 12px'}}/>
                        <button onClick={()=>answerDoubt(d.id)} style={{padding:'9px 18px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-body)',whiteSpace:'nowrap'}}>Answer</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NOTES */}
        {active==='Notes' && (
          <div style={{...dark,padding:20,maxWidth:520}}>
            <h3 style={{color:'#fff',marginBottom:18,fontFamily:'var(--font-body)',fontWeight:700}}>Upload Study Notes</h3>
            <form onSubmit={e=>{e.preventDefault();submit('/teacher/notes',noteForm,()=>setNoteForm({student_id:'',subject:'',title:'',content:'',is_public:false}),'Notes saved!')}} style={{display:'grid',gap:14}}>
              <div>{label('Student (leave blank for all)')}<StudentSelect value={noteForm.student_id} onChange={e=>setNoteForm({...noteForm,student_id:e.target.value})}/></div>
              <div>{label('Subject')}<input value={noteForm.subject} onChange={e=>setNoteForm({...noteForm,subject:e.target.value})} style={inp}/></div>
              <div>{label('Title *')}<input value={noteForm.title} onChange={e=>setNoteForm({...noteForm,title:e.target.value})} required style={inp}/></div>
              <div>{label('Content')}<textarea value={noteForm.content} onChange={e=>setNoteForm({...noteForm,content:e.target.value})} rows={5} style={{...inp,resize:'vertical'}}/></div>
              <label style={{display:'flex',gap:8,alignItems:'center',color:'var(--slate2)',fontSize:'0.88rem',cursor:'pointer'}}><input type="checkbox" checked={noteForm.is_public} onChange={e=>setNoteForm({...noteForm,is_public:e.target.checked})}/>Visible to all my students</label>
              <button type="submit" style={{padding:'13px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-body)'}}>Save Notes</button>
            </form>
          </div>
        )}

        {/* FEEDBACK */}
        {active==='Feedback' && (
          <div style={{...dark,padding:20,maxWidth:480}}>
            <h3 style={{color:'#fff',marginBottom:18,fontFamily:'var(--font-body)',fontWeight:700}}>Give Student Feedback</h3>
            <form onSubmit={e=>{e.preventDefault();submit('/teacher/feedback',fbForm,()=>setFbForm({student_id:'',subject:'',feedback:'',rating:5}),'Feedback submitted!')}} style={{display:'grid',gap:14}}>
              <div>{label('Student *')}<StudentSelect value={fbForm.student_id} onChange={e=>setFbForm({...fbForm,student_id:e.target.value})}/></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div>{label('Subject')}<input value={fbForm.subject} onChange={e=>setFbForm({...fbForm,subject:e.target.value})} style={inp}/></div>
                <div>{label('Rating')}<select value={fbForm.rating} onChange={e=>setFbForm({...fbForm,rating:e.target.value})} style={inp}>{[5,4,3,2,1].map(r=><option key={r} value={r}>{r} ⭐</option>)}</select></div>
              </div>
              <div>{label('Feedback *')}<textarea value={fbForm.feedback} onChange={e=>setFbForm({...fbForm,feedback:e.target.value})} rows={4} required style={{...inp,resize:'vertical'}} placeholder="Detailed feedback for student and parent..."/></div>
              <button type="submit" style={{padding:'13px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-body)'}}>Submit Feedback</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
