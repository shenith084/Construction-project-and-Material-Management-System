'use client';
import Link from 'next/link';
import { HardHat, MapPin, Phone, Mail, Globe, Share2, Rss, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#020617', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '60px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', paddingBottom: '48px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #f97316, #ea580c)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HardHat size={18} color="white" />
              </div>
              <span style={{ color: 'white', fontWeight: '800', fontSize: '17px' }}>Construct<span style={{ color: '#f97316' }}>Pro</span></span>
            </div>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.7', maxWidth: '260px', marginBottom: '20px' }}>
              Professional construction project and material management system for modern construction companies.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[Globe, Share2, Rss, ExternalLink].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b',
                  transition: 'all 0.2s', textDecoration: 'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.color = '#f97316'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#64748b'; }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontWeight: '700', fontSize: '14px', marginBottom: '16px' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[['/', 'Home'], ['/about', 'About'], ['/projects', 'Projects'], ['/materials', 'Materials'], ['/workforce', 'Workforce'], ['/contact', 'Contact']].map(([href, label]) => (
                <Link key={href} href={href} style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f97316'}
                  onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ color: 'white', fontWeight: '700', fontSize: '14px', marginBottom: '16px' }}>Services</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Project Management', 'Material Tracking', 'Workforce Management', 'Supplier Coordination', 'Progress Monitoring', 'Analytics'].map(s => (
                <span key={s} style={{ color: '#64748b', fontSize: '14px' }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'white', fontWeight: '700', fontSize: '14px', marginBottom: '16px' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                [MapPin, '123 Construction Ave, City, Country'],
                [Phone, '+1 (555) 000-0000'],
                [Mail, 'info@constructpro.com'],
              ].map(([Icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#64748b', fontSize: '13px' }}>
                  <Icon size={14} style={{ marginTop: '3px', color: '#f97316', flexShrink: 0 }} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <p style={{ color: '#475569', fontSize: '13px' }}>© 2026 ConstructPro. All rights reserved.</p>
          <p style={{ color: '#334155', fontSize: '13px' }}>Built with Next.js & MongoDB</p>
        </div>
      </div>
    </footer>
  );
}
