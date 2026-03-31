import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/api';

const inp = { width:'100%', padding:'11px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(212,168,83,0.2)', borderRadius:10, color:'#fff', fontSize:'0.9rem', fontFamily:'var(--font-body)', outline:'none', boxSizing:'border-box' };

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [msg, setMsg] = useState({ text:'', type:'' });
  const [saving, setSaving] = useState(false);

  const showMsg = (text, type='success') => { setMsg({text,type}); setTimeout(()=>setMsg({text:'',type:''}),4000); };

  useEffect(() => {
    document.title = 'Settings | Admin';
    api.get('/settings/all')
      .then(r => {
        const s = {};
        if (Array.isArray(r.data)) {
          r.data.forEach(row => { s[row.setting_key] = row.setting_value; });
        }
        setSettings(s);
      })
      .catch(() => showMsg('Failed to load settings','error'));
  }, []);

  const save = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings', settings);
      showMsg('✅ Settings saved successfully!');
    } catch(err) {
      showMsg(err.response?.data?.error || 'Failed to save.', 'error');
    } finally { setSaving(false); }
  };

  const fields = [
    ['site_name','Site Name'],
    ['tagline','Tagline'],
    ['phone','Phone Number'],
    ['email','Support Email'],
    ['whatsapp','WhatsApp Number (with country code, no +)'],
    ['address','Address'],
    ['instagram','Instagram URL'],
    ['twitter','Twitter/X URL'],
    ['facebook','Facebook URL'],
    ['youtube','YouTube URL'],
  ];

  return (
    <AdminLayout title="Site Settings">
      {msg.text && <div className={`alert alert-${msg.type}`} style={{marginBottom:16}}>{msg.text}</div>}
      <div style={{background:'#152238',border:'1px solid rgba(212,168,83,0.15)',borderRadius:16,padding:'28px 22px',maxWidth:640}}>
        <form onSubmit={save}>
          {fields.map(([k,l]) => (
            <div key={k} style={{marginBottom:18}}>
              <label style={{display:'block',fontSize:'0.82rem',fontWeight:600,color:'var(--slate2)',marginBottom:6}}>{l}</label>
              <input
                value={settings[k] || ''}
                onChange={e => setSettings({...settings, [k]: e.target.value})}
                style={inp}
              />
            </div>
          ))}
          <button type="submit" disabled={saving} style={{padding:'12px 28px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontSize:'0.95rem',fontFamily:'var(--font-body)'}}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
