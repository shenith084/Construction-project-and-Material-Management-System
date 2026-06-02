'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { projectsAPI } from '@/lib/api';
import { Plus, Edit2, Trash2, X, Save, MapPin, Calendar, DollarSign, TrendingUp, FolderOpen } from 'lucide-react';

const STATUSES = ['Planning', 'Active', 'On Hold', 'Completed'];

const emptyForm = {
  title: '', description: '', location: '', manager: '',
  startDate: '', endDate: '', budget: '', spent: '', progress: 0, status: 'Planning',
};

function ProjectModal({ project, onClose, onSave }) {
  const [form, setForm] = useState(project ? { ...project, startDate: project.startDate?.substring(0, 10), endDate: project.endDate?.substring(0, 10) } : emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (project) { await projectsAPI.update(project._id, form); }
      else { await projectsAPI.create(form); }
      onSave();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '620px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
            {project ? 'Edit Project' : 'New Project'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
        </div>
        {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Project Title *</label>
            <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. City Highway Bridge Construction" />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Description *</label>
            <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required placeholder="Project description..." />
          </div>
          <div className="form-group">
            <label className="form-label">Location *</label>
            <input className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required placeholder="City, Country" />
          </div>
          <div className="form-group">
            <label className="form-label">Project Manager *</label>
            <input className="form-input" value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} required placeholder="Manager name" />
          </div>
          <div className="form-group">
            <label className="form-label">Start Date *</label>
            <input className="form-input" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">End Date *</label>
            <input className="form-input" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Budget ($) *</label>
            <input className="form-input" type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} required min="0" placeholder="0" />
          </div>
          <div className="form-group">
            <label className="form-label">Spent ($)</label>
            <input className="form-input" type="number" value={form.spent} onChange={(e) => setForm({ ...form, spent: e.target.value })} min="0" placeholder="0" />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Progress ({form.progress}%)</label>
            <input type="range" min="0" max="100" value={form.progress} onChange={(e) => setForm({ ...form, progress: +e.target.value })}
              style={{ width: '100%', accentColor: '#f97316' }} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              <Save size={16} />{loading ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const statusClass = { 'Active': 'badge-orange', 'Planning': 'badge-info', 'Completed': 'badge-success', 'On Hold': 'badge-warning' };

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'new' | project object
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    try {
      const data = await projectsAPI.getAll();
      setProjects(data.projects);
    } catch { router.push('/login'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/login'); return; }
    load();
  }, []);

  const handleDelete = async (id) => {
    try {
      await projectsAPI.delete(id);
      setDeleteId(null);
      load();
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="page-enter">
      <Header title="Projects" subtitle="Manage all construction projects" />
      <div style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button className="btn-primary" onClick={() => setModal('new')}>
            <Plus size={16} /> New Project
          </button>
        </div>

        <div className="card">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '52px', marginBottom: '8px', borderRadius: '8px' }} />)}
            </div>
          ) : projects.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
              <FolderOpen size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
              <p>No projects yet. Create your first one!</p>
            </div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Project</th><th>Location</th><th>Manager</th><th>Status</th><th>Progress</th><th>Budget</th><th>Actions</th></tr></thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ fontWeight: '600', color: '#0f172a' }}>{p.title}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{new Date(p.startDate).toLocaleDateString()} – {new Date(p.endDate).toLocaleDateString()}</div>
                    </td>
                    <td style={{ color: '#64748b' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={13} />{p.location}</div></td>
                    <td style={{ color: '#64748b' }}>{p.manager}</td>
                    <td><span className={`badge ${statusClass[p.status] || 'badge-gray'}`}>{p.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="progress-bar" style={{ width: '80px' }}>
                          <div className="progress-fill" style={{ width: `${p.progress}%` }} />
                        </div>
                        <span style={{ fontSize: '12px', color: '#64748b', minWidth: '32px' }}>{p.progress}%</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: '600' }}>${Number(p.budget).toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setModal(p)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: '#3b82f6', transition: 'all 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background='#dbeafe'} onMouseLeave={e => e.currentTarget.style.background='#f1f5f9'}>
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => setDeleteId(p._id)} style={{ background: '#fee2e2', border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: '#dc2626', transition: 'all 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background='#fecaca'} onMouseLeave={e => e.currentTarget.style.background='#fee2e2'}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && <ProjectModal project={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />}

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '380px', textAlign: 'center' }}>
            <Trash2 size={40} color="#dc2626" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Delete Project?</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>This action cannot be undone.</p>
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
