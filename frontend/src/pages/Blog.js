import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const CATEGORIES = ['All','Study Tips','Parenting','Board Exams','Learning','News'];

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    document.title = 'Blog | Teachs – Study Tips, Parenting & Education';
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (cat !== 'All') params.category = cat;
    if (search) params.search = search;
    api.get('/blog', { params }).then(r => setPosts(r.data)).catch(() => setPosts([])).finally(() => setLoading(false));
  }, [cat, search]);

  const handleSearch = e => { e.preventDefault(); setSearch(searchVal); };
  const fmt = d => new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });

  const Tag = ({text}) => <div style={{ display:'inline-flex',alignItems:'center',gap:6,background:'rgba(212,168,83,0.1)',border:'1px solid rgba(212,168,83,0.25)',color:'var(--gold)',fontSize:'0.72rem',fontWeight:700,padding:'5px 14px',borderRadius:100,marginBottom:16,letterSpacing:'0.5px' }}><span style={{width:5,height:5,borderRadius:'50%',background:'var(--gold)',display:'inline-block'}}/>{text}</div>;

  return (
    <div style={{ background:'var(--navy)', minHeight:'100vh' }}>

      {/* HERO */}
      <section style={{ paddingTop:'calc(var(--nav-height) + 60px)', paddingBottom:52, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(212,168,83,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,83,0.03) 1px,transparent 1px)',backgroundSize:'60px 60px' }}/>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px', position:'relative', textAlign:'center' }}>
          <Tag text="TEACHS BLOG"/>
          <h1 style={{ color:'white', marginBottom:14 }}>Insights for <em style={{ color:'var(--gold)', fontStyle:'normal' }}>Smarter</em> Learning</h1>
          <p style={{ color:'var(--slate2)', maxWidth:480, margin:'0 auto 32px', lineHeight:1.75 }}>Study tips, parenting advice, board exam strategies and education insights — written by our expert educators.</p>
          <form onSubmit={handleSearch} style={{ display:'flex', gap:8, maxWidth:440, margin:'0 auto', justifyContent:'center' }}>
            <input
              value={searchVal} onChange={e=>setSearchVal(e.target.value)}
              placeholder="Search articles..."
              style={{ flex:1, padding:'11px 16px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(212,168,83,0.2)', borderRadius:10, color:'white', fontFamily:'var(--font-body)', fontSize:'0.9rem', outline:'none' }}
            />
            <button type="submit" style={{ padding:'11px 20px', background:'var(--gold)', color:'var(--navy)', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'0.9rem', whiteSpace:'nowrap' }}>Search</button>
          </form>
        </div>
      </section>

      {/* CATEGORY TABS */}
      <div style={{ background:'var(--navy2)', borderTop:'1px solid rgba(212,168,83,0.1)', borderBottom:'1px solid rgba(212,168,83,0.1)', padding:'14px 20px', overflowX:'auto' }}>
        <div style={{ display:'flex', gap:8, maxWidth:1100, margin:'0 auto', minWidth:'max-content' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding:'7px 18px', borderRadius:20, border:'none', cursor:'pointer', fontSize:'0.83rem',
              background: cat===c ? 'var(--gold)' : 'rgba(255,255,255,0.05)',
              color: cat===c ? 'var(--navy)' : 'var(--slate2)',
              fontWeight: cat===c ? 700 : 400, fontFamily:'var(--font-body)', whiteSpace:'nowrap',
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* POSTS */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'48px 20px' }}>
        {loading ? <div className="spinner" style={{ margin:'60px auto', borderTopColor:'var(--gold)' }}/> :
         posts.length===0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px', background:'var(--navy2)', borderRadius:20, border:'1px solid rgba(212,168,83,0.1)' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:14 }}>📝</div>
            <h3 style={{ color:'white', marginBottom:8 }}>No articles yet</h3>
            <p style={{ color:'var(--slate2)' }}>Check back soon — new articles are published regularly.</p>
          </div>
         ) : (
          <>
            {/* Featured first post */}
            {posts[0] && (
              <Link to={`/blog/${posts[0].slug}`} style={{ display:'block', textDecoration:'none', marginBottom:32 }}>
                <div style={{ background:'var(--navy2)', borderRadius:20, border:'1px solid rgba(212,168,83,0.12)', overflow:'hidden', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(300px,100%),1fr))', transition:'border-color 0.2s' }}>
                  {posts[0].cover_image ? (
                    <div style={{ height:280, overflow:'hidden' }}>
                      <img src={posts[0].cover_image} alt={posts[0].title} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                    </div>
                  ) : (
                    <div style={{ height:280, background:'linear-gradient(135deg,var(--navy3),var(--teal))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'4rem' }}>📚</div>
                  )}
                  <div style={{ padding:'32px 28px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                    <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:14 }}>
                      {posts[0].category && <span style={{ background:'rgba(212,168,83,0.12)', color:'var(--gold)', padding:'3px 10px', borderRadius:100, fontSize:'0.7rem', fontWeight:700 }}>{posts[0].category}</span>}
                      <span style={{ background:'rgba(42,138,94,0.15)', color:'#5BC8A0', padding:'3px 10px', borderRadius:100, fontSize:'0.7rem', fontWeight:700 }}>FEATURED</span>
                    </div>
                    <h2 style={{ color:'white', fontSize:'clamp(1.2rem,2.5vw,1.6rem)', marginBottom:12, lineHeight:1.3 }}>{posts[0].title}</h2>
                    <p style={{ color:'var(--slate2)', fontSize:'0.9rem', lineHeight:1.7, marginBottom:18 }}>{posts[0].excerpt}</p>
                    <div style={{ display:'flex', gap:16, alignItems:'center', flexWrap:'wrap' }}>
                      <span style={{ fontSize:'0.78rem', color:'var(--slate)' }}>✍️ {posts[0].author}</span>
                      <span style={{ fontSize:'0.78rem', color:'var(--slate)' }}>📅 {fmt(posts[0].created_at)}</span>
                      <span style={{ fontSize:'0.78rem', color:'var(--slate)' }}>👁 {posts[0].views} views</span>
                    </div>
                    <div style={{ marginTop:20, color:'var(--gold)', fontWeight:700, fontSize:'0.9rem' }}>Read Article →</div>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid of remaining posts */}
            {posts.length > 1 && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(300px,100%),1fr))', gap:20 }}>
                {posts.slice(1).map(post => (
                  <Link key={post.id} to={`/blog/${post.slug}`} style={{ textDecoration:'none' }}>
                    <div style={{ background:'var(--navy2)', borderRadius:18, border:'1px solid rgba(212,168,83,0.1)', overflow:'hidden', height:'100%', display:'flex', flexDirection:'column', transition:'border-color 0.2s' }}>
                      {post.cover_image ? (
                        <div style={{ height:180, overflow:'hidden' }}>
                          <img src={post.cover_image} alt={post.title} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                        </div>
                      ) : (
                        <div style={{ height:180, background:'linear-gradient(135deg,var(--navy3),rgba(0,153,178,0.3))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem' }}>📖</div>
                      )}
                      <div style={{ padding:'20px 18px', flex:1, display:'flex', flexDirection:'column' }}>
                        {post.category && <span style={{ display:'inline-block', background:'rgba(212,168,83,0.1)', color:'var(--gold)', padding:'3px 10px', borderRadius:100, fontSize:'0.68rem', fontWeight:700, marginBottom:10, alignSelf:'flex-start' }}>{post.category}</span>}
                        <h3 style={{ color:'white', fontSize:'0.95rem', marginBottom:8, lineHeight:1.4, fontFamily:'var(--font-body)', fontWeight:700, flex:1 }}>{post.title}</h3>
                        <p style={{ color:'var(--slate2)', fontSize:'0.82rem', lineHeight:1.6, marginBottom:14, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{post.excerpt}</p>
                        <div style={{ display:'flex', gap:12, alignItems:'center', borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:12 }}>
                          <span style={{ fontSize:'0.74rem', color:'var(--slate)' }}>📅 {fmt(post.created_at)}</span>
                          <span style={{ fontSize:'0.74rem', color:'var(--slate)' }}>👁 {post.views}</span>
                          <span style={{ marginLeft:'auto', color:'var(--gold)', fontWeight:700, fontSize:'0.78rem' }}>Read →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
         )}
      </div>

      {/* CTA */}
      <div style={{ background:'var(--navy2)', borderTop:'1px solid rgba(212,168,83,0.1)', padding:'48px 20px', textAlign:'center' }}>
        <h2 style={{ color:'white', marginBottom:10 }}>Want to Learn With Expert Teachers?</h2>
        <p style={{ color:'var(--slate2)', marginBottom:24, maxWidth:400, margin:'0 auto 24px' }}>Book a free demo class and experience the Teachs Dual-Teacher model.</p>
        <Link to="/pricing" style={{ display:'inline-block', background:'var(--gold)', color:'var(--navy)', fontWeight:700, padding:'13px 28px', borderRadius:10, textDecoration:'none' }}>Book Free Demo →</Link>
      </div>
    </div>
  );
}
