import { useState, useEffect } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Materials' },
    { to: '/projects', label: 'Projects' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 20px -2px rgba(0,0,0,0.03)' : 'none',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: scrolled ? 70 : 84, transition: 'height 0.4s ease' }}>
        
        {/* Logo (Left) */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
          <div style={{ width: 42, height: 42, background: 'var(--color-dark)', color: 'var(--color-lime)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--font-display)', boxShadow: '0 4px 12px rgba(15,23,42,0.15)' }}>
            BH
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-dark)', letterSpacing: '-0.02em', lineHeight: 1 }}>
              BHAKAT HARDWARE
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--color-ash)', marginTop: 4 }}>
              EST. 2008
            </span>
          </div>
        </Link>

        {/* Desktop Nav (Center) */}
        <nav className="hidden md:flex" style={{ flex: 2, justifyContent: 'center', alignItems: 'center', gap: 36 }}>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA & Mobile Toggle (Right) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16, flex: 1 }}>
          <div className="hidden md:block">
            <a href="tel:+919153760277" className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>
              <Phone size={14} />
              Call Now
            </a>
          </div>
          <div className="md:hidden">
            <button className="btn-ghost" onClick={() => setMenuOpen(true)} style={{ padding: 8 }}>
              <Menu size={24} color="var(--color-dark)" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'tween', duration: 0.2 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              background: 'var(--color-white)', padding: 24,
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, background: 'var(--color-dark)', color: 'var(--color-lime)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-display)' }}>BH</div>
                <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-dark)', letterSpacing: '-0.02em' }}>BHAKAT HARDWARE</span>
              </div>
              <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
                <X size={24} color="var(--color-dark)" />
              </button>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {links.map(l => (
                <NavLink key={l.to} to={l.to} end={l.to === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                  style={{ fontSize: '1.5rem', fontWeight: 700, padding: '12px 0' }}
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
            <div style={{ marginTop: 'auto' }}>
              <a href="tel:+919153760277" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>
                <Phone size={18} /> Call Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Footer = () => (
  <footer style={{ background: 'var(--color-white)', borderTop: '1px solid rgba(101,163,13,0.1)', padding: '60px 24px 30px' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
        <div>
          <div className="font-display" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-dark)', letterSpacing: '0.05em', marginBottom: 4 }}>BHAKAT HARDWARE</div>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', color: 'var(--color-lime-dark)', marginBottom: 16 }}>EST. 2008 · MIDNAPORE</div>
          <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem', lineHeight: 1.7 }}>
            The backbone of Midnapore's skyline. Exclusive suppliers of AAC Blocks and heavy construction materials.
          </p>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--color-dark)', marginBottom: 16, fontSize: '0.875rem', letterSpacing: '0.05em' }}>QUICK LINKS</div>
          {[['/', 'Home'], ['/products', 'Materials'], ['/projects', 'Projects'], ['/contact', 'Contact']].map(([to, label]) => (
            <Link key={to} to={to} style={{ display: 'block', color: 'var(--color-ash)', textDecoration: 'none', marginBottom: 8, fontSize: '0.875rem', transition: 'color 0.2s' }}
              onMouseOver={e => e.target.style.color = 'var(--color-lime-dark)'}
              onMouseOut={e => e.target.style.color = 'var(--color-ash)'}
            >{label}</Link>
          ))}
        </div>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--color-dark)', marginBottom: 16, fontSize: '0.875rem', letterSpacing: '0.05em' }}>GET IN TOUCH</div>
          <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem', marginBottom: 8 }}>Rajardijhi, Jamunabali Basantpur,</p>
          <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem', marginBottom: 16 }}>Midnapore, West Bengal 721102</p>
          <a href="tel:+919153760277" style={{ color: 'var(--color-lime-dark)', textDecoration: 'none', fontSize: '0.875rem', display: 'block', marginBottom: 4 }}>+91 91537 60277</a>
          <a href="tel:+919434321475" style={{ color: 'var(--color-lime-dark)', textDecoration: 'none', fontSize: '0.875rem', display: 'block' }}>+91 94343 21475</a>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ color: 'var(--color-ash)', fontSize: '0.8rem' }}>© 2026 Bhakat Hardware. Built for Strength.</p>
        <Link to="/admin/login" style={{ color: 'rgba(168,168,179,0.3)', fontSize: '0.75rem', textDecoration: 'none' }}>Admin</Link>
      </div>
    </div>
  </footer>
);

const PublicLayout = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Navbar />
    <main style={{ flex: 1 }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PublicLayout;
