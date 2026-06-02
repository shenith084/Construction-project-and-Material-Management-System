import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projectsAPI } from '@/lib/api';
import { MapPin, Calendar, DollarSign, User, ArrowLeft, CheckCircle, Circle, TrendingUp } from 'lucide-react';

async function getProject(id) {
  try { return await projectsAPI.getOne(id); } catch { return null; }
}

const STATUS_MAP = {
  'Active': 'badge-active', 'Completed': 'badge-completed',
  'Planning': 'badge-planning', 'On Hold': 'badge-hold',
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const data = await getProject(resolvedParams.id);
  const title = data?.project?.title || 'Project Details';
  return {
    title: `${title} – ConstructPro`,
    description: data?.project?.description || 'View construction project details, timeline, and milestones.',
  };
}

export default async function ProjectDetailPage({ params }) {
  const resolvedParams = await params;
  const data = await getProject(resolvedParams.id);
  if (!data) notFound();
  const p = data.project;

  const daysLeft = Math.ceil((new Date(p.endDate) - new Date()) / (1000 * 60 * 60 * 24));
  const budgetUsedPct = p.budget > 0 ? Math.round(((p.spent || 0) / p.budget) * 100) : 0;
  const completedMilestones = p.milestones?.filter(m => m.completed).length || 0;

  return (
    <>
      {/* Header */}
      <section style={{ paddingTop: '100px', paddingBottom: '48px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="container">
          <Link href="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748b', textDecoration: 'none', fontSize: '14px', marginBottom: '28px', transition: 'color 0.15s' }}>
            <ArrowLeft size={15} /> Back to Projects
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <span className={`status-badge ${STATUS_MAP[p.status] || 'badge-planning'}`} style={{ marginBottom: '14px', display: 'inline-flex' }}>{p.status}</span>
              <h1 style={{ color: 'white', fontSize: 'clamp(24px, 4vw, 42px)', fontWeight: '900', lineHeight: '1.15', maxWidth: '720px' }}>{p.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', color: '#64748b', fontSize: '14px' }}>
                <MapPin size={14} color="#f97316" /> {p.location} &nbsp;•&nbsp;
                <User size={14} color="#f97316" /> {p.manager}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Total Budget</div>
              <div style={{ color: '#f97316', fontSize: '32px', fontWeight: '900', lineHeight: 1 }}>${Number(p.budget).toLocaleString()}</div>
              {daysLeft > 0 && (
                <div style={{ color: daysLeft < 30 ? '#f59e0b' : '#64748b', fontSize: '12px', marginTop: '6px' }}>
                  ⏱ {daysLeft} days remaining
                </div>
              )}
              {daysLeft <= 0 && <div style={{ color: p.status === 'Completed' ? '#22c55e' : '#ef4444', fontSize: '12px', marginTop: '6px' }}>{p.status === 'Completed' ? '✓ Delivered' : '⚠ Past deadline'}</div>}
            </div>
          </div>
        </div>
      </section>

      {/* Summary Metrics */}
      <section style={{ background: '#0a1628', padding: '28px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div className="grid-4">
            {[
              { label: 'Progress', value: `${p.progress}%`, color: '#f97316' },
              { label: 'Budget Used', value: `${budgetUsedPct}%`, color: budgetUsedPct > 90 ? '#ef4444' : '#22c55e' },
              { label: 'Spent', value: `$${Number(p.spent || 0).toLocaleString()}`, color: '#3b82f6' },
              { label: 'Milestones Done', value: `${completedMilestones}/${p.milestones?.length || 0}`, color: '#8b5cf6' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{ color, fontSize: '28px', fontWeight: '900', lineHeight: 1 }}>{value}</div>
                <div style={{ color: '#64748b', fontSize: '12px', marginTop: '6px', fontWeight: '500' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section" style={{ background: '#0f172a' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '32px', alignItems: 'flex-start' }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="glass-card" style={{ padding: '28px' }}>
                <h2 style={{ color: 'white', fontWeight: '700', fontSize: '17px', marginBottom: '14px' }}>Project Description</h2>
                <p style={{ color: '#94a3b8', lineHeight: '1.85', fontSize: '15px' }}>{p.description}</p>
              </div>

              <div className="glass-card" style={{ padding: '28px' }}>
                <h2 style={{ color: 'white', fontWeight: '700', fontSize: '17px', marginBottom: '20px' }}>Project Details</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    [MapPin, 'Location', p.location],
                    [User, 'Project Manager', p.manager],
                    [Calendar, 'Start Date', new Date(p.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
                    [Calendar, 'End Date', new Date(p.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
                    [DollarSign, 'Total Budget', `$${Number(p.budget).toLocaleString()}`],
                    [TrendingUp, 'Amount Spent', `$${Number(p.spent || 0).toLocaleString()}`],
                  ].map(([Icon, label, value]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={16} color="#f97316" />
                      </div>
                      <div>
                        <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '2px' }}>{label}</div>
                        <div style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Progress Card */}
              <div className="glass-card" style={{ padding: '28px' }}>
                <h2 style={{ color: 'white', fontWeight: '700', fontSize: '17px', marginBottom: '24px' }}>Overall Progress</h2>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{
                    width: '130px', height: '130px', borderRadius: '50%', margin: '0 auto',
                    background: `conic-gradient(#f97316 ${p.progress * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                  }}>
                    <div style={{
                      width: '98px', height: '98px', borderRadius: '50%',
                      background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div>
                        <div style={{ color: '#f97316', fontWeight: '900', fontSize: '26px', textAlign: 'center', lineHeight: 1 }}>{p.progress}%</div>
                        <div style={{ color: '#64748b', fontSize: '11px', textAlign: 'center', marginTop: '3px' }}>Complete</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="prog-bar" style={{ height: '10px' }}>
                  <div className="prog-fill" style={{ width: `${p.progress}%` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>0%</span>
                  <span style={{ fontSize: '12px', color: '#f97316', fontWeight: '700' }}>{p.progress}% Complete</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>100%</span>
                </div>
              </div>

              {/* Budget Usage */}
              <div className="glass-card" style={{ padding: '28px' }}>
                <h2 style={{ color: 'white', fontWeight: '700', fontSize: '17px', marginBottom: '20px' }}>Budget Utilization</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Spent: ${Number(p.spent || 0).toLocaleString()}</span>
                  <span style={{ fontSize: '13px', color: budgetUsedPct > 90 ? '#ef4444' : '#22c55e', fontWeight: '700' }}>{budgetUsedPct}%</span>
                </div>
                <div className="prog-bar" style={{ height: '10px' }}>
                  <div className="prog-fill" style={{
                    width: `${Math.min(budgetUsedPct, 100)}%`,
                    background: budgetUsedPct > 90 ? 'linear-gradient(90deg, #ef4444, #f87171)' : undefined
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Budget: ${Number(p.budget).toLocaleString()}</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Remaining: ${Number(p.budget - (p.spent || 0)).toLocaleString()}</span>
                </div>
              </div>

              {/* Milestones */}
              {p.milestones?.length > 0 && (
                <div className="glass-card" style={{ padding: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: 'white', fontWeight: '700', fontSize: '17px' }}>Milestones</h2>
                    <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600' }}>{completedMilestones}/{p.milestones.length} done</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {p.milestones.map((m, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ marginTop: '2px', flexShrink: 0 }}>
                          {m.completed
                            ? <CheckCircle size={18} color="#22c55e" />
                            : <Circle size={18} color="#475569" />}
                        </div>
                        <div>
                          <div style={{ color: m.completed ? '#22c55e' : 'white', fontSize: '14px', fontWeight: '500', textDecoration: m.completed ? 'line-through' : 'none', opacity: m.completed ? 0.8 : 1 }}>
                            {m.title}
                          </div>
                          {m.targetDate && (
                            <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>
                              Target: {new Date(m.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          )}
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

      {/* CTA */}
      <section style={{ background: '#0a1628', padding: '48px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '15px' }}>Interested in this project or want to collaborate?</p>
          <Link href="/contact" className="btn-orange">Get In Touch</Link>
        </div>
      </section>
    </>
  );
}
