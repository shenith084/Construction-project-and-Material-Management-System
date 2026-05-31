'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { workersAPI, projectsAPI } from '@/lib/api';
import { Plus, Edit2, Trash2, X, Save, Phone, Mail } from 'lucide-react';

const ROLES = ['Mason', 'Carpenter', 'Electrician', 'Plumber', 'Welder', 'Painter', 'Foreman', 'Engineer', 'Laborer', 'Supervisor', 'Other'];

const emptyForm = { name: '', email: '', phone: '', role: 'Mason', skills: '', dailyWage: '', status: 'Active', address: '', assignedProject: '', emergencyContact: '' };

function WorkerModal({ worker, projects, onClose, onSave }) {
  const [form, setForm] = useState(worker ? { ...worker, skills: Array.isArray(worker.skills) ? worker.skills.join(', ') : '', assignedProject: worker.assignedProject?._id || '' } : emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    const payload = { ...form, skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [] };
    if (!payload.assignedProject) delete payload.assignedProject;
    try {
      if (worker) await workersAPI.update(worker._id, payload);
      else await workersAPI.create(payload);
      onSave();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '620px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{worker ? 'Edit Worker' : 'Add Worker'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
        </div>
        {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
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
            <label className="form-label">Role *</label>
            <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Daily Wage ($) *</label>
            <input className="form-input" type="number" min="0" value={form.dailyWage} onChange={(e) => setForm({ ...form, dailyWage: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Active</option><option>Inactive</option>
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Skills (comma separated)</label>
            <input className="form-input" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="e.g. Bricklaying, Plastering, Concrete" />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Assigned Project</label>
            <select className="form-select" value={form.assignedProject} onChange={(e) => setForm({ ...form, assignedProject: e.target.value })}>
              <option value="">-- None --</option>
              {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input className="form-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Emergency Contact</label>
            <input className="form-input" value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary"><Save size={16} />{loading ? 'Saving...' : 'Save Worker'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function WorkforcePage() {
  const router = useRouter();
  const [workers, setWorkers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    try {
      const [wd, pd] = await Promise.all([workersAPI.getAll(), projectsAPI.getAll()]);
      setWorkers(wd.workers); setProjects(pd.projects);
    } catch { router.push('/login'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) { router.push('/login'); return; }
    load();
  }, []);

  const handleDelete = async (id) => {
    try { await workersAPI.delete(id); setDeleteId(null); load(); } catch (err) { alert(err.message); }
  };

  return (
    <div className="page-enter">
      <Header title="Workforce" subtitle="Manage workers and assignments" />
      <div style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button className="btn-primary" onClick={() => setModal('new')}><Plus size={16} /> Add Worker</button>
        </div>
        <div className="card">
          {loading ? [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '52px', margin: '8px', borderRadius: '8px' }} />) :
            workers.length === 0 ? <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>No workers yet.</div> : (
              <table className="data-table">
                <thead><tr><th>Name</th><th>Role</th><th>Contact</th><th>Daily Wage</th><th>Project</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {workers.map(w => (
                    <tr key={w._id}>
                      <td>
                        <div style={{ fontWeight: '600' }}>{w.name}</div>
                        {w.skills?.length > 0 && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{w.skills.slice(0, 2).join(', ')}</div>}
                      </td>
                      <td><span className="badge badge-info">{w.role}</span></td>
                      <td>
                        <div style={{ fontSize: '13px', color: '#64748b' }}><Mail size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{w.email}</div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}><Phone size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{w.phone}</div>
                      </td>
                      <td style={{ fontWeight: '600' }}>${Number(w.dailyWage).toLocaleString()}/day</td>
                      <td style={{ color: '#64748b', fontSize: '13px' }}>{w.assignedProject?.title || '—'}</td>
                      <td><span className={`badge ${w.status === 'Active' ? 'badge-success' : 'badge-gray'}`}>{w.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => setModal(w)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: '#3b82f6' }}><Edit2 size={15} /></button>
                          <button onClick={() => setDeleteId(w._id)} style={{ background: '#fee2e2', border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={15} /></button>
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
      {modal && <WorkerModal worker={modal === 'new' ? null : modal} projects={projects} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '380px', textAlign: 'center' }}>
            <Trash2 size={40} color="#dc2626" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Remove Worker?</h3>
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
