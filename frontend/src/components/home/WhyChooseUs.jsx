import { motion } from 'framer-motion';
import { Award, Truck, FileCheck, Compass } from 'lucide-react';

const PILLARS = [
  {
    icon: Award,
    title: 'Factory-Direct Authorized Supply',
    desc: 'Sole authorized distributor for premium AAC Blocks and MYK building chemicals. We source directly from manufacturing plants, eliminating multi-tier middleman markups.',
  },
  {
    icon: Truck,
    title: 'Dedicated Site Logistics Fleet',
    desc: 'Our logistics fleet is equipped for heavy deliveries. Whether it is 500 blocks for a private villa or 50 truckloads for a commercial high-rise, we deliver directly to your foundation.',
  },
  {
    icon: FileCheck,
    title: 'GST Invoicing & Test Certificates',
    desc: 'Zero ambiguity. Every single dispatch is accompanied by genuine GST billing, weighbridge slips, and manufacturer laboratory test certificates required for structural compliance.',
  },
  {
    icon: Compass,
    title: '15+ Years Technical Guidance',
    desc: 'Our experienced staff helps engineers and homeowners compute accurate mortar coverage, block requirements, and appropriate chemical waterproofing ratios before purchase.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28 bg-[var(--color-off-white)] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-700 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full mb-4 shadow-2xs">
            The Bhakat Standard
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Why West Bengal's Top Builders Trust Us
          </h2>
          <p className="text-base text-slate-600 font-normal">
            For more than 15 years, we have provided the solid backbone for Midnapore's skyline with dependable materials and unwavering integrity.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-2xl transition-all duration-300 group"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '28px',
                  boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)'
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:text-lime-400 transition-colors">
                  <Icon size={22} />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2.5">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  {pillar.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
