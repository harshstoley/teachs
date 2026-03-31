import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LeadForm from '../components/LeadForm';
import api from '../utils/api';

const CATEGORIES = [
  { key: 'class-1-3',  label: 'Class 1–3' },
  { key: 'class-4-5',  label: 'Class 4–5' },
  { key: 'class-6-8',  label: 'Class 6–8' },
  { key: 'class-9-10', label: 'Class 9–10' },
  { key: 'spoken',     label: 'Spoken English' },
  { key: 'music',      label: 'Guitar / Piano' },
];

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('class-1-3');

  useEffect(() => {
    document.title = 'Affordable Tutoring Plans | Teachs';
    api.get('/pricing').then(r => setPlans(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const fmt = n => n > 0 ? `₹${Number(n).toLocaleString('en-IN')}` : 'Free';
  const save = (r, d) => r > 0 && d > 0 ? Math.round(((r - d) / r) * 100) : 0;

  const allPlans = plans.filter(p => p.plan_type === 'individual');
  const demoPlan = plans.find(p => p.plan_type === 'demo');
  const board = plans.filter(p => p.plan_type === 'board');

  const PlanCard = ({ plan, highlight }) => {
    const features = typeof plan.features === 'string' ? JSON.parse(plan.features || '[]') : plan.features || [];
    const pct = save(plan.regular_price, plan.discounted_price);
    return (
      <div style={{
        background: highlight ? 'var(--navy)' : 'var(--navy2)',
        border: `1px solid ${highlight ? 'var(--gold)' : 'rgba(212,168,83,0.12)'}`,
        borderRadius: 20, padding: '28px 22px', position: 'relative',
        boxShadow: highlight ? '0 20px 60px rgba(212,168,83,0.15)' : 'none',
      }}>
        {plan.is_recommended && (
          <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'var(--gold)', color: 'var(--navy)', padding: '4px 16px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' }}>Most Popular</div>
        )}
        {plan.label && <div style={{ display: 'inline-block', background: 'rgba(212,168,83,0.12)', color: 'var(--gold)', padding: '3px 12px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{plan.label}</div>}
        <h3 style={{ color: 'white', fontSize: '1.05rem', marginBottom: 4 }}>{plan.title}</h3>
        <p style={{ color: 'var(--teal)', fontWeight: 600, fontSize: '0.78rem', marginBottom: 18 }}>{plan.class_range}</p>

        <div style={{ marginBottom: 20 }}>
          {plan.regular_price > 0 && plan.discounted_price > 0 ? (
            <>
              <div style={{ textDecoration: 'line-through', color: 'var(--slate)', fontSize: '0.85rem' }}>{fmt(plan.regular_price)}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'white', lineHeight: 1, fontFamily: 'var(--font-body)' }}>{fmt(plan.discounted_price)}</span>
                <span style={{ color: 'var(--slate)', fontSize: '0.8rem' }}>/month</span>
              </div>
              {pct > 0 && <span style={{ display: 'inline-block', background: 'rgba(42,138,94,0.15)', color: '#5BC8A0', padding: '2px 8px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 700, marginTop: 6 }}>Save {pct}%</span>}
            </>
          ) : plan.regular_price === 0 ? (
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#5BC8A0' }}>FREE</div>
          ) : (
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold)' }}>Custom</div>
          )}
        </div>

        <ul style={{ listStyle: 'none', marginBottom: 22 }}>
          {features.map((f, i) => (
            <li key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: '0.84rem', color: 'var(--slate2)', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 1 }}>✓</span>{f}
            </li>
          ))}
        </ul>

        <button onClick={() => setShowForm(true)} style={{
          width: '100%', padding: '12px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: highlight ? 'var(--gold)' : 'rgba(212,168,83,0.12)',
          color: highlight ? 'var(--navy)' : 'var(--gold)',
          fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-body)',
        }}>Book Free Demo</button>
      </div>
    );
  };

  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: 'var(--navy)', paddingTop: 'calc(var(--nav-height) + 48px)', paddingBottom: 48, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(212,168,83,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,83,0.03) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', position: 'relative', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.25)', color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 700, padding: '5px 14px', borderRadius: 100, marginBottom: 20, letterSpacing: '0.5px' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
            SIMPLE, HONEST PRICING
          </div>
          <h1 style={{ color: 'white', marginBottom: 14 }}>Transparent <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Pricing</em><br/>for Every Child</h1>
          <p style={{ color: 'var(--slate2)', maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.75 }}>No hidden fees. No registration charges. Just great tutoring with a clear monthly plan that actually works.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
            {[['🎓','Free Demo Class'],['✅','No Registration Fees'],['🛡️','7-Day Refund']].map(([icon,label]) => (
              <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(212,168,83,0.08)', border: '1px solid rgba(212,168,83,0.2)', color: 'var(--slate2)', padding: '6px 14px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 500 }}>{icon} {label}</span>
            ))}
          </div>
          <div style={{ background: 'rgba(212,168,83,0.08)', border: '1px solid rgba(212,168,83,0.15)', borderRadius: 12, padding: '14px 20px', maxWidth: 440, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ color: 'var(--slate2)', fontSize: '0.85rem' }}>🎓 Not sure yet? Start with a free demo class — no payment needed.</span>
            <button onClick={() => setShowForm(true)} style={{ background: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Book Free Demo Now</button>
          </div>
        </div>
      </section>



      {/* PLANS */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 20px' }}>
        {loading ? <div className="spinner" style={{ margin: '60px auto', borderTopColor: 'var(--gold)' }}/> : (
          <>
            {/* Main plans grid */}
            {allPlans.length > 0 && (
              <div style={{ marginBottom: 64 }}>
                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                  <h2 style={{ color: 'white', marginBottom: 8 }}>Dual-Teacher Plans</h2>
                  <p style={{ color: 'var(--slate2)', fontSize: '0.9rem' }}>Two specialized teachers per student. Structured lessons, weekly tests & progress reports.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))', gap: 20 }}>
                  {allPlans.map(p => <PlanCard key={p.id} plan={p} highlight={!!p.is_recommended}/>)}
                </div>
              </div>
            )}

            {/* Demo plan highlight */}
            {demoPlan && (
              <div style={{ background: 'linear-gradient(135deg,rgba(212,168,83,0.1),rgba(0,153,178,0.08))', border: '1px solid rgba(212,168,83,0.2)', borderRadius: 20, padding: '32px 28px', marginBottom: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                <div>
                  <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Free to Start</div>
                  <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: 6 }}>Demo Class — Completely Free</h3>
                  <p style={{ color: 'var(--slate2)', fontSize: '0.875rem' }}>No registration fee. No commitment. Just a free class with one of our expert teachers.</p>
                </div>
                <button onClick={() => setShowForm(true)} style={{ background: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, padding: '13px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>Get Free Demo →</button>
              </div>
            )}

            {/* Board Plans */}
            {board.length > 0 && (
              <div style={{ marginBottom: 64 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <h2 style={{ color: 'white', marginBottom: 8 }}>Class 11–12 Arts & Commerce</h2>
                  <p style={{ color: 'var(--slate2)', fontSize: '0.9rem' }}>Custom pricing. Contact us for a personalized quote.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: 16 }}>
                  {board.map(p => {
                    const features = typeof p.features === 'string' ? JSON.parse(p.features || '[]') : p.features || [];
                    return (
                      <div key={p.id} style={{ background: 'var(--navy2)', border: '1px solid rgba(212,168,83,0.12)', borderRadius: 16, padding: '22px 18px' }}>
                        <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: 4 }}>{p.title}</h3>
                        <p style={{ color: 'var(--teal)', fontWeight: 600, fontSize: '0.76rem', marginBottom: 14 }}>{p.class_range}</p>
                        <ul style={{ listStyle: 'none', marginBottom: 16 }}>
                          {features.map((f, i) => <li key={i} style={{ fontSize: '0.82rem', color: 'var(--slate2)', marginBottom: 7, display: 'flex', gap: 7 }}><span style={{ color: 'var(--gold)' }}>✓</span>{f}</li>)}
                        </ul>
                        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '10px', background: '#25D366', color: 'white', fontWeight: 700, textAlign: 'center', borderRadius: 8, fontSize: '0.85rem' }}>💬 Get Quote</a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FAQ */}
            <div style={{ background: 'var(--navy2)', borderRadius: 20, padding: '40px 28px', marginBottom: 48, border: '1px solid rgba(212,168,83,0.1)' }}>
              <h2 style={{ color: 'white', textAlign: 'center', marginBottom: 32 }}>Common Questions</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap: 20 }}>
                {[
                  ['What is the Dual-Teacher Model?','Each student gets 2 teachers — one for science/math, one for languages — for deeper expertise.'],
                  ['Can I try before paying?','Yes! 100% free demo class. No registration fee. No credit card needed.'],
                  ['What if I am not satisfied?','7-day no-questions-asked refund on all paid plans.'],
                  ['Are classes online?','All classes are online via video call — anywhere in India.'],
                  ['How are teachers selected?','All teachers are verified by Teachs. Only top 5% of applicants are hired.'],
                  ['Can I change my teacher?','Yes, request a teacher change any time — no extra charge.'],
                ].map(([q, a]) => (
                  <div key={q} style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ color: 'var(--gold)', fontSize: '0.88rem', marginBottom: 6, fontFamily: 'var(--font-body)', fontWeight: 700 }}>{q}</h4>
                    <p style={{ color: 'var(--slate2)', fontSize: '0.82rem', lineHeight: 1.65, margin: 0 }}>{a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(212,168,83,0.06)', borderRadius: 20, border: '1px solid rgba(212,168,83,0.12)' }}>
              <h2 style={{ color: 'white', marginBottom: 10 }}>Still have questions?</h2>
              <p style={{ color: 'var(--slate2)', marginBottom: 24, fontSize: '0.9rem' }}>Talk to our academic counsellor. We will find the right plan for your child.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => setShowForm(true)} style={{ background: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, padding: '13px 26px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>Book Free Demo</button>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#25D366', color: 'white', fontWeight: 700, padding: '13px 26px', borderRadius: 10, fontSize: '0.95rem' }}>💬 WhatsApp</a>
              </div>
            </div>
          </>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ position: 'relative', background: 'var(--navy2)', border: '1px solid rgba(212,168,83,0.2)' }}>
            <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: 'var(--slate)' }}>✕</button>
            <LeadForm />
          </div>
        </div>
      )}
    </div>
  );
}
