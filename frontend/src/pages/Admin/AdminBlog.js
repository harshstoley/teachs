import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/api';

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title:'', excerpt:'', content:'', category:'', tags:'', author:'Teachs Team', published:false });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const fileRef = useRef();

  const load = () => {
    setLoading(true);
    api.get('/blog/admin/all').then(r => setPosts(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  };
  useEffect(load, []);

  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  const openNew = () => { setEditing(null); setForm({title:'',excerpt:'',content:'',category:'',tags:'',author:'Teachs Team',published:false}); setImageFile(null); setShowForm(true); };
  const openEdit = (p) => { setEditing(p); setForm({title:p.title,excerpt:p.excerpt||'',content:p.content||'',category:p.category||'',tags:p.tags||'',author:p.author||'Teachs Team',published:!!p.published}); setImageFile(null); setShowForm(true); };

  const save = async e => {
    e.preventDefault(); setSaving(true); setMsg('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      if (imageFile) fd.append('cover_image', imageFile);
      if (editing) { await api.put(`/blog/${editing.id}`, fd, { headers:{'Content-Type':'multipart/form-data'} }); }
      else { await api.post('/blog', fd, { headers:{'Content-Type':'multipart/form-data'} }); }
      setMsg('Saved!'); setShowForm(false); load();
    } catch(e) { setMsg(e.response?.data?.error || 'Error'); }
    finally { setSaving(false); }
  };

  const toggle = async (id) => { await api.patch(`/blog/${id}/toggle`); load(); };
  const del = async (id) => { if (!window.confirm('Delete this post?')) return; await api.delete(`/blog/${id}`); load(); };

  const row = { borderBottom:'1px solid rgba(212,168,83,0.08)', padding:'14px 0', display:'grid', gridTemplateColumns:'1fr auto auto auto auto', gap:16, alignItems:'center' };
  const inp = { width:'100%', padding:'10px 14px', background:'#0f1f35', border:'1px solid rgba(212,168,83,0.2)', borderRadius:10, color:'#ffffff', fontFamily:'var(--font-body)', fontSize:'0.9rem', outline:'none', boxSizing:'border-box' };
  const lbl = { display:'block', fontSize:'0.78rem', color:'#b8c5d9', marginBottom:5, fontWeight:600 };

  return (
    <AdminLayout>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28, flexWrap:'wrap', gap:12 }}>
        <h2 style={{ color:'white', margin:0 }}>Blog Posts</h2>
        <button onClick={openNew} style={{ background:'var(--gold)', color:'var(--navy)', padding:'10px 20px', borderRadius:10, border:'none', cursor:'pointer', fontWeight:700, fontFamily:'var(--font-body)' }}>+ New Post</button>
      </div>
      {msg && <div style={{ background:'rgba(42,138,94,0.15)', border:'1px solid rgba(42,138,94,0.3)', borderRadius:10, padding:'10px 16px', marginBottom:16, color:'#5BC8A0', fontSize:'0.875rem' }}>{msg}</div>}

      {/* Form Modal */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:200, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'20px', overflowY:'auto' }}>
          <div style={{ background:'var(--navy2)', borderRadius:20, padding:'28px 24px', maxWidth:680, width:'100%', border:'1px solid rgba(212,168,83,0.2)', marginTop:40 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h3 style={{ color:'white', margin:0 }}>{editing ? 'Edit Post' : 'New Post'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background:'none', border:'none', color:'var(--slate)', cursor:'pointer', fontSize:'1.3rem' }}>✕</button>
            </div>
            <form onSubmit={save} style={{ display:'grid', gap:14 }}>
              <div><label style={lbl}>Title *</label><input value={form.title} onChange={e=>set('title',e.target.value)} required style={inp} placeholder="Article title"/></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label style={lbl}>Category</label>
                  <select value={form.category} onChange={e=>set('category',e.target.value)} style={{...inp, background:'#152238', color:'white'}}>
                    {['','Study Tips','Parenting','Board Exams','Learning','News'].map(c=><option key={c} value={c}>{c||'Select...'}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Author</label><input value={form.author} onChange={e=>set('author',e.target.value)} style={inp}/></div>
              </div>
              <div><label style={lbl}>Tags (comma separated)</label><input value={form.tags} onChange={e=>set('tags',e.target.value)} style={inp} placeholder="study tips, class 10, maths"/></div>
              <div><label style={lbl}>Excerpt (short description)</label><textarea value={form.excerpt} onChange={e=>set('excerpt',e.target.value)} rows={2} style={{...inp,resize:'vertical'}} placeholder="Brief description shown in listing..."/></div>
              <div><label style={lbl}>Content (HTML supported)</label><textarea value={form.content} onChange={e=>set('content',e.target.value)} rows={8} style={{...inp,resize:'vertical',fontFamily:'monospace',fontSize:'0.85rem'}} placeholder="Full article content..."/></div>
              <div>
                <label style={lbl}>Cover Image</label>
                <input type="file" accept="image/*" ref={fileRef} onChange={e=>setImageFile(e.target.files[0])} style={{ display:'none' }}/>
                <button type="button" onClick={() => fileRef.current.click()} style={{ padding:'8px 16px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(212,168,83,0.2)', borderRadius:8, color:'var(--slate2)', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'0.85rem' }}>
                  {imageFile ? `✅ ${imageFile.name}` : (editing?.cover_image ? '🖼️ Change Image' : '📷 Upload Image')}
                </button>
              </div>
              <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
                <input type="checkbox" checked={form.published} onChange={e=>set('published',e.target.checked)} style={{ width:16,height:16,accentColor:'var(--gold)' }}/>
                <span style={{ color:'var(--slate2)', fontSize:'0.875rem' }}>Publish immediately</span>
              </label>
              <div style={{ display:'flex', gap:10, marginTop:8 }}>
                <button type="submit" disabled={saving} style={{ flex:1, padding:'12px', background:'var(--gold)', color:'var(--navy)', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', fontFamily:'var(--font-body)' }}>
                  {saving ? 'Saving...' : (editing ? 'Update Post' : 'Create Post')}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding:'12px 20px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'var(--slate2)', cursor:'pointer', fontFamily:'var(--font-body)' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts list */}
      {loading ? <div className="spinner" style={{ margin:'40px auto', borderTopColor:'var(--gold)' }}/> : posts.length === 0 ? (
        <div style={{ textAlign:'center', padding:'48px', background:'var(--navy2)', borderRadius:16, border:'1px solid rgba(212,168,83,0.1)' }}>
          <div style={{ fontSize:'2rem', marginBottom:12 }}>📝</div>
          <p style={{ color:'var(--slate2)' }}>No posts yet. Create your first article!</p>
        </div>
      ) : (
        <div style={{ background:'var(--navy2)', borderRadius:16, padding:'8px 20px', border:'1px solid rgba(212,168,83,0.1)' }}>
          <div style={{ ...row, borderBottom:'1px solid rgba(212,168,83,0.15)' }}>
            {['Title','Category','Status','Views','Actions'].map(h=><span key={h} style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--slate)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</span>)}
          </div>
          {posts.map(p => (
            <div key={p.id} style={row}>
              <div>
                <div style={{ color:'white', fontWeight:600, fontSize:'0.9rem', marginBottom:2 }}>{p.title}</div>
                <div style={{ color:'var(--slate)', fontSize:'0.75rem' }}>{new Date(p.created_at).toLocaleDateString('en-IN')}</div>
              </div>
              <span style={{ color:'var(--teal)', fontSize:'0.8rem' }}>{p.category||'—'}</span>
              <span style={{ background:p.published?'rgba(42,138,94,0.15)':'rgba(255,255,255,0.06)', color:p.published?'#5BC8A0':'var(--slate)', padding:'3px 10px', borderRadius:100, fontSize:'0.72rem', fontWeight:700, whiteSpace:'nowrap' }}>
                {p.published ? '✅ Live' : '⏸ Draft'}
              </span>
              <span style={{ color:'var(--slate)', fontSize:'0.8rem' }}>👁 {p.views}</span>
              <div style={{ display:'flex', gap:6 }}>
                <button onClick={() => openEdit(p)} style={{ padding:'5px 10px', background:'rgba(212,168,83,0.1)', border:'none', borderRadius:6, color:'var(--gold)', cursor:'pointer', fontSize:'0.78rem', fontFamily:'var(--font-body)' }}>Edit</button>
                <button onClick={() => toggle(p.id)} style={{ padding:'5px 10px', background:'rgba(0,153,178,0.1)', border:'none', borderRadius:6, color:'var(--teal)', cursor:'pointer', fontSize:'0.78rem', fontFamily:'var(--font-body)' }}>{p.published?'Hide':'Show'}</button>
                <button onClick={() => del(p.id)} style={{ padding:'5px 10px', background:'rgba(192,57,43,0.1)', border:'none', borderRadius:6, color:'#e74c3c', cursor:'pointer', fontSize:'0.78rem', fontFamily:'var(--font-body)' }}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
