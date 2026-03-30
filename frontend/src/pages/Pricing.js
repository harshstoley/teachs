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
  const disc = (reg, disc) => reg > 0 && disc > 0 ? Math.round(((reg - disc) / reg) * 100) : 0;

  const groupedPlans = {
    individual: plans.filter(p => p.plan_type === 'individual'),
    demo: plans.filter(p => p.plan_type === 'demo'),
    group: plans.filter(p => p.plan_type === 'group'),
    music: plans.filter(p => p.plan_type === 'music'),
    board: plans.filter(p => p.plan_type === 'board'),
  };

  return (
    <div>
      {/* Header */}
      <section style={{ background: 'var(--navy)', padding: '100px 0 72px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="badge badge-teal" style={{ marginBottom: 16 }}>Transparent Pricing</span>
          <h1 style={{ color: 'white', marginBottom: 20 }}>Plans for Every Student</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 540, margin: '0 auto', fontSize: '1.1rem' }}>
            No hidden fees. No registration charges. Start with a completely free demo class.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 40, flexWrap: 'wrap' }}>
            {[['✅', 'Free Demo'], ['✅', 'No Registration Fee'], ['✅', '7-Day Refund'], ['✅', 'Cancel Anytime']].map(([icon, label]) => (
              <div key={label} style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', fontWeight: 600 }}>{icon} {label}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Demo Banner */}
      <section style={{ background: 'var(--teal)', padding: '20px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>🎯 Start with a FREE Demo Class — No Fees, No Commitment →</span>
          <button onClick={() => { setShowForm(true); document.getElementById('demo-section').scrollIntoView({ behavior: 'smooth' }); }} style={{ marginLeft: 20, background: 'white', color: 'var(--teal)', border: 'none', borderRadius: 24, padding: '6px 18px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>Book Now</button>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
          ) : (
            <>
              {/* Individual Plans */}
              {groupedPlans.individual.length > 0 && (
                <div style={{ marginBottom: 64 }}>
                  <div className="section-header" style={{ margin: '0 auto 40px' }}>
                    <span className="overline">Individual Tutoring</span>
                    <h2>Dual-Teacher Plans by Class</h2>
                    <p>Each plan includes two specialized teachers, lesson plans, weekly tests, and progress reports.</p>
                  </div>
                  <div className="grid-3">
                    {groupedPlans.individual.map(plan => {
                      const features = typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features || [];
                      const savings = disc(plan.regular_price, plan.discounted_price);
                      return (
                        <div key={plan.id} className="card" style={{
                          padding: 32, position: 'relative', border: plan.is_recommended ? '2px solid var(--teal)' : '1px solid var(--border)',
                          transform: plan.is_recommended ? 'scale(1.03)' : 'none',
                        }}>
                          {plan.is_recommended && (
                            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--teal)', color: 'white', padding: '4px 16px', borderRadius: 24, fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                              ⭐ Most Popular
                            </div>
                          )}
                          {plan.label && <div className="badge badge-navy" style={{ marginBottom: 12 }}>{plan.label}</div>}
                          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 4 }}>{plan.title}</h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--teal)', fontWeight: 600, marginBottom: 20 }}>{plan.class_range}</p>

                          <div style={{ marginBottom: 24 }}>
                            {plan.regular_price > 0 && plan.discounted_price > 0 ? (
                              <>
                                <span style={{ textDecoration: 'line-through', color: 'var(--ink-lighter)', fontSize: '1rem' }}>{fmt(plan.regular_price)}</span>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                                  <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy)', fontFamily: 'var(--font-body)', lineHeight: 1 }}>{fmt(plan.discounted_price)}</span>
                                  <span style={{ color: 'var(--ink-lighter)', fontSize: '0.85rem' }}>/month</span>
                                </div>
                                {savings > 0 && <span className="badge badge-amber" style={{ marginTop: 6 }}>Save {savings}%</span>}
                              </>
                            ) : (
                              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>FREE</div>
                            )}
                          </div>

                          <ul style={{ listStyle: 'none', marginBottom: 28 }}>
                            {features.map((f, i) => (
                              <li key={i} style={{ display: 'flex', gap: 10, marginBottom: 9, fontSize: '0.875rem', color: 'var(--ink-light)', alignItems: 'flex-start' }}>
                                <span style={{ color: 'var(--teal)', flexShrink: 0 }}>✓</span> {f}
                              </li>
                            ))}
                          </ul>

                          <button onClick={() => { setShowForm(true); document.getElementById('demo-section').scrollIntoView({ behavior: 'smooth' }); }}
                            className={`btn ${plan.is_recommended ? 'btn-secondary' : 'btn-outline'}`} style={{ width: '100%' }}>
                            Book Free Demo
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Other Plans Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, marginBottom: 48 }}>
                {[...groupedPlans.demo, ...groupedPlans.group, ...groupedPlans.music].map(plan => {
                  const features = typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features || [];
                  return (
                    <div key={plan.id} className="card-flat" style={{ padding: 28 }}>
                      <span className="badge badge-teal" style={{ marginBottom: 12 }}>{plan.plan_type === 'demo' ? 'Free' : plan.plan_type === 'group' ? 'Group' : 'Music'}</span>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 4 }}>{plan.title}</h3>
                      <p style={{ color: 'var(--teal)', fontWeight: 600, fontSize: '0.85rem', marginBottom: 16 }}>{plan.class_range}</p>
                      {plan.discounted_price > 0 ? (
                        <div style={{ marginBottom: 16 }}>
                          {plan.regular_price > 0 && <div style={{ textDecoration: 'line-through', color: 'var(--ink-lighter)', fontSize: '0.9rem' }}>{fmt(plan.regular_price)}/mo</div>}
                          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', fontFamily: 'var(--font-body)' }}>{fmt(plan.discounted_price)}<span style={{ fontSize: '0.85rem', color: 'var(--ink-lighter)', fontWeight: 400 }}>/mo</span></div>
                        </div>
                      ) : <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)', marginBottom: 16 }}>FREE</div>}
                      <ul style={{ listStyle: 'none', marginBottom: 20 }}>
                        {features.slice(0, 4).map((f, i) => <li key={i} style={{ fontSize: '0.85rem', color: 'var(--ink-light)', marginBottom: 7 }}><span style={{ color: 'var(--teal)' }}>✓</span> {f}</li>)}
                      </ul>
                      <button onClick={() => { setShowForm(true); document.getElementById('demo-section').scrollIntoView({ behavior: 'smooth' }); }} className="btn btn-outline" style={{ width: '100%' }}>Get Started</button>
                    </div>
                  );
                })}
              </div>

              {/* Board Plans */}
              {groupedPlans.board.length > 0 && (
                <div style={{ background: 'var(--ice)', borderRadius: 20, padding: 40, marginBottom: 48 }}>
                  <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h2>Class 11–12 Arts & Commerce</h2>
                    <p>Custom pricing based on subjects and batch type. Contact us for a personalized quote.</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    {groupedPlans.board.map(plan => {
                      const features = typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features || [];
                      return (
                        <div key={plan.id} className="card-flat" style={{ padding: 28 }}>
                          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 4 }}>{plan.title}</h3>
                          <p style={{ color: 'var(--ink-lighter)', fontWeight: 600, fontSize: '0.85rem', marginBottom: 16 }}>{plan.class_range}</p>
                          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 16 }}>Custom Pricing</div>
                          <ul style={{ listStyle: 'none', marginBottom: 20 }}>
                            {features.map((f, i) => <li key={i} style={{ fontSize: '0.875rem', color: 'var(--ink-light)', marginBottom: 7 }}><span style={{ color: 'var(--teal)' }}>✓</span> {f}</li>)}
                          </ul>
                          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>💬 Get Quote on WhatsApp</a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Demo Form Section */}
      <section id="demo-section" className="section section-ice">
        <div className="container">
          <div style={{ maxWidth: 580, margin: '0 auto', background: 'white', borderRadius: 24, padding: 48, boxShadow: 'var(--shadow-lg)' }}>
            <LeadForm title="Book Your Free Demo Class" />
          </div>
        </div>
      </section>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <LeadForm />
          </div>
        </div>
      )}
    </div>
  );
}
