import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/api';
const inp={width:'100%',padding:'11px 14px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(212,168,83,0.2)',borderRadius:10,color:'#fff',fontSize:'0.9rem',fontFamily:'var(--font-body)',outline:'none'};
const DAYS=['','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
export default function AdminSchedule() {
  const [students,setStudents]=useState([]); const [teachers,setTeachers]=useState([]);
  const [form,setForm]=useState({student_id:'',teacher_id:'',subject:'',day_of_week:1,start_time:'17:00',duration_min:60,notes:''});
  const [msg,setMsg]=useState({text:'',type:''});
  const showMsg=(text,type='success')=>{setMsg({text,type});setTimeout(()=>setMsg({text:'',type:''}),3000);};
  useEffect(()=>{document.title='Schedule | Admin';api.get('/admin/users?role=student&limit=100').then(r=>setStudents(r.data.users)).catch(()=>{});api.get('/admin/users?role=teacher&limit=100').then(r=>setTeachers(r.data.users)).catch(()=>{});}, []);
  const schedule=async e=>{e.preventDefault();try{await api.post('/admin/schedule',form);showMsg('Class scheduled!');}catch(err){showMsg(err.response?.data?.error||'Failed.','error');}};
  return (
    <AdminLayout title="Schedule Classes">
      {msg.text&&<div className={`alert alert-${msg.type}`} style={{marginBottom:16}}>{msg.text}</div>}
      <div style={{background:'#152238',border:'1px solid rgba(212,168,83,0.15)',borderRadius:16,padding:'24px 20px',maxWidth:560}}>
        <form onSubmit={schedule} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div style={{gridColumn:'1/-1'}}><label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Student *</label><select value={form.student_id} onChange={e=>setForm({...form,student_id:e.target.value})} style={inp} required><option value="">-- Select Student --</option>{students.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          <div style={{gridColumn:'1/-1'}}><label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Teacher *</label><select value={form.teacher_id} onChange={e=>setForm({...form,teacher_id:e.target.value})} style={inp} required><option value="">-- Select Teacher --</option>{teachers.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
          <div><label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Subject</label><input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} style={inp}/></div>
          <div><label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Day</label><select value={form.day_of_week} onChange={e=>setForm({...form,day_of_week:e.target.value})} style={inp}>{DAYS.slice(1).map((d,i)=><option key={i+1} value={i+1}>{d}</option>)}</select></div>
          <div><label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Start Time</label><input type="time" value={form.start_time} onChange={e=>setForm({...form,start_time:e.target.value})} style={inp}/></div>
          <div><label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Duration (min)</label><input type="number" value={form.duration_min} onChange={e=>setForm({...form,duration_min:e.target.value})} style={inp}/></div>
          <button type="submit" style={{gridColumn:'1/-1',padding:'13px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontSize:'0.95rem',fontFamily:'var(--font-body)'}}>Schedule Class</button>
        </form>
      </div>
    </AdminLayout>
  );
}
