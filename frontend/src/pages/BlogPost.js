import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/blog/${slug}`)
      .then(r => { setPost(r.data); document.title = `${r.data.title} | Teachs Blog`; })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const fmt = d => new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });

  if (loading) return <div style={{ background:'var(--navy)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}><div className="spinner" style={{ borderTopColor:'var(--gold)' }}/></div>;
  if (notFound) return (
    <div style={{ background:'var(--navy)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', padding:20 }}>
      <div><div style={{ fontSize:'3rem', marginBottom:16 }}>📭</div><h2 style={{ color:'white', marginBottom:10 }}>Article not found</h2><Link to="/blog" style={{ color:'var(--gold)', fontWeight:700 }}>← Back to Blog</Link></div>
    </div>
  );

  return (
    <div style={{ background:'var(--navy)', minHeight:'100vh' }}>
      <div style={{ paddingTop:'var(--nav-height)' }}>
        {/* Cover image */}
        {post.cover_image && (
          <div style={{ width:'100%', height:'clamp(200px,40vw,420px)', overflow:'hidden' }}>
            <img src={post.cover_image} alt={post.title} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
          </div>
        )}

        <div style={{ maxWidth:780, margin:'0 auto', padding:'48px 20px 80px' }}>
          {/* Back */}
          <Link to="/blog" style={{ display:'inline-flex', alignItems:'center', gap:6, color:'var(--slate2)', fontSize:'0.85rem', marginBottom:28, textDecoration:'none' }}>← Back to Blog</Link>

          {/* Meta */}
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:18 }}>
            {post.category && <span style={{ background:'rgba(212,168,83,0.1)', color:'var(--gold)', padding:'4px 12px', borderRadius:100, fontSize:'0.72rem', fontWeight:700 }}>{post.category}</span>}
            {post.tags && post.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => <span key={t} style={{ background:'rgba(0,153,178,0.1)', color:'var(--teal)', padding:'4px 10px', borderRadius:100, fontSize:'0.7rem', fontWeight:600 }}>{t}</span>)}
          </div>

          <h1 style={{ color:'white', marginBottom:16, lineHeight:1.25 }}>{post.title}</h1>

          <div style={{ display:'flex', gap:18, marginBottom:36, flexWrap:'wrap', paddingBottom:20, borderBottom:'1px solid rgba(212,168,83,0.1)' }}>
            <span style={{ fontSize:'0.82rem', color:'var(--slate)' }}>✍️ {post.author}</span>
            <span style={{ fontSize:'0.82rem', color:'var(--slate)' }}>📅 {fmt(post.created_at)}</span>
            <span style={{ fontSize:'0.82rem', color:'var(--slate)' }}>👁 {post.views} views</span>
          </div>

          {/* Content */}
          <div style={{ color:'var(--slate2)', lineHeight:1.9, fontSize:'1rem' }}
            dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, '<br/>') || '' }}
          />

          {/* Footer */}
          <div style={{ marginTop:48, paddingTop:28, borderTop:'1px solid rgba(212,168,83,0.1)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
            <Link to="/blog" style={{ color:'var(--gold)', fontWeight:700, fontSize:'0.9rem' }}>← All Articles</Link>
            <Link to="/pricing" style={{ background:'var(--gold)', color:'var(--navy)', fontWeight:700, padding:'10px 22px', borderRadius:10, textDecoration:'none', fontSize:'0.9rem' }}>Book Free Demo →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
