import { Package, AlertTriangle } from 'lucide-react';
import { materialsAPI } from '@/lib/api';

export const metadata = { title: 'Materials – ConstructPro', description: 'View construction materials stock, usage, and availability.' };

async function getMaterials() {
  try { return await materialsAPI.getAll(); } catch { return { materials: [] }; }
}

const stockBadge = { 'In Stock': 'badge-instock', 'Low Stock': 'badge-lowstock', 'Out of Stock': 'badge-outstock' };

export default async function MaterialsPage() {
  const { materials = [] } = await getMaterials();

  const categories = [...new Set(materials.map(m => m.category))];

  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '60px', background: 'linear-gradient(135deg, #0f172a, #1e293b)', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label"><Package size={12} /> Materials</div>
          <h1 className="section-title" style={{ margin: '8px auto 16px' }}>Construction Materials</h1>
          <p className="section-sub" style={{ margin: '0 auto' }}>Track material inventory, stock levels, and usage across all projects.</p>
        </div>
      </section>

      <section className="section" style={{ background: '#0f172a' }}>
        <div className="container">
          {/* Summary Cards */}
          <div className="grid-3" style={{ marginBottom: '40px' }}>
            {[
              { label: 'Total Materials', value: materials.length, color: '#f97316' },
              { label: 'In Stock', value: materials.filter(m => m.status === 'In Stock').length, color: '#22c55e' },
              { label: 'Low / Out of Stock', value: materials.filter(m => m.status !== 'In Stock').length, color: '#ef4444' },
            ].map(({ label, value, color }) => (
              <div key={label} className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', fontWeight: '900', color, marginBottom: '6px' }}>{value}</div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>{label}</div>
              </div>
            ))}
          </div>

          {materials.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <Package size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p>No materials found.</p>
            </div>
          ) : (
            categories.map(cat => {
              const catMaterials = materials.filter(m => m.category === cat);
              return (
                <div key={cat} style={{ marginBottom: '40px' }}>
                  <h2 style={{ color: 'white', fontWeight: '700', fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#f97316' }}>▸</span> {cat}
                    <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '400' }}>({catMaterials.length} items)</span>
                  </h2>
                  <div className="grid-4">
                    {catMaterials.map(m => {
                      const available = Math.max(0, m.stockQuantity - m.usedQuantity);
                      const pct = m.stockQuantity > 0 ? Math.round((available / m.stockQuantity) * 100) : 0;
                      return (
                        <div key={m._id} className="glass-card" style={{ padding: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <h3 style={{ color: 'white', fontWeight: '600', fontSize: '14px', lineHeight: '1.3' }}>{m.name}</h3>
                            {m.status !== 'In Stock' && <AlertTriangle size={14} color="#f59e0b" />}
                          </div>
                          <span className={`status-badge ${stockBadge[m.status] || 'badge-planning'}`} style={{ marginBottom: '12px', fontSize: '11px' }}>{m.status}</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#64748b', marginTop: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Stock</span><span style={{ color: 'white', fontWeight: '600' }}>{m.stockQuantity} {m.unit}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Used</span><span style={{ color: '#f97316', fontWeight: '600' }}>{m.usedQuantity} {m.unit}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Available</span><span style={{ color: '#22c55e', fontWeight: '600' }}>{available} {m.unit}</span>
                            </div>
                          </div>
                          <div className="prog-bar" style={{ marginTop: '12px' }}>
                            <div className="prog-fill" style={{ width: `${pct}%`, background: m.status === 'Out of Stock' ? '#ef4444' : m.status === 'Low Stock' ? '#f59e0b' : undefined }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}
