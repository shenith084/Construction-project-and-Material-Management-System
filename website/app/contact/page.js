'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

const contactInfo = [
  { icon: MapPin, title: 'Our Office', detail: '123 Construction Avenue, Business District, City, Country' },
  { icon: Phone, title: 'Phone', detail: '+1 (555) 000-0000' },
  { icon: Mail, title: 'Email', detail: 'info@constructpro.com' },
];

/**
 * ContactPage Component
 * Displays contact information and a contact form.
 * Handles form state, submission to the backend API, and displays success/error states.
 */
export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '60px', background: 'linear-gradient(135deg, #0f172a, #1e293b)', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label"><MessageSquare size={12} /> Get In Touch</div>
          <h1 className="section-title" style={{ margin: '8px auto 16px' }}>Contact Us</h1>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            Have a project in mind? Get in touch with our team and we'll get back to you shortly.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: '#0f172a' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '48px', alignItems: 'flex-start' }}>
            {/* Contact Info */}
            <div>
              <h2 style={{ color: 'white', fontWeight: '700', fontSize: '22px', marginBottom: '8px' }}>Let's Start a Conversation</h2>
              <div className="divider" />
              <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.7', marginBottom: '32px' }}>
                Whether you have a question about our platform, need a demo, or want to discuss your construction project — our team is ready to help.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {contactInfo.map(({ icon: Icon, title, detail }) => (
                  <div key={title} className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
                      background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={18} color="#f97316" />
                    </div>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{title}</div>
                      <div style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="glass-card" style={{ padding: '32px' }}>
              {status === 'success' ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <CheckCircle size={56} color="#22c55e" style={{ marginBottom: '16px' }} />
                  <h3 style={{ color: 'white', fontWeight: '700', fontSize: '20px', marginBottom: '10px' }}>Message Sent!</h3>
                  <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '24px' }}>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button onClick={() => setStatus(null)} className="btn-orange">Send Another</button>
                </div>
              ) : (
                <>
                  <h3 style={{ color: 'white', fontWeight: '700', fontSize: '18px', marginBottom: '24px' }}>Send a Message</h3>
                  {status === 'error' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '18px', color: '#fca5a5', fontSize: '14px' }}>
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="grid-2" style={{ gap: '14px' }}>
                      <div>
                        <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Name *</label>
                        <input className="web-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="John Smith" />
                      </div>
                      <div>
                        <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email *</label>
                        <input className="web-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="john@example.com" />
                      </div>
                    </div>
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</label>
                      <input className="web-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
                    </div>
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subject *</label>
                      <input className="web-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required placeholder="Project inquiry, Demo request, etc." />
                    </div>
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Message *</label>
                      <textarea className="web-textarea" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required placeholder="Tell us about your project or question..." />
                    </div>
                    <button type="submit" disabled={status === 'loading'} className="btn-orange" style={{ justifyContent: 'center' }}>
                      {status === 'loading' ? 'Sending...' : <><Send size={16} /> Send Message</>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
