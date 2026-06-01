import { Users, Wrench, Mail, Phone } from 'lucide-react';
import { workersAPI } from '@/lib/api';

export const metadata = { title: 'Workforce – ConstructPro', description: 'Meet the skilled workforce behind our construction projects.' };

async function getWorkers() {
  try { return await workersAPI.getAll(); } catch { return { workers: [] }; }
}

const roleColors = {
  Mason: '#f97316', Carpenter: '#3b82f6', Electrician: '#f59e0b',
  Plumber: '#22c55e', Welder: '#8b5cf6', Painter: '#ec4899',
  Foreman: '#06b6d4', Engineer: '#f97316', Laborer: '#64748b',
  Supervisor: '#ef4444', Other: '#94a3b8',
};

export default async function WorkforcePage() {
  const { workers = [] } = await getWorkers();
  const active = workers.filter(w => w.status === 'Active');
  const roles = [...new Set(workers.map(w => w.role))];

  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '60px', background: 'linear-gradient(135deg, #0f172a, #1e293b)', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label"><Users size={12} /> Our Team</div>
          <h1 className="section-title" style={{ margin: '8px auto 16px' }}>Our Workforce</h1>
          <p className="section-sub" style={{ margin: '0 auto' }}>Skilled professionals driving our construction projects forward.</p>
        </div>
      </section>

      <section className="section" style={{ background: '#0f172a' }}>
        <div className="container">
          {/* Summary */}
          <div className="grid-4" style={{ marginBottom: '48px' }}>
            {[
              { label: 'Total Workers', value: workers.length, color: '#f97316' },
              { label: 'Active', value: active.length, color: '#22c55e' },
              { label: 'Unique Roles', value: roles.length, color: '#3b82f6' },
              { label: 'Inactive', value: workers.length - active.length, color: '#94a3b8' },
            ].map(({ label, value, color }) => (
              <div key={label} className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: '900', color, marginBottom: '6px' }}>{value}</div>
                <div style={{ color: '#64748b', fontSize: '13px' }}>{label}</div>
              </div>
            ))}
          </div>

          {workers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <Users size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p>No workforce records found.</p>
            </div>
          ) : (
            <div className="grid-3">
              {workers.map(w => {
                const roleColor = roleColors[w.role] || '#94a3b8';
                return (
                  <div key={w._id} className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{
                        width: '50px', height: '50px', borderRadius: '50%',
                        background: `linear-gradient(135deg, ${roleColor}33, ${roleColor}11)`,
                        border: `2px solid ${roleColor}44`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px', fontWeight: '800', color: roleColor,
                      }}>
                        {w.name.charAt(0)}
                      </div>
                      <span className={`status-badge ${w.status === 'Active' ? 'badge-active' : 'badge-hold'}`}>{w.status}</span>
                    </div>
                    <h3 style={{ color: 'white', fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{w.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
                        background: `${roleColor}1a`, color: roleColor, border: `1px solid ${roleColor}33`,
                      }}>{w.role}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#64748b', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={12} color="#f97316" /> {w.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={12} color="#f97316" /> {w.phone}
                      </div>
                      {w.assignedProject?.title && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Wrench size={12} color="#f97316" /> {w.assignedProject.title}
                        </div>
                      )}
                    </div>
                    {w.skills?.length > 0 && (
                      <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {w.skills.slice(0, 3).map(s => (
                          <span key={s} style={{ padding: '2px 10px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontSize: '11px', border: '1px solid rgba(255,255,255,0.07)' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
