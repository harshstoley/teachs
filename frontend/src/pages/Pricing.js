import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import LeadForm from '../components/LeadForm';

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    document.title = 'Affordable Tutoring Plans | Teachs – Dual-Teacher Model';
    api.get('/pricing').then(r => setPlans(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const fmt = n => n > 0 ? `₹${Number(n).toLocaleString('en-IN')}` : 'Free';
  const save = (r, d) => r > 0 && d > 0 ? Math.round(((r-d)/r)*100) : 0;
  const individual = plans.filter(p => p.plan_type === 'individual');
  const demo = plans.filter(p => p.plan_type === 'demo');
  const group = plans.filter(p => p.plan_type === 'group');
  const board = plans.filter(p => p.plan_type === 'board');

  const PlanCard = ({ plan, highlight }) => {
    const features = typeof plan.features === 'string' ? JSON.parse(plan.features || '[]') : plan.features || [];
    const pct = save(plan.regular_price, plan.discounted_price);
    return (
      <div style={{
        background: highlight ? 'var(--navy)' : 'white',
        border: highlight ? '2px solid var(--gold)' : '1px solid rgba(0,0,0,0.08)',
        borderRadius: 20, padding: '28px 24px', position: 'relative',
        boxShadow: highlight ? '0 20px 60px rgba(12,22,40,0.2)' : '0 4px 20px rgba(0,0,0,0.06)',
        transition: 'transform 0.2s, box-shadow 0.2s', display: 'flex', flexDirection: 'column',
      }}>
        {plan.is_recommended && (
          <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'var(--gold)', color: 'var(--navy)', padding: '4px 18px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>⭐ Most Popular</div>
        )}
        {plan.label && <span className="badge badge-teal" style={{ marginBottom: 14, alignSelf: 'flex-start' }}>{plan.label}</span>}
        <h3 style={{ color: highlight ? 'white' : 'var(--text)', fontSize: '1.15rem', marginBottom: 4 }}>{plan.title}</h3>
        <p style={{ color: highlight ? 'var(--gold)' : 'var(--teal)', fontWeight: 600, fontSize: '0.82rem', marginBottom: 20 }}>{plan.class_range}</p>
        <div style={{ marginBottom: 22 }}>
          {plan.regular_price > 0 && plan.discounted_price > 0 ? (
            <>
              <div style={{ textDecoration: 'line-through', color: highlight ? 'var(--slate)' : 'var(--slate)', fontSize: '0.9rem' }}>{fmt(plan.regular_price)}/mo</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: highlight ? 'white' : 'var(--text)', lineHeight: 1 }}>{fmt(plan.discounted_price)}</span>
                <span style={{ color: highlight ? 'var(--slate2)' : 'var(--text2)', fontSize: '0.85rem' }}>/month</span>
              </div>
              {pct > 0 && <span style={{ display: 'inline-block', background: 'rgba(42,138,94,0.1)', color: '#2A8A5E', padding: '3px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, marginTop: 6 }}>Save {pct}%</span>}
            </>
          ) : plan.regular_price === 0 ? (
            <div style={{ fontSize: '2rem', fontWeight: 800, color: highlight ? '#5BC8A0' : '#2A8A5E' }}>FREE</div>
          ) : (
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: highlight ? 'var(--gold)' : 'var(--navy)' }}>Custom Pricing</div>
          )}
        </div>
        <ul style={{ listStyle: 'none', marginBottom: 24, flex: 1 }}>
          {features.map((f, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: '0.875rem', color: highlight ? 'var(--slate2)' : 'var(--text2)', alignItems: 'flex-start' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="12" cy="12" r="10" fill={highlight ? 'rgba(212,168,83,0.2)' : 'rgba(0,153,178,0.1)'}/><path d="M8 12l3 3 5-5" stroke={highlight ? 'var(--gold)' : 'var(--teal)'} strokeWidth="2" strokeLinecap="round"/></svg>
              {f}
            </li>
          ))}
        </ul>
        <button onClick={() => setShowForm(true)} style={{
          width: '100%', padding: '13px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-body)', transition: 'all 0.2s',
          background: highlight ? 'var(--gold)' : 'var(--navy)', color: highlight ? 'var(--navy)' : 'white',
        }}>Book Free Demo</button>
      </div>
    );
  };

  return (
    <div style={{ background: 'var(--cream)' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #1a3a6e 100%)', padding: '100px 0 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(212,168,83,0.06)' }}/>
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(0,153,178,0.06)' }}/>
        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <span className="section-tag">Transparent Pricing</span>
          <h1 className="section-title light" style={{ marginBottom: 18 }}>Plans for Every Student</h1>
          <p style={{ color: 'var(--slate2)', maxWidth: 500, margin: '0 auto 36px', fontSize: '1.05rem', lineHeight: 1.75 }}>No hidden fees. No registration charges. Start with a completely free demo class and see the Teachs difference.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 36 }}>
            {['✅ Free Demo Class','✅ No Registration Fee','✅ 7-Day Refund','✅ Cancel Anytime'].map(t => (
              <span key={t} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem' }}>{t}</span>
            ))}
          </div>
          <button onClick={() => setShowForm(true)} className="btn btn-gold btn-lg">Book Free Demo Now →</button>
        </div>
      </section>

      {/* Trust bar */}
      <div style={{ background: 'white', borderBottom: '1px solid rgba(0,0,0,0.07)', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {[['500+','Students Taught'],['4.9★','Average Rating'],['95%','Score Improvement'],['2','Teachers Per Student']].map(([n,l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--navy)', fontFamily: 'var(--font-body)' }}>{n}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text2)', fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '80px 0' }}>
        <div className="container">
          {loading ? <div className="spinner" style={{ margin: '60px auto', borderTopColor: 'var(--gold)' }}/> : (
            <>
              {/* Individual Plans */}
              {individual.length > 0 && (
                <div style={{ marginBottom: 80 }}>
                  <div className="section-header center" style={{ marginBottom: 48 }}>
                    <span className="section-tag">Dual-Teacher Model</span>
                    <h2 className="section-title">Individual Tutoring Plans</h2>
                    <p className="section-sub" style={{ margin: '0 auto' }}>Two specialized teachers per student — one for each subject group. Lesson plans, weekly tests, and progress reports included.</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
                    {individual.map(p => <PlanCard key={p.id} plan={p} highlight={!!p.is_recommended}/>)}
                  </div>
                </div>
              )}

              {/* Demo + Group */}
              {(demo.length > 0 || group.length > 0) && (
                <div style={{ marginBottom: 80 }}>
                  <div className="section-header center" style={{ marginBottom: 40 }}>
                    <h2 className="section-title">More Options</h2>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                    {[...demo, ...group].map(p => <PlanCard key={p.id} plan={p} highlight={false}/>)}
                  </div>
                </div>
              )}

              {/* Board */}
              {board.length > 0 && (
                <div style={{ background: 'white', borderRadius: 24, padding: '48px 40px', border: '1px solid rgba(0,0,0,0.08)', marginBottom: 60, boxShadow: '0 4px 30px rgba(0,0,0,0.06)' }}>
                  <div style={{ textAlign: 'center', marginBottom: 36 }}>
                    <span className="section-tag">Class 11-12</span>
                    <h2 className="section-title">Arts & Commerce Plans</h2>
                    <p style={{ color: 'var(--text2)' }}>Custom pricing based on subjects and batch type. Contact us for a personalized quote.</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                    {board.map(p => {
                      const features = typeof p.features === 'string' ? JSON.parse(p.features || '[]') : p.features || [];
                      return (
                        <div key={p.id} style={{ background: 'var(--cream)', borderRadius: 16, padding: '22px 18px', border: '1px solid rgba(0,0,0,0.07)' }}>
                          <h3 style={{ color: 'var(--text)', fontSize: '1rem', marginBottom: 4 }}>{p.title}</h3>
                          <p style={{ color: 'var(--teal)', fontWeight: 600, fontSize: '0.78rem', marginBottom: 14 }}>{p.class_range}</p>
                          <ul style={{ listStyle: 'none', marginBottom: 18 }}>
                            {features.map((f, i) => <li key={i} style={{ fontSize: '0.83rem', color: 'var(--text2)', marginBottom: 8, display: 'flex', gap: 8 }}><span style={{ color: 'var(--teal)' }}>✓</span>{f}</li>)}
                          </ul>
                          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.88rem' }}>💬 Get Quote</a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* FAQ */}
              <div style={{ background: 'white', borderRadius: 24, padding: '48px 40px', marginBottom: 60, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <h2 style={{ color: 'var(--text)', marginBottom: 32, textAlign: 'center' }}>Frequently Asked Questions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                  {[
                    ['What is the Dual-Teacher Model?','Each student gets 2 specialized teachers — one for science/math and one for languages/social studies — for deeper expertise.'],
                    ['Can I try before paying?','Yes! Book a completely free demo class with no registration fees or commitment required.'],
                    ['What if I am not satisfied?','We offer a 7-day refund guarantee, no questions asked. Your satisfaction is our priority.'],
                    ['Are classes online or offline?','All classes are conducted online via video call, making it convenient for students anywhere in India.'],
                    ['How are teachers selected?','All teachers are verified, qualified, and trained by Teachs. We only hire the top 5% of applicants.'],
                    ['Can I change my teacher?','Yes, you can request a teacher change at any time if you feel it is not the right fit.'],
                  ].map(([q, a]) => (
                    <div key={q} style={{ padding: '18px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <h4 style={{ color: 'var(--navy)', fontSize: '0.95rem', marginBottom: 8, fontFamily: 'var(--font-body)', fontWeight: 700 }}>{q}</h4>
                      <p style={{ color: 'var(--text2)', fontSize: '0.875rem', lineHeight: 1.65 }}>{a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #1a3a6e 100%)', borderRadius: 24, padding: '56px 40px', textAlign: 'center' }}>
                <h2 style={{ color: 'white', marginBottom: 12 }}>Still have questions?</h2>
                <p style={{ color: 'var(--slate2)', marginBottom: 28 }}>Talk to our academic counsellor. We will help you find the right plan.</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => setShowForm(true)} className="btn btn-gold btn-lg">Book Free Demo →</button>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn btn-lg" style={{ background: '#25D366', color: 'white' }}>💬 WhatsApp Us</a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
            <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: 'var(--slate)' }}>✕</button>
            <LeadForm />
          </div>
        </div>
      )}
    </div>
  );
}
