import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/api';

export default function AdminPricing() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({ title:'', plan_type:'individual', class_range:'', label:'', regular_price:'', discounted_price:'', features:'2 Subjects\nWeekly Tests\nProgress Reports', is_recommended:false, sort_order:99 });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => { setLoading(true); api.get('/pricing').then(r=>setPlans(r.data)).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(load,[]);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const save = async e => {
    e.preventDefault();
    try {
      const payload = {...form, features: JSON.stringify(form.features.split('\n').filter(Boolean)) };
      if(editing) { await api.put(`/pricing/${editing.id}`, payload); setMsg('Updated!'); }
      else { await api.post('/pricing', payload); setMsg('Created!'); }
      setEditing(null);
      setForm({title:'',plan_type:'individual',class_range:'',label:'',regular_price:'',discounted_price:'',features:'2 Subjects\nWeekly Tests\nProgress Reports',is_recommended:false,sort_order:99});
      load();
    } catch(e) { setMsg(e.response?.data?.error||'Error'); }
  };

  const del = async id => { if(!window.confirm('Delete?')) return; await api.delete(`/pricing/${id}`); load(); };
  const edit = p => {
    setEditing(p);
    const feats = typeof p.features==='string' ? JSON.parse(p.features||'[]') : p.features||[];
    setForm({...p, features: feats.join('\n')});
  };

  const inp = { width:'100%', padding:'10px 14px', background:'#0f1f35', border:'1px solid rgba(212,168,83,0.2)', borderRadius:10, color:'#ffffff', fontFamily:'var(--font-body)', fontSize:'0.9rem', outline:'none', boxSizing:'border-box' };
  const lbl = { display:'block', fontSize:'0.78rem', color:'#b8c5d9', marginBottom:5, fontWeight:600 };

  return (
    <AdminLayout>
      <h2 style={{color:'white',marginBottom:24}}>Manage Pricing Plans</h2>
      {msg && <div style={{background:'rgba(42,138,94,0.15)',border:'1px solid rgba(42,138,94,0.3)',borderRadius:10,padding:'10px 16px',marginBottom:16,color:'#5BC8A0',fontSize:'0.875rem'}}>{msg}</div>}

      {/* Form */}
      <div style={{background:'var(--navy2)',borderRadius:16,padding:'24px 20px',border:'1px solid rgba(212,168,83,0.15)',marginBottom:28}}>
        <h3 style={{color:'white',marginBottom:18,fontSize:'1rem'}}>{editing?'Edit Plan':'Add New Plan'}</h3>
        <form onSubmit={save} style={{display:'grid',gap:14}}>
          <div><label style={lbl}>Title *</label><input value={form.title} onChange={e=>set('title',e.target.value)} required style={inp} placeholder="e.g. Junior Scholar"/></div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12}}>
            <div><label style={lbl}>Type</label>
              <select value={form.plan_type} onChange={e=>set('plan_type',e.target.value)} style={inp}>
                {['individual','demo','group','board'].map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Class Range</label><input value={form.class_range} onChange={e=>set('class_range',e.target.value)} style={inp} placeholder="e.g. Class 6–8"/></div>
            <div><label style={lbl}>Label/Badge</label><input value={form.label} onChange={e=>set('label',e.target.value)} style={inp} placeholder="e.g. Most Popular"/></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12}}>
            <div><label style={lbl}>Regular Price (₹)</label><input type="number" value={form.regular_price} onChange={e=>set('regular_price',e.target.value)} style={inp} placeholder="2999"/></div>
            <div><label style={lbl}>Discounted Price (₹)</label><input type="number" value={form.discounted_price} onChange={e=>set('discounted_price',e.target.value)} style={inp} placeholder="1999"/></div>
            <div><label style={lbl}>Sort Order</label><input type="number" value={form.sort_order} onChange={e=>set('sort_order',e.target.value)} style={inp}/></div>
          </div>
          <div><label style={lbl}>Features (one per line)</label><textarea value={form.features} onChange={e=>set('features',e.target.value)} rows={5} style={{...inp,resize:'vertical'}}/></div>
          <div style={{display:'flex',gap:20,alignItems:'center'}}>
            <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
              <input type="checkbox" checked={form.is_recommended} onChange={e=>set('is_recommended',e.target.checked)} style={{width:16,height:16,accentColor:'var(--gold)'}}/>
              <span style={{color:'var(--slate2)',fontSize:'0.875rem'}}>Mark as Recommended</span>
            </label>
          </div>
          <div style={{display:'flex',gap:10}}>
            <button type="submit" style={{padding:'11px 24px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-body)'}}>
              {editing?'Update Plan':'Create Plan'}
            </button>
            {editing && <button type="button" onClick={()=>{setEditing(null);setForm({title:'',plan_type:'individual',class_range:'',label:'',regular_price:'',discounted_price:'',features:'2 Subjects\nWeekly Tests\nProgress Reports',is_recommended:false,sort_order:99});}} style={{padding:'11px 20px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,color:'var(--slate2)',cursor:'pointer',fontFamily:'var(--font-body)'}}>Cancel</button>}
          </div>
        </form>
      </div>

      {/* Plans list */}
      {loading ? <div className="spinner" style={{margin:'40px auto',borderTopColor:'var(--gold)'}}/> :
       plans.length===0 ? <p style={{color:'var(--slate2)'}}>No plans yet.</p> : (
        <div style={{display:'grid',gap:12}}>
          {plans.map(p => {
            const feats = typeof p.features==='string' ? JSON.parse(p.features||'[]') : p.features||[];
            return (
              <div key={p.id} style={{background:'var(--navy2)',borderRadius:14,padding:'18px 20px',border:'1px solid rgba(212,168,83,0.1)',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
                <div>
                  <div style={{color:'white',fontWeight:700,fontSize:'0.95rem'}}>{p.title} {p.is_recommended && <span style={{background:'rgba(212,168,83,0.15)',color:'var(--gold)',padding:'2px 8px',borderRadius:100,fontSize:'0.68rem',marginLeft:6}}>★ Recommended</span>}</div>
                  <div style={{color:'var(--teal)',fontSize:'0.78rem',marginTop:2}}>{p.plan_type} · {p.class_range}</div>
                  <div style={{color:'var(--slate2)',fontSize:'0.78rem',marginTop:2}}>₹{p.discounted_price||0}/mo · {feats.length} features</div>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button onClick={()=>edit(p)} style={{padding:'7px 14px',background:'rgba(212,168,83,0.1)',border:'none',borderRadius:8,color:'var(--gold)',cursor:'pointer',fontSize:'0.8rem',fontFamily:'var(--font-body)'}}>Edit</button>
                  <button onClick={()=>del(p.id)} style={{padding:'7px 14px',background:'rgba(192,57,43,0.1)',border:'none',borderRadius:8,color:'#e74c3c',cursor:'pointer',fontSize:'0.8rem',fontFamily:'var(--font-body)'}}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
