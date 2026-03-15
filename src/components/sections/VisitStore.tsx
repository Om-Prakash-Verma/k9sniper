import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Clock, Navigation, PhoneCall } from 'lucide-react';

const VisitStore = () => {
  return (
    <section id="contact" className="relative bg-brand-bg overflow-hidden">
      {/* Mobile/Tablet Unique Layout (hidden on lg) */}
      <div className="lg:hidden flex flex-col">
        {/* Map Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="h-[40vh] relative grayscale hover:grayscale-0 transition-all duration-1000"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.562306721665!2d77.3243!3d28.6129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzQ2LjQiTiA3N8KwMTknMjcuNSJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'sepia(30%) hue-rotate(-15deg) contrast(90%)' }} 
            allowFullScreen={true} 
            loading="lazy"
            title="K9 Snipers Location Mobile"
          ></iframe>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-bg to-transparent" />
        </motion.div>

        {/* Content Body */}
        <div className="px-6 pb-24 -mt-12 relative z-10">
          <div className="micro-label mb-4">Connect With Us</div>
          <h2 className="text-5xl font-display font-bold tracking-tighter uppercase leading-[0.85] mb-12 text-brand-primary">
            Visit Our <br />
            <span className="text-brand-accent">Flagship</span> <br />
            Store
          </h2>

          <div className="space-y-12 mb-16">
            <div className="p-8 bg-brand-bg-secondary rounded-[32px] border border-brand-accent-secondary/10 shadow-sm">
              <div className="micro-label mb-4 text-brand-accent">Address</div>
              <p className="text-brand-primary text-lg font-bold leading-relaxed">
                Opposite Punjabi Dhaba, New Kondli Market, Mayur Vihar Phase 3, New Delhi – 110096
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-brand-bg-secondary rounded-[32px] border border-brand-accent-secondary/10 shadow-sm">
                <div className="micro-label mb-2 text-brand-accent">Contact</div>
                <p className="text-brand-primary font-bold text-sm">+91 96437 97801</p>
              </div>
              <div className="p-6 bg-brand-bg-secondary rounded-[32px] border border-brand-accent-secondary/10 shadow-sm">
                <div className="micro-label mb-2 text-brand-accent">Email</div>
                <p className="text-brand-primary font-bold text-[10px] truncate">info@k9snipers.in</p>
              </div>
            </div>

            <div className="p-8 bg-brand-bg-secondary rounded-[32px] border border-brand-accent-secondary/10 shadow-sm">
              <div className="micro-label mb-4 text-brand-accent">Opening Hours</div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-brand-text text-sm">Mon – Sat</span>
                  <span className="text-brand-primary font-bold text-sm">10 AM – 10 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-text text-sm">Sunday</span>
                  <span className="text-brand-primary font-bold text-sm">1 PM – 5 PM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <a 
              href="tel:+919643797801"
              className="btn-premium py-6 rounded-full text-brand-bg-secondary font-bold uppercase tracking-tighter flex items-center justify-center gap-3"
            >
              <PhoneCall className="w-5 h-5" />
              Call Now
            </a>
            <button className="bg-brand-bg-secondary text-brand-primary py-6 rounded-full font-bold uppercase tracking-tighter flex items-center justify-center gap-3 border border-brand-accent-secondary/20 shadow-sm">
              <Navigation className="w-5 h-5" />
              Directions
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout (hidden on mobile/tablet) */}
      <div className="hidden lg:flex flex-row min-h-screen">
        {/* Contact Info Pane */}
        <div className="lg:w-1/2 p-10 md:p-24 flex flex-col justify-center bg-brand-bg relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="micro-label mb-8">Connect With Us</div>
            <h2 className="editorial-title mb-16">
              Visit Our <br />
              <span className="text-brand-accent">Flagship</span> <br />
              Store
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
              <div className="space-y-4">
                <div className="micro-label text-brand-accent">Address</div>
                <p className="text-brand-primary text-xl font-bold leading-relaxed">
                  Opposite Punjabi Dhaba, New Kondli Market, Mayur Vihar Phase 3, New Delhi – 110096
                </p>
              </div>
              <div className="space-y-4">
                <div className="micro-label text-brand-accent">Contact</div>
                <p className="text-brand-primary text-xl font-bold">+91 96437 97801</p>
                <p className="text-brand-text text-lg">info@k9snipers.in</p>
              </div>
              <div className="space-y-4 md:col-span-2">
                <div className="micro-label text-brand-accent">Opening Hours</div>
                <div className="flex flex-wrap gap-12">
                  <div>
                    <div className="text-brand-text text-sm mb-1">Mon – Sat</div>
                    <div className="text-brand-primary font-bold">10:00 AM – 10:00 PM</div>
                  </div>
                  <div>
                    <div className="text-brand-text text-sm mb-1">Sunday</div>
                    <div className="text-brand-primary font-bold">1:00 PM – 5:00 PM</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <a 
                href="tel:+919643797801"
                className="btn-premium px-10 py-5 rounded-full text-brand-bg-secondary font-bold uppercase tracking-tighter flex items-center gap-3 transition-all transform hover:scale-105"
              >
                <PhoneCall className="w-5 h-5" />
                Call Now
              </a>
              <button className="bg-brand-bg-secondary text-brand-primary px-10 py-5 rounded-full font-bold uppercase tracking-tighter flex items-center gap-3 border border-brand-accent-secondary/20 shadow-sm transition-all hover:bg-brand-bg">
                <Navigation className="w-5 h-5" />
                Directions
              </button>
            </div>
          </motion.div>
        </div>

        {/* Map Pane */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="lg:w-1/2 h-[500px] lg:h-auto relative grayscale hover:grayscale-0 transition-all duration-1000"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.562306721665!2d77.3243!3d28.6129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzQ2LjQiTiA3N8KwMTknMjcuNSJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'sepia(30%) hue-rotate(-15deg) contrast(90%)' }} 
            allowFullScreen={true} 
            loading="lazy"
            title="K9 Snipers Location"
          ></iframe>
          
          {/* Map Overlay Label */}
          <div className="absolute top-10 right-10 bg-brand-bg p-4 border border-brand-accent-secondary/20 rounded-xl hidden md:block shadow-sm">
            <div className="micro-label text-brand-accent">Live Map View</div>
            <div className="text-brand-primary font-bold text-xs">Mayur Vihar Phase 3</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VisitStore;
