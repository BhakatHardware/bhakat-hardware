import { motion } from 'framer-motion';

const STATS = [
  { value: '15+', label: 'Years of Excellence', detail: 'Serving Midnapore since 2008' },
  { value: '50,000+', label: 'Metric Tons Supplied', detail: 'Across West Bengal projects' },
  { value: '100%', label: 'Factory Direct', detail: 'Zero middleman markups' },
  { value: '4.8★', label: 'Google Rating', detail: 'Trusted by 1,200+ contractors' },
];

export default function StatsBar() {
  return (
    <section className="bg-white border-y border-slate-200/80 py-12 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`text-center px-4 ${idx !== 0 ? 'pt-6 sm:pt-0' : ''}`}
            >
              <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-slate-800 mb-0.5">
                {stat.label}
              </div>
              <div className="text-xs text-slate-400 font-normal">
                {stat.detail}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

