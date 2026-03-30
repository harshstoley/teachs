import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/api';
const inp = { width:'100%', padding:'11px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(212,168,83,0.2)', borderRadius:10, color:'#fff', fontSize:'0.9rem', fontFamily:'var(--font-body)', outline:'none' };
export default function AdminAnnouncements() {
  const [items, setItems] = useState([]); const [msg, setMsg] = useState('');
  const [form, setForm] = useState({title:'',message:'',target_role:'all',is_active:true});
  const showMsg=m=>{setMsg(m);setTimeout(()=>setMsg(''),3000);};
  const load=()=>api.get('/admin/announcements').then(r=>setItems(r.data)).catch(()=>{});
  useEffect(()=>{document.title='Announcements | Admin';load();},[]);
  const create=async e=>{e.preventDefault();try{await api.post('/admin/announcements',{...form,is_active:form.is_active?1:0});showMsg('Created!');load();setForm({title:'',message:'',target_role:'all',is_active:true});}catch{showMsg('Failed.');}};
  return (
    <AdminLayout title="Announcements">
      {msg&&<div className="alert alert-success" style={{marginBottom:16}}>{msg}</div>}
      <div style={{background:'#152238',border:'1px solid rgba(212,168,83,0.15)',borderRadius:16,padding:'24px 20px',marginBottom:24,maxWidth:580}}>
        <h4 style={{color:'#fff',marginBottom:18,fontFamily:'var(--font-body)',fontWeight:700}}>Create Announcement</h4>
        <form onSubmit={create} style={{display:'grid',gap:14}}>
          <div><label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={inp}/></div>
          <div><label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Message *</label><textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows={3} required style={{...inp,resize:'vertical'}}/></div>
          <div><label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Target</label><select value={form.target_role} onChange={e=>setForm({...form,target_role:e.target.value})} style={inp}><option value="all">All Users</option><option value="student">Students Only</option><option value="teacher">Teachers Only</option></select></div>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <label style={{display:'flex',gap:8,alignItems:'center',fontSize:'0.88rem',color:'var(--slate2)',cursor:'pointer'}}><input type="checkbox" checked={form.is_active} onChange={e=>setForm({...form,is_active:e.target.checked})}/>Show immediately</label>
            <button type="submit" style={{padding:'10px 22px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-body)'}}>Create</button>
          </div>
        </form>
      </div>
      <div style={{display:'grid',gap:10}}>
        {items.map(a=>(
          <div key={a.id} style={{background:'#152238',border:'1px solid rgba(212,168,83,0.12)',borderRadius:12,padding:'14px 18px',display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:16}}>
            <div>
              <div style={{fontWeight:700,color:'#fff',fontSize:'0.88rem',marginBottom:4}}>{a.title}</div>
              <p style={{fontSize:'0.845rem',color:'var(--slate2)',margin:0}}>{a.message}</p>
              <div style={{marginTop:8,display:'flex',gap:8}}>
                <span style={{background:'rgba(0,153,178,0.12)',color:'var(--teal)',padding:'2px 10px',borderRadius:100,fontSize:'0.68rem',fontWeight:700}}>{a.target_role}</span>
                <span style={{background:a.is_active?'rgba(42,138,94,0.15)':'rgba(192,57,43,0.15)',color:a.is_active?'#5BC8A0':'#e74c3c',padding:'2px 10px',borderRadius:100,fontSize:'0.68rem',fontWeight:700}}>{a.is_active?'Active':'Hidden'}</span>
              </div>
            </div>
            <div style={{fontSize:'0.75rem',color:'var(--slate)',flexShrink:0}}>{new Date(a.created_at).toLocaleDateString('en-IN')}</div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
