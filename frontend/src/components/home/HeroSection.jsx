import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Phone, ShieldCheck, CheckCircle2, Award, Truck } from 'lucide-react';

export default function HeroSection() {
  const whatsappUrl = "https://wa.me/919153760277?text=Hello%20Bhakat%20Hardware,%20I%20would%20like%20to%20inquire%20about%20materials%20and%20rates.";

  return (
    <section className="relative py-12 md:py-20 overflow-hidden bg-[var(--color-off-white)]">
      {/* Background architectural grid pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at 50% 30%, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%, black 40%, transparent 80%)'
        }}
      />

      {/* Subtle ambient light glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-lime-200/30 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading & Content */}
          <div className="lg:col-span-7 text-left">
            
            {/* Status & Location Pill */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs mb-6"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-lime-500 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-slate-800 uppercase">
                EST. 2008 • Midnapore, West Bengal
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-medium text-slate-500">Open 8 AM – 7:30 PM</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-6"
            >
              Building Midnapore with{' '}
              <span className="relative inline-block text-slate-900">
                Uncompromising
                <span className="absolute left-0 bottom-1.5 w-full h-3 bg-lime-300/50 -z-10 rounded-sm" />
              </span>{' '}
              Strength.
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-8 font-normal"
            >
              Exclusive authorized distributor for premium <strong>AAC Blocks</strong>, heavy construction chemicals, tile adhesives, and structural hardware. Factory-direct wholesale pricing for builders, contractors, and enduring homes.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3.5 mb-10"
            >
              <Link 
                to="/products"
                className="btn-primary"
                style={{ padding: '13px 28px', borderRadius: '12px' }}
              >
                <span>Browse Materials</span>
                <ArrowRight size={17} />
              </Link>

              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-semibold text-sm hover:border-lime-500 hover:bg-lime-50/50 hover:text-lime-800 transition-all shadow-xs active:scale-[0.98]"
              >
                <MessageSquare size={17} className="text-lime-600" />
                <span>WhatsApp Quote</span>
              </a>

              <a 
                href="tel:+919153760277"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-slate-700 font-semibold text-sm hover:text-slate-950 transition-colors"
                title="Direct Phone Call"
              >
                <Phone size={16} className="text-slate-500" />
                <span>+91 91537 60277</span>
              </a>
            </motion.div>

            {/* Trust Highlights Checklist */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-600"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-lime-600 shrink-0" />
                <span>Authorized Factory Direct</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-lime-600 shrink-0" />
                <span>GST Billing & Lab Reports</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <Truck size={16} className="text-lime-600 shrink-0" />
                <span>On-Site Delivery Fleet</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Architectural Visual Card */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto max-w-md w-full"
            >
              {/* Main Clean Card */}
              <div 
                className="bg-white rounded-3xl p-6 sm:p-8 relative overflow-hidden"
                style={{
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.02)'
                }}
              >
                {/* Top Header */}
                <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-lime-400 flex items-center justify-center font-bold text-lg font-display shadow-xs">
                      BH
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorized Partner</div>
                      <div className="text-sm font-bold text-slate-900">Ual Kon Crete • Rashmi • Biltech</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-lime-100 text-lime-800 font-bold text-[11px]">
                    Grade-1
                  </span>
                </div>

                {/* Featured Product Spec Spotlight */}
                <div className="space-y-4 mb-6">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Flagship Material</span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">In Stock</span>
                    </div>
                    <div className="text-base font-bold text-slate-900 mb-1">
                      Autoclaved Aerated Concrete (AAC)
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Lightweight, high-thermal resistance, eco-friendly. Saves 25% on structural costs compared to traditional red brick.
                    </p>
                  </div>

                  {/* 3 Spec Pillars */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-medium">Strength</div>
                      <div className="text-xs font-bold text-slate-900">&gt; 3.5 N/mm²</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-medium">Weight</div>
                      <div className="text-xs font-bold text-slate-900">65% Lighter</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-medium">Fire Rating</div>
                      <div className="text-xs font-bold text-slate-900">4+ Hours</div>
                    </div>
                  </div>
                </div>

                {/* Direct Action Inside Card */}
                <div>
                  <a
                    href="https://wa.me/919153760277?text=Hello%20Bhakat%20Hardware,%20please%20send%20me%20the%20current%20rates%20for%20AAC%20Blocks."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    <span>Check Today's Block Rate</span>
                    <ArrowRight size={14} />
                  </a>
                </div>

                {/* Floating Metric Badge - Positioned cleanly at bottom-left */}
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="hidden sm:flex absolute -bottom-3 -left-3 bg-slate-900 text-white px-3.5 py-2 rounded-xl shadow-lg border border-slate-800 items-center gap-2"
                >
                  <Award size={15} className="text-lime-400" />
                  <div className="text-left">
                    <div className="text-xs font-bold text-white leading-tight">50,000+ MT</div>
                    <div className="text-[9px] text-slate-300">Supplied in Bengal</div>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
