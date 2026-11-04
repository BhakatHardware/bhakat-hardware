import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Droplets, Grid, Wrench, Shield, Check } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'aac-blocks',
    name: 'AAC Lightweight Blocks',
    brand: 'Ual Kon Crete • Rashmi • Biltech',
    icon: Layers,
    tag: 'Authorized Partner',
    tagColor: 'bg-lime-100 text-lime-800 border-lime-200',
    description: 'Grade-1 Autoclaved Aerated Concrete blocks. 65% lighter than red bricks with 4-hour fire rating and high thermal comfort.',
    features: ['Direct Factory Wholesale', 'High Compressive Strength', 'Uniform 4", 6", 8", 9" Sizes'],
    whatsappMsg: 'Hello Bhakat Hardware, I need a price quote for AAC Blocks with delivery in Midnapore.'
  },
  {
    id: 'waterproofing',
    name: 'Waterproofing Solutions',
    brand: 'MYK Arment',
    icon: Droplets,
    tag: 'High Performance',
    tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Advanced elastomeric and crystalline coatings for roofs, basements, swimming pools, and sunken slabs against water seepage.',
    features: ['Seamless Membrane', 'UV & Weather Proof', 'Basement & Terrace Safe'],
    whatsappMsg: 'Hello Bhakat Hardware, I want to inquire about MYK Arment waterproofing chemicals.'
  },
  {
    id: 'tile-adhesives',
    name: 'Tile Adhesives & Grouts',
    brand: 'MYK Laticrete',
    icon: Grid,
    tag: 'Heavy Duty',
    tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    description: 'Polymer-fortified tile and stone adhesives engineered for vitreous, porcelain, large-format marble, and swimming pools.',
    features: ['Zero Tile Debonding', 'Water & Shock Resistant', 'Interior & Exterior Grades'],
    whatsappMsg: 'Hello Bhakat Hardware, I want to inquire about MYK Laticrete Tile Adhesives and Epoxy Grouts.'
  },
  {
    id: 'ready-mix-plaster',
    name: 'Ready-Mix Plaster & Mortar',
    brand: 'Konarak • Rashmi Ready Plaster',
    icon: Layers,
    tag: 'Pre-Blended',
    tagColor: 'bg-amber-50 text-amber-800 border-amber-200',
    description: 'Scientifically graded sand and cement mortar designed specifically for thin-bed AAC block jointing and ultra-smooth plaster.',
    features: ['Thin-bed 3mm Jointing', 'Negligible Curing Required', 'Zero Plaster Cracking'],
    whatsappMsg: 'Hello Bhakat Hardware, I would like rates for AAC Block Jointing Mortar and Ready-mix Plaster.'
  },
  {
    id: 'fiber-mesh',
    name: 'Glass Fiber Reinforcement',
    brand: 'Industrial Grade Mesh',
    icon: Shield,
    tag: 'Crack Prevention',
    tagColor: 'bg-purple-50 text-purple-800 border-purple-200',
    description: 'High tensile alkali-resistant fiberglass mesh for joints between concrete columns and AAC blocks to eliminate wall cracks.',
    features: ['Alkali Resistant Coated', 'High Tensile Endurance', 'Eliminates Stress Cracks'],
    whatsappMsg: 'Hello Bhakat Hardware, please share rates for Fiberglass Mesh and Binding Wire.'
  },
  {
    id: 'hardware-tools',
    name: 'Tools & Construction Hardware',
    brand: 'Certified Brands',
    icon: Wrench,
    tag: 'Direct Supply',
    tagColor: 'bg-slate-100 text-slate-800 border-slate-200',
    description: 'Comprehensive inventory of notched trowels, block cutters, plumbing fittings, heavy fasteners, and site safety supplies.',
    features: ['Contractor Grade Tools', 'Complete Plumbing Line', 'Immediate Yard Pickup'],
    whatsappMsg: 'Hello Bhakat Hardware, I want to inquire about contractor tools and construction hardware.'
  },
];

export default function MaterialHighlights() {
  return (
    <section className="py-20 md:py-28 bg-[var(--color-surface)] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-lime-800 bg-lime-100/80 px-3 py-1 rounded-md mb-3">
              Direct Supply Portfolio
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Materials Engineered for Modern Buildings
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-lime-700 transition-colors group shrink-0"
          >
            <span>View Full Materials Catalog</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {CATEGORIES.map((item, idx) => {
            const Icon = item.icon;
            const encodedMsg = encodeURIComponent(item.whatsappMsg);
            const waUrl = `https://wa.me/919153760277?text=${encodedMsg}`;

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="rounded-2xl transition-all duration-300 flex flex-col justify-between group"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '28px',
                  boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)'
                }}
              >
                <div>
                  {/* Top Bar with Icon & Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-lime-400 transition-colors">
                      <Icon size={22} />
                    </div>
                    <span className={`text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full border ${item.tagColor}`}>
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Brand */}
                  <h3 className="font-display text-xl font-bold text-slate-900 mb-1">
                    {item.name}
                  </h3>
                  <div className="text-xs font-semibold text-lime-700 mb-4">
                    {item.brand}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-500 leading-relaxed mb-6 font-normal">
                    {item.description}
                  </p>

                  {/* Key Feature Bullets */}
                  <ul className="space-y-2 mb-8 border-t border-slate-100 pt-4">
                    {item.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <Check size={14} className="text-lime-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2.5 px-3 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-lime-500 hover:text-slate-950 transition-colors"
                  >
                    Inquire Rate
                  </a>
                  <Link
                    to="/products"
                    className="py-2.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
                  >
                    Specs
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
