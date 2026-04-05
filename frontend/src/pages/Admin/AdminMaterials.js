import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/api';

export default function AdminMaterials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title:'', description:'', category:'', subject:'', class_no:'', is_free:true, published:true });
  const [fileObj, setFileObj] = useState(null);
  const [thumbObj, setThumbObj] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const fileRef = useRef();
  const thumbRef = useRef();

  const load = () => {
    setLoading(true);
    api.get('/materials/admin/all').then(r => setItems(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  };
  useEffect(load, []);

  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  const openNew = () => { setEditing(null); setForm({title:'',description:'',category:'',subject:'',class_no:'',is_free:true,published:true}); setFileObj(null); setThumbObj(null); setShowForm(true); };
  const openEdit = (m) => { setEditing(m); setForm({title:m.title,description:m.description||'',category:m.category||'',subject:m.subject||'',class_no:m.class_no||'',is_free:!!m.is_free,published:!!m.published}); setFileObj(null); setThumbObj(null); setShowForm(true); };

  const save = async e => {
    e.preventDefault(); setSaving(true); setMsg('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      if (fileObj) fd.append('file', fileObj);
      if (thumbObj) fd.append('thumbnail', thumbObj);
      if (editing) await api.put(`/materials/${editing.id}`, fd, { headers:{'Content-Type':'multipart/form-data'} });
      else await api.post('/materials', fd, { headers:{'Content-Type':'multipart/form-data'} });
      setMsg('Saved!'); setShowForm(false); load();
    } catch(e) { setMsg(e.response?.data?.error || 'Error'); }
    finally { setSaving(false); }
  };

  const toggle = async (id) => { await api.patch(`/materials/${id}/toggle`); load(); };
  const del = async (id) => { if (!window.confirm('Delete this material?')) return; await api.delete(`/materials/${id}`); load(); };

  const inp = { width:'100%', padding:'10px 14px', background:'#0f1f35', border:'1px solid rgba(212,168,83,0.2)', borderRadius:10, color:'#ffffff', fontFamily:'var(--font-body)', fontSize:'0.9rem', outline:'none', boxSizing:'border-box' };
  const lbl = { display:'block', fontSize:'0.78rem', color:'#b8c5d9', marginBottom:5, fontWeight:600 };
  const row = { borderBottom:'1px solid rgba(212,168,83,0.08)', padding:'14px 0', display:'grid', gridTemplateColumns:'1fr auto auto auto auto auto', gap:12, alignItems:'center' };

  return (
    <AdminLayout>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28, flexWrap:'wrap', gap:12 }}>
        <h2 style={{ color:'white', margin:0 }}>Study Materials</h2>
        <button onClick={openNew} style={{ background:'var(--gold)', color:'var(--navy)', padding:'10px 20px', borderRadius:10, border:'none', cursor:'pointer', fontWeight:700, fontFamily:'var(--font-body)' }}>+ Add Material</button>
      </div>
      {msg && <div style={{ background:'rgba(42,138,94,0.15)', border:'1px solid rgba(42,138,94,0.3)', borderRadius:10, padding:'10px 16px', marginBottom:16, color:'#5BC8A0', fontSize:'0.875rem' }}>{msg}</div>}

      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:200, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'20px', overflowY:'auto' }}>
          <div style={{ background:'var(--navy2)', borderRadius:20, padding:'28px 24px', maxWidth:640, width:'100%', border:'1px solid rgba(212,168,83,0.2)', marginTop:40 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h3 style={{ color:'white', margin:0 }}>{editing ? 'Edit Material' : 'Add Material'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background:'none', border:'none', color:'var(--slate)', cursor:'pointer', fontSize:'1.3rem' }}>✕</button>
            </div>
            <form onSubmit={save} style={{ display:'grid', gap:14 }}>
              <div><label style={lbl}>Title *</label><input value={form.title} onChange={e=>set('title',e.target.value)} required style={inp} placeholder="e.g. Class 10 Maths Chapter 1 Notes"/></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
                <div><label style={lbl}>Category</label>
                  <select value={form.category} onChange={e=>set('category',e.target.value)} style={{...inp, background:'#152238', color:'white'}}>
                    {['','Notes','Question Papers','Worksheets','Syllabus','Sample Papers'].map(c=><option key={c} value={c}>{c||'Select...'}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Subject</label>
                  <select value={form.subject} onChange={e=>set('subject',e.target.value)} style={{...inp, background:'#152238', color:'white'}}>
                    {['','Mathematics','Science','English','Social Studies','Hindi'].map(s=><option key={s} value={s}>{s||'Select...'}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Class</label>
                  <select value={form.class_no} onChange={e=>set('class_no',e.target.value)} style={{...inp, background:'#152238', color:'white'}}>
                    {['','1','2','3','4','5','6','7','8','9','10'].map(c=><option key={c} value={c}>{c?`Class ${c}`:'Select...'}</option>)}
                  </select>
                </div>
              </div>
              <div><label style={lbl}>Description</label><textarea value={form.description} onChange={e=>set('description',e.target.value)} rows={3} style={{...inp,resize:'vertical'}} placeholder="Brief description of this material..."/></div>
              
              {/* File Upload */}
              <div>
                <label style={lbl}>Material File (PDF, DOC, PPT, Image)</label>
                <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png" ref={fileRef} onChange={e=>setFileObj(e.target.files[0])} style={{ display:'none' }}/>
                <button type="button" onClick={() => fileRef.current.click()} style={{ padding:'10px 18px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(212,168,83,0.2)', borderRadius:8, color:'var(--slate2)', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'0.85rem', width:'100%', textAlign:'left' }}>
                  {fileObj ? `✅ ${fileObj.name}` : (editing?.file_url ? `📄 File uploaded — click to replace` : '📁 Choose file to upload')}
                </button>
              </div>

              {/* Thumbnail */}
              <div>
                <label style={lbl}>Thumbnail Image (optional)</label>
                <input type="file" accept="image/*" ref={thumbRef} onChange={e=>setThumbObj(e.target.files[0])} style={{ display:'none' }}/>
                <button type="button" onClick={() => thumbRef.current.click()} style={{ padding:'10px 18px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(212,168,83,0.2)', borderRadius:8, color:'var(--slate2)', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'0.85rem', width:'100%', textAlign:'left' }}>
                  {thumbObj ? `✅ ${thumbObj.name}` : (editing?.thumbnail_url ? '🖼️ Thumbnail uploaded — click to replace' : '🖼️ Upload thumbnail (optional)')}
                </button>
              </div>

              <div style={{ display:'flex', gap:20 }}>
                <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                  <input type="checkbox" checked={form.is_free} onChange={e=>set('is_free',e.target.checked)} style={{ width:16,height:16,accentColor:'var(--gold)' }}/>
                  <span style={{ color:'var(--slate2)', fontSize:'0.875rem' }}>Free to download</span>
                </label>
                <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                  <input type="checkbox" checked={form.published} onChange={e=>set('published',e.target.checked)} style={{ width:16,height:16,accentColor:'var(--gold)' }}/>
                  <span style={{ color:'var(--slate2)', fontSize:'0.875rem' }}>Published</span>
                </label>
              </div>

              <div style={{ display:'flex', gap:10, marginTop:8 }}>
                <button type="submit" disabled={saving} style={{ flex:1, padding:'12px', background:'var(--gold)', color:'var(--navy)', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', fontFamily:'var(--font-body)' }}>
                  {saving ? 'Saving...' : (editing ? 'Update' : 'Add Material')}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding:'12px 20px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'var(--slate2)', cursor:'pointer', fontFamily:'var(--font-body)' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <div className="spinner" style={{ margin:'40px auto', borderTopColor:'var(--gold)' }}/> : items.length===0 ? (
        <div style={{ textAlign:'center', padding:'48px', background:'var(--navy2)', borderRadius:16, border:'1px solid rgba(212,168,83,0.1)' }}>
          <div style={{ fontSize:'2rem', marginBottom:12 }}>📂</div>
          <p style={{ color:'var(--slate2)' }}>No materials yet. Add your first resource!</p>
        </div>
      ) : (
        <div style={{ background:'var(--navy2)', borderRadius:16, padding:'8px 20px', border:'1px solid rgba(212,168,83,0.1)' }}>
          <div style={{ ...row, borderBottom:'1px solid rgba(212,168,83,0.15)' }}>
            {['Title','Category','Subject','Class','Status','Actions'].map(h=><span key={h} style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--slate)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</span>)}
          </div>
          {items.map(m => (
            <div key={m.id} style={row}>
              <div>
                <div style={{ color:'white', fontWeight:600, fontSize:'0.875rem', marginBottom:2 }}>{m.title}</div>
                <div style={{ color:'var(--slate)', fontSize:'0.72rem' }}>{m.file_type||'—'} {m.file_size ? `· ${m.file_size}` : ''} · ⬇️ {m.downloads}</div>
              </div>
              <span style={{ color:'var(--gold)', fontSize:'0.78rem' }}>{m.category||'—'}</span>
              <span style={{ color:'var(--teal)', fontSize:'0.78rem' }}>{m.subject||'—'}</span>
              <span style={{ color:'var(--slate2)', fontSize:'0.78rem' }}>{m.class_no?`Cl ${m.class_no}`:'—'}</span>
              <span style={{ background:m.published?'rgba(42,138,94,0.15)':'rgba(255,255,255,0.06)', color:m.published?'#5BC8A0':'var(--slate)', padding:'3px 8px', borderRadius:100, fontSize:'0.68rem', fontWeight:700, whiteSpace:'nowrap' }}>
                {m.published ? '✅ Live' : '⏸ Hidden'}
              </span>
              <div style={{ display:'flex', gap:6 }}>
                <button onClick={() => openEdit(m)} style={{ padding:'5px 10px', background:'rgba(212,168,83,0.1)', border:'none', borderRadius:6, color:'var(--gold)', cursor:'pointer', fontSize:'0.78rem', fontFamily:'var(--font-body)' }}>Edit</button>
                <button onClick={() => toggle(m.id)} style={{ padding:'5px 10px', background:'rgba(0,153,178,0.1)', border:'none', borderRadius:6, color:'var(--teal)', cursor:'pointer', fontSize:'0.78rem', fontFamily:'var(--font-body)' }}>{m.published?'Hide':'Show'}</button>
                <button onClick={() => del(m.id)} style={{ padding:'5px 10px', background:'rgba(192,57,43,0.1)', border:'none', borderRadius:6, color:'#e74c3c', cursor:'pointer', fontSize:'0.78rem', fontFamily:'var(--font-body)' }}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
