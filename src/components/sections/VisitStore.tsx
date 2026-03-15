import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Clock, Navigation, PhoneCall } from 'lucide-react';

const VisitStore = () => {
  return (
    <section id="contact" className="relative py-20 md:py-32 bg-brand-bg-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tighter"
          >
            Visit Our <span className="text-brand-accent">Store</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 md:space-y-12"
          >
            <div className="bg-brand-bg p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">K9 Snipers Dog Shop</h3>
              
              <div className="space-y-6 md:space-y-8">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center shrink-0">
                    <MapPin className="text-brand-accent w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1 md:mb-2 text-sm md:text-base">Address</h4>
                    <p className="text-text-body leading-relaxed text-sm md:text-base">
                      Opposite Punjabi Dhaba, New Kondli Market<br />
                      Mayur Vihar Phase 3, New Delhi – 110096
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center shrink-0">
                    <Phone className="text-brand-accent w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1 md:mb-2 text-sm md:text-base">Phone</h4>
                    <p className="text-text-body text-sm md:text-base">+91 96437 97801</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center shrink-0">
                    <Clock className="text-brand-accent w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1 md:mb-2 text-sm md:text-base">Opening Hours</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 md:gap-y-2 text-text-body text-sm md:text-base">
                      <div className="flex justify-between sm:block">
                        <span>Mon – Sat</span>
                        <span className="text-white sm:ml-4">10:00 AM – 10:00 PM</span>
                      </div>
                      <div className="flex justify-between sm:block">
                        <span>Sunday</span>
                        <span className="text-white sm:ml-4">1:00 PM – 5:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-4">
                <a 
                  href="tel:+919643797801"
                  className="bg-brand-accent hover:bg-brand-accent-light text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-105 text-sm md:text-base"
                >
                  <PhoneCall className="w-5 h-5" />
                  Call Now
                </a>
                <button className="btn-premium px-8 py-4 rounded-full text-white font-bold flex items-center justify-center gap-3 transition-all text-sm md:text-base">
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[32px] md:rounded-[40px] overflow-hidden border border-white/10 h-[300px] sm:h-[400px] lg:h-full min-h-[300px] md:min-h-[500px]"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.562306721665!2d77.3243!3d28.6129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzQ2LjQiTiA3N8KwMTknMjcuNSJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(90%)' }} 
              allowFullScreen={true} 
              loading="lazy"
              title="K9 Snipers Location"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisitStore;
