import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Phone } from 'lucide-react';

export default function CtaBanner() {
  const whatsappUrl = "https://wa.me/919153760277?text=Hello%20Bhakat%20Hardware,%20I%20would%20like%20to%20request%20a%20bulk%20quote%20for%20my%20upcoming%20project.";

  return (
    <section className="py-20 md:py-28 bg-[var(--color-off-white)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          className="relative bg-slate-900 rounded-3xl p-8 sm:p-14 md:p-16 text-center text-white overflow-hidden shadow-2xl"
        >
          {/* Ambient decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-gradient-to-b from-lime-400/20 via-transparent to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-lime-400 mb-4">
              Wholesale Supply & Bulk Logistics
            </span>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Ready to Build with Uncompromising Quality?
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 font-normal leading-relaxed mb-10 max-w-2xl mx-auto">
              Whether you are casting high-rise slabs or laying the foundation for your dream residence, Bhakat Hardware supplies certified materials with zero delay.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-lime-400 text-slate-950 font-bold hover:bg-lime-300 transition-all text-sm sm:text-base shadow-lg shadow-lime-400/20 active:scale-[0.98]"
              >
                <span>Request Project Quote</span>
                <ArrowRight size={18} />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold transition-all text-sm sm:text-base"
              >
                <MessageSquare size={18} className="text-lime-400" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href="tel:+919153760277"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-slate-300 hover:text-white font-medium text-sm transition-colors"
              >
                <Phone size={16} className="text-slate-400" />
                <span>+91 91537 60277</span>
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

