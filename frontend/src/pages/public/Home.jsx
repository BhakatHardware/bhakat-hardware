import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Shield, Star, Clock, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: '15+', label: 'Years of Excellence' },
  { value: '15+', label: 'High-Rise Projects' },
  { value: '50k+', label: 'Metric Tons Supplied' },
  { value: 'WB', label: 'Delivery Radius' },
];

const REASONS = [
  { icon: '✦', title: 'Exclusive AAC Partner', desc: 'The sole authorized distributor for premium AAC blocks in the region. Direct-from-factory rates, zero middleman markup.' },
  { icon: '⚡', title: 'Bulk Logistics', desc: 'Our logistics network is optimized for heavy loads. From truckloads of sand to 50 tons of steel, we handle it all seamlessly.' },
  { icon: '◈', title: 'Authentic Billing', desc: 'Transparency is our core. Every supply comes with authentic GST billing and manufacturer test certificates.' },
];

const REVIEWS = [
  { text: 'The delivered products were of excellent quality. A seamless experience from order to delivery.', rating: 5, author: 'S. Mukherjee' },
  { text: 'Professional behavior and reasonable pricing. Highly recommended for bulk orders.', rating: 5, author: 'R. Banerjee' },
  { text: 'Very helpful and knowledgeable staff. They understand construction requirements perfectly.', rating: 5, author: 'A. Das' },
];

export default function Home() {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const reasonsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animations
      gsap.fromTo('.hero-label', 
        { opacity: 0, x: -20 }, 
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.1 }
      );

      gsap.fromTo('.hero-title span', 
        { y: 120, opacity: 0, rotateX: -25, transformOrigin: '0% 50% -50' }, 
        { y: 0, opacity: 1, rotateX: 0, duration: 1.4, stagger: 0.15, ease: 'expo.out', delay: 0.2 }
      );

      gsap.fromTo('.hero-sub', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1.2, delay: 0.7, ease: 'power3.out' }
      );

      gsap.fromTo('.hero-cta', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 1, delay: 0.9, ease: 'power3.out' }
      );

      gsap.fromTo('.hero-trust', 
        { opacity: 0 }, 
        { opacity: 1, duration: 1, delay: 1.1, ease: 'power2.out' }
      );

      gsap.fromTo('.hero-visual',
        { opacity: 0, scale: 0.9, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 1.5, delay: 0.4, ease: 'expo.out' }
      );

      // Floating animation for visual elements
      gsap.to('.float-element-1', {
        y: -15, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut'
      });
      gsap.to('.float-element-2', {
        y: 15, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1
      });

      // Stats Parallax
      gsap.fromTo('.stat-item', 
        { opacity: 0, y: 40 }, 
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: statsRef.current, start: 'top 85%' } }
      );

      // Reasons Stagger
      gsap.fromTo('.reason-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: reasonsRef.current, start: 'top 80%' } }
      );

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>Bhakat Hardware | Premium Construction Materials</title>
        <meta name="description" content="Exclusive authorized partner for AAC Blocks in Midnapore. Premium construction materials and building supplies. Est. 2008." />
      </Helmet>

      <div ref={heroRef} style={{ background: 'var(--color-off-white)' }}>
        {/* HERO SECTION */}
        <section style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          position: 'relative', 
          overflow: 'hidden', 
          paddingTop: 80 
        }}>
          {/* Extremely subtle, elegant background gradients */}
          <div style={{ 
            position: 'absolute', inset: 0, 
            background: 'radial-gradient(circle at 15% 50%, rgba(15, 23, 42, 0.02) 0%, transparent 50%), radial-gradient(circle at 85% 30%, rgba(0, 0, 0, 0.015) 0%, transparent 50%)' 
          }} />

          {/* Very light, sophisticated grid */}
          <div style={{ 
            position: 'absolute', inset: 0, 
            backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)', 
            backgroundSize: '80px 80px', 
            opacity: 0.8,
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)'
          }} />

          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px', position: 'relative', zIndex: 1, width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 60, alignItems: 'center' }}>
              
              {/* Left Content */}
              <div>
                <div className="hero-label section-label" style={{ 
                  color: 'var(--color-ash)', fontSize: '0.75rem', letterSpacing: '0.15em', 
                  display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32,
                  textTransform: 'uppercase'
                }}>
                  <div style={{ width: 30, height: 1, background: 'var(--color-ash)' }} />
                  EST. 2008 • MIDNAPORE
                </div>

                <h1 className="font-display hero-title" style={{ 
                  fontSize: 'clamp(3.5rem, 6.5vw, 6rem)', 
                  fontWeight: 500, 
                  lineHeight: 1.05, 
                  marginBottom: 32, 
                  letterSpacing: '-0.04em',
                  perspective: '1000px'
                }}>
                  <span style={{ display: 'block', color: 'var(--color-dark)' }}>Bhakat</span>
                  <span style={{ display: 'block', color: 'var(--color-ash)' }}>Hardware.</span>
                </h1>

                <div className="hero-sub" style={{ marginBottom: 48, maxWidth: 540 }}>
                  <p style={{ 
                    fontSize: '1.15rem', 
                    color: 'var(--color-dark-muted)', 
                    lineHeight: 1.7,
                    fontWeight: 400
                  }}>
                    The foundation of modern living. We are the exclusive authorized partner for premium AAC Blocks and high-grade construction materials, bridging the gap between manufacturers and your site.
                  </p>
                </div>

                <div className="hero-cta" style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Link to="/products" className="btn-primary" style={{ 
                    background: 'var(--color-dark)', color: 'var(--color-white)', 
                    padding: '16px 36px', borderRadius: '100px', fontWeight: 500,
                    letterSpacing: '-0.01em'
                  }}>
                    Explore Materials
                  </Link>
                  <Link to="/contact" className="btn-ghost" style={{ 
                    color: 'var(--color-dark)', padding: '16px 24px', fontWeight: 500 
                  }}>
                    Contact Sales <ChevronRight size={16} />
                  </Link>
                </div>

                {/* Trust indicators - Elegant minimalist versions */}
                <div className="hero-trust" style={{ 
                  display: 'flex', gap: 32, marginTop: 60, paddingTop: 32, 
                  borderTop: '1px solid rgba(15, 23, 42, 0.08)' 
                }}>
                  {[
                    { icon: Shield, text: 'GST Verified' },
                    { icon: Star, text: 'Google 4.8★' },
                    { icon: Clock, text: 'Open Till 7:30 PM' }
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <item.icon size={16} strokeWidth={1.5} color="var(--color-dark)" />
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-dark-muted)', fontWeight: 500 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side visual - Premium abstract composition */}
              <div className="hero-visual" style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
                <div style={{ 
                  width: '100%', maxWidth: 440, aspectRatio: '4/5', 
                  background: 'var(--color-white)',
                  borderRadius: '24px',
                  boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.04)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* Subtle inner gradient */}
                  <div style={{ 
                    position: 'absolute', inset: 0, 
                    background: 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(241,245,249,0.6) 100%)' 
                  }} />
                  
                  {/* Wireframe / architectural graphic */}
                  <div style={{
                    position: 'absolute', inset: '10%',
                    border: '1px solid rgba(15, 23, 42, 0.05)',
                    borderRadius: '12px'
                  }} />
                  <div style={{
                    position: 'absolute', inset: '20%',
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    borderRadius: '8px'
                  }} />
                  
                  <h2 className="font-display" style={{ 
                    fontSize: '12rem', color: 'rgba(15, 23, 42, 0.03)', 
                    fontWeight: 700, letterSpacing: '-0.05em', zIndex: 1 
                  }}>
                    BH
                  </h2>

                  {/* Floating minimalist badges */}
                  <div className="float-element-1" style={{ 
                    position: 'absolute', top: 40, left: -20, 
                    background: 'var(--color-dark)', color: 'var(--color-white)',
                    padding: '12px 20px', borderRadius: '100px',
                    boxShadow: '0 10px 20px rgba(15, 23, 42, 0.1)',
                    display: 'flex', alignItems: 'center', gap: 10
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.02em' }}>Authorized AAC</span>
                  </div>

                  <div className="float-element-2" style={{ 
                    position: 'absolute', bottom: 60, right: -20, 
                    background: 'var(--color-white)', color: 'var(--color-dark)',
                    padding: '14px 24px', borderRadius: '16px',
                    boxShadow: '0 15px 30px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.04)',
                  }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)', marginBottom: 4 }}>Bulk Supply</div>
                    <div className="font-display" style={{ fontSize: '1.25rem', fontWeight: 600 }}>50k+ MT</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* STATS SECTION - Minimalist */}
        <section ref={statsRef} style={{ 
          padding: '80px 24px', 
          borderTop: '1px solid rgba(15, 23, 42, 0.06)',
          borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
          background: 'var(--color-white)'
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
            {STATS.map((s, i) => (
              <div key={i} className="stat-item" style={{ textAlign: 'center' }}>
                <div className="font-display" style={{ 
                  fontSize: '3.5rem', fontWeight: 400, color: 'var(--color-dark)', 
                  letterSpacing: '-0.03em', lineHeight: 1 
                }}>
                  {s.value}
                </div>
                <div style={{ 
                  fontSize: '0.85rem', color: 'var(--color-ash)', 
                  marginTop: 12, letterSpacing: '0.05em', textTransform: 'uppercase',
                  fontWeight: 500
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WHY US - Elegant Grid */}
        <section ref={reasonsRef} style={{ padding: '120px 24px', background: 'var(--color-off-white)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <div className="section-label" style={{ 
                color: 'var(--color-ash)', fontSize: '0.75rem', letterSpacing: '0.15em', 
                display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 24,
                textTransform: 'uppercase'
              }}>
                <div style={{ width: 30, height: 1, background: 'var(--color-ash)' }} />
                The Bhakat Advantage
                <div style={{ width: 30, height: 1, background: 'var(--color-ash)' }} />
              </div>
              <h2 className="font-display" style={{ 
                fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500, 
                color: 'var(--color-dark)', letterSpacing: '-0.02em',
                maxWidth: 600, margin: '0 auto'
              }}>
                Uncompromising Quality. <br/><span style={{ color: 'var(--color-ash)' }}>Unmatched Scale.</span>
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
              {REASONS.map((r, i) => (
                <div key={i} className="reason-card" style={{ 
                  padding: '48px 40px', 
                  background: 'var(--color-white)', 
                  borderRadius: '20px',
                  boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.02), 0 2px 4px -1px rgba(15, 23, 42, 0.02)',
                  border: '1px solid rgba(15, 23, 42, 0.04)',
                  transition: 'transform 0.4s ease, box-shadow 0.4s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px -12px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(15, 23, 42, 0.02), 0 2px 4px -1px rgba(15, 23, 42, 0.02)';
                }}
                >
                  <div style={{ 
                    fontSize: '1.5rem', color: 'var(--color-dark)', marginBottom: 32,
                    width: 48, height: 48, borderRadius: '12px',
                    background: 'var(--color-surface)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                  }}>{r.icon}</div>
                  <h3 className="font-display" style={{ fontWeight: 600, fontSize: '1.25rem', marginBottom: 16, color: 'var(--color-dark)' }}>{r.title}</h3>
                  <p style={{ color: 'var(--color-ash)', fontSize: '0.95rem', lineHeight: 1.7, fontWeight: 400 }}>{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER - Sleek Dark Mode */}
        <section style={{ padding: '40px 24px 100px', background: 'var(--color-off-white)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <motion.div
              style={{ 
                padding: '80px 48px', 
                textAlign: 'center', 
                position: 'relative', 
                overflow: 'hidden', 
                background: 'var(--color-dark)',
                color: 'var(--color-white)',
                borderRadius: '32px'
              }}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              {/* Subtle light effect */}
              <div style={{ 
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: '80%', height: '100%', 
                background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.08) 0%, transparent 60%)',
                pointerEvents: 'none'
              }} />

              <h2 className="font-display" style={{ 
                fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 500, marginBottom: 24,
                letterSpacing: '-0.02em', position: 'relative', zIndex: 1
              }}>
                Ready to build something <span style={{ color: 'rgba(255,255,255,0.5)' }}>extraordinary?</span>
              </h2>
              <p style={{ 
                color: 'rgba(255,255,255,0.7)', marginBottom: 48, fontSize: '1.1rem', 
                maxWidth: 600, margin: '0 auto 48px', fontWeight: 300,
                position: 'relative', zIndex: 1
              }}>
                Secure the foundation of your project with Midnapore's most trusted material supplier. Request a comprehensive quote today.
              </p>
              <Link to="/contact" className="btn-primary" style={{ 
                fontSize: '1rem', padding: '16px 40px', background: 'var(--color-white)', 
                color: 'var(--color-dark)', borderRadius: '100px', fontWeight: 500,
                position: 'relative', zIndex: 1
              }}>
                Get a Bulk Quote <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* REVIEWS SECTION - Elegant Minimalist */}
        <section style={{ padding: '0px 24px 100px', background: 'var(--color-off-white)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ marginBottom: 60, textAlign: 'center' }}>
              <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 500, color: 'var(--color-dark)', letterSpacing: '-0.02em' }}>
                Client Testimonials
              </h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
              {REVIEWS.map((r, i) => (
                <div key={i} style={{ 
                  padding: '40px', background: 'var(--color-white)', borderRadius: '20px',
                  border: '1px solid rgba(15, 23, 42, 0.04)',
                  boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.02)'
                }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} size={14} fill="var(--color-dark)" color="var(--color-dark)" />
                    ))}
                  </div>
                  <p style={{ color: 'var(--color-dark-muted)', fontSize: '1rem', lineHeight: 1.8, marginBottom: 24, fontStyle: 'italic', fontWeight: 300 }}>
                    "{r.text}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, fontSize: '0.9rem', color: 'var(--color-dark)' }}>
                      {r.author.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-dark)' }}>{r.author}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)' }}>Verified Client</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
