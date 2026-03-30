import React, { useState, useRef, useEffect } from 'react';

const FAQS = [
  { q: 'What is the Flexible Dual-Teacher Model?', a: 'The Flexible Dual-Teacher Model pairs each student with two expert teachers based on subject need — e.g., one for Math+Science and one for English+SST. This ensures deep subject expertise rather than one teacher spreading thin.' },
  { q: 'How much does Teachs cost?', a: 'Plans start from ₹1,499/month. We have options for Class 1–12 across individual, group, and music. Visit our Pricing page for full details. We also offer a FREE demo class!' },
  { q: 'Is there a free trial?', a: 'Yes! We offer a completely free demo class. Book it on our Pricing page — no registration fee, no commitment.' },
  { q: 'How do I book a demo?', a: 'Click "Book Free Demo" on the homepage or Pricing page. Fill the short form and our team will contact you within 24 hours to schedule.' },
  { q: 'What classes do you teach?', a: 'We cover Class 1–12. For Class 1–10, we offer our full Dual-Teacher model. For Class 11–12 Arts and Commerce, we have custom pricing — contact us!' },
  { q: 'How does progress tracking work?', a: 'Every student gets weekly progress reports, chapter-wise test results, attendance tracking, and parent updates. You can view everything in the student dashboard.' },
  { q: 'Do you offer a refund?', a: 'Yes! We have a 7-day no-questions-asked refund policy. If you\'re not satisfied within the first 7 days, contact us for a full refund.' },
  { q: 'How are teachers assigned?', a: 'Our team carefully assigns teachers based on subject strength, teaching style, and student needs. You won\'t need to search — we handle the pairing for you.' },
];

const GREETINGS = ["Hi there! 👋 I'm the Teachs assistant. Ask me anything about our tutoring programs!", "Hello! How can I help you today? 😊"];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: 'bot', text: GREETINGS[0] }]);
  const [input, setInput] = useState('');
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const getAnswer = (q) => {
    const lower = q.toLowerCase();
    for (const faq of FAQS) {
      const keywords = faq.q.toLowerCase().split(' ').filter(w => w.length > 3);
      if (keywords.some(k => lower.includes(k))) return faq.a;
    }
    if (lower.includes('price') || lower.includes('cost') || lower.includes('fee')) return FAQS[1].a;
    if (lower.includes('demo') || lower.includes('trial') || lower.includes('free')) return FAQS[2].a;
    if (lower.includes('class') || lower.includes('grade')) return FAQS[5].a;
    if (lower.includes('refund') || lower.includes('money')) return FAQS[7].a;
    return "Great question! For the most accurate answer, please contact us at hello@teachs.in or WhatsApp us. Our team typically responds within a few hours. 😊";
  };

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(m => [...m, { from: 'user', text: userMsg }]);
    setInput('');
    setTimeout(() => setMessages(m => [...m, { from: 'bot', text: getAnswer(userMsg) }]), 700);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: 96, right: 28, width: 54, height: 54, borderRadius: '50%',
          background: 'var(--navy)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-lg)', zIndex: 998, transition: 'all 0.3s',
          transform: open ? 'scale(0.9)' : 'scale(1)',
        }}
        title="Chat with us"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"/>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 158, right: 28, width: 340, borderRadius: 16,
          background: 'white', boxShadow: 'var(--shadow-xl)', zIndex: 997,
          border: '1px solid var(--border)', overflow: 'hidden',
          animation: 'fadeUp 0.3s ease',
        }}>
          {/* Header */}
          <div style={{ background: 'var(--navy)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🎓</div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>Teachs Assistant</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>Typically replies instantly</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ height: 280, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: m.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: m.from === 'user' ? 'var(--navy)' : 'var(--ice)',
                  color: m.from === 'user' ? 'white' : 'var(--ink)',
                  fontSize: '0.875rem', lineHeight: 1.6,
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick Questions */}
          <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['Pricing?', 'Free demo?', 'Refund policy?'].map(q => (
              <button key={q} onClick={() => { setInput(q); setTimeout(send, 50); }} style={{
                padding: '4px 10px', borderRadius: 20, background: 'rgba(0,153,178,0.1)',
                color: 'var(--teal)', border: '1px solid rgba(0,153,178,0.2)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
              }}>{q}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask me anything..."
              style={{
                flex: 1, padding: '9px 14px', borderRadius: 24, border: '2px solid var(--border)',
                fontSize: '0.875rem', outline: 'none', fontFamily: 'var(--font-body)',
              }}
            />
            <button onClick={send} style={{
              width: 38, height: 38, borderRadius: '50%', background: 'var(--teal)',
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M2 21L23 12 2 3V10L17 12 2 14Z"/></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
