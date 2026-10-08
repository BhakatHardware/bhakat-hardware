import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Shield, Truck, FileCheck, Star, MapPin, Phone, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: '15+', label: 'Years of Establishment' },
  { value: '15+', label: 'High-Rise Projects' },
  { value: '50k+', label: 'Metric Tons Supplied' },
  { value: 'WB', label: 'Delivery Radius' },
];

const REASONS = [
  { icon: '★', title: 'Exclusive AAC Partner', desc: 'We are the sole authorized distributor for premium AAC blocks in the region. Get direct-from-factory rates without the middleman markup.' },
  { icon: '🚛', title: 'Bulk Logistics', desc: 'Our logistics network is optimized for heavy loads. Whether it\'s a truckload of sand or 50 tons of steel, we handle the transport so you don\'t have to.' },
  { icon: '🤝', title: 'Authentic Billing', desc: 'Transparency is our core. Every bag of cement and every rod of steel comes with authentic GST billing and manufacturer test certificates.' },
];

const REVIEWS = [
  { text: 'The delivered products were of good quality.', rating: 5 },
  { text: 'Good behavior and reasonable price of the product.', rating: 4 },
  { text: 'Very helpful and knowledgeable staff. Great service!', rating: 5 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } })
};

export default function Home() {
  const heroRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-title span', { y: 100, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power4.out', delay: 0.3
      });
      gsap.fromTo('.hero-sub', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: 'power3.out' });
      gsap.fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 1.1, ease: 'power3.out' });

      gsap.fromTo('.stat-item', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: statsRef.current, start: 'top 80%' }
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>Bhakat Hardware | Midnapore's #1 Construction Material Supplier</title>
        <meta name="description" content="Bhakat Hardware - Exclusive authorized partner for AAC Blocks in Midnapore. Premium construction materials, tools, and building supplies. Est. 2008." />
      </Helmet>

      <div ref={heroRef}>
        {/* HERO */}
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 80 }}>
          {/* BG Gradient */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(101,163,13,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(163,230,53,0.4) 0%, transparent 60%)' }} />

          {/* Grid pattern */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(101,163,13,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(101,163,13,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px', opacity: 0.6 }} />

          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="hero-grid">
              <div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <div className="section-label">Est. 2008 · Midnapore</div>
                </motion.div>

                <h1 className="font-display hero-title" style={{ fontSize: 'clamp(3.5rem, 7vw, 6rem)', fontWeight: 800, lineHeight: 1, marginBottom: 24, overflow: 'hidden', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                  <span style={{ display: 'block', color: 'var(--color-dark)' }}>Bhakat</span>
                  <span style={{ display: 'block' }} className="text-gold-gradient">Hardware.</span>
                </h1>

                <div className="hero-sub" style={{ marginBottom: 40, maxWidth: 520 }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 12 }}>
                    The Foundation of Modern Living.
                  </div>
                  <p style={{ fontSize: '1.05rem', color: 'var(--color-ash)', lineHeight: 1.8 }}>
                    The exclusive authorized partner for AAC Blocks and high-grade construction materials in Midnapore. We bridge the gap between major manufacturers and your construction site.
                  </p>
                </div>

                <div className="hero-cta" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <Link to="/products" className="btn-primary">
                    View Catalog <ArrowRight size={16} />
                  </Link>
                  <Link to="/contact" className="btn-outline">
                    Talk to Owner
                  </Link>
                </div>

                {/* Trust indicators */}
                <div style={{ display: 'flex', gap: 24, marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Shield size={16} color="var(--color-lime-dark)" />
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-ash)' }}>GST Verified</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Star size={16} color="var(--color-lime-dark)" />
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-ash)' }}>Google 3.5★</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Clock size={16} color="var(--color-lime-dark)" />
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-ash)' }}>Open Till 7:30 PM</span>
                  </div>
                </div>
              </div>

              {/* Right side visual */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="animate-float" style={{ position: 'relative' }}>
                  <div style={{
                    width: 340, height: 340, borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 30%, rgba(101,163,13,0.15), rgba(163,230,53,0.3))',
                    border: '1px solid rgba(101,163,13,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{ fontSize: '7rem', lineHeight: 1, filter: 'drop-shadow(0 0 40px rgba(101,163,13,0.3))' }}>🏗️</div>
                    <div style={{
                      position: 'absolute', top: 20, right: 20,
                      background: 'var(--color-lime-dark)', color: 'var(--color-dark)',
                      padding: '8px 14px', borderRadius: 8, fontWeight: 800, fontSize: '0.8rem',
                    }}>EXCLUSIVE</div>
                  </div>
                  {/* Floating badges */}
                  <div className="glass-card" style={{ position: 'absolute', bottom: 20, left: -40, padding: '12px 16px', borderRadius: 12 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)' }}>AAC Blocks</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-lime-dark)' }}>Authorized</div>
                  </div>
                  <div className="glass-card" style={{ position: 'absolute', top: 40, right: -30, padding: '12px 16px', borderRadius: 12 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)' }}>Bulk Supply</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-dark)' }}>50k+ MT</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section ref={statsRef} style={{ padding: '60px 24px', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', background: 'rgba(101,163,13,0.02)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 40 }}>
            {STATS.map((s, i) => (
              <div key={i} className="stat-item" style={{ textAlign: 'center' }}>
                <div className="font-display text-gold-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-ash)', marginTop: 8, letterSpacing: '0.05em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* WHY US */}
        <section style={{ padding: '100px 24px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div variants={fadeUp} className="section-label" style={{ marginBottom: 16 }}>Why Choose Us</motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="font-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 800, marginBottom: 16 }}>
                Why Builders <span className="text-gold-gradient">Trust Us</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} style={{ color: 'var(--color-ash)', marginBottom: 60, maxWidth: 500 }}>
                Over 15 years of delivering quality and trust to construction sites across Midnapore.
              </motion.p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {REASONS.map((r, i) => (
                <motion.div key={i} className="glass-card" style={{ padding: 32 }}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: 20 }}>{r.icon}</div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 12 }}>{r.title}</h3>
                  <p style={{ color: 'var(--color-ash)', fontSize: '0.9rem', lineHeight: 1.7 }}>{r.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section style={{ padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <motion.div
              className="glass-card"
              style={{ padding: '60px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(101,163,13,0.08), rgba(163,230,53,0.3))' }}
              initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            >
              <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(101,163,13,0.06)', filter: 'blur(40px)' }} />
              <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, marginBottom: 16 }}>
                Building Something <span className="text-gold-gradient">Big?</span>
              </h2>
              <p style={{ color: 'var(--color-ash)', marginBottom: 36, fontSize: '1.05rem', maxWidth: 500, margin: '0 auto 36px' }}>
                Don't compromise on your foundation. Get a quote for your project's complete material requirement today.
              </p>
              <Link to="/contact" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 36px' }}>
                Get a Bulk Quote <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* REVIEWS */}
        <section style={{ padding: '80px 24px 100px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div className="section-label">Customer Reviews</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, marginBottom: 48 }}>
              What People Say
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
              {REVIEWS.map((r, i) => (
                <motion.div key={i} className="glass-card-light" style={{ padding: 28 }}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                >
                  <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} size={16} fill="var(--color-lime-dark)" color="var(--color-lime-dark)" />
                    ))}
                  </div>
                  <p style={{ color: 'var(--color-ash)', fontSize: '0.9rem', lineHeight: 1.7, fontStyle: 'italic' }}>"{r.text}"</p>
                  <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-lime-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-dark)' }}>G</div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-ash)' }}>Google Review</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
