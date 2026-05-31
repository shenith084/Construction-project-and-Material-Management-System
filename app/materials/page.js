'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { materialsAPI } from '@/lib/api';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

const CATEGORIES = ['Cement', 'Steel', 'Sand', 'Gravel', 'Bricks', 'Wood', 'Paint', 'Tiles', 'Glass', 'Pipes', 'Electrical', 'Other'];
const UNITS = ['kg', 'ton', 'piece', 'm3', 'm2', 'liter', 'bag', 'roll', 'sheet'];

const emptyForm = { name: '', category: 'Cement', unit: 'kg', stockQuantity: '', usedQuantity: 0, unitPrice: '', reorderLevel: 10, description: '' };

function MaterialModal({ material, onClose, onSave }) {
  const [form, setForm] = useState(material || emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (material) await materialsAPI.update(material._id, form);
      else await materialsAPI.create(form);
      onSave();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{material ? 'Edit Material' : 'Add Material'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
        </div>
        {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Material Name *</label>
            <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Portland Cement" />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Unit</label>
            <select className="form-select" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
              {UNITS.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Stock Quantity *</label>
            <input className="form-input" type="number" min="0" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Used Quantity</label>
            <input className="form-input" type="number" min="0" value={form.usedQuantity} onChange={(e) => setForm({ ...form, usedQuantity: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Unit Price ($) *</label>
            <input className="form-input" type="number" min="0" step="0.01" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Reorder Level</label>
            <input className="form-input" type="number" min="0" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional notes..." style={{ minHeight: '70px' }} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary"><Save size={16} />{loading ? 'Saving...' : 'Save Material'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const stockClass = { 'In Stock': 'badge-success', 'Low Stock': 'badge-warning', 'Out of Stock': 'badge-danger' };

export default function MaterialsPage() {
  const router = useRouter();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    try { const d = await materialsAPI.getAll(); setMaterials(d.materials); }
    catch { router.push('/login'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) { router.push('/login'); return; }
    load();
  }, []);

  const handleDelete = async (id) => {
    try { await materialsAPI.delete(id); setDeleteId(null); load(); } catch (err) { alert(err.message); }
  };

  return (
    <div className="page-enter">
      <Header title="Materials" subtitle="Track and manage construction materials" />
      <div style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button className="btn-primary" onClick={() => setModal('new')}><Plus size={16} /> Add Material</button>
        </div>
        <div className="card">
          {loading ? [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '52px', margin: '8px', borderRadius: '8px' }} />) :
            materials.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>No materials yet. Add your first one!</div>
            ) : (
              <table className="data-table">
                <thead><tr><th>Name</th><th>Category</th><th>Stock</th><th>Used</th><th>Available</th><th>Unit Price</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {materials.map(m => (
                    <tr key={m._id}>
                      <td><div style={{ fontWeight: '600' }}>{m.name}</div><div style={{ fontSize: '12px', color: '#94a3b8' }}>{m.unit}</div></td>
                      <td><span className="badge badge-info">{m.category}</span></td>
                      <td style={{ fontWeight: '600' }}>{m.stockQuantity}</td>
                      <td style={{ color: '#64748b' }}>{m.usedQuantity}</td>
                      <td style={{ fontWeight: '600', color: '#22c55e' }}>{Math.max(0, m.stockQuantity - m.usedQuantity)}</td>
                      <td>${Number(m.unitPrice).toFixed(2)}</td>
                      <td><span className={`badge ${stockClass[m.status] || 'badge-gray'}`}>{m.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => setModal(m)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: '#3b82f6' }}><Edit2 size={15} /></button>
                          <button onClick={() => setDeleteId(m._id)} style={{ background: '#fee2e2', border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={15} /></button>
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
      {modal && <MaterialModal material={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '380px', textAlign: 'center' }}>
            <Trash2 size={40} color="#dc2626" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Delete Material?</h3>
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
