import React from 'react';
import { motion } from 'motion/react';
import { Dog, ArrowRight, Shield, Heart, Award } from 'lucide-react';
import { getImageUrl } from '../../utils/imageHelper';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-brand-bg">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full"
        >
          <img 
            src={getImageUrl("https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=2000")} 
            alt="Happy Pets" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-bg via-brand-bg/80 to-transparent" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 pt-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
                <Dog className="text-brand-bg-secondary w-6 h-6" />
              </div>
              <span className="micro-label text-brand-primary">Premium Pet Destination</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter uppercase leading-[0.85] text-brand-primary mb-8">
              K9 Snipers <br />
              <span className="text-brand-accent">Dog Shop</span>
            </h1>

            <p className="text-xl md:text-2xl text-brand-text mb-10 font-medium max-w-xl leading-relaxed">
              Where healthy pets find happy homes. Your trusted destination for premium breeds, expert care, and high-quality pet essentials in New Delhi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link to="/pets" className="btn-premium px-10 py-5 rounded-full text-brand-bg-secondary font-bold transition-all flex items-center justify-center gap-3 group">
                Find Your Companion
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/products" className="bg-brand-bg-secondary/80 hover:bg-brand-bg-secondary backdrop-blur-md text-brand-primary px-10 py-5 rounded-full font-bold transition-all border border-brand-accent-secondary/20 flex items-center justify-center gap-2 shadow-sm">
                Shop Accessories
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-brand-primary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-brand-primary font-bold text-sm">Certified Breeds</div>
                  <div className="text-brand-text/60 text-xs font-medium">100% Health Guarantee</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-brand-primary font-bold text-sm">Expert Care</div>
                  <div className="text-brand-text/60 text-xs font-medium">Lifelong Support</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-brand-primary font-bold text-sm">15+ Years</div>
                  <div className="text-brand-text/60 text-xs font-medium">Trusted Experience</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gradient-to-t from-brand-bg to-transparent z-0" />
    </section>
  );
};

export default Hero;
