import Link from 'next/link';
import { HardHat, MapPin, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { projectsAPI } from '@/lib/api';

export const metadata = { title: 'Projects – ConstructPro', description: 'Browse all construction projects managed by ConstructPro.' };

const STATUS_MAP = {
  'Active': 'badge-active', 'Completed': 'badge-completed',
  'Planning': 'badge-planning', 'On Hold': 'badge-hold',
};

async function getProjects() {
  try { return await projectsAPI.getAll(); } catch { return { projects: [] }; }
}

export default async function ProjectsPage() {
  const { projects = [] } = await getProjects();

  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '60px', background: 'linear-gradient(135deg, #0f172a, #1e293b)', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label"><HardHat size={12} /> Our Projects</div>
          <h1 className="section-title" style={{ margin: '8px auto 16px' }}>Construction Projects</h1>
          <p className="section-sub" style={{ margin: '0 auto' }}>Explore all active, completed, and upcoming construction projects.</p>
        </div>
      </section>

      <section className="section" style={{ background: '#0f172a' }}>
        <div className="container">
          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <HardHat size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p style={{ fontSize: '18px' }}>No projects available yet.</p>
            </div>
          ) : (
            <div className="grid-3">
              {projects.map((p) => (
                <Link key={p._id} href={`/projects/${p._id}`} style={{ textDecoration: 'none' }}>
                  <div className="glass-card" style={{ padding: '28px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <span className={`status-badge ${STATUS_MAP[p.status] || 'badge-planning'}`}>{p.status}</span>
                    </div>
                    <h2 style={{ color: 'white', fontWeight: '700', fontSize: '18px', marginBottom: '10px', lineHeight: '1.3', flex: 1 }}>{p.title}</h2>
                    <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {p.description}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px' }}>
                        <MapPin size={13} color="#f97316" /> {p.location}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px' }}>
                        <Calendar size={13} color="#f97316" /> {new Date(p.startDate).toLocaleDateString()} – {new Date(p.endDate).toLocaleDateString()}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px' }}>
                        <DollarSign size={13} color="#f97316" /> Budget: <strong style={{ color: '#f97316' }}>${Number(p.budget).toLocaleString()}</strong>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Progress</span>
                        <span style={{ fontSize: '12px', color: '#f97316', fontWeight: '700' }}>{p.progress}%</span>
                      </div>
                      <div className="prog-bar"><div className="prog-fill" style={{ width: `${p.progress}%` }} /></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f97316', fontSize: '13px', fontWeight: '600', marginTop: '16px' }}>
                      View Details <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
