'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { suppliersAPI } from '@/lib/api';
import { Plus, Edit2, Trash2, X, Save, Mail, Phone, Globe, History, Package, ChevronDown, ChevronUp } from 'lucide-react';

const emptyForm = { companyName: '', contactPerson: '', email: '', phone: '', address: '', materials: '', website: '', notes: '', status: 'Active' };
const emptyHistory = { material: '', quantity: '', unit: 'kg', cost: '', notes: '' };

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
            <input className="form-input" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required placeholder="e.g. SteelPro Lanka" />
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

function SupplyHistoryModal({ supplier, onClose, onSave }) {
  const [form, setForm] = useState({ ...emptyHistory });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const UNITS = ['kg', 'ton', 'piece', 'm³', 'm²', 'liter', 'bag', 'roll', 'sheet', 'm'];

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const updatedHistory = [...(supplier.supplyHistory || []), {
        material: form.material,
        quantity: Number(form.quantity),
        unit: form.unit,
        cost: Number(form.cost),
        notes: form.notes,
        date: new Date(),
      }];
      await suppliersAPI.update(supplier._id, { supplyHistory: updatedHistory });
      onSave();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '520px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
            <History size={18} style={{ verticalAlign: 'middle', marginRight: '8px', color: '#f97316' }} />
            Add Supply Record
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
        </div>
        <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px', fontSize: '13px', color: '#64748b' }}>
          Supplier: <strong style={{ color: '#0f172a' }}>{supplier.companyName}</strong>
        </div>
        {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Material Name *</label>
            <input className="form-input" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} required placeholder="e.g. Portland Cement, TMT Steel" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Quantity *</label>
              <input className="form-input" type="number" min="0" step="0.01" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Unit</label>
              <select className="form-select" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Total Cost ($) *</label>
              <input className="form-input" type="number" min="0" step="0.01" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <input className="form-input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes about this delivery..." />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary"><Save size={16} />{loading ? 'Saving...' : 'Add Record'}</button>
          </div>
        </form>

        {/* Existing supply history */}
        {supplier.supplyHistory?.length > 0 && (
          <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>Previous Supply Records</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              {[...supplier.supplyHistory].reverse().map((h, i) => (
                <div key={i} style={{ background: '#f8fafc', borderRadius: '8px', padding: '10px 12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: '600', fontSize: '13px', color: '#0f172a' }}>{h.material}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{new Date(h.date).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'flex', gap: '16px' }}>
                    <span>Qty: <strong>{h.quantity} {h.unit}</strong></span>
                    <span>Cost: <strong style={{ color: '#f97316' }}>${Number(h.cost).toLocaleString()}</strong></span>
                  </div>
                  {h.notes && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>{h.notes}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SuppliersPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [historyModal, setHistoryModal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

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

  const activeSups = suppliers.filter(s => s.status === 'Active');
  const totalSupplyRecords = suppliers.reduce((sum, s) => sum + (s.supplyHistory?.length || 0), 0);
  const totalSpend = suppliers.reduce((sum, s) => sum + (s.supplyHistory?.reduce((a, h) => a + (h.cost || 0), 0) || 0), 0);

  return (
    <div className="page-enter">
      <Header title="Suppliers" subtitle="Manage material suppliers and procurement records" />
      <div style={{ padding: '28px' }}>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Suppliers', value: suppliers.length, color: '#f97316', bg: '#fff7ed' },
            { label: 'Active', value: activeSups.length, color: '#22c55e', bg: '#dcfce7' },
            { label: 'Supply Records', value: totalSupplyRecords, color: '#3b82f6', bg: '#dbeafe' },
            { label: 'Total Procurement', value: `$${totalSpend.toLocaleString()}`, color: '#8b5cf6', bg: '#ede9fe' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Package size={18} color={color} />
              </div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button className="btn-primary" onClick={() => setModal('new')}><Plus size={16} /> Add Supplier</button>
        </div>
        <div className="card">
          {loading ? [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '52px', margin: '8px', borderRadius: '8px' }} />) :
            suppliers.length === 0 ? <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>No suppliers yet. Add your first supplier!</div> : (
              <table className="data-table">
                <thead><tr><th>Company</th><th>Contact</th><th>Materials</th><th>Status</th><th>Supply History</th><th>Actions</th></tr></thead>
                <tbody>
                  {suppliers.map(s => (
                    <>
                      <tr key={s._id}>
                        <td>
                          <div style={{ fontWeight: '600' }}>{s.companyName}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{s.address}</div>
                          {s.website && (
                            <a href={s.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px', textDecoration: 'none' }}>
                              <Globe size={10} /> {s.website}
                            </a>
                          )}
                        </td>
                        <td>
                          <div style={{ fontSize: '13px', color: '#64748b' }}>{s.contactPerson}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}><Mail size={11} style={{ verticalAlign: 'middle' }} /> {s.email}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}><Phone size={11} style={{ verticalAlign: 'middle' }} /> {s.phone}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '180px' }}>
                            {s.materials?.slice(0, 3).map(m => (
                              <span key={m} style={{ background: '#f1f5f9', color: '#475569', fontSize: '11px', padding: '2px 8px', borderRadius: '999px', border: '1px solid #e2e8f0' }}>{m}</span>
                            ))}
                            {s.materials?.length > 3 && <span style={{ fontSize: '11px', color: '#94a3b8' }}>+{s.materials.length - 3} more</span>}
                            {(!s.materials || s.materials.length === 0) && <span style={{ color: '#94a3b8', fontSize: '12px' }}>—</span>}
                          </div>
                        </td>
                        <td><span className={`badge ${s.status === 'Active' ? 'badge-success' : 'badge-gray'}`}>{s.status}</span></td>
                        <td>
                          <button
                            onClick={() => setExpandedId(expandedId === s._id ? null : s._id)}
                            style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', color: '#64748b', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <History size={13} />
                            {s.supplyHistory?.length || 0} records
                            {expandedId === s._id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => setHistoryModal(s)}
                              title="Add Supply Record"
                              style={{ background: '#f0fdf4', border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: '#16a34a' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#dcfce7'}
                              onMouseLeave={e => e.currentTarget.style.background = '#f0fdf4'}
                            >
                              <Plus size={15} />
                            </button>
                            <button onClick={() => setModal(s)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: '#3b82f6' }}>
                              <Edit2 size={15} />
                            </button>
                            <button onClick={() => setDeleteId(s._id)} style={{ background: '#fee2e2', border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: '#dc2626' }}>
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedId === s._id && s.supplyHistory?.length > 0 && (
                        <tr key={`${s._id}-history`}>
                          <td colSpan={6} style={{ background: '#f8fafc', padding: '12px 16px' }}>
                            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Supply History – {s.companyName}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px' }}>
                              {[...s.supplyHistory].reverse().map((h, i) => (
                                <div key={i} style={{ background: 'white', borderRadius: '8px', padding: '10px 12px', border: '1px solid #e2e8f0' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ fontWeight: '600', fontSize: '13px', color: '#1e293b' }}>{h.material}</div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(h.date).toLocaleDateString()}</div>
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'flex', gap: '12px' }}>
                                    <span>Qty: <strong>{h.quantity} {h.unit}</strong></span>
                                    <span>Cost: <strong style={{ color: '#f97316' }}>${Number(h.cost).toLocaleString()}</strong></span>
                                  </div>
                                  {h.notes && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>{h.notes}</div>}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      </div>
      {modal && <SupplierModal supplier={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />}
      {historyModal && <SupplyHistoryModal supplier={historyModal} onClose={() => setHistoryModal(null)} onSave={() => { setHistoryModal(null); load(); }} />}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '380px', textAlign: 'center' }}>
            <Trash2 size={40} color="#dc2626" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Delete Supplier?</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>This will permanently remove the supplier and all supply history records.</p>
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
