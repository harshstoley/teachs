import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/api';
export default function AdminWomen() {
  const [apps,setApps]=useState([]); const [msg,setMsg]=useState('');
  const showMsg=m=>{setMsg(m);setTimeout(()=>setMsg(''),3000);};
  const load=()=>api.get('/women/applications').then(r=>setApps(r.data)).catch(()=>{});
  useEffect(()=>{document.title="Women's Program | Admin";load();},[]);
  const update=async(id,status)=>{await api.put(`/women/applications/${id}`,{status});showMsg('Updated!');load();};
  const sColor={pending:'rgba(212,168,83,0.15)',reviewing:'rgba(0,153,178,0.15)',accepted:'rgba(42,138,94,0.15)',rejected:'rgba(192,57,43,0.15)'};
  const sText={pending:'var(--gold)',reviewing:'var(--teal)',accepted:'#5BC8A0',rejected:'#e74c3c'};
  return (
    <AdminLayout title="Women's Program Applications">
      {msg&&<div className="alert alert-success" style={{marginBottom:16}}>{msg}</div>}
      <div style={{overflowX:'auto',borderRadius:12,border:'1px solid rgba(212,168,83,0.12)'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:600}}>
          <thead><tr>{['Name','Phone','City','Subjects','Status','Date','Actions'].map(h=><th key={h} style={{padding:'11px 14px',background:'#0f1e35',textAlign:'left',fontSize:'0.75rem',fontWeight:700,color:'var(--slate2)',textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</th>)}</tr></thead>
          <tbody>
            {apps.map(a=>(
              <tr key={a.id}>
                <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'#fff',fontWeight:600,fontSize:'0.875rem'}}>{a.name}<div style={{fontSize:'0.72rem',color:'var(--slate)'}}>{a.email}</div></td>
                <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)'}}><a href={`tel:${a.phone}`} style={{color:'var(--gold)',fontSize:'0.875rem'}}>{a.phone}</a></td>
                <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--slate2)',fontSize:'0.875rem'}}>{a.city}</td>
                <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--slate2)',fontSize:'0.875rem'}}>{a.subjects}</td>
                <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)'}}><span style={{background:sColor[a.status],color:sText[a.status],padding:'3px 10px',borderRadius:100,fontSize:'0.7rem',fontWeight:700}}>{a.status}</span></td>
                <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)',fontSize:'0.78rem',color:'var(--slate)'}}>{new Date(a.created_at).toLocaleDateString('en-IN')}</td>
                <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                    <button onClick={()=>update(a.id,'reviewing')} style={{padding:'5px 8px',background:'rgba(0,153,178,0.15)',color:'var(--teal)',border:'1px solid rgba(0,153,178,0.2)',borderRadius:7,cursor:'pointer',fontSize:'0.72rem',fontFamily:'var(--font-body)'}}>Review</button>
                    <button onClick={()=>update(a.id,'accepted')} style={{padding:'5px 8px',background:'rgba(42,138,94,0.15)',color:'#5BC8A0',border:'1px solid rgba(42,138,94,0.2)',borderRadius:7,cursor:'pointer',fontSize:'0.72rem',fontFamily:'var(--font-body)'}}>Accept</button>
                    <button onClick={()=>update(a.id,'rejected')} style={{padding:'5px 8px',background:'rgba(192,57,43,0.15)',color:'#e74c3c',border:'1px solid rgba(192,57,43,0.2)',borderRadius:7,cursor:'pointer',fontSize:'0.72rem',fontFamily:'var(--font-body)'}}>Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
