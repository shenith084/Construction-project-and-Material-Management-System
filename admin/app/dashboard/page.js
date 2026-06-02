'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { dashboardAPI } from '@/lib/api';
import {
  FolderOpen, Package, Users, Truck, MessageSquare,
  CheckCircle, Clock, DollarSign, TrendingUp, AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const PIE_COLORS = ['#f97316', '#3b82f6', '#22c55e', '#f59e0b'];
const STATUS_COLORS = { 'Active': '#f97316', 'Planning': '#3b82f6', 'Completed': '#22c55e', 'On Hold': '#f59e0b' };

function StatCard({ icon: Icon, label, value, sub, color, bg }) {
  return (
    <div className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{
        width: '52px', height: '52px', borderRadius: '14px',
        background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500', marginTop: '4px' }}>{label}</div>
        {sub && <div style={{ fontSize: '11px', color, fontWeight: '600', marginTop: '2px' }}>{sub}</div>}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ fontSize: '12px', color: p.color }}>{p.name}: {p.value}{p.name === 'Progress' ? '%' : ''}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/login'); return; }
    dashboardAPI.get()
      .then(setData)
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div>
      <Header title="Dashboard" subtitle="Overview of all operations" />
      <div style={{ padding: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '12px' }} />
          ))}
        </div>
      </div>
    </div>
  );

  const stats = data?.stats || {};
  const recentProjects = data?.recentProjects || [];
  const projectsByStatus = data?.projectsByStatus || [];

  const pieData = projectsByStatus.map(p => ({ name: p._id, value: p.count }));
  const barData = recentProjects.slice(0, 6).map(p => ({
    name: p.title.length > 18 ? p.title.substring(0, 18) + '…' : p.title,
    progress: p.progress,
  }));

  const budgetUtilization = stats.totalBudget > 0 ? Math.round(((stats.totalBudget - (stats.totalBudget * 0.3)) / stats.totalBudget) * 100) : 0;

  return (
    <div className="page-enter">
      <Header title="Dashboard" subtitle="Welcome back! Here's your construction management overview." />
      <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* KPI Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          <StatCard icon={FolderOpen} label="Total Projects" value={stats.totalProjects || 0}
            sub={`${stats.activeProjects || 0} active`} color="#f97316" bg="#fff7ed" />
          <StatCard icon={CheckCircle} label="Completed Projects" value={stats.completedProjects || 0}
            sub="Successfully delivered" color="#22c55e" bg="#dcfce7" />
          <StatCard icon={Package} label="Materials" value={stats.totalMaterials || 0}
            sub={stats.lowStockMaterials ? `⚠ ${stats.lowStockMaterials} low/out of stock` : '✓ All stocked'} color="#3b82f6" bg="#dbeafe" />
          <StatCard icon={Users} label="Workforce" value={stats.totalWorkers || 0}
            sub={`${stats.activeWorkers || 0} active workers`} color="#8b5cf6" bg="#ede9fe" />
          <StatCard icon={Truck} label="Suppliers" value={stats.totalSuppliers || 0}
            sub="Registered suppliers" color="#f59e0b" bg="#fef3c7" />
          <StatCard icon={MessageSquare} label="New Messages" value={stats.newContacts || 0}
            sub="Pending review" color="#ef4444" bg="#fee2e2" />
        </div>

        {/* Budget Banner */}
        <div className="card" style={{
          padding: '20px 28px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(249,115,22,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={24} color="#f97316" />
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '500' }}>Total Project Portfolio Value</div>
              <div style={{ color: 'white', fontSize: '32px', fontWeight: '900', lineHeight: 1 }}>
                ${(stats.totalBudget || 0).toLocaleString()}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Active Projects</div>
            <div style={{ color: '#f97316', fontSize: '24px', fontWeight: '800' }}>{stats.activeProjects || 0}</div>
            <div style={{ color: '#475569', fontSize: '11px' }}>of {stats.totalProjects || 0} total</div>
          </div>
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '20px' }}>
          {/* Bar Chart - Project Progress */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>📊 Project Progress Overview</h3>
              <a href="/projects" style={{ fontSize: '12px', color: '#f97316', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
                View all <ArrowRight size={12} />
              </a>
            </div>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="progress" name="Progress" fill="#f97316" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', gap: '8px' }}>
                <FolderOpen size={36} style={{ opacity: 0.3 }} />
                <span style={{ fontSize: '14px' }}>No projects yet</span>
              </div>
            )}
          </div>

          {/* Pie Chart - By Status */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>🥧 Projects by Status</h3>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" paddingAngle={3}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
                  {pieData.map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#64748b' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                      {p.name} ({p.value})
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '14px' }}>No project data</div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        {stats.lowStockMaterials > 0 && (
          <div className="card" style={{ padding: '16px 24px', background: '#fffbeb', border: '1px solid #fde68a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertTriangle size={20} color="#d97706" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', color: '#92400e', fontSize: '14px' }}>Stock Alert: {stats.lowStockMaterials} material(s) running low</div>
                <div style={{ color: '#b45309', fontSize: '12px', marginTop: '2px' }}>Review your inventory and reorder before site work is disrupted.</div>
              </div>
              <a href="/materials" style={{ padding: '8px 16px', background: '#f59e0b', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Check Materials <ArrowRight size={14} />
              </a>
            </div>
          </div>
        )}

        {/* Recent Projects Table */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>🏗️ Recent Projects</h3>
            <a href="/projects" style={{ fontSize: '12px', color: '#f97316', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
              Manage All <ArrowRight size={12} />
            </a>
          </div>
          {recentProjects.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Budget</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((p) => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: '600' }}>{p.title}</td>
                    <td style={{ color: '#64748b', fontSize: '13px' }}>{p.location}</td>
                    <td>
                      <span className={`badge badge-${p.status === 'Active' ? 'orange' : p.status === 'Completed' ? 'success' : p.status === 'On Hold' ? 'warning' : 'info'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="progress-bar" style={{ width: '80px' }}>
                          <div className="progress-fill" style={{ width: `${p.progress}%` }} />
                        </div>
                        <span style={{ fontSize: '12px', color: '#64748b', minWidth: '32px' }}>{p.progress}%</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: '600', color: '#0f172a' }}>${p.budget?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              <FolderOpen size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
              <p>No projects found.</p>
              <a href="/projects" style={{ color: '#f97316', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Create your first project →</a>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
          {[
            { href: '/projects', label: 'New Project', icon: FolderOpen, color: '#f97316' },
            { href: '/materials', label: 'Add Material', icon: Package, color: '#3b82f6' },
            { href: '/workforce', label: 'Add Worker', icon: Users, color: '#8b5cf6' },
            { href: '/suppliers', label: 'Add Supplier', icon: Truck, color: '#f59e0b' },
            { href: '/contacts', label: 'View Messages', icon: MessageSquare, color: '#ef4444' },
          ].map(({ href, label, icon: Icon, color }) => (
            <a key={href} href={href} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'none'; }}
              >
                <Icon size={22} color={color} style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>{label}</div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}
