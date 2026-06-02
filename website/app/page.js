import Link from 'next/link';
import { ArrowRight, HardHat, BarChart3, Package, Users, CheckCircle, Star, Zap, Shield } from 'lucide-react';
import { projectsAPI } from '@/lib/api';

async function getProjects() {
  try { return await projectsAPI.getAll(); } catch { return { projects: [] }; }
}

const stats = [
  { value: '50+', label: 'Projects Completed' },
  { value: '200+', label: 'Workers Managed' },
  { value: '99%', label: 'Client Satisfaction' },
  { value: '10+', label: 'Years Experience' },
];

const features = [
  { icon: HardHat, title: 'Project Management', desc: 'Plan, track, and deliver construction projects on time and within budget.' },
  { icon: Package, title: 'Material Tracking', desc: 'Monitor stock levels, usage, and procurement in real time.' },
  { icon: Users, title: 'Workforce Management', desc: 'Assign workers, track roles, and manage team performance.' },
  { icon: BarChart3, title: 'Analytics & Reports', desc: 'Get clear insights with dashboards, progress charts, and reports.' },
  { icon: Zap, title: 'Real-Time Updates', desc: 'Instant updates across all devices for seamless collaboration.' },
  { icon: Shield, title: 'Secure & Reliable', desc: 'Enterprise-grade security with MongoDB and JWT authentication.' },
];

const STATUS_MAP = {
  'Active': 'badge-active', 'Completed': 'badge-completed',
  'Planning': 'badge-planning', 'On Hold': 'badge-hold',
};

export default async function HomePage() {
  const { projects = [] } = await getProjects();
  const featured = projects.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section style={{
        minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
        paddingTop: '70px', overflow: 'hidden',
      }}>
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '15%', left: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '80px 24px' }}>
          <div className="section-label animate-fade-in">
            <HardHat size={12} /> Construction Management Platform
          </div>
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: '900', color: 'white',
            lineHeight: '1.1', letterSpacing: '-1px', marginBottom: '24px', marginTop: '8px',
          }}>
            Build Smarter,{' '}
            <span style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Deliver Faster
            </span>
          </h1>
          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.7' }}>
            The all-in-one platform for construction companies to manage projects, materials, workforce, and suppliers from one centralized dashboard.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/projects" className="btn-orange">
              View Projects <ArrowRight size={18} />
            </Link>
            <Link href="/about" className="btn-outline">
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', maxWidth: '700px', margin: '60px auto 0', textAlign: 'center' }}>
            {stats.map(({ value, label }) => (
              <div key={label} style={{ padding: '20px 10px' }}>
                <div style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '900', color: '#f97316', marginBottom: '6px' }}>{value}</div>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ background: '#0a1628' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="section-label"><Zap size={12} /> Features</div>
            <h2 className="section-title" style={{ margin: '0 auto' }}>Everything You Need</h2>
            <p className="section-sub" style={{ margin: '12px auto 0' }}>
              A complete toolkit to streamline your construction operations from planning to completion.
            </p>
          </div>
          <div className="grid-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card" style={{ padding: '28px 24px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(249,115,22,0.05))',
                  border: '1px solid rgba(249,115,22,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
                }}>
                  <Icon size={22} color="#f97316" />
                </div>
                <h3 style={{ color: 'white', fontWeight: '700', fontSize: '16px', marginBottom: '10px' }}>{title}</h3>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featured.length > 0 && (
        <section className="section" style={{ background: '#0f172a' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div className="section-label"><HardHat size={12} /> Our Work</div>
                <h2 className="section-title">Featured Projects</h2>
              </div>
              <Link href="/projects" className="btn-outline" style={{ padding: '10px 20px', fontSize: '14px' }}>
                View All <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid-3">
              {featured.map((p) => (
                <Link key={p._id} href={`/projects/${p._id}`} style={{ textDecoration: 'none' }}>
                  <div className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <span className={`status-badge ${STATUS_MAP[p.status] || 'badge-planning'}`}>{p.status}</span>
                      <span style={{ color: '#f97316', fontWeight: '700', fontSize: '15px' }}>${Number(p.budget).toLocaleString()}</span>
                    </div>
                    <h3 style={{ color: 'white', fontWeight: '700', fontSize: '17px', marginBottom: '8px', lineHeight: '1.3' }}>{p.title}</h3>
                    <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px', lineHeight: '1.5', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {p.description}
                    </p>
                    <div style={{ fontSize: '12px', color: '#475569', marginBottom: '8px' }}>📍 {p.location}</div>
                    <div className="prog-bar">
                      <div className="prog-fill" style={{ width: `${p.progress}%` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Progress</span>
                      <span style={{ fontSize: '12px', color: '#f97316', fontWeight: '600' }}>{p.progress}%</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(249,115,22,0.05))',
            border: '1px solid rgba(249,115,22,0.2)', borderRadius: '24px', padding: '64px 40px',
          }}>
            <h2 className="section-title" style={{ margin: '0 auto 16px' }}>Ready to Start Your Project?</h2>
            <p className="section-sub" style={{ margin: '0 auto 36px' }}>
              Get in touch with our team and see how ConstructPro can transform your operations.
            </p>
            <Link href="/contact" className="btn-orange">
              Contact Us <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
