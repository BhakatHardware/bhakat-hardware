import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Package, ShoppingCart, History,
  FolderKanban, Layers, LogOut, Menu, X, ExternalLink,
  ChevronDown, BarChart3, NotebookTabs
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin', end: true },
  { icon: Package, label: 'Inventory', to: '/admin/inventory' },
  { icon: ShoppingCart, label: 'Record Sale', to: '/admin/sales/new' },
  { icon: History, label: 'Sales History', to: '/admin/sales/history' },
  { icon: NotebookTabs, label: 'Customer Ledger', to: '/admin/debts' },
  { icon: FolderKanban, label: 'Projects', to: '/admin/projects' },
  { icon: Layers, label: 'Materials (Web)', to: '/admin/materials' },
];

export default function AdminLayout() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-surface)', fontFamily: 'var(--font-body)' }}>
      {/* Sidebar Overlay for Mobile */}
      {isMobile && sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 998 }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : (isMobile ? 0 : 70),
        flexShrink: 0,
        background: 'var(--color-white)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s',
        overflow: 'hidden',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0, height: '100vh',
        zIndex: 999,
        transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, var(--color-lime-dark), var(--color-lime))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 800, fontSize: '0.8rem', color: 'var(--color-dark)' }}>
            BH
          </div>
          {sidebarOpen && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-dark)' }}>BHAKAT HW</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-lime-dark)', letterSpacing: '0.1em' }}>ADMIN PANEL</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 10px', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => isMobile && setSidebarOpen(false)}
              style={{ marginBottom: 4, justifyContent: (sidebarOpen || isMobile) ? 'flex-start' : 'center', title: (!sidebarOpen && !isMobile) ? item.label : undefined }}>
              <item.icon size={18} style={{ flexShrink: 0 }} />
              {(sidebarOpen || isMobile) && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '16px 10px', borderTop: '1px solid var(--color-border)' }}>
          <Link to="/" target="_blank" className="sidebar-link" style={{ marginBottom: 4, justifyContent: (sidebarOpen || isMobile) ? 'flex-start' : 'center' }}>
            <ExternalLink size={18} style={{ flexShrink: 0 }} />
            {(sidebarOpen || isMobile) && <span>View Website</span>}
          </Link>
          <button onClick={handleLogout} className="sidebar-link" style={{ width: '100%', border: 'none', background: 'none', justifyContent: (sidebarOpen || isMobile) ? 'flex-start' : 'center', color: '#f87171' }}>
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {(sidebarOpen || isMobile) && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <header style={{ height: 60, background: 'var(--color-white)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(o => !o)} className="btn-ghost" style={{ padding: 8 }}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-dark)' }}>{admin?.name || 'Admin'}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-ash)' }}>Owner</div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-lime-dark), var(--color-lime))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-dark)' }}>
              {admin?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: 'auto', padding: isMobile ? 16 : 28 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
