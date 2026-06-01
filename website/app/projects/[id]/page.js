import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projectsAPI } from '@/lib/api';
import { MapPin, Calendar, DollarSign, User, ArrowLeft, CheckCircle, Circle } from 'lucide-react';

async function getProject(id) {
  try { return await projectsAPI.getOne(id); } catch { return null; }
}

const STATUS_MAP = {
  'Active': 'badge-active', 'Completed': 'badge-completed',
  'Planning': 'badge-planning', 'On Hold': 'badge-hold',
};

export default async function ProjectDetailPage({ params }) {
  const data = await getProject(params.id);
  if (!data) notFound();
  const p = data.project;

  return (
    <>
      <section style={{ paddingTop: '100px', paddingBottom: '40px', background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
        <div className="container">
          <Link href="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748b', textDecoration: 'none', fontSize: '14px', marginBottom: '24px' }}>
            <ArrowLeft size={15} /> Back to Projects
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className={`status-badge ${STATUS_MAP[p.status] || 'badge-planning'}`} style={{ marginBottom: '12px', display: 'inline-flex' }}>{p.status}</span>
              <h1 style={{ color: 'white', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '900', lineHeight: '1.15', maxWidth: '700px' }}>{p.title}</h1>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#64748b', fontSize: '13px' }}>Total Budget</div>
              <div style={{ color: '#f97316', fontSize: '28px', fontWeight: '900' }}>${Number(p.budget).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#0f172a' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '32px', alignItems: 'flex-start' }}>
            {/* Left - Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="glass-card" style={{ padding: '28px' }}>
                <h2 style={{ color: 'white', fontWeight: '700', fontSize: '17px', marginBottom: '14px' }}>Project Description</h2>
                <p style={{ color: '#94a3b8', lineHeight: '1.8', fontSize: '15px' }}>{p.description}</p>
              </div>

              <div className="glass-card" style={{ padding: '28px' }}>
                <h2 style={{ color: 'white', fontWeight: '700', fontSize: '17px', marginBottom: '18px' }}>Project Details</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    [MapPin, 'Location', p.location],
                    [User, 'Project Manager', p.manager],
                    [Calendar, 'Start Date', new Date(p.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
                    [Calendar, 'End Date', new Date(p.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
                    [DollarSign, 'Budget', `$${Number(p.budget).toLocaleString()}`],
                    [DollarSign, 'Spent', `$${Number(p.spent || 0).toLocaleString()}`],
                  ].map(([Icon, label, value]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={15} color="#f97316" />
                      </div>
                      <div>
                        <div style={{ color: '#64748b', fontSize: '12px' }}>{label}</div>
                        <div style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Progress & Milestones */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="glass-card" style={{ padding: '28px' }}>
                <h2 style={{ color: 'white', fontWeight: '700', fontSize: '17px', marginBottom: '20px' }}>Overall Progress</h2>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto',
                    background: `conic-gradient(#f97316 ${p.progress * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                  }}>
                    <div style={{
                      width: '90px', height: '90px', borderRadius: '50%',
                      background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div>
                        <div style={{ color: '#f97316', fontWeight: '900', fontSize: '24px', textAlign: 'center', lineHeight: 1 }}>{p.progress}%</div>
                        <div style={{ color: '#64748b', fontSize: '11px', textAlign: 'center' }}>Complete</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="prog-bar" style={{ height: '10px' }}>
                  <div className="prog-fill" style={{ width: `${p.progress}%` }} />
                </div>
              </div>

              {p.milestones?.length > 0 && (
                <div className="glass-card" style={{ padding: '28px' }}>
                  <h2 style={{ color: 'white', fontWeight: '700', fontSize: '17px', marginBottom: '18px' }}>Milestones</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {p.milestones.map((m, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {m.completed
                          ? <CheckCircle size={18} color="#22c55e" />
                          : <Circle size={18} color="#475569" />}
                        <div>
                          <div style={{ color: m.completed ? '#22c55e' : 'white', fontSize: '14px', fontWeight: '500', textDecoration: m.completed ? 'line-through' : 'none' }}>
                            {m.title}
                          </div>
                          {m.targetDate && <div style={{ color: '#64748b', fontSize: '12px' }}>Target: {new Date(m.targetDate).toLocaleDateString()}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
