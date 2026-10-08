import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Building2, MapPin, Calendar } from 'lucide-react';

const DEFAULT_PROJECTS = [
  { _id: '1', title: 'Residential High-Rise Complex', location: 'Midnapore', completionYear: 2024, category: 'Residential', description: 'Multi-story residential building featuring AAC block construction for superior insulation and earthquake resistance.', materials: ['AAC Blocks', 'TMT Steel', 'Cement', 'Sand'] },
  { _id: '2', title: 'Commercial Shopping Complex', location: 'Kharagpur', completionYear: 2023, category: 'Commercial', description: 'Large-scale commercial construction with premium waterproofing and tile installations throughout.', materials: ['AAC Blocks', 'Waterproofing', 'Tile Adhesive'] },
  { _id: '3', title: 'Government Housing Project', location: 'Midnapore', completionYear: 2023, category: 'Infrastructure', description: 'Bulk supply of construction materials for government housing scheme serving hundreds of families.', materials: ['Bricks', 'Cement', 'TMT Steel', 'Sand', 'Stone Chips'] },
];

const CAT_COLORS = {
  Residential: '#C9A84C',
  Commercial: '#60a5fa',
  Industrial: '#f87171',
  Infrastructure: '#4ade80',
  Other: '#c084fc',
};

export default function Projects() {
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);

  useEffect(() => {
    axios.get('/api/projects')
      .then(r => { if (r.data.length > 0) setProjects(r.data); })
      .catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>Projects | Bhakat Hardware - Completed Construction Projects Midnapore</title>
        <meta name="description" content="View completed construction projects supplied by Bhakat Hardware across Midnapore and West Bengal. High-rise buildings, commercial complexes, and infrastructure projects." />
      </Helmet>

      {/* Header */}
      <section style={{ paddingTop: 140, paddingBottom: 60, paddingLeft: 24, paddingRight: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(163,230,53,0.3) 0%, transparent 60%)' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', textAlign: 'center' }}>
          <motion.div className="section-label" style={{ justifyContent: 'center' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Our Work</motion.div>
          <motion.h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, marginBottom: 20 }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Completed <span className="text-gold-gradient">Projects</span>
          </motion.h1>
          <motion.p style={{ color: 'var(--color-ash)', maxWidth: 500, margin: '0 auto', fontSize: '1.05rem' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            15+ high-rise projects and counting. We take pride in every structure we've helped build across Midnapore.
          </motion.p>
        </div>
      </section>

      {/* Projects Grid */}
      <section style={{ padding: '20px 24px 100px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 28 }}>
            {projects.map((p, i) => (
              <motion.div key={p._id} className="glass-card" style={{ overflow: 'hidden' }}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                {/* Image placeholder / actual image */}
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: 180, background: 'linear-gradient(135deg, rgba(163,230,53,0.5), rgba(101,163,13,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <Building2 size={48} color="rgba(101,163,13,0.3)" />
                    <div style={{ position: 'absolute', top: 16, left: 16, padding: '4px 12px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700, background: `${CAT_COLORS[p.category]}22`, color: CAT_COLORS[p.category] }}>
                      {p.category}
                    </div>
                  </div>
                )}

                <div style={{ padding: 28 }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 12, lineHeight: 1.4 }}>{p.title}</h3>
                  <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: 20 }}>{p.description}</p>

                  <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                    {p.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--color-ash)' }}>
                        <MapPin size={13} color="var(--color-lime-dark)" />
                        {p.location}
                      </div>
                    )}
                    {p.completionYear && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--color-ash)' }}>
                        <Calendar size={13} color="var(--color-lime-dark)" />
                        {p.completionYear}
                      </div>
                    )}
                  </div>

                  {p.materials && p.materials.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {p.materials.map((m, j) => (
                        <span key={j} style={{ padding: '3px 10px', borderRadius: 100, fontSize: '0.7rem', background: 'rgba(101,163,13,0.08)', color: 'var(--color-lime-dark)' }}>{m}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {projects.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--color-ash)' }}>
              <Building2 size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p>Projects will appear here once added by the owner.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
