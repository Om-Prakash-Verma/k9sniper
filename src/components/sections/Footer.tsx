import React from 'react';
import { motion } from 'motion/react';
import { Dog, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-bg border-t border-brand-accent-secondary/10 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Mobile/Tablet Unique Layout (hidden on lg) */}
        <div className="lg:hidden flex flex-col items-center text-center">
          <h2 className="text-5xl font-display font-bold uppercase tracking-tighter text-brand-primary mb-6">
            K9 <span className="text-brand-accent">Snipers</span>
          </h2>
          <p className="text-brand-text text-lg max-w-sm leading-relaxed mb-8">
            Redefining the pet ownership experience in New Delhi with premium care and global standards.
          </p>
          
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-8 w-full max-w-xs">
            {['Home', 'About', 'Pets', 'Services', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-brand-primary hover:text-brand-accent transition-colors text-sm font-bold uppercase tracking-widest"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex gap-4 mb-8">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a 
                key={i}
                href="#" 
                className="w-14 h-14 rounded-2xl bg-brand-bg-secondary border border-brand-accent-secondary/20 flex items-center justify-center text-brand-primary hover:bg-brand-accent hover:text-brand-bg-secondary transition-all shadow-sm"
              >
                <Icon className="w-6 h-6" />
              </a>
            ))}
          </div>

          <div className="w-full pt-12 border-t border-brand-accent-secondary/10 space-y-6">
            <div className="text-brand-text text-[10px] font-bold tracking-[0.2em] uppercase">
              © 2024 K9 SNIPERS. ALL RIGHTS RESERVED.
            </div>
            <div className="flex justify-center gap-8 text-brand-text text-[10px] font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-brand-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-brand-primary transition-colors">Terms</a>
            </div>
          </div>
        </div>

        {/* Desktop Layout (hidden on mobile/tablet) */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-12">
            <div className="lg:col-span-2">
              <h2 className="text-4xl font-display font-bold uppercase tracking-tighter text-brand-primary mb-4">
                K9 <span className="text-brand-accent">Snipers</span>
              </h2>
              <p className="text-brand-text text-xl max-w-md leading-relaxed">
                Redefining the pet ownership experience in New Delhi with premium care, global standards, and a passion for animals.
              </p>
            </div>
            
            <div>
              <div className="micro-label mb-4">Navigation</div>
              <ul className="space-y-4">
                {['Home', 'About', 'Pets', 'Services', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-brand-primary hover:text-brand-accent transition-colors text-lg font-medium">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="micro-label mb-4">Social</div>
              <div className="flex gap-6">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <a 
                    key={i}
                    href="#" 
                    className="w-12 h-12 rounded-full border border-brand-accent-secondary/20 flex items-center justify-center text-brand-primary hover:bg-brand-accent hover:text-brand-bg-secondary hover:border-brand-accent transition-all shadow-sm"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-brand-accent-secondary/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-brand-text text-sm font-bold">
              © 2024 K9 SNIPERS. ALL RIGHTS RESERVED.
            </div>
            <div className="flex gap-12 text-brand-text text-sm font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-brand-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-brand-primary transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
