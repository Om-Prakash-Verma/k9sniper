import React from 'react';
import { motion } from 'motion/react';
import { Dog, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-bg py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center">
                <Dog className="text-white w-6 h-6" />
              </div>
              <span className="text-white font-bold tracking-tighter text-2xl uppercase">K9 SNIPERS</span>
            </div>
            <p className="text-text-body leading-relaxed max-w-xs">
              Premium pet shop dedicated to providing healthy companions and high-quality pet care products.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <motion.a 
                  key={i} 
                  href="#" 
                  whileHover={{ y: -5, scale: 1.1 }}
                  className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-accent transition-colors group"
                >
                  <Icon className="w-5 h-5 text-text-body group-hover:text-white" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.3em]">Quick Links</h4>
            <ul className="space-y-4">
              {['Overview', 'Pets', 'Accessories', 'Services', 'Contact'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-text-body hover:text-brand-accent transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent scale-0 group-hover:scale-100 transition-transform duration-300" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.3em]">Contact Info</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group">
                <Phone className="w-5 h-5 text-brand-accent shrink-0" />
                <span className="text-text-body group-hover:text-white transition-colors">+91 96437 97801</span>
              </li>
              <li className="flex items-start gap-4 group">
                <MapPin className="w-5 h-5 text-brand-accent shrink-0" />
                <span className="text-text-body group-hover:text-white transition-colors">
                  Opposite Punjabi Dhaba, New Kondli Market, Mayur Vihar Phase 3, New Delhi – 110096
                </span>
              </li>
              <li className="flex items-start gap-4 group">
                <Mail className="w-5 h-5 text-brand-accent shrink-0" />
                <span className="text-text-body group-hover:text-white transition-colors">info@k9snipers.in</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.3em]">Newsletter</h4>
            <p className="text-text-body text-sm mb-6">Join our community for pet care tips and exclusive offers.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm focus:outline-none focus:border-brand-accent transition-colors"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-brand-accent hover:bg-brand-accent-light text-white px-6 rounded-full text-xs font-bold transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-brand-accent font-bold tracking-widest text-sm uppercase">Healthy Pets. Happy Homes.</p>
            <p className="text-text-body text-xs">
              © {new Date().getFullYear()} K9 Snipers Dog Shop. All rights reserved.
            </p>
          </div>
          <div className="flex gap-8 text-xs font-medium">
            <a href="#" className="text-text-body hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-text-body hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-text-body hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
