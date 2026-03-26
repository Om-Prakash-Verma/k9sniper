import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Clock, Navigation, Instagram, Mail, MessageSquare } from 'lucide-react';

const VisitStore = () => {
  const address = "Opposite Punjabi Dhaba, New Kondli Market, Mayur Vihar Phase 3, New Delhi – 110096";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("K9 Sniper Pet Shop Mayur Vihar Phase 3 New Delhi")}`;
  const phone = "+919643797801";
  const email = "info@k9sniper.com";

  return (
    <section id="contact" className="relative py-16 lg:py-32 bg-brand-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Editorial Header */}
        <div className="mb-16 lg:mb-24">
          <div className="micro-label mb-4 text-brand-primary">Visit Our Flagship</div>
          <h2 className="editorial-title mb-8">
            The <span className="text-brand-accent italic font-serif normal-case tracking-normal">Experience</span> <br />
            Center
          </h2>
          <div className="h-px w-full bg-brand-primary/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: Interactive Map & Visual */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[16/10] rounded-[3rem] overflow-hidden hardware-border shadow-2xl group"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.562306721665!2d77.3243!3d28.6129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce50000000000%3A0x0!2zMjjCsDM2JzQ2LjQiTiA3N8KwMTknMjcuNSJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'grayscale(1) contrast(1.1) brightness(0.9)' }} 
                allowFullScreen={true} 
                loading="lazy"
                title="K9 Sniper Location"
                className="group-hover:grayscale-0 transition-all duration-700"
              ></iframe>
              <div className="absolute inset-0 bg-brand-primary/5 pointer-events-none group-hover:bg-transparent transition-all duration-700" />
              
              {/* Overlay Button */}
              <div className="absolute bottom-8 right-8">
                <a 
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-brand-primary text-brand-bg-secondary rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-brand-accent transition-all duration-300 shadow-2xl"
                >
                  <Navigation className="w-4 h-4" />
                  Open in Maps
                </a>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-8">
              <div className="p-8 bg-brand-bg-secondary/50 rounded-[2rem] border border-brand-accent-secondary/10">
                <div className="flex justify-between items-center mb-4">
                  <div className="micro-label">Store Status</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Live Now</span>
                  </div>
                </div>
                <div className="text-brand-primary font-bold text-lg">10:00 AM – 07:00 PM</div>
                <div className="text-brand-text/60 text-sm uppercase tracking-widest">Open Every Day</div>
              </div>
              <div className="p-8 bg-brand-bg-secondary/50 rounded-[2rem] border border-brand-accent-secondary/10">
                <div className="micro-label mb-4">Service Area</div>
                <div className="text-brand-primary font-bold text-lg">Delhi NCR</div>
                <div className="text-brand-text/60 text-sm uppercase tracking-widest">Pan-India Shipping</div>
              </div>
            </div>
          </div>

          {/* Right: Contact Details (Technical Dashboard Style) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-px bg-brand-primary/10 border border-brand-primary/10 rounded-[3rem] overflow-hidden shadow-xl">
              {/* Address Row */}
              <a 
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-10 bg-brand-bg-secondary hover:bg-brand-primary transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-bg flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-brand-bg-secondary transition-all">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="text-[10px] font-mono text-brand-accent group-hover:text-brand-bg-secondary/40 tracking-widest">LOC_001</div>
                </div>
                <h3 className="text-brand-primary font-display font-bold text-2xl uppercase tracking-tighter mb-4 group-hover:text-brand-bg-secondary transition-colors">
                  Our Location
                </h3>
                <p className="text-brand-text text-lg leading-relaxed group-hover:text-brand-bg-secondary/70 transition-colors">
                  {address}
                </p>
              </a>

              {/* Phone Row */}
              <a 
                href={`tel:${phone}`}
                className="group block p-10 bg-brand-bg-secondary hover:bg-brand-primary transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-bg flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-brand-bg-secondary transition-all">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="text-[10px] font-mono text-brand-accent group-hover:text-brand-bg-secondary/40 tracking-widest">TEL_001</div>
                </div>
                <h3 className="text-brand-primary font-display font-bold text-2xl uppercase tracking-tighter mb-4 group-hover:text-brand-bg-secondary transition-colors">
                  Call Support
                </h3>
                <p className="text-brand-primary font-bold text-3xl group-hover:text-brand-bg-secondary transition-colors">
                  +91 96437 97801
                </p>
              </a>

              {/* Email Row */}
              <a 
                href={`mailto:${email}`}
                className="group block p-10 bg-brand-bg-secondary hover:bg-brand-primary transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-bg flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-brand-bg-secondary transition-all">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="text-[10px] font-mono text-brand-accent group-hover:text-brand-bg-secondary/40 tracking-widest">MAIL_001</div>
                </div>
                <h3 className="text-brand-primary font-display font-bold text-2xl uppercase tracking-tighter mb-4 group-hover:text-brand-bg-secondary transition-colors">
                  Email Us
                </h3>
                <p className="text-brand-primary font-bold text-2xl group-hover:text-brand-bg-secondary transition-colors">
                  {email}
                </p>
              </a>
            </div>

            {/* Social & Directions Footer */}
            <div className="mt-12 flex flex-col sm:flex-row gap-6">
              <a 
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 btn-premium flex items-center justify-center gap-3"
              >
                <Navigation className="w-5 h-5" />
                Get Directions
              </a>
              <div className="flex gap-4">
                <a 
                  href={`https://wa.me/919643797801`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-2xl bg-brand-bg-secondary border border-brand-accent-secondary/20 flex items-center justify-center text-brand-primary hover:bg-brand-accent hover:text-brand-bg-secondary transition-all duration-500 shadow-lg"
                  aria-label="Chat with us on WhatsApp"
                >
                  <MessageSquare className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.instagram.com/k9_snipers_petshop/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-2xl bg-brand-bg-secondary border border-brand-accent-secondary/20 flex items-center justify-center text-brand-primary hover:bg-brand-accent hover:text-brand-bg-secondary transition-all duration-500 shadow-lg"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisitStore;