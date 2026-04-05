import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/api';
const inp={width:'100%',padding:'11px 14px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(212,168,83,0.2)',borderRadius:10,color:'#fff',fontSize:'0.9rem',fontFamily:'var(--font-body)',outline:'none'};
export default function AdminWorkshop() {
  const [sessions,setSessions]=useState([]); const [msg,setMsg]=useState('');
  const [form,setForm]=useState({title:'',description:'',session_date:'',duration:60,google_form_url:'',seats:30,is_active:true});
  const showMsg=m=>{setMsg(m);setTimeout(()=>setMsg(''),3000);};
  const load=()=>api.get('/workshop/sessions').then(r=>setSessions(r.data)).catch(()=>{});
  useEffect(()=>{document.title='Workshop | Admin';load();},[]);
  const save=async e=>{e.preventDefault();try{await api.post('/workshop/sessions',{...form,is_active:form.is_active?1:0});showMsg('Session created!');load();setForm({title:'',description:'',session_date:'',duration:60,google_form_url:'',seats:30,is_active:true});}catch{showMsg('Failed.');}};
  const del=async id=>{if(!window.confirm('Delete?'))return;await api.delete(`/workshop/sessions/${id}`);load();};
  return (
    <AdminLayout title="Manage Workshop Sessions">
      {msg&&<div className="alert alert-success" style={{marginBottom:16}}>{msg}</div>}
      <div style={{background:'#152238',border:'1px solid rgba(212,168,83,0.15)',borderRadius:16,padding:'24px 20px',marginBottom:24}}>
        <h4 style={{color:'#fff',marginBottom:18,fontFamily:'var(--font-body)',fontWeight:700}}>Create Session</h4>
        <form onSubmit={save} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <div style={{gridColumn:'1/-1'}}><label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Title *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={inp} required/></div>
          <div><label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Date & Time *</label><input type="datetime-local" value={form.session_date} onChange={e=>setForm({...form,session_date:e.target.value})} style={inp} required/></div>
          <div><label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Duration (min)</label><input type="number" value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} style={inp}/></div>
          <div style={{gridColumn:'1/-1'}}><label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} className="admin-inp" style={{...inp,resize:'vertical'}}/></div>
          <div style={{gridColumn:'1/-1'}}><label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Google Form URL</label><input value={form.google_form_url} onChange={e=>setForm({...form,google_form_url:e.target.value})} placeholder="https://forms.google.com/..." style={inp}/></div>
          <div><label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Seats</label><input type="number" value={form.seats} onChange={e=>setForm({...form,seats:e.target.value})} style={inp}/></div>
          <div style={{display:'flex',alignItems:'flex-end',gap:12}}>
            <label style={{display:'flex',gap:8,alignItems:'center',fontSize:'0.88rem',color:'var(--slate2)',cursor:'pointer'}}><input type="checkbox" checked={form.is_active} onChange={e=>setForm({...form,is_active:e.target.checked})}/>Active</label>
            <button type="submit" style={{padding:'11px 22px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-body)'}}>Create</button>
          </div>
        </form>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>
        {sessions.map(s=>(
          <div key={s.id} style={{background:'#152238',border:'1px solid rgba(212,168,83,0.12)',borderRadius:14,padding:'20px 18px'}}>
            <h4 style={{color:'#fff',marginBottom:8,fontSize:'0.95rem',fontFamily:'var(--font-body)',fontWeight:700}}>{s.title}</h4>
            <p style={{color:'var(--slate2)',fontSize:'0.83rem',marginBottom:12}}>{s.description}</p>
            <div style={{fontSize:'0.78rem',color:'var(--slate)',marginBottom:12}}>📅 {new Date(s.session_date).toLocaleString('en-IN')} · {s.duration} min · {s.seats} seats</div>
            <button onClick={()=>del(s.id)} style={{padding:'7px 14px',background:'rgba(192,57,43,0.15)',color:'#e74c3c',border:'1px solid rgba(192,57,43,0.2)',borderRadius:8,cursor:'pointer',fontSize:'0.8rem',fontFamily:'var(--font-body)'}}>Delete</button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
