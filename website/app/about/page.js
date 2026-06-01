import { HardHat, Target, Eye, Award, Users, TrendingUp } from 'lucide-react';

const timeline = [
  { year: '2014', title: 'Founded', desc: 'ConstructPro was established with a mission to modernize construction management.' },
  { year: '2016', title: 'First Major Project', desc: 'Successfully delivered a $5M commercial complex on time and under budget.' },
  { year: '2019', title: 'Digital Transformation', desc: 'Launched our digital platform connecting projects, materials, and teams.' },
  { year: '2022', title: 'National Expansion', desc: 'Expanded to 12 cities and over 100 active construction projects.' },
  { year: '2026', title: 'Smart Platform', desc: 'Launched the Construction Project & Material Management System.' },
];

const values = [
  { icon: Target, title: 'Precision', desc: 'We deliver exactly what is planned, on time and on budget.' },
  { icon: Eye, title: 'Transparency', desc: 'Full visibility into project progress, costs, and resources.' },
  { icon: Award, title: 'Excellence', desc: 'Uncompromising quality in every project and platform feature.' },
  { icon: Users, title: 'Collaboration', desc: 'Connecting teams, suppliers, and stakeholders seamlessly.' },
];

export const metadata = { title: 'About – ConstructPro', description: 'Learn about the ConstructPro construction management platform.' };

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section style={{
        paddingTop: '130px', paddingBottom: '80px', textAlign: 'center',
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div className="section-label"><HardHat size={12} /> Our Story</div>
          <h1 className="section-title" style={{ maxWidth: '700px', margin: '8px auto 20px' }}>
            Building the Future of Construction Management
          </h1>
          <p className="section-sub" style={{ margin: '0 auto', maxWidth: '580px' }}>
            ConstructPro is a comprehensive platform designed to help construction companies manage every aspect of their projects — from materials and workforce to budgets and timelines.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section" style={{ background: '#0a1628' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '60px' }}>
            <div>
              <div className="section-label"><Target size={12} /> Our Mission</div>
              <h2 className="section-title">Transforming How Construction Projects Are Managed</h2>
              <div className="divider" />
              <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.8', marginBottom: '20px' }}>
                We believe construction companies deserve powerful, easy-to-use tools to manage their operations. Our platform brings together project tracking, material management, workforce coordination, and supplier relationships in one unified system.
              </p>
              <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.8' }}>
                Built by construction professionals, for construction professionals — with a deep understanding of on-site realities and business demands.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Projects Completed', value: '50+', color: '#f97316' },
                { label: 'Active Users', value: '500+', color: '#3b82f6' },
                { label: 'Cities Served', value: '12', color: '#22c55e' },
                { label: 'Years Experience', value: '10+', color: '#8b5cf6' },
              ].map(({ label, value, color }) => (
                <div key={label} className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: '900', color, marginBottom: '6px' }}>{value}</div>
                  <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '500' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: '#0f172a' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="section-label"><Award size={12} /> Our Values</div>
            <h2 className="section-title">What Drives Us</h2>
          </div>
          <div className="grid-4">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card" style={{ padding: '28px 20px', textAlign: 'center' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                }}>
                  <Icon size={22} color="#f97316" />
                </div>
                <h3 style={{ color: 'white', fontWeight: '700', fontSize: '15px', marginBottom: '8px' }}>{title}</h3>
                <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section" style={{ background: '#0a1628' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="section-label"><TrendingUp size={12} /> Our Journey</div>
            <h2 className="section-title">Milestones</h2>
          </div>
          <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0' }}>
            {timeline.map((item, i) => (
              <div key={item.year} style={{ display: 'flex', gap: '24px', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: '800', fontSize: '12px',
                  }}>{item.year.slice(2)}</div>
                  {i < timeline.length - 1 && <div style={{ width: '2px', flex: 1, background: 'rgba(249,115,22,0.2)', margin: '6px 0' }} />}
                </div>
                <div style={{ paddingBottom: i < timeline.length - 1 ? '28px' : '0', paddingTop: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#f97316', fontWeight: '700', marginBottom: '4px' }}>{item.year}</div>
                  <h3 style={{ color: 'white', fontWeight: '700', fontSize: '15px', marginBottom: '6px' }}>{item.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
