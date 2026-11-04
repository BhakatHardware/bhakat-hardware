import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Navigation, MessageSquare } from 'lucide-react';

export default function StoreInfo() {
  const mapUrl = "https://maps.google.com/?q=Rajardijhi,+Jamunabali+Basantpur,+Midnapore,+West+Bengal+721102";
  const whatsappUrl = "https://wa.me/919153760277?text=Hello%20Bhakat%20Hardware,%20I%20am%20visiting%20your%20store%20yard.";

  return (
    <section className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Address & Details */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-800 bg-lime-100 px-3 py-1 rounded-md mb-4">
                Store Yard & Dispatch Center
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                Visit Our Showroom & Materials Yard
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 max-w-xl font-normal">
                Inspect physical sample blocks, check manufacturer test certificates in person, or arrange immediate site unloading trucks directly at our Midnapore depot.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-400">Depot Address</div>
                    <div className="text-sm font-semibold text-slate-800">
                      Rajardijhi, Jamunabali Basantpur, Midnapore, West Bengal 721102
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-400">Depot Operating Hours</div>
                    <div className="text-sm font-semibold text-slate-800">
                      Monday – Sunday: 8:00 AM – 7:30 PM (Dispatch 7 Days a Week)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-400">Direct Contact Numbers</div>
                    <div className="text-sm font-semibold text-slate-800">
                      <a href="tel:+919153760277" className="hover:text-lime-700 transition-colors">+91 91537 60277</a>
                      {' '}&bull;{' '}
                      <a href="tel:+919434321475" className="hover:text-lime-700 transition-colors">+91 94343 21475</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-lime-500 hover:text-slate-950 transition-colors shadow-2xs"
                >
                  <Navigation size={15} />
                  <span>Get Directions</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold hover:bg-slate-100 transition-colors"
                >
                  <MessageSquare size={15} className="text-lime-600" />
                  <span>Chat With Store Yard</span>
                </a>
              </div>
            </div>

            {/* Right Column: Visual Showcase Badge */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-md">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Service Reach</div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-3">
                  Direct Truck Dispatch Across Bengal
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 font-normal">
                  Our fleet services Midnapore Sadar, Kharagpur, Jhargram, Ghatal, Tamluk, Haldia, and surrounding districts with dedicated unloading crews.
                </p>

                <div className="space-y-2.5 text-xs font-medium text-slate-700">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span>Midnapore Sadar & Vicinity</span>
                    <span className="text-lime-700 font-bold">Same-Day Dispatch</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span>Kharagpur & Industrial Belt</span>
                    <span className="text-lime-700 font-bold">Scheduled Deliveries</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span>Jhargram, Ghatal & South Bengal</span>
                    <span className="text-slate-600 font-bold">Full Truckloads (FTL)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

