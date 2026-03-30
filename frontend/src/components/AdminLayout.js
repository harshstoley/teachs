import React from 'react';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children, title, subtitle }) {
  const isMobile = window.innerWidth <= 768;
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ink)' }}>
      <AdminSidebar />
      <main style={{
        flex: 1, overflowY: 'auto', minWidth: 0,
        background: 'linear-gradient(160deg, #0d1a36 0%, #0B1120 100%)',
        paddingTop: isMobile ? 72 : 32,
        padding: isMobile ? '72px 16px 32px' : '36px 32px',
      }}>
        {(title || subtitle) && (
          <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid rgba(59,114,245,0.12)' }}>
            {title && <h2 style={{ color: 'white', marginBottom: 5, fontSize: 'clamp(1.3rem,2.5vw,1.7rem)' }}>{title}</h2>}
            {subtitle && <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem' }}>{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
