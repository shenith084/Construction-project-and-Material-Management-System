'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { suppliersAPI } from '@/lib/api';
import { Plus, Edit2, Trash2, X, Save, Mail, Phone, Globe } from 'lucide-react';

const emptyForm = { companyName: '', contactPerson: '', email: '', phone: '', address: '', materials: '', website: '', notes: '', status: 'Active' };

function SupplierModal({ supplier, onClose, onSave }) {
  const [form, setForm] = useState(supplier ? { ...supplier, materials: Array.isArray(supplier.materials) ? supplier.materials.join(', ') : '' } : emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    const payload = { ...form, materials: form.materials ? form.materials.split(',').map(s => s.trim()).filter(Boolean) : [] };
    try {
      if (supplier) await suppliersAPI.update(supplier._id, payload);
      else await suppliersAPI.create(payload);
      onSave();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '620px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{supplier ? 'Edit Supplier' : 'Add Supplier'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
        </div>
        {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Company Name *</label>
            <input className="form-input" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Person *</label>
            <input className="form-input" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone *</label>
            <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Active</option><option>Inactive</option>
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Address *</label>
            <input className="form-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Materials Supplied (comma separated)</label>
            <input className="form-input" value={form.materials} onChange={(e) => setForm({ ...form, materials: e.target.value })} placeholder="e.g. Cement, Steel, Sand" />
          </div>
          <div className="form-group">
            <label className="form-label">Website</label>
            <input className="form-input" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" />
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <input className="form-input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary"><Save size={16} />{loading ? 'Saving...' : 'Save Supplier'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SuppliersPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    try { const d = await suppliersAPI.getAll(); setSuppliers(d.suppliers); }
    catch { router.push('/login'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) { router.push('/login'); return; }
    load();
  }, []);

  const handleDelete = async (id) => {
    try { await suppliersAPI.delete(id); setDeleteId(null); load(); } catch (err) { alert(err.message); }
  };

  return (
    <div className="page-enter">
      <Header title="Suppliers" subtitle="Manage material suppliers and procurement" />
      <div style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button className="btn-primary" onClick={() => setModal('new')}><Plus size={16} /> Add Supplier</button>
        </div>
        <div className="card">
          {loading ? [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '52px', margin: '8px', borderRadius: '8px' }} />) :
            suppliers.length === 0 ? <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>No suppliers yet.</div> : (
              <table className="data-table">
                <thead><tr><th>Company</th><th>Contact</th><th>Materials</th><th>Status</th><th>History</th><th>Actions</th></tr></thead>
                <tbody>
                  {suppliers.map(s => (
                    <tr key={s._id}>
                      <td>
                        <div style={{ fontWeight: '600' }}>{s.companyName}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{s.address}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>{s.contactPerson}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}><Mail size={11} style={{ verticalAlign: 'middle' }} /> {s.email}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}><Phone size={11} style={{ verticalAlign: 'middle' }} /> {s.phone}</div>
                      </td>
                      <td><div style={{ fontSize: '13px', color: '#64748b' }}>{s.materials?.join(', ') || '—'}</div></td>
                      <td><span className={`badge ${s.status === 'Active' ? 'badge-success' : 'badge-gray'}`}>{s.status}</span></td>
                      <td style={{ color: '#64748b', fontSize: '13px' }}>{s.supplyHistory?.length || 0} records</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => setModal(s)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: '#3b82f6' }}><Edit2 size={15} /></button>
                          <button onClick={() => setDeleteId(s._id)} style={{ background: '#fee2e2', border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={15} /></button>
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
      {modal && <SupplierModal supplier={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '380px', textAlign: 'center' }}>
            <Trash2 size={40} color="#dc2626" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Delete Supplier?</h3>
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
