'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { dashboardAPI } from '@/lib/api';
import {
  FolderOpen, Package, Users, Truck, MessageSquare,
  TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const STATUS_COLORS = {
  'Active': '#f97316',
  'Planning': '#3b82f6',
  'Completed': '#22c55e',
  'On Hold': '#f59e0b',
};

const PIE_COLORS = ['#f97316', '#3b82f6', '#22c55e', '#f59e0b'];

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
        {sub && <div style={{ fontSize: '11px', color: color, fontWeight: '600', marginTop: '2px' }}>{sub}</div>}
      </div>
    </div>
  );
}

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
  const barData = recentProjects.map(p => ({ name: p.title.substring(0, 15) + '...', progress: p.progress }));

  return (
    <div className="page-enter">
      <Header title="Dashboard" subtitle="Welcome back! Here's what's happening." />
      <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          <StatCard icon={FolderOpen} label="Total Projects" value={stats.totalProjects || 0}
            sub={`${stats.activeProjects || 0} active`} color="#f97316" bg="#fff7ed" />
          <StatCard icon={CheckCircle} label="Completed" value={stats.completedProjects || 0}
            sub="Projects done" color="#22c55e" bg="#dcfce7" />
          <StatCard icon={Package} label="Materials" value={stats.totalMaterials || 0}
            sub={stats.lowStockMaterials ? `${stats.lowStockMaterials} low stock` : 'All stocked'} color="#3b82f6" bg="#dbeafe" />
          <StatCard icon={Users} label="Workforce" value={stats.totalWorkers || 0}
            sub={`${stats.activeWorkers || 0} active`} color="#8b5cf6" bg="#ede9fe" />
          <StatCard icon={Truck} label="Suppliers" value={stats.totalSuppliers || 0}
            sub="Registered" color="#f59e0b" bg="#fef3c7" />
          <StatCard icon={MessageSquare} label="New Messages" value={stats.newContacts || 0}
            sub="Unread" color="#ef4444" bg="#fee2e2" />
        </div>

        {/* Budget */}
        <div className="card" style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(249,115,22,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={22} color="#f97316" />
          </div>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>Total Project Budget</div>
            <div style={{ color: 'white', fontSize: '28px', fontWeight: '800' }}>
              ${(stats.totalBudget || 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Project Progress Bar Chart */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>
              📊 Recent Project Progress
            </h3>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
                  <Tooltip
                    formatter={(v) => [`${v}%`, 'Progress']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="progress" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '14px' }}>
                No projects yet
              </div>
            )}
          </div>

          {/* Status Pie Chart */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>
              🥧 Projects by Status
            </h3>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '8px' }}>
                  {pieData.map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      {p.name} ({p.value})
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '14px' }}>
                No data
              </div>
            )}
          </div>
        </div>

        {/* Recent Projects Table */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>🏗️ Recent Projects</h3>
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
                    <td style={{ color: '#64748b' }}>{p.location}</td>
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
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{p.progress}%</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: '600', color: '#0f172a' }}>${p.budget?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              No projects found. <a href="/projects" style={{ color: '#f97316', textDecoration: 'none' }}>Create your first project →</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
