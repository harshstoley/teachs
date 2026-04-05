import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import GuestGate from '../components/GuestGate';

const CATEGORIES = ['All', 'Notes', 'Question Papers', 'Worksheets', 'Syllabus', 'Sample Papers'];
const SUBJECTS = ['All', 'Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'];
const CLASSES = ['All', ...Array.from({ length: 10 }, (_, i) => String(i + 1))];

const fileIcon = (type) => {
  if (!type) return '📄';
  const t = type.toUpperCase();
  if (t === 'PDF') return '📕';
  if (['DOC', 'DOCX'].includes(t)) return '📘';
  if (['PPT', 'PPTX'].includes(t)) return '📊';
  if (['JPG', 'PNG', 'JPEG'].includes(t)) return '🖼️';
  return '📄';
};

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('All');
  const [subject, setSubject] = useState('All');
  const [cls, setCls] = useState('All');
  const { user } = useAuth();

  useEffect(() => { document.title = 'Study Materials | Teachs – Free Notes & Papers'; }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (cat !== 'All') params.category = cat;
    if (subject !== 'All') params.subject = subject;
    if (cls !== 'All') params.class_no = cls;
    api.get('/materials', { params }).then(r => setMaterials(r.data)).catch(() => setMaterials([])).finally(() => setLoading(false));
  }, [cat, subject, cls]);

  const handleDownload = async (material) => {
    await api.patch(`/materials/${material.id}/download`).catch(() => {});
    window.open(material.file_url, '_blank');
  };

  const Tag = ({ text }) => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.25)', color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 700, padding: '5px 14px', borderRadius: 100, marginBottom: 16, letterSpacing: '0.5px' }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />{text}
    </div>
  );

  return (
    <GuestGate pageLabel="Study Materials">
      <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
        {/* HERO */}
        <section style={{ paddingTop: 'calc(var(--nav-height) + 60px)', paddingBottom: 52, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(212,168,83,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,83,0.03) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', position: 'relative', textAlign: 'center' }}>
            <Tag text="FREE STUDY MATERIALS" />
            <h1 style={{ color: 'white', marginBottom: 14 }}>Download <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Study</em> Materials</h1>
            <p style={{ color: 'var(--slate2)', maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.75 }}>
              Free notes, question papers, worksheets, and sample papers for Class 1–10. Prepared by our expert educators.
            </p>
          </div>
        </section>

        {/* STATS BAR */}
        <div style={{ background: 'var(--navy2)', borderTop: '1px solid rgba(212,168,83,0.1)', borderBottom: '1px solid rgba(212,168,83,0.1)', padding: '14px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
            {['📕 Notes', '📋 Question Papers', '✏️ Worksheets', '📑 Sample Papers', '📚 Syllabus'].map(t => (
              <span key={t} style={{ color: 'var(--slate2)', fontSize: '0.82rem', fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>

        {/* FILTERS */}
        <div style={{ background: 'var(--navy)', borderBottom: '1px solid rgba(212,168,83,0.08)', padding: '16px 20px', overflowX: 'auto' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--slate)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Category</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCat(c)} style={{ padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: '0.78rem', background: cat === c ? 'var(--gold)' : 'rgba(255,255,255,0.06)', color: cat === c ? 'var(--navy)' : 'var(--slate2)', fontWeight: cat === c ? 700 : 400, fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--slate)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Subject</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {SUBJECTS.map(s => (
                  <button key={s} onClick={() => setSubject(s)} style={{ padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: '0.78rem', background: subject === s ? 'var(--teal)' : 'rgba(255,255,255,0.06)', color: subject === s ? 'white' : 'var(--slate2)', fontWeight: subject === s ? 700 : 400, fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--slate)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Class</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {CLASSES.map(c => (
                  <button key={c} onClick={() => setCls(c)} style={{ padding: '5px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: '0.78rem', background: cls === c ? 'rgba(212,168,83,0.2)' : 'rgba(255,255,255,0.06)', color: cls === c ? 'var(--gold)' : 'var(--slate2)', fontWeight: cls === c ? 700 : 400, fontFamily: 'var(--font-body)' }}>{c === 'All' ? 'All' : `Cl ${c}`}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MATERIALS GRID */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px' }}>
          {loading ? <div className="spinner" style={{ margin: '60px auto', borderTopColor: 'var(--gold)' }} /> :
            materials.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--navy2)', borderRadius: 20, border: '1px solid rgba(212,168,83,0.1)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>📂</div>
                <h3 style={{ color: 'white', marginBottom: 8 }}>No materials found</h3>
                <p style={{ color: 'var(--slate2)' }}>Try different filters or check back soon.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(280px,100%),1fr))', gap: 18 }}>
                {materials.map(m => (
                  <div key={m.id} style={{ background: 'var(--navy2)', borderRadius: 18, border: '1px solid rgba(212,168,83,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {m.thumbnail_url ? (
                      <div style={{ height: 150, overflow: 'hidden' }}>
                        <img src={m.thumbnail_url} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{ height: 100, background: 'linear-gradient(135deg,var(--navy3),rgba(0,153,178,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                        {fileIcon(m.file_type)}
                      </div>
                    )}
                    <div style={{ padding: '18px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                        {m.category && <span style={{ background: 'rgba(212,168,83,0.1)', color: 'var(--gold)', padding: '2px 8px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 700 }}>{m.category}</span>}
                        {m.subject && <span style={{ background: 'rgba(0,153,178,0.1)', color: 'var(--teal)', padding: '2px 8px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 600 }}>{m.subject}</span>}
                        {m.class_no && <span style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--slate2)', padding: '2px 8px', borderRadius: 100, fontSize: '0.65rem' }}>Class {m.class_no}</span>}
                      </div>
                      <h3 style={{ color: 'white', fontSize: '0.92rem', marginBottom: 6, fontFamily: 'var(--font-body)', fontWeight: 700, flex: 1 }}>{m.title}</h3>
                      {m.description && <p style={{ color: 'var(--slate2)', fontSize: '0.8rem', lineHeight: 1.55, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.description}</p>}
                      <div style={{ display: 'flex', gap: 12, marginBottom: 14, fontSize: '0.75rem', color: 'var(--slate)' }}>
                        {m.file_type && <span>📄 {m.file_type}</span>}
                        {m.file_size && <span>💾 {m.file_size}</span>}
                        <span>⬇️ {m.downloads}</span>
                        {m.is_free ? <span style={{ color: '#5BC8A0' }}>✅ Free</span> : <span style={{ color: 'var(--gold)' }}>🔒 Premium</span>}
                      </div>
                      {m.file_url ? (
                        <button onClick={() => handleDownload(m)} style={{ width: '100%', padding: '10px', background: 'var(--gold)', color: 'var(--navy)', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                          ⬇️ Download
                        </button>
                      ) : (
                        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, textAlign: 'center', color: 'var(--slate)', fontSize: '0.82rem' }}>Coming Soon</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* CTA */}
        <div style={{ background: 'var(--navy2)', borderTop: '1px solid rgba(212,168,83,0.1)', padding: '48px 20px', textAlign: 'center' }}>
          <h2 style={{ color: 'white', marginBottom: 10 }}>Want Structured Lessons?</h2>
          <p style={{ color: 'var(--slate2)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>Get personalized lessons with our Dual-Teacher model.</p>
          <Link to="/pricing" style={{ display: 'inline-block', background: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, padding: '13px 28px', borderRadius: 10, textDecoration: 'none' }}>Book Free Demo →</Link>
        </div>
      </div>
    </GuestGate>
  );
}
