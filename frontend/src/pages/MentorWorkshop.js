import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const Tag = ({text}) => <div style={{ display:'inline-flex',alignItems:'center',gap:6,background:'rgba(212,168,83,0.1)',border:'1px solid rgba(212,168,83,0.25)',color:'var(--gold)',fontSize:'0.72rem',fontWeight:700,padding:'5px 14px',borderRadius:100,marginBottom:16,letterSpacing:'0.5px' }}><span style={{width:5,height:5,borderRadius:'50%',background:'var(--gold)',display:'inline-block'}}/>{text}</div>;

export default function MentorWorkshop() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Mentor Workshops | Teachs';
    api.get('/workshop/sessions').then(r => setSessions(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background:'var(--navy)', minHeight:'100vh' }}>

      {/* HERO */}
      <section style={{ paddingTop:'calc(var(--nav-height) + 60px)', paddingBottom:60, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute',inset:0, backgroundImage:'linear-gradient(rgba(212,168,83,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,83,0.03) 1px,transparent 1px)', backgroundSize:'60px 60px' }}/>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px', position:'relative', textAlign:'center' }}>
          <Tag text="MENTOR WORKSHOP"/>
          <h1 style={{ color:'white', marginBottom:14 }}>Expert Workshops for<br/>Parents & Students</h1>
          <p style={{ color:'var(--slate2)', maxWidth:500, margin:'0 auto 32px', lineHeight:1.75 }}>Live sessions on study habits, board exam strategies, and parenting for academic success — led by verified educators with 5+ years experience.</p>
          <a href="#sessions" style={{ display:'inline-block', background:'var(--gold)', color:'var(--navy)', fontWeight:700, padding:'13px 28px', borderRadius:10, textDecoration:'none', fontSize:'0.95rem' }}>View Upcoming Sessions →</a>
        </div>
      </section>

      {/* TRUST BAR */}
      <div style={{ background:'var(--navy2)', borderTop:'1px solid rgba(212,168,83,0.1)', borderBottom:'1px solid rgba(212,168,83,0.1)', padding:'14px 20px' }}>
        <div style={{ display:'flex', justifyContent:'center', gap:24, flexWrap:'wrap' }}>
          {['🎓 Expert Led','👥 Small Groups','💬 Live Q&A','📝 Free Resources','🆓 Free to Attend'].map(t=>(
            <span key={t} style={{ color:'var(--slate2)', fontSize:'0.82rem', fontWeight:500 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* WHY */}
      <section style={{ background:'var(--white)', padding:'64px 0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <Tag text="PURPOSE"/>
            <h2 style={{ color:'var(--text)', margin:0 }}>Why We Run These Workshops</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap:20 }}>
            {[
              ['👨‍👩‍👧','Parent Empowerment','Practical tools to support learning at home without stress.'],
              ['📖','Student Skills','Study strategies and exam techniques that actually work.'],
              ['🎯','Expert Guidance','Led by verified educators with real classroom experience.'],
              ['🧠','Mental Well-being','Exam anxiety, stress management & growth mindset.'],
            ].map(([icon,title,desc]) => (
              <div key={title} style={{ background:'var(--cream)', borderRadius:16, padding:'28px 22px', border:'1px solid rgba(0,0,0,0.06)', textAlign:'center' }}>
                <div style={{ fontSize:'2rem', marginBottom:14 }}>{icon}</div>
                <h3 style={{ color:'var(--text)', fontSize:'1rem', marginBottom:8, fontFamily:'var(--font-body)', fontWeight:700 }}>{title}</h3>
                <p style={{ color:'var(--text2)', fontSize:'0.85rem', lineHeight:1.65, margin:0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU LEARN */}
      <section style={{ background:'var(--navy2)', padding:'64px 0', borderTop:'1px solid rgba(212,168,83,0.1)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap:48, alignItems:'start' }}>
            <div>
              <Tag text="TOPICS COVERED"/>
              <h2 style={{ color:'white', marginBottom:24 }}>What You Will Learn</h2>
              <div style={{ display:'grid', gap:10 }}>
                {['How to create an effective study schedule','Board exam prep for Class 10 & 12','Understanding your child\'s learning style','Managing screen time & distractions','Building exam confidence & reducing anxiety','Effective revision techniques','Parent-teacher communication tips','Time management for competitive students'].map(item=>(
                  <div key={item} style={{ display:'flex', gap:10, alignItems:'center', background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'10px 14px', border:'1px solid rgba(212,168,83,0.08)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}><circle cx="12" cy="12" r="10" fill="rgba(212,168,83,0.15)"/><path d="M8 12l3 3 5-5" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round"/></svg>
                    <span style={{ color:'var(--slate2)', fontSize:'0.85rem' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Tag text="SESSION FEATURES"/>
              <h2 style={{ color:'white', marginBottom:24 }}>What Makes It Special</h2>
              <div style={{ display:'grid', gap:12 }}>
                {[['🎓','Expert Led','5–15 years experienced educators'],['👥','Small Groups','Max 50 for personal attention'],['💬','Live Q&A','Direct interaction during session'],['📝','Resources','Notes & recording after class'],['🆓','Free to Attend','Most sessions are free'],['📱','Join Anywhere','Mobile, tablet or computer']].map(([icon,title,desc])=>(
                  <div key={title} style={{ display:'flex', gap:14, alignItems:'center', background:'rgba(255,255,255,0.04)', borderRadius:12, padding:'14px 16px', border:'1px solid rgba(212,168,83,0.08)' }}>
                    <div style={{ fontSize:'1.3rem', flexShrink:0, width:38, textAlign:'center' }}>{icon}</div>
                    <div><div style={{ fontWeight:700, color:'white', fontSize:'0.875rem' }}>{title}</div><div style={{ color:'var(--slate)', fontSize:'0.78rem', marginTop:1 }}>{desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SESSIONS */}
      <section id="sessions" style={{ background:'var(--navy)', padding:'64px 0', borderTop:'1px solid rgba(212,168,83,0.1)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <Tag text="UPCOMING SESSIONS"/>
            <h2 style={{ color:'white', margin:0 }}>Register for a Workshop</h2>
          </div>
          {loading ? <div className="spinner" style={{ margin:'40px auto', borderTopColor:'var(--gold)' }}/> :
           sessions.length===0 ? (
            <div style={{ textAlign:'center', padding:'48px 20px', background:'var(--navy2)', borderRadius:20, maxWidth:460, margin:'0 auto', border:'1px solid rgba(212,168,83,0.1)' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:14 }}>📅</div>
              <h3 style={{ color:'white', marginBottom:8 }}>Sessions Coming Soon</h3>
              <p style={{ color:'var(--slate2)', marginBottom:24, fontSize:'0.9rem' }}>Follow us on WhatsApp to get notified.</p>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ display:'inline-block', background:'#25D366', color:'white', fontWeight:700, padding:'12px 24px', borderRadius:10, textDecoration:'none' }}>💬 Get Notified</a>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap:20 }}>
              {sessions.map(s=>(
                <div key={s.id} style={{ background:'var(--navy2)', borderRadius:18, padding:'24px 20px', border:'1px solid rgba(212,168,83,0.12)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                    <span style={{ background:'rgba(42,138,94,0.15)', color:'#5BC8A0', padding:'4px 10px', borderRadius:100, fontSize:'0.68rem', fontWeight:700 }}>UPCOMING</span>
                    <span style={{ fontSize:'0.78rem', color:'var(--slate)' }}>⏱ {s.duration} min</span>
                  </div>
                  <h3 style={{ color:'white', fontSize:'1rem', marginBottom:8 }}>{s.title}</h3>
                  <p style={{ color:'var(--slate2)', fontSize:'0.85rem', marginBottom:18, lineHeight:1.65 }}>{s.description}</p>
                  <div style={{ display:'flex', gap:12, marginBottom:18, flexWrap:'wrap' }}>
                    <span style={{ fontSize:'0.78rem', color:'var(--slate)' }}>📅 {new Date(s.session_date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                    <span style={{ fontSize:'0.78rem', color:'var(--slate)' }}>🕐 {new Date(s.session_date).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span>
                  </div>
                  {s.google_form_url
                    ? <a href={s.google_form_url} target="_blank" rel="noopener noreferrer" style={{ display:'block', background:'var(--gold)', color:'var(--navy)', fontWeight:700, textAlign:'center', padding:'11px', borderRadius:10, textDecoration:'none', fontSize:'0.9rem' }}>Register Free →</a>
                    : <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ display:'block', background:'var(--teal)', color:'white', fontWeight:700, textAlign:'center', padding:'11px', borderRadius:10, textDecoration:'none', fontSize:'0.9rem' }}>Register via WhatsApp →</a>
                  }
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background:'var(--white)', padding:'64px 0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <Tag text="REVIEWS"/>
            <h2 style={{ color:'var(--text)', margin:0 }}>What Parents Say</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(260px,100%),1fr))', gap:20 }}>
            {[['Sunita Mehta','Parent, Delhi','The workshop changed how I talk to my daughter about studies. No more stress at home!'],['Rahul Verma','Parent, Mumbai','Incredibly practical. Saw a difference within a week of using the strategies.'],['Kavitha N.','Parent, Bangalore','My son\'s board exam confidence improved a lot after the strategy session.']].map(([name,tag,quote])=>(
              <div key={name} style={{ background:'var(--cream)', borderRadius:18, padding:'24px 20px', border:'1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ color:'var(--gold)', fontSize:'0.9rem', marginBottom:12 }}>★★★★★</div>
                <p style={{ color:'var(--text)', fontSize:'0.9rem', lineHeight:1.7, fontStyle:'italic', marginBottom:18 }}>"{quote}"</p>
                <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                  <div style={{ width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,var(--navy),var(--teal))',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,flexShrink:0 }}>{name[0]}</div>
                  <div><div style={{ fontWeight:700,color:'var(--text)',fontSize:'0.875rem' }}>{name}</div><div style={{ fontSize:'0.74rem',color:'var(--text2)' }}>{tag}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div style={{ background:'var(--navy2)', borderTop:'1px solid rgba(212,168,83,0.1)', padding:'48px 20px', textAlign:'center' }}>
        <h2 style={{ color:'white', marginBottom:12 }}>Ready to Transform Learning?</h2>
        <p style={{ color:'var(--slate2)', marginBottom:28, maxWidth:400, margin:'0 auto 28px' }}>Join thousands of parents who transformed their child's academic journey.</p>
        <a href="#sessions" style={{ display:'inline-block', background:'var(--gold)', color:'var(--navy)', fontWeight:700, padding:'13px 28px', borderRadius:10, textDecoration:'none', fontSize:'0.95rem' }}>Register for Free →</a>
      </div>
    </div>
  );
}
