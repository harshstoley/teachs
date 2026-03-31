import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function MentorWorkshop() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Mentor Workshops | Teachs – Live Sessions for Parents & Students';
    api.get('/workshop/sessions').then(r => setSessions(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const tag = (text, color='#1B3A6B') => (
    <span style={{ display:'inline-block', background:`${color}12`, color, fontSize:'0.72rem', fontWeight:700, padding:'5px 14px', borderRadius:100, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:14 }}>{text}</span>
  );

  return (
    <div style={{ background:'#FAF7F2' }}>

      {/* HERO */}
      <section style={{ background:'linear-gradient(135deg, #1B3A6B 0%, #0099B2 100%)', padding:'80px 0 60px', overflow:'hidden', position:'relative' }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:280, height:280, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }}/>
        <div style={{ position:'absolute', bottom:-40, left:40, width:180, height:180, borderRadius:'50%', background:'rgba(245,166,35,0.1)' }}/>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px', position:'relative', textAlign:'center' }}>
          {tag('Mentor Workshop','#F5A623')}
          <h1 style={{ color:'white', margin:'0 auto 16px', maxWidth:600, fontSize:'clamp(1.8rem,4vw,2.8rem)' }}>Expert Workshops for Parents & Students</h1>
          <p style={{ color:'rgba(255,255,255,0.8)', maxWidth:500, margin:'0 auto 32px', lineHeight:1.75 }}>Live sessions on study habits, board exam strategies, and parenting for academic success — led by verified educators.</p>
          <a href="#sessions" style={{ display:'inline-block', background:'#F5A623', color:'#1B3A6B', fontWeight:700, padding:'13px 28px', borderRadius:10, textDecoration:'none', fontSize:'0.95rem' }}>View Upcoming Sessions →</a>
        </div>
      </section>

      {/* WHY */}
      <section style={{ background:'white', padding:'60px 0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            {tag('Purpose','#1B3A6B')}
            <h2 style={{ color:'#1B3A6B', margin:0 }}>Why We Run These Workshops</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16 }}>
            {[
              ['👨‍👩‍👧','Parent Empowerment','#1B3A6B','Practical tools to support learning at home without stress or conflict.'],
              ['📖','Student Skills','#0099B2','Study strategies, time management, and exam techniques that work.'],
              ['🎯','Expert Guidance','#F5A623','Sessions led by verified educators with 5+ years experience.'],
              ['🧠','Mental Well-being','#1B3A6B','Exam anxiety, stress management, and growth mindset building.'],
            ].map(([icon,title,color,desc]) => (
              <div key={title} style={{ background:'#FAF7F2', borderRadius:16, padding:'24px 20px', border:'1px solid rgba(27,58,107,0.08)', textAlign:'center' }}>
                <div style={{ width:60, height:60, borderRadius:'50%', background:`${color}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', margin:'0 auto 14px' }}>{icon}</div>
                <h3 style={{ color:'#1B3A6B', fontSize:'0.95rem', marginBottom:8, fontFamily:'var(--font-body)', fontWeight:700 }}>{title}</h3>
                <p style={{ color:'#4A5E7A', fontSize:'0.84rem', lineHeight:1.65, margin:0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU LEARN + FEATURES */}
      <section style={{ background:'#FAF7F2', padding:'60px 0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:40, alignItems:'start' }}>
            <div>
              {tag('Topics Covered','#0099B2')}
              <h2 style={{ color:'#1B3A6B', marginBottom:24 }}>What You Will Learn</h2>
              <div style={{ display:'grid', gap:10 }}>
                {['How to create an effective study schedule','Board exam preparation (Class 10 & 12)','Understanding your child\'s learning style','Managing screen time & distractions','Building exam confidence','Effective revision techniques','Parent-teacher communication','Time management for students'].map(item => (
                  <div key={item} style={{ display:'flex', gap:10, alignItems:'center', background:'white', borderRadius:10, padding:'10px 14px', border:'1px solid rgba(27,58,107,0.07)' }}>
                    <div style={{ width:22, height:22, borderRadius:'50%', background:'rgba(0,153,178,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#0099B2" strokeWidth="2.5" strokeLinecap="round"/></svg>
                    </div>
                    <span style={{ color:'#1B3A6B', fontSize:'0.85rem', fontWeight:500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {tag('Session Features','#1B3A6B')}
              <h2 style={{ color:'#1B3A6B', marginBottom:24 }}>What Makes It Special</h2>
              <div style={{ display:'grid', gap:12 }}>
                {[['🎓','Expert Led','5–15 years experienced educators'],['👥','Small Groups','Max 50 for personal attention'],['💬','Live Q&A','Direct interaction with expert'],['📝','Resources','Notes & recording after class'],['🆓','Free to Attend','Most sessions are free'],['📱','Join Anywhere','Mobile, tablet or computer']].map(([icon,title,desc]) => (
                  <div key={title} style={{ display:'flex', gap:14, alignItems:'center', background:'white', borderRadius:12, padding:'14px 16px', border:'1px solid rgba(27,58,107,0.07)' }}>
                    <div style={{ fontSize:'1.3rem', flexShrink:0, width:40, textAlign:'center' }}>{icon}</div>
                    <div><div style={{ fontWeight:700, color:'#1B3A6B', fontSize:'0.875rem' }}>{title}</div><div style={{ color:'#4A5E7A', fontSize:'0.78rem', marginTop:1 }}>{desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SESSIONS */}
      <section id="sessions" style={{ background:'white', padding:'60px 0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            {tag('Upcoming','#2A8A5E')}
            <h2 style={{ color:'#1B3A6B', margin:0 }}>Register for a Workshop</h2>
          </div>
          {loading ? <div className="spinner" style={{ margin:'40px auto', borderTopColor:'#F5A623' }}/> :
           sessions.length === 0 ? (
            <div style={{ textAlign:'center', padding:'48px 20px', background:'#FAF7F2', borderRadius:20, maxWidth:460, margin:'0 auto' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:14 }}>📅</div>
              <h3 style={{ color:'#1B3A6B', marginBottom:8 }}>Sessions Coming Soon</h3>
              <p style={{ color:'#4A5E7A', marginBottom:24, fontSize:'0.9rem' }}>Follow us on WhatsApp to get notified when new sessions are announced.</p>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ display:'inline-block', background:'#25D366', color:'white', fontWeight:700, padding:'12px 24px', borderRadius:10, textDecoration:'none' }}>💬 Get Notified</a>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
              {sessions.map(s => (
                <div key={s.id} style={{ background:'#FAF7F2', borderRadius:18, padding:'24px 20px', border:'1px solid rgba(27,58,107,0.1)', boxShadow:'0 2px 12px rgba(27,58,107,0.06)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                    <span style={{ background:'rgba(42,138,94,0.1)', color:'#2A8A5E', padding:'4px 12px', borderRadius:100, fontSize:'0.7rem', fontWeight:700 }}>UPCOMING</span>
                    <span style={{ fontSize:'0.78rem', color:'#4A5E7A' }}>⏱ {s.duration} min</span>
                  </div>
                  <h3 style={{ color:'#1B3A6B', fontSize:'1rem', marginBottom:8 }}>{s.title}</h3>
                  <p style={{ color:'#4A5E7A', fontSize:'0.85rem', marginBottom:18, lineHeight:1.65 }}>{s.description}</p>
                  <div style={{ display:'flex', gap:14, marginBottom:18, flexWrap:'wrap' }}>
                    <span style={{ fontSize:'0.78rem', color:'#4A5E7A' }}>📅 {new Date(s.session_date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                    <span style={{ fontSize:'0.78rem', color:'#4A5E7A' }}>🕐 {new Date(s.session_date).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span>
                    {s.seats && <span style={{ fontSize:'0.78rem', color:'#4A5E7A' }}>👥 {s.seats} seats</span>}
                  </div>
                  {s.google_form_url
                    ? <a href={s.google_form_url} target="_blank" rel="noopener noreferrer" style={{ display:'block', background:'#F5A623', color:'#1B3A6B', fontWeight:700, textAlign:'center', padding:'12px', borderRadius:10, textDecoration:'none', fontSize:'0.9rem' }}>Register Free →</a>
                    : <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ display:'block', background:'#0099B2', color:'white', fontWeight:700, textAlign:'center', padding:'12px', borderRadius:10, textDecoration:'none', fontSize:'0.9rem' }}>Register via WhatsApp →</a>
                  }
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background:'#FAF7F2', padding:'60px 0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            {tag('Reviews','#F5A623')}
            <h2 style={{ color:'#1B3A6B', margin:0 }}>What Parents Say</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20 }}>
            {[['Sunita Mehta','Parent, Delhi','The workshop completely changed how I talk to my daughter about studies. No more stress at home!'],['Rahul Verma','Parent, Mumbai','Incredibly practical. I saw a difference within a week of implementing the strategies.'],['Kavitha N.','Parent, Bangalore','My son\'s confidence in board exams improved a lot after the strategy session.']].map(([name,tag2,quote]) => (
              <div key={name} style={{ background:'white', borderRadius:18, padding:'24px 20px', boxShadow:'0 2px 16px rgba(27,58,107,0.07)' }}>
                <div style={{ color:'#F5A623', fontSize:'1rem', marginBottom:12 }}>★★★★★</div>
                <p style={{ color:'#1B3A6B', fontSize:'0.9rem', lineHeight:1.7, fontStyle:'italic', marginBottom:18 }}>"{quote}"</p>
                <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                  <div style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#1B3A6B,#0099B2)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, flexShrink:0 }}>{name[0]}</div>
                  <div><div style={{ fontWeight:700, color:'#1B3A6B', fontSize:'0.875rem' }}>{name}</div><div style={{ fontSize:'0.74rem', color:'#4A5E7A' }}>{tag2}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:'linear-gradient(135deg,#1B3A6B,#0099B2)', padding:'60px 20px', textAlign:'center' }}>
        <h2 style={{ color:'white', marginBottom:12 }}>Ready to Transform Learning?</h2>
        <p style={{ color:'rgba(255,255,255,0.75)', marginBottom:28, maxWidth:440, margin:'0 auto 28px' }}>Join thousands of parents who have already transformed their child's academic journey.</p>
        <a href="#sessions" style={{ display:'inline-block', background:'#F5A623', color:'#1B3A6B', fontWeight:700, padding:'14px 28px', borderRadius:10, textDecoration:'none', fontSize:'1rem' }}>Register for Free →</a>
      </section>
    </div>
  );
}
