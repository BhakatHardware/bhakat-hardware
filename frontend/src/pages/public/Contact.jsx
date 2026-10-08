import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react';

const CONTACT_INFO = [
  { icon: Phone, title: 'Phone', lines: ['+91 91537 60277', '+91 94343 21475'], action: 'tel:+919153760277' },
  { icon: Mail, title: 'Email', lines: ['pappu.3790@gmail.com'], action: 'mailto:pappu.3790@gmail.com' },
  { icon: MapPin, title: 'Address', lines: ['Rajardijhi, Jamunabali Basantpur,', 'Midnapore, West Bengal 721102'], action: 'https://www.google.com/maps/search/?api=1&query=Bhakat+Hardware&query_place_id=ChIJSTnjCQ9bHToRp9GGGwvi_As' },
  { icon: Clock, title: 'Hours', lines: ['Mon – Sat: 8:00 AM – 7:30 PM', 'Sunday: Closed'] },
];

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact Bhakat Hardware | Call or Visit Our Store in Midnapore</title>
        <meta name="description" content="Contact Susmit Bhakat at Bhakat Hardware. Phone: +91 91537 60277. Located at Rajardijhi, Jamunabali Basantpur, Midnapore, West Bengal 721102." />
      </Helmet>

      {/* Header */}
      <section style={{ paddingTop: 140, paddingBottom: 60, paddingLeft: 24, paddingRight: 24, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(101,163,13,0.06) 0%, transparent 60%)' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', textAlign: 'center' }}>
          <motion.div className="section-label" style={{ justifyContent: 'center' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Get in Touch</motion.div>
          <motion.h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, marginBottom: 20 }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Start Your <span className="text-gold-gradient">Project</span>
          </motion.h1>
          <motion.p style={{ color: 'var(--color-ash)', maxWidth: 500, margin: '0 auto', fontSize: '1.05rem' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Ready to build? Contact Susmit Bhakat directly for bulk rates and logistics planning.
          </motion.p>
        </div>
      </section>

      {/* Owner Card */}
      <section style={{ padding: '0 24px 60px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <motion.div className="glass-card" style={{ padding: '40px 48px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(101,163,13,0.06), rgba(163,230,53,0.2))' }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-lime-dark), var(--color-lime))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '2rem', fontWeight: 800, color: 'var(--color-dark)' }}>
              SB
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--color-lime-dark)', textTransform: 'uppercase', marginBottom: 8 }}>Owner / Proprietor</div>
            <h2 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 24 }}>Susmit Bhakat</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              <a href="tel:+919153760277" className="btn-primary">
                <Phone size={16} /> Call Now
              </a>
              <a href="tel:+919434321475" className="btn-outline">
                +91 94343 21475
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Grid */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 60 }}>
            {CONTACT_INFO.map((item, i) => (
              <motion.div key={i} className="glass-card" style={{ padding: 28 }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(101,163,13,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <item.icon size={20} color="var(--color-lime-dark)" />
                </div>
                <div style={{ fontWeight: 700, marginBottom: 10, fontSize: '0.9rem' }}>{item.title}</div>
                {item.lines.map((line, j) => (
                  <div key={j} style={{ fontSize: '0.875rem', color: 'var(--color-ash)', marginBottom: 4, lineHeight: 1.5 }}>
                    {item.action && j === 0 ? (
                      <a href={item.action} target={item.action.startsWith('http') ? '_blank' : undefined}
                        style={{ color: 'var(--color-lime-dark)', textDecoration: 'none' }} rel="noreferrer">{line}</a>
                    ) : line}
                  </div>
                ))}
                {item.action && item.action.startsWith('http') && (
                  <a href={item.action} target="_blank" rel="noreferrer" className="btn-ghost" style={{ marginTop: 12, padding: '6px 0', fontSize: '0.8rem', gap: 4 }}>
                    View on Maps <ExternalLink size={12} />
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          {/* Map Embed */}
          <motion.div className="glass-card" style={{ overflow: 'hidden', borderRadius: 16 }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Bhakat Hardware</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-ash)' }}>Rajardijhi, Jamunabali Basantpur, West Bengal 721102</div>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Bhakat+Hardware&query_place_id=ChIJSTnjCQ9bHToRp9GGGwvi_As"
                target="_blank" rel="noreferrer" className="btn-outline" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                <ExternalLink size={14} /> Google Maps
              </a>
            </div>
            <iframe
              src="https://maps.google.com/maps?q=Rajardijhi,+Jamunabali+Basantpur,+West+Bengal+721102&output=embed"
              width="100%" height="350" style={{ border: 0, display: 'block', filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              title="Bhakat Hardware Location"
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}
