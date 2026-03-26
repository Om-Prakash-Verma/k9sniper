import React from 'react';
import { motion } from 'motion/react';
import { Dog, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-primary text-brand-bg-secondary py-16 lg:py-24 overflow-hidden relative">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl -mr-48 -mt-48" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-16 lg:mb-24">
          {/* Brand Column */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-brand-accent flex items-center justify-center text-brand-bg-secondary shadow-xl">
                <Dog className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tighter">
                K9 <span className="text-brand-accent">Snipers</span>
              </h2>
            </div>
            <div className="mb-10">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-4">Our Commitment</div>
              <p className="text-brand-bg-secondary/70 text-lg md:text-xl leading-relaxed max-w-md mx-auto lg:mx-0">
                At K9SNIPERS Pet Shop, we are committed to providing healthy pets, quality accessories, and expert guidance to ensure a happy and fulfilling life for every pet and their owner.
              </p>
            </div>
            <div className="flex justify-center lg:justify-start gap-4">
              <a 
                href="https://www.instagram.com/k9_snipers_petshop/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 text-center sm:text-left">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-8">Business Info</div>
              <ul className="space-y-4 text-brand-bg-secondary/60 font-medium">
                <li><span className="text-brand-accent">Owner:</span> Mr. Sanjay</li>
                <li><span className="text-brand-accent">Business:</span> K9SNIPERS Pet Shop</li>
              </ul>
              <div className="mt-8">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-4">Business Hours</div>
                <ul className="space-y-2 text-brand-bg-secondary/60 font-medium text-sm">
                  <li>Mon - Sat: 10:00 AM - 10:00 PM</li>
                  <li>Sunday: 01:00 PM - 05:00 PM</li>
                </ul>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-8">Contact</div>
              <ul className="space-y-4">
                <li>
                  <a href="tel:+919643797801" className="text-brand-bg-secondary/60 hover:text-brand-accent transition-colors font-medium flex items-center justify-center sm:justify-start gap-2">
                    <Phone className="w-4 h-4" />
                    +91 96437 97801
                  </a>
                </li>
                <li>
                  <a href="mailto:info@k9sniper.com" className="text-brand-bg-secondary/60 hover:text-brand-accent transition-colors font-medium flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="w-4 h-4" />
                    info@k9sniper.com
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-8">Location</div>
              <a 
                href="https://maps.app.goo.gl/YourActualMapLink" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-bg-secondary/60 hover:text-brand-accent transition-colors font-medium flex items-start justify-center sm:justify-start gap-2"
              >
                <MapPin className="w-4 h-4 mt-1 shrink-0" />
                <span>Opposite Punjabi Dhaba, New Kondli Market, Mayur Vihar Phase 3, New Delhi – 110096</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-brand-bg-secondary/40 text-[10px] font-bold uppercase tracking-widest">
            © {currentYear} K9 SNIPERS. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-12 text-brand-bg-secondary/40 text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-brand-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
