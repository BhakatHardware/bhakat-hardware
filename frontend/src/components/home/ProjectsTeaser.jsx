import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, MapPin, ArrowRight, Layers } from 'lucide-react';

const FEATURED_PROJECTS = [
  {
    title: 'Residential High-Rise Complex',
    location: 'Midnapore Sadar',
    type: 'Multi-Story Residential',
    scope: 'AAC Blocks, TMT Steel & Thin-Bed Jointing Mortar',
    badge: '10+ Stories'
  },
  {
    title: 'Commercial Shopping Complex',
    location: 'Kharagpur',
    type: 'Commercial Infra',
    scope: 'Waterproofing, AAC Blocks & Large Format Tile Adhesives',
    badge: 'High Footfall'
  },
  {
    title: 'Hospital & Institutional Wing',
    location: 'West Midnapore',
    type: 'Healthcare & Public',
    scope: 'Acoustic AAC Blocks & Chemical Waterproofing',
    badge: 'Certified Spec'
  },
];

export default function ProjectsTeaser() {
  return (
    <section className="py-20 md:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-md mb-3">
              Landmark Portfolio
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Supplying Midnapore's Most Ambitious Structures
            </h2>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-lime-700 transition-colors group shrink-0"
          >
            <span>Explore All Projects</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Projects Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {FEATURED_PROJECTS.map((proj, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-2xl transition-all duration-300 flex flex-col justify-between"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)'
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-800 flex items-center justify-center shadow-2xs">
                    <Building2 size={20} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-full shadow-2xs">
                    {proj.badge}
                  </span>
                </div>

                <div className="text-xs font-semibold text-lime-700 uppercase tracking-wider mb-1">
                  {proj.type}
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
                  {proj.title}
                </h3>
                
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
                  <MapPin size={13} className="text-slate-400" />
                  <span>{proj.location}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/80">
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <Layers size={14} className="text-lime-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{proj.scope}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
