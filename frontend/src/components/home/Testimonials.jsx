import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';

const REVIEWS = [
  {
    name: 'S. Mukherjee',
    role: 'Civil Contractor',
    project: '10-Story Residential Tower',
    rating: 5,
    text: 'Bhakat Hardware is our primary supplier for AAC blocks in Midnapore. Their direct factory pricing and prompt unloading schedule saved us significant site delays.',
  },
  {
    name: 'R. Banerjee',
    role: 'Structural Consultant & Builder',
    project: 'Commercial Plaza Kharagpur',
    rating: 5,
    text: 'Authentic GST billing with genuine manufacturer test certificates. The quality of AAC blocks and MYK waterproofing compounds delivered was flawless.',
  },
  {
    name: 'A. Das',
    role: 'Homeowner',
    project: 'Independent Villa, Basantpur',
    rating: 5,
    text: 'We switched from red bricks to AAC blocks on their advice. Our house stays substantially cooler during Bengal summers, and our mortar consumption dropped by over 50%.',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-[var(--color-surface)] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-full mb-3 shadow-2xs">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} fill="currentColor" />
              ))}
            </div>
            <span>Google 4.8★ Verified Client Feedback</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Endorsed by Midnapore's Leading Builders
          </h2>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-2xl transition-all duration-300 flex flex-col justify-between"
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)'
              }}
            >
              <div>
                {/* 5 Stars */}
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-sm text-slate-600 leading-relaxed italic mb-6">
                  "{rev.text}"
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-display font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <span>{rev.name}</span>
                    <CheckCircle size={13} className="text-lime-600" />
                  </div>
                  <div className="text-xs text-slate-400">
                    {rev.role} • {rev.project}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
