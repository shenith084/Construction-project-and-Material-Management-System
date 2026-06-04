'use client';
import { useState, useEffect } from 'react';
import { Bell, Search, User } from 'lucide-react';

export default function Header({ title, subtitle }) {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('admin_user');
    if (stored) setAdmin(JSON.parse(stored));
  }, []);

  return (
    <header style={{
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      padding: '16px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: '#f8fafc', border: '1px solid #e2e8f0',
          borderRadius: '8px', padding: '8px 12px',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={16} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{admin?.name || 'Admin'}</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>{admin?.role || 'Administrator'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
