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
  const demo = plans.filter(p => p.plan_type === 'demo');
  const group = plans.filter(p => p.plan_type === 'group');
  const music = plans.filter(p => p.plan_type === 'music');
  const board = plans.filter(p => p.plan_type === 'board');

  const PlanCard = ({ plan, highlight }) => {
    const features = typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features || [];
    const pct = savings(plan.regular_price, plan.discounted_price);
    return (
      <div style={{
        background: highlight ? 'var(--navy2)' : '#0f1e35',
        border: `1px solid ${highlight ? 'var(--gold)' : 'rgba(212,168,83,0.15)'}`,
        borderRadius: 16, padding: '24px 20px', position: 'relative', display: 'flex', flexDirection: 'column',
        transition: 'all 0.3s',
      }}>
        {plan.is_recommended && (
          <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'var(--gold)', color: 'var(--navy)', padding: '4px 16px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
            ⭐ Most Popular
          </div>
        )}
        {plan.label && (
          <div style={{ display: 'inline-block', background: 'rgba(212,168,83,0.12)', color: 'var(--gold)', padding: '3px 12px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700, marginBottom: 12, alignSelf: 'flex-start', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {plan.label}
          </div>
        )}
        <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: 4, fontFamily: 'var(--font-display)' }}>{plan.title}</h3>
        <p style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.8rem', marginBottom: 18 }}>{plan.class_range}</p>

        {/* Price */}
        <div style={{ marginBottom: 20 }}>
          {plan.regular_price > 0 && plan.discounted_price > 0 ? (
            <>
              <div style={{ textDecoration: 'line-through', color: 'var(--slate)', fontSize: '0.9rem' }}>{fmt(plan.regular_price)}/mo</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-body)', lineHeight: 1 }}>{fmt(plan.discounted_price)}</span>
                <span style={{ color: 'var(--slate)', fontSize: '0.82rem' }}>/month</span>
              </div>
              {pct > 0 && (
                <div style={{ display: 'inline-block', background: 'rgba(42,138,94,0.15)', color: '#5BC8A0', padding: '2px 10px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700, marginTop: 6 }}>
                  Save {pct}%
                </div>
              )}
            </>
          ) : plan.regular_price === 0 ? (
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#5BC8A0', fontFamily: 'var(--font-body)' }}>FREE</div>
          ) : (
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold)', fontFamily: 'var(--font-body)' }}>Custom</div>
          )}
        </div>

        {/* Features */}
        <ul style={{ listStyle: 'none', marginBottom: 22, flex: 1 }}>
          {features.map((f, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, marginBottom: 9, fontSize: '0.85rem', color: 'var(--slate2)', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 1 }}>✓</span> {f}
            </li>
          ))}
        </ul>

        <button onClick={() => setShowForm(true)} style={{
          width: '100%', padding: '12px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: highlight ? 'var(--gold)' : 'rgba(212,168,83,0.12)',
          color: highlight ? 'var(--navy)' : 'var(--gold)',
          fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-body)', transition: 'all 0.2s',
        }}>
          Book Free Demo
        </button>
      </div>
    );
  };

  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ background: 'var(--navy)', padding: '100px 0 60px', borderBottom: '1px solid rgba(212,168,83,0.1)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ display: 'inline-block', background: 'rgba(212,168,83,0.1)', color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, padding: '6px 16px', borderRadius: 100, marginBottom: 20, letterSpacing: '0.8px', textTransform: 'uppercase' }}>Transparent Pricing</span>
          <h1 style={{ color: '#fff', marginBottom: 16 }}>Plans for Every Student</h1>
          <p style={{ color: 'var(--slate2)', maxWidth: 500, margin: '0 auto 32px', fontSize: '1rem', lineHeight: 1.7 }}>No hidden fees. No registration charges. Start with a completely free demo class.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
            {['✅ Free Demo', '✅ No Registration Fee', '✅ 7-Day Refund', '✅ Cancel Anytime'].map(t => (
              <span key={t} style={{ color: 'var(--slate2)', fontSize: '0.85rem', fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Free demo banner */}
      <div style={{ background: 'rgba(212,168,83,0.1)', borderBottom: '1px solid rgba(212,168,83,0.15)', padding: '14px 20px', textAlign: 'center' }}>
        <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.9rem' }}>🎯 Start with a FREE Demo Class — No Fees, No Commitment</span>
        <button onClick={() => setShowForm(true)} style={{ marginLeft: 16, background: 'var(--gold)', color: 'var(--navy)', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-body)' }}>Book Now</button>
      </div>

      <div style={{ padding: '60px 0' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: '0 auto', borderTopColor: 'var(--gold)' }} /></div>
          ) : (
            <>
              {/* Individual Plans */}
              {individual.length > 0 && (
                <div style={{ marginBottom: 64 }}>
                  <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <span style={{ display: 'inline-block', background: 'rgba(212,168,83,0.1)', color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, padding: '6px 16px', borderRadius: 100, marginBottom: 14, letterSpacing: '0.8px', textTransform: 'uppercase' }}>Individual Tutoring</span>
                    <h2 style={{ color: '#fff', marginBottom: 12 }}>Dual-Teacher Plans by Class</h2>
                    <p style={{ color: 'var(--slate2)', maxWidth: 480, margin: '0 auto' }}>Two specialized teachers, lesson plans, weekly tests, and progress reports.</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
                    {individual.map(plan => <PlanCard key={plan.id} plan={plan} highlight={!!plan.is_recommended} />)}
                  </div>
                </div>
              )}

              {/* Other Plans */}
              <div style={{ marginBottom: 64 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <h2 style={{ color: '#fff', marginBottom: 8 }}>More Options</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
                  {[...demo, ...group, ...music].map(plan => <PlanCard key={plan.id} plan={plan} highlight={false} />)}
                </div>
              </div>

              {/* Board Plans */}
              {board.length > 0 && (
                <div style={{ background: 'var(--navy2)', borderRadius: 20, padding: '36px 28px', border: '1px solid rgba(212,168,83,0.15)', marginBottom: 48 }}>
                  <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <h2 style={{ color: '#fff', marginBottom: 8 }}>Class 11–12 Arts & Commerce</h2>
                    <p style={{ color: 'var(--slate2)' }}>Custom pricing. Contact us for a personalized quote.</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                    {board.map(plan => {
                      const features = typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features || [];
                      return (
                        <div key={plan.id} style={{ background: '#0C1628', borderRadius: 14, padding: '22px 18px', border: '1px solid rgba(212,168,83,0.15)' }}>
                          <h3 style={{ color: '#fff', marginBottom: 4, fontSize: '1.05rem' }}>{plan.title}</h3>
                          <p style={{ color: 'var(--gold)', fontSize: '0.78rem', fontWeight: 600, marginBottom: 14 }}>{plan.class_range}</p>
                          <ul style={{ listStyle: 'none', marginBottom: 18 }}>
                            {features.map((f, i) => <li key={i} style={{ fontSize: '0.83rem', color: 'var(--slate2)', marginBottom: 7, display: 'flex', gap: 8 }}><span style={{ color: 'var(--gold)' }}>✓</span>{f}</li>)}
                          </ul>
                          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', padding: '11px', borderRadius: 10, background: '#25D366', color: '#fff', fontWeight: 700, textAlign: 'center', fontSize: '0.88rem' }}>💬 Get Quote on WhatsApp</a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bottom CTA */}
              <div style={{ background: 'var(--navy2)', borderRadius: 20, padding: '36px 24px', textAlign: 'center', border: '1px solid rgba(212,168,83,0.15)' }}>
                <h3 style={{ color: '#fff', marginBottom: 10 }}>Still have questions?</h3>
                <p style={{ color: 'var(--slate2)', marginBottom: 24, fontSize: '0.9rem' }}>Talk to us directly. We'll help you find the right plan.</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => setShowForm(true)} style={{ background: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, padding: '13px 26px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'var(--font-body)' }}>Book Free Demo</button>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ background: '#25D366', color: '#fff', fontWeight: 700, padding: '13px 26px', borderRadius: 10, fontSize: '0.95rem', display: 'inline-block' }}>💬 WhatsApp</a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ position: 'relative', background: '#0C1628', border: '1px solid rgba(212,168,83,0.2)' }}>
            <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: 'var(--slate)' }}>✕</button>
            <LeadForm />
          </div>
        </div>
      )}
    </div>
  );
}
