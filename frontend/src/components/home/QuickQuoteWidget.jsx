import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Calculator, PhoneCall, CheckCircle } from 'lucide-react';

const MATERIALS = [
  { id: 'aac', label: 'AAC Lightweight Blocks', unit: 'Pieces / Truckload' },
  { id: 'waterproofing', label: 'MYK Waterproofing Chemicals', unit: 'Liters / Buckets' },
  { id: 'tile-adhesive', label: 'Tile Adhesive & Epoxy Grout', unit: 'Bags (20-50 kg)' },
  { id: 'mortar', label: 'Ready-mix Block Joint Mortar', unit: 'Bags (40 kg)' },
  { id: 'mesh', label: 'Fiberglass Reinforcement Mesh', unit: 'Rolls (50m)' },
  { id: 'other', label: 'General / Multiple Hardware', unit: 'Consolidated List' },
];

const PROJECT_TYPES = [
  'Individual Home',
  'Commercial Complex',
  'Multi-Story Apartments',
  'Renovation / Waterproofing Work',
];

export default function QuickQuoteWidget() {
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0].id);
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('Midnapore');

  const activeMaterial = MATERIALS.find(m => m.id === selectedMaterial);

  const generateWhatsAppUrl = () => {
    const text = `Hello Bhakat Hardware, I need a bulk quote:%0A%0A• Material: ${activeMaterial?.label}%0A• Project: ${projectType}%0A• Approx Requirement: ${quantity || 'Not specified'}%0A• Delivery Site: ${location}%0A%0APlease let me know the best factory-direct wholesale rate and delivery schedule.`;
    return `https://wa.me/919153760277?text=${text}`;
  };

  return (
    <section className="py-20 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl p-6 sm:p-10 md:p-12 text-white relative overflow-hidden shadow-2xl">
          
          {/* Subtle gradient effect in background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-lime-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <Calculator size={14} />
                <span>Instant Project Estimator</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
                Get a Factory-Direct Rate in Minutes
              </h2>
              <p className="text-sm sm:text-base text-slate-400 font-normal">
                Select your required material and project details to get instant wholesale rates and delivery availability via WhatsApp.
              </p>
            </div>

            {/* Form Matrix */}
            <div className="space-y-6">
              
              {/* Step 1: Material Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                  1. Select Material Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {MATERIALS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMaterial(m.id)}
                      className={`text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                        selectedMaterial === m.id
                          ? 'bg-lime-500 text-slate-950 border-lime-400 font-semibold shadow-sm'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="truncate">{m.label}</div>
                      <div className={`text-[10px] ${selectedMaterial === m.id ? 'text-slate-800' : 'text-slate-500'}`}>
                        {m.unit}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Project Type & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    2. Project Scope
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-lime-400 transition-colors"
                  >
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-slate-900 text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    3. Estimated Quantity / Area
                  </label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 1500 blocks or 1200 sq.ft"
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-lime-400 transition-colors"
                  />
                </div>
              </div>

              {/* Step 3: Location */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  4. Site Location / Delivery City
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Midnapore Sadar, Kharagpur, Ghatal, Jhargram"
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-lime-400 transition-colors"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-lime-400 text-slate-950 font-bold hover:bg-lime-300 transition-colors text-sm sm:text-base shadow-lg shadow-lime-400/20 active:scale-[0.99]"
                >
                  <MessageSquare size={19} className="text-slate-950" />
                  <span>Send Direct Inquiry on WhatsApp</span>
                </a>

                <a
                  href="tel:+919153760277"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-sm font-semibold transition-colors"
                >
                  <PhoneCall size={17} className="text-lime-400" />
                  <span>Call Desk</span>
                </a>
              </div>

              {/* Verification footnotes */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-lime-400" /> GST Billing Included
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-lime-400" /> Unloading Fleet Available
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-lime-400" /> Manufacturer Certificates
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

