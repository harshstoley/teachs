import React from 'react';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children, title, subtitle }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0C1628' }}>
      <AdminSidebar />
      <main style={{
        flex: 1, overflowY: 'auto', minWidth: 0,
        background: '#0C1628',
        paddingTop: window.innerWidth <= 768 ? 64 : 32,
        padding: window.innerWidth <= 768 ? '64px 14px 24px' : '32px 28px',
      }}>
        {(title || subtitle) && (
          <div style={{ marginBottom: 24 }}>
            {title && <h2 style={{ color: '#fff', marginBottom: 4, fontSize: 'clamp(1.2rem,2.5vw,1.6rem)' }}>{title}</h2>}
            {subtitle && <p style={{ color: 'rgba(184,197,217,0.7)', fontSize: '0.875rem' }}>{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
