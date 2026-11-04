import { useState, useEffect } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, MessageSquare, ShieldCheck } from 'lucide-react';
import Lenis from 'lenis';

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

  const whatsappUrl = "https://wa.me/919153760277?text=Hello%20Bhakat%20Hardware,%20I%20want%20to%20inquire%20about%20materials.";

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: scrolled ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(15, 23, 42, 0.04)',
        boxShadow: scrolled ? '0 4px 20px -2px rgba(15, 23, 42, 0.05)' : 'none',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: scrolled ? 68 : 80, transition: 'height 0.3s ease' }}>
        
        {/* Logo (Left) */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, background: 'var(--color-dark)', color: 'var(--color-lime)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.15rem', fontFamily: 'var(--font-display)', boxShadow: '0 4px 12px rgba(15,23,42,0.15)' }}>
            BH
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-dark)', letterSpacing: '-0.02em', lineHeight: 1 }}>
              BHAKAT HARDWARE
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--color-ash)', marginTop: 4 }}>
              EST. 2008 • MIDNAPORE
            </span>
          </div>
        </Link>

        {/* Desktop Nav (Center) */}
        <nav className="hidden md:flex" style={{ alignItems: 'center', gap: 32 }}>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA & Mobile Toggle (Right) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="hidden sm:flex items-center gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageSquare size={14} className="text-emerald-700" />
              <span>WhatsApp</span>
            </a>

            <a
              href="tel:+919153760277"
              className="btn-primary"
              style={{ padding: '9px 20px', fontSize: '0.85rem' }}
            >
              <Phone size={14} />
              <span>+91 91537 60277</span>
            </a>
          </div>

          <div className="md:hidden">
            <button className="btn-ghost" onClick={() => setMenuOpen(true)} style={{ padding: 8 }} aria-label="Open navigation menu">
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, background: 'var(--color-dark)', color: 'var(--color-lime)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-display)' }}>BH</div>
                <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-dark)', letterSpacing: '-0.02em' }}>BHAKAT HARDWARE</span>
              </div>
              <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }} aria-label="Close navigation menu">
                <X size={24} color="var(--color-dark)" />
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
              {links.map(l => (
                <NavLink key={l.to} to={l.to} end={l.to === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                  style={{ fontSize: '1.4rem', fontWeight: 700, padding: '12px 0' }}
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-sm"
              >
                <MessageSquare size={18} />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href="tel:+919153760277"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '15px' }}
              >
                <Phone size={18} />
                <span>Call +91 91537 60277</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Footer = () => (
  <footer style={{ background: 'var(--color-white)', borderTop: '1px solid rgba(15,23,42,0.08)', padding: '64px 24px 32px' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, marginBottom: 48 }}>
        <div>
          <div className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-dark)', letterSpacing: '-0.02em', marginBottom: 4 }}>BHAKAT HARDWARE</div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--color-lime-dark)', marginBottom: 16 }}>EST. 2008 • MIDNAPORE</div>
          <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: 16 }}>
            Exclusive authorized distributors for AAC Blocks, waterproofing chemicals, and heavy building supplies across West Bengal.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600, color: '#166534', background: '#f0fdf4', padding: '4px 10px', borderRadius: 999, border: '1px solid #bbf7d0' }}>
            <ShieldCheck size={14} />
            <span>GST Verified & Lab Certified</span>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, color: 'var(--color-dark)', marginBottom: 16, fontSize: '0.85rem', letterSpacing: '0.05em' }}>QUICK NAVIGATION</div>
          {[['/', 'Home'], ['/products', 'Materials & Catalog'], ['/projects', 'Landmark Projects'], ['/contact', 'Contact & Depot']].map(([to, label]) => (
            <Link key={to} to={to} style={{ display: 'block', color: 'var(--color-ash)', textDecoration: 'none', marginBottom: 10, fontSize: '0.875rem', transition: 'color 0.2s' }}
              onMouseOver={e => e.target.style.color = 'var(--color-dark)'}
              onMouseOut={e => e.target.style.color = 'var(--color-ash)'}
            >{label}</Link>
          ))}
        </div>

        <div>
          <div style={{ fontWeight: 700, color: 'var(--color-dark)', marginBottom: 16, fontSize: '0.85rem', letterSpacing: '0.05em' }}>MATERIALS</div>
          {['Autoclaved Aerated Concrete (AAC)', 'MYK Arment Waterproofing', 'MYK Laticrete Tile Adhesives', 'Ready-Mix Plaster & Mortar', 'Glass Fiber Reinforcement Mesh'].map((m, idx) => (
            <div key={idx} style={{ color: 'var(--color-ash)', marginBottom: 8, fontSize: '0.85rem' }}>
              {m}
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontWeight: 700, color: 'var(--color-dark)', marginBottom: 16, fontSize: '0.85rem', letterSpacing: '0.05em' }}>DEPOT & CONTACT</div>
          <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem', marginBottom: 4 }}>Rajardijhi, Jamunabali Basantpur,</p>
          <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem', marginBottom: 14 }}>Midnapore, West Bengal 721102</p>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-dark)', fontWeight: 600, marginBottom: 4 }}>
            <a href="tel:+919153760277" style={{ color: 'inherit', textDecoration: 'none' }}>+91 91537 60277</a>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-dark)', fontWeight: 600, marginBottom: 12 }}>
            <a href="tel:+919434321475" style={{ color: 'inherit', textDecoration: 'none' }}>+91 94343 21475</a>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)' }}>
            Open 7 Days • 8:00 AM – 7:30 PM
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(15,23,42,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ color: 'var(--color-ash)', fontSize: '0.8rem' }}>© 2026 Bhakat Hardware. All rights reserved. Built for Strength.</p>
        <Link to="/admin/login" style={{ color: 'rgba(100,116,139,0.4)', fontSize: '0.75rem', textDecoration: 'none' }}>Portal Login</Link>
      </div>
    </div>
  </footer>
);

const PublicLayout = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: 80 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
