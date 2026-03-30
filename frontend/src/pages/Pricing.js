import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LeadForm from '../components/LeadForm';
import api from '../utils/api';

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    document.title = 'Pricing | Teachs – Affordable Personalized Tutoring Plans';
    api.get('/pricing').then(r => setPlans(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const fmt = n => n > 0 ? `₹${Number(n).toLocaleString('en-IN')}` : 'Free';
  const savings = (r, d) => r > 0 && d > 0 ? Math.round(((r - d) / r) * 100) : 0;

  const individual = plans.filter(p => p.plan_type === 'individual');
  const demo       = plans.filter(p => p.plan_type === 'demo');
  const group      = plans.filter(p => p.plan_type === 'group');
  const music      = plans.filter(p => p.plan_type === 'music');
  const board      = plans.filter(p => p.plan_type === 'board');

  const PlanCard = ({ plan, highlight }) => {
    const features = typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features || [];
    const pct = savings(plan.regular_price, plan.discounted_price);
    return (
      <div style={{
        background: highlight ? 'linear-gradient(160deg, var(--sapphire) 0%, var(--ink2) 100%)' : 'var(--ink2)',
        border: `1px solid ${highlight ? 'rgba(224,156,26,0.40)' : 'rgba(59,114,245,0.18)'}`,
        borderRadius: 20, padding: '26px 22px', position: 'relative',
        display: 'flex', flexDirection: 'column', transition: 'all 0.3s',
        boxShadow: highlight ? '0 12px 48px rgba(26,58,143,0.25)' : 'none',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = highlight ? '0 20px 60px rgba(26,58,143,0.35)' : '0 8px 32px rgba(11,17,32,0.25)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = highlight ? '0 12px 48px rgba(26,58,143,0.25)' : 'none'; }}>
        {plan.is_recommended && (
          <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, var(--amber) 0%, var(--amber2) 100%)', color: 'var(--ink)', padding: '4px 18px', borderRadius: 100, fontSize: '0.70rem', fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(200,130,10,0.35)' }}>
            ⭐ Most Popular
          </div>
        )}
        {plan.label && (
          <span className="badge badge-amber" style={{ marginBottom: 14, alignSelf: 'flex-start' }}>{plan.label}</span>
        )}
        <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: 4, fontFamily: 'var(--font-display)' }}>{plan.title}</h3>
        <p style={{ color: 'var(--amber2)', fontWeight: 600, fontSize: '0.78rem', marginBottom: 20, letterSpacing: '0.04em' }}>{plan.class_range}</p>

        <div style={{ marginBottom: 22 }}>
          {plan.regular_price > 0 && plan.discounted_price > 0 ? (
            <>
              <div style={{ textDecoration: 'line-through', color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>{fmt(plan.regular_price)}/mo</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 3 }}>
                <span style={{ fontSize: '2.1rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-body)', lineHeight: 1 }}>{fmt(plan.discounted_price)}</span>
                <span style={{ color: 'rgba(255,255,255,0.40)', fontSize: '0.82rem' }}>/month</span>
              </div>
              {pct > 0 && (
                <span className="badge badge-emerald" style={{ marginTop: 8 }}>Save {pct}%</span>
              )}
            </>
          ) : plan.regular_price === 0 ? (
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--emerald2)', fontFamily: 'var(--font-body)' }}>FREE</div>
          ) : (
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--amber2)', fontFamily: 'var(--font-body)' }}>Custom</div>
          )}
        </div>

        <ul style={{ listStyle: 'none', marginBottom: 24, flex: 1 }}>
          {features.map((f, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--emerald2)', flexShrink: 0, marginTop: 1, fontWeight: 700 }}>✓</span> {f}
            </li>
          ))}
        </ul>

        <button onClick={() => setShowForm(true)} style={{
          width: '100%', padding: '13px', borderRadius: 12, border: 'none', cursor: 'pointer',
          background: highlight ? 'linear-gradient(135deg, var(--amber) 0%, var(--amber2) 100%)' : 'rgba(59,114,245,0.15)',
          color: highlight ? 'var(--ink)' : 'rgba(255,255,255,0.80)',
          fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-body)', transition: 'all 0.2s',
          boxShadow: highlight ? '0 6px 24px rgba(200,130,10,0.30)' : 'none',
          border: highlight ? 'none' : '1px solid rgba(59,114,245,0.30)',
        }}>
          Book Free Demo →
        </button>
      </div>
    );
  };

  const SectionTag = ({ label }) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(59,114,245,0.10)', color: 'var(--sky)', fontSize: '0.72rem', fontWeight: 700, padding: '6px 16px', borderRadius: 100, letterSpacing: '0.8px', textTransform: 'uppercase', border: '1px solid rgba(59,114,245,0.20)', marginBottom: 16 }}>{label}</span>
  );

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ background: 'var(--ink)', padding: '110px 0 64px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(59,114,245,0.10) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(59,114,245,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,114,245,0.04) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <SectionTag label="Transparent Pricing" />
          <h1 style={{ color: 'white', marginBottom: 18 }}>Plans for Every Student</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 500, margin: '0 auto 36px', fontSize: '1rem', lineHeight: 1.78 }}>No hidden fees. No registration charges. Start with a completely free demo class.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            {['✅ Free Demo', '✅ No Registration', '✅ 7-Day Refund', '✅ Cancel Anytime'].map(t => (
              <span key={t} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Banner */}
      <div style={{ background: 'rgba(224,156,26,0.08)', borderTop: '1px solid rgba(224,156,26,0.18)', borderBottom: '1px solid rgba(224,156,26,0.18)', padding: '14px 24px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--amber2)', fontWeight: 600, fontSize: '0.92rem' }}>🎯 Start with a FREE Demo Class — No Fees, No Commitment</span>
        <button onClick={() => setShowForm(true)} style={{ background: 'linear-gradient(135deg, var(--amber) 0%, var(--amber2) 100%)', color: 'var(--ink)', border: 'none', borderRadius: 9, padding: '8px 20px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-body)', boxShadow: '0 4px 16px rgba(200,130,10,0.30)' }}>Book Now →</button>
      </div>

      <div style={{ padding: '64px 0 80px' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: 80 }}>
              <div className="spinner" style={{ margin: '0 auto', width: 44, height: 44 }} />
            </div>
          ) : (
            <>
              {/* Individual Plans */}
              {individual.length > 0 && (
                <div style={{ marginBottom: 72 }}>
                  <div style={{ textAlign: 'center', marginBottom: 44 }}>
                    <SectionTag label="Individual Tutoring" />
                    <h2 style={{ color: 'white', marginBottom: 12 }}>Dual-Teacher Plans by Class</h2>
                    <p style={{ color: 'rgba(255,255,255,0.50)', maxWidth: 480, margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.75 }}>Two specialized teachers, lesson plans, weekly tests, and progress reports.</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 22 }}>
                    {individual.map(plan => <PlanCard key={plan.id} plan={plan} highlight={!!plan.is_recommended} />)}
                  </div>
                </div>
              )}

              {/* Other Plans */}
              {[...demo, ...group, ...music].length > 0 && (
                <div style={{ marginBottom: 72 }}>
                  <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <SectionTag label="More Options" />
                    <h2 style={{ color: 'white', marginBottom: 10 }}>Group & Specialty Plans</h2>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
                    {[...demo, ...group, ...music].map(plan => <PlanCard key={plan.id} plan={plan} highlight={false} />)}
                  </div>
                </div>
              )}

              {/* Board Exam Plans */}
              {board.length > 0 && (
                <div style={{ background: 'rgba(59,114,245,0.07)', borderRadius: 24, padding: '40px 32px', border: '1px solid rgba(59,114,245,0.18)', marginBottom: 56 }}>
                  <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <SectionTag label="Board Exam" />
                    <h2 style={{ color: 'white', marginBottom: 10 }}>Class 11–12 Arts & Commerce</h2>
                    <p style={{ color: 'rgba(255,255,255,0.50)', fontSize: '0.92rem' }}>Custom pricing. Contact us for a personalized quote.</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 18 }}>
                    {board.map(plan => {
                      const features = typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features || [];
                      return (
                        <div key={plan.id} style={{ background: 'var(--ink)', borderRadius: 16, padding: '22px 20px', border: '1px solid rgba(59,114,245,0.20)' }}>
                          <h3 style={{ color: 'white', marginBottom: 4, fontSize: '1.05rem' }}>{plan.title}</h3>
                          <p style={{ color: 'var(--amber2)', fontSize: '0.78rem', fontWeight: 600, marginBottom: 16 }}>{plan.class_range}</p>
                          <ul style={{ listStyle: 'none', marginBottom: 20 }}>
                            {features.map((f, i) => <li key={i} style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.55)', marginBottom: 8, display: 'flex', gap: 9 }}><span style={{ color: 'var(--emerald2)', fontWeight: 700 }}>✓</span>{f}</li>)}
                          </ul>
                          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', padding: '12px', borderRadius: 10, background: '#25D366', color: 'white', fontWeight: 700, textAlign: 'center', fontSize: '0.88rem' }}>💬 Get Quote on WhatsApp</a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bottom CTA */}
              <div style={{ background: 'linear-gradient(135deg, var(--sapphire) 0%, var(--ink2) 100%)', borderRadius: 24, padding: '44px 28px', textAlign: 'center', border: '1px solid rgba(59,114,245,0.25)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(59,114,245,0.10)' }} />
                <h3 style={{ color: 'white', marginBottom: 12, fontSize: '1.5rem' }}>Still have questions?</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 28, fontSize: '0.92rem', maxWidth: 380, margin: '0 auto 28px' }}>Talk to us directly. We'll help you find the right plan for your child.</p>
                <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => setShowForm(true)} style={{ background: 'linear-gradient(135deg, var(--amber) 0%, var(--amber2) 100%)', color: 'var(--ink)', fontWeight: 700, padding: '13px 28px', borderRadius: 11, border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'var(--font-body)', boxShadow: '0 6px 24px rgba(200,130,10,0.35)' }}>Book Free Demo</button>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ background: '#25D366', color: 'white', fontWeight: 700, padding: '13px 28px', borderRadius: 11, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 6px 24px rgba(37,211,102,0.30)' }}>💬 WhatsApp Us</a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ position: 'relative', background: 'var(--white)', borderRadius: 24 }}>
            <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: 14, right: 18, background: 'rgba(59,114,245,0.08)', border: '1px solid rgba(59,114,245,0.15)', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', cursor: 'pointer', color: 'var(--text2)' }}>✕</button>
            <LeadForm />
          </div>
        </div>
      )}
    </div>
  );
}
