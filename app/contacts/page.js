'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { contactsAPI } from '@/lib/api';
import { Trash2, Eye, CheckCircle, X, Mail, Phone, MessageSquare } from 'lucide-react';

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    try { const d = await contactsAPI.getAll(); setContacts(d.contacts); }
    catch { router.push('/login'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) { router.push('/login'); return; }
    load();
  }, []);

  const handleMarkRead = async (id) => {
    try { await contactsAPI.update(id, { status: 'Read' }); load(); } catch {}
  };

  const handleDelete = async (id) => {
    try { await contactsAPI.delete(id); setDeleteId(null); setSelected(null); load(); } catch (err) { alert(err.message); }
  };

  const statusClass = { 'New': 'badge-danger', 'Read': 'badge-gray', 'Replied': 'badge-success' };

  return (
    <div className="page-enter">
      <Header title="Contact Messages" subtitle="View and manage contact form submissions" />
      <div style={{ padding: '28px' }}>
        {/* Summary bar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          {[{ label: 'All', count: contacts.length, color: '#64748b' },
            { label: 'New', count: contacts.filter(c => c.status === 'New').length, color: '#ef4444' },
            { label: 'Read', count: contacts.filter(c => c.status === 'Read').length, color: '#94a3b8' }]
            .map(({ label, count, color }) => (
              <div key={label} style={{ padding: '10px 18px', background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '600', color }}>
                {label}: {count}
              </div>
            ))}
        </div>

        <div className="card">
          {loading ? [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '64px', margin: '8px', borderRadius: '8px' }} />) :
            contacts.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                <MessageSquare size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
                <p>No messages yet.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead><tr><th>Sender</th><th>Subject</th><th>Message</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {contacts.map(c => (
                    <tr key={c._id} style={{ cursor: 'pointer' }}>
                      <td>
                        <div style={{ fontWeight: '600' }}>{c.name}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}><Mail size={11} style={{ verticalAlign: 'middle' }} /> {c.email}</div>
                        {c.phone && <div style={{ fontSize: '12px', color: '#94a3b8' }}><Phone size={11} style={{ verticalAlign: 'middle' }} /> {c.phone}</div>}
                      </td>
                      <td style={{ fontWeight: '500', maxWidth: '160px' }}>{c.subject}</td>
                      <td style={{ color: '#64748b', fontSize: '13px', maxWidth: '200px' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                          {c.message}
                        </div>
                      </td>
                      <td style={{ color: '#64748b', fontSize: '12px', whiteSpace: 'nowrap' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td><span className={`badge ${statusClass[c.status] || 'badge-gray'}`}>{c.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button title="View" onClick={() => { setSelected(c); handleMarkRead(c._id); }} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: '#3b82f6' }}><Eye size={15} /></button>
                          <button title="Delete" onClick={() => setDeleteId(c._id)} style={{ background: '#fee2e2', border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      </div>

      {/* View Modal */}
      {selected && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal-box" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>Message Details</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '16px' }}>
                <div style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a', marginBottom: '6px' }}>{selected.name}</div>
                <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <span><Mail size={13} style={{ verticalAlign: 'middle' }} /> {selected.email}</span>
                  {selected.phone && <span><Phone size={13} style={{ verticalAlign: 'middle' }} /> {selected.phone}</span>}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Subject</div>
                <div style={{ fontWeight: '600', color: '#1e293b' }}>{selected.subject}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Message</div>
                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '14px', color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>{selected.message}</div>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Received: {new Date(selected.createdAt).toLocaleString()}</div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px' }}>
                <button className="btn-secondary" onClick={() => setSelected(null)}>Close</button>
                <button className="btn-danger" onClick={() => { setDeleteId(selected._id); setSelected(null); }}><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '360px', textAlign: 'center' }}>
            <Trash2 size={40} color="#dc2626" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Delete Message?</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>This cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
