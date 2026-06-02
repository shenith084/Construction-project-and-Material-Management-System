import Sidebar from '@/components/Sidebar';
export default function WorkforceLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '240px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>{children}</main>
    </div>
  );
}
