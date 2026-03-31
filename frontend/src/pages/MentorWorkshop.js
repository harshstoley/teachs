import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function MentorWorkshop() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Mentor Workshops | Teachs – Live Sessions for Parents & Students';
    const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Join Teachs live mentor workshops. Expert sessions on study habits, board exam strategies, parenting for academic success, and child development. Register free.';
    document.head.appendChild(meta);
    api.get('/workshop/sessions').then(r => setSessions(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background:'var(--cream)' }}>
      {/* Hero */}
      <section style={{ background:'linear-gradient(135deg, #1B3A6B 0%, #0099B2 100%)', padding:'100px 0 80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:350, height:350, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }}/>
        <div className="container" style={{ position:'relative', textAlign:'center' }}>
          <span className="section-tag" style={{ background:'rgba(255,255,255,0.15)', color:'white' }}>Mentor Workshop</span>
          <h1 style={{ color:'white', marginTop:14, marginBottom:18 }}>Expert Workshops for<br/>Parents & Students</h1>
          <p style={{ color:'rgba(255,255,255,0.8)', maxWidth:560, margin:'0 auto 36px', fontSize:'1.05rem', lineHeight:1.8 }}>
            Live sessions on study habits, board exam strategies, parenting for academic success, and more — led by verified educators with real classroom experience.
          </p>
          <a href="#sessions" className="btn btn-gold btn-lg">View Upcoming Sessions →</a>
        </div>
      </section>

      {/* Why */}
      <section style={{ background:'white', padding:'80px 0' }}>
        <div className="container">
          <div className="section-header center" style={{ marginBottom:52 }}>
            <span className="section-tag">Purpose</span>
            <h2 className="section-title">Why We Run These Workshops</h2>
            <p className="section-sub" style={{ margin:'0 auto' }}>Every session is carefully designed to create real, lasting change in how students learn and parents support them.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:24 }}>
            {[
              ['👨‍👩‍👧','Parent Empowerment','Help parents understand how to support learning at home without stress or conflict. Practical tools that actually work.','rgba(26,58,143,0.08)','var(--navy)'],
              ['📖','Student Skills','Teach students study strategies, time management, and exam techniques that significantly improve performance.','rgba(0,153,178,0.08)','var(--teal)'],
              ['🎯','Expert Guidance','Every session is led by verified educators with 5+ years of real classroom experience and proven results.','rgba(212,168,83,0.1)','var(--gold)'],
              ['🧠','Mental Well-being','Address exam anxiety, stress management, and building a growth mindset for academic resilience.','rgba(155,89,182,0.1)','#9B59B6'],
            ].map(([icon,title,desc,bg,accent]) => (
              <div key={title} style={{ background:'var(--cream)', borderRadius:20, padding:'32px 26px', border:'1px solid rgba(0,0,0,0.06)', textAlign:'center' }}>
                <div style={{ width:70, height:70, borderRadius:'50%', background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', margin:'0 auto 20px' }}>{icon}</div>
                <h3 style={{ color:'var(--text)', fontSize:'1rem', marginBottom:10, fontFamily:'var(--font-body)', fontWeight:700 }}>{title}</h3>
                <p style={{ color:'var(--text2)', fontSize:'0.875rem', lineHeight:1.7, margin:0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you will learn */}
      <section style={{ background:'var(--cream)', padding:'80px 0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
            <div>
              <span className="section-tag">Topics Covered</span>
              <h2 className="section-title" style={{ marginTop:14 }}>What You Will Learn</h2>
              <div style={{ display:'grid', gap:12, marginTop:24 }}>
                {[
                  'How to create an effective study schedule','Board exam preparation strategies (Class 10 & 12)','Understanding your child\'s learning style','Managing screen time and distractions','Building exam confidence and reducing anxiety','Effective revision techniques that actually work','Parent-teacher communication best practices','Time management for competitive students',
                ].map(item => (
                  <div key={item} style={{ display:'flex', gap:12, alignItems:'center' }}>
                    <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(0,153,178,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round"/></svg>
                    </div>
                    <span style={{ color:'var(--text)', fontSize:'0.875rem' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:'grid', gap:16 }}>
              {[
                ['🎓','Expert Led','Sessions by educators with 5–15 years experience'],
                ['👥','Small Groups','Maximum 50 participants for personal attention'],
                ['💬','Live Q&A','Direct interaction with the expert during session'],
                ['📝','Resources','Get notes, worksheets, and recording after class'],
                ['🆓','Free to Attend','Most sessions are completely free to register'],
                ['📱','Online Format','Join from mobile, tablet, or computer'],
              ].map(([icon,title,desc]) => (
                <div key={title} style={{ display:'flex', gap:14, alignItems:'center', background:'white', borderRadius:14, padding:'14px 18px', border:'1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize:'1.3rem', flexShrink:0 }}>{icon}</div>
                  <div><div style={{ fontWeight:600, color:'var(--text)', fontSize:'0.875rem' }}>{title}</div><div style={{ color:'var(--text2)', fontSize:'0.78rem', marginTop:1 }}>{desc}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sessions */}
      <section id="sessions" style={{ background:'white', padding:'80px 0' }}>
        <div className="container">
          <div className="section-header center" style={{ marginBottom:48 }}>
            <span className="section-tag">Upcoming</span>
            <h2 className="section-title">Register for a Workshop</h2>
          </div>
          {loading ? <div className="spinner" style={{ margin:'40px auto', borderTopColor:'var(--gold)' }}/> :
           sessions.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 20px', background:'var(--cream)', borderRadius:24, maxWidth:500, margin:'0 auto' }}>
              <div style={{ fontSize:'3rem', marginBottom:16 }}>📅</div>
              <h3 style={{ color:'var(--text)', marginBottom:10 }}>New Sessions Coming Soon</h3>
              <p style={{ color:'var(--text2)', marginBottom:24 }}>Follow us on WhatsApp to get notified when new sessions are announced.</p>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn btn-gold">💬 Get Notified on WhatsApp</a>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24 }}>
              {sessions.map(s => (
                <div key={s.id} style={{ background:'var(--cream)', borderRadius:20, padding:'28px 24px', border:'1px solid rgba(0,0,0,0.07)', boxShadow:'0 4px 20px rgba(0,0,0,0.05)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                    <span style={{ background:'rgba(42,138,94,0.1)', color:'#2A8A5E', padding:'4px 12px', borderRadius:100, fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase' }}>Upcoming</span>
                    <span style={{ fontSize:'0.78rem', color:'var(--text2)' }}>⏱ {s.duration} min</span>
                  </div>
                  <h3 style={{ color:'var(--text)', fontSize:'1.05rem', marginBottom:10 }}>{s.title}</h3>
                  <p style={{ color:'var(--text2)', fontSize:'0.875rem', marginBottom:20, lineHeight:1.65 }}>{s.description}</p>
                  <div style={{ display:'flex', gap:16, marginBottom:20, flexWrap:'wrap' }}>
                    <span style={{ fontSize:'0.8rem', color:'var(--text2)' }}>📅 {new Date(s.session_date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</span>
                    <span style={{ fontSize:'0.8rem', color:'var(--text2)' }}>🕐 {new Date(s.session_date).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span>
                    {s.seats && <span style={{ fontSize:'0.8rem', color:'var(--text2)' }}>👥 {s.seats} seats</span>}
                  </div>
                  {s.google_form_url
                    ? <a href={s.google_form_url} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ width:'100%', justifyContent:'center' }}>Register Free →</a>
                    : <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width:'100%', justifyContent:'center' }}>Register via WhatsApp →</a>
                  }
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background:'var(--cream)', padding:'80px 0' }}>
        <div className="container">
          <div className="section-header center" style={{ marginBottom:48 }}>
            <span className="section-tag">Reviews</span>
            <h2 className="section-title">What Parents Say</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
            {[
              ['Sunita Mehta','Parent, Delhi','The workshop completely changed how I talk to my daughter about studies. No more stress at home!'],
              ['Rahul Verma','Parent, Mumbai','Incredibly practical. I implemented 3 strategies the same day and saw a difference within a week.'],
              ['Kavitha N.','Parent, Bangalore','The board exam workshop prepared my son mentally. His confidence in exams has improved a lot.'],
            ].map(([name,tag,quote]) => (
              <div key={name} style={{ background:'white', borderRadius:20, padding:'28px 24px', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ color:'var(--gold)', fontSize:'1rem', marginBottom:14 }}>★★★★★</div>
                <p style={{ color:'var(--text)', fontSize:'0.9rem', lineHeight:1.7, fontStyle:'italic', marginBottom:20 }}>"{quote}"</p>
                <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                  <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg, var(--navy) 0%, var(--teal) 100%)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, flexShrink:0 }}>{name[0]}</div>
                  <div><div style={{ fontWeight:600, color:'var(--text)', fontSize:'0.875rem' }}>{name}</div><div style={{ fontSize:'0.75rem', color:'var(--text2)' }}>{tag}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
