import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Package } from 'lucide-react';

const DEFAULT_MATERIALS = [
  { _id: '1', name: 'Autoclaved Aerated Concrete (AAC) Blocks', category: 'Masonry', brand: 'Ual Kon Crete / Rashmi / Joyce / Biltech', description: 'The modern standard for high-rise construction. Lightweight, heat-resistant, and eco-friendly. We are the exclusive authorized supplier for major projects in Midnapore.', tag: 'Exclusive' },
  { _id: '2', name: 'Liquid Waterproofing', category: 'Waterproofing', brand: 'MYK Arment', description: 'Advanced liquid waterproofing solution. Ideal for roofs, terraces, and basements. Provides a seamless, durable barrier against water ingress.', tag: 'Premium' },
  { _id: '3', name: 'Tile Adhesives & Grouts', category: 'Finishing', brand: 'MYK Laticrete', description: 'Premium tile adhesives and grouts. Engineered for superior bonding, flexibility, and durability. Perfect for both indoor and outdoor applications.', tag: 'Premium' },
  { _id: '4', name: 'Glass Fiber Mesh', category: 'Reinforcement', brand: 'Local', description: 'High-strength glass fiber mesh for crack prevention and structural reinforcement. Ideal for plastering, flooring, and waterproofing applications.', tag: '' },
  { _id: '5', name: 'Redemix Plaster', category: 'Plaster', brand: 'Konarak / Rashmi', description: 'Pre-mixed plaster for smooth and durable finishes. Suitable for both interior and exterior applications. Saves time and ensures consistent quality.', tag: '' },
  { _id: '6', name: 'Breeze Block', category: 'Masonry', brand: 'Local', description: 'Cost-effective alternative to traditional bricks. Made from a mix of cement, sand, and lightweight aggregates. Ideal for non-load-bearing walls and partitions.', tag: '' },
];

const TAG_COLORS = {
  Exclusive: { bg: 'rgba(101,163,13,0.15)', color: 'var(--color-lime-dark)' },
  Premium: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  Local: { bg: 'rgba(168,168,179,0.15)', color: 'var(--color-ash)' },
  Imported: { bg: 'rgba(147,51,234,0.15)', color: '#c084fc' },
  '': { bg: 'transparent', color: 'transparent' },
};

export default function Materials() {
  const [materials, setMaterials] = useState(DEFAULT_MATERIALS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/materials')
      .then(r => { if (r.data.length > 0) setMaterials(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Materials & Products | Bhakat Hardware Midnapore</title>
        <meta name="description" content="Browse our catalog of AAC Blocks, waterproofing, tile adhesives, plaster, reinforcement, and construction materials at Bhakat Hardware." />
      </Helmet>

      {/* Header */}
      <section style={{ paddingTop: 140, paddingBottom: 60, paddingLeft: 24, paddingRight: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(101,163,13,0.07) 0%, transparent 60%)' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', textAlign: 'center' }}>
          <motion.div className="section-label" style={{ justifyContent: 'center' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Our Catalog</motion.div>
          <motion.h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, marginBottom: 20 }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Product <span className="text-gold-gradient">Catalog</span>
          </motion.h1>
          <motion.p style={{ color: 'var(--color-ash)', maxWidth: 500, margin: '0 auto', fontSize: '1.05rem' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            All kinds of building material suppliers. AAC Block, Cement, TMT bar, Bricks, Sand, Stone chips, Pipes & Fittings.
          </motion.p>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: '20px 24px 100px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {materials.map((m, i) => {
              const tagStyle = TAG_COLORS[m.tag] || TAG_COLORS[''];
              return (
                <motion.div key={m._id} className="glass-card" style={{ padding: 20, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  {m.tag && (
                    <div style={{ position: 'absolute', top: 28, right: 28, padding: '4px 12px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', background: tagStyle.bg, color: tagStyle.color, zIndex: 10 }}>
                      {m.tag}
                    </div>
                  )}
                  {m.imageUrl ? (
                    <div style={{ width: '100%', height: 220, borderRadius: 8, overflow: 'hidden', marginBottom: 20, background: 'var(--color-surface)', flexShrink: 0 }}>
                      <img src={m.imageUrl} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                    </div>
                  ) : (
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(101,163,13,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                      <Package size={24} color="var(--color-lime-dark)" />
                    </div>
                  )}
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-lime-dark)', textTransform: 'uppercase', marginBottom: 8 }}>{m.category}</div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 10, lineHeight: 1.4 }}>{m.name}</h3>
                  <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: 16, flex: 1 }}>{m.description}</p>
                  {m.brand && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-ash)', padding: '6px 12px', background: 'rgba(0,0,0,0.04)', borderRadius: 6, display: 'inline-block', alignSelf: 'flex-start' }}>
                      {m.brand}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Contact CTA */}
          <motion.div style={{ textAlign: 'center', marginTop: 80 }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p style={{ color: 'var(--color-ash)', marginBottom: 20 }}>Don't see what you're looking for? We stock much more.</p>
            <a href="/contact" className="btn-primary">Contact for Custom Requirements</a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
