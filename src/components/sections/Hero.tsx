import React from 'react';
import { motion } from 'motion/react';
import { Dog, ArrowRight, Shield, Heart, Award } from 'lucide-react';
import { getImageUrl } from '../../utils/imageHelper';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-24 pb-12 lg:pt-32 bg-brand-bg overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-full lg:w-1/3 h-full bg-brand-bg-secondary/30 lg:-skew-x-12 lg:translate-x-1/4 z-0" />
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-brand-bg to-transparent z-0 lg:hidden" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:items-center">
          
          {/* Mobile/Tablet Visual - Shown first on small screens */}
          <div className="lg:hidden relative order-1 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="aspect-[16/10] sm:aspect-[21/9] rounded-[2.5rem] overflow-hidden hardware-border shadow-2xl">
                <img 
                  src={getImageUrl("https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=1200")} 
                  alt="Happy Dog" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Floating Badge for Mobile */}
              <div className="absolute -bottom-4 -right-4 bg-brand-primary text-brand-bg-secondary p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 border border-brand-accent/20">
                <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center">
                  <Dog className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[8px] uppercase tracking-widest opacity-70">Quality & Care</div>
                  <div className="text-sm font-bold leading-none">Premium Breeds</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Left Content - 7 columns */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-6 lg:mb-8">
                <div className="h-[1px] w-8 lg:w-12 bg-brand-accent" />
                <span className="micro-label text-brand-accent">Est. 2008 • New Delhi</span>
              </div>

              <h1 className="editorial-title mb-6 lg:mb-8">
                K9 Snipers <br />
                <span className="text-brand-accent italic font-serif normal-case tracking-normal">Pet Shop</span>
              </h1>

              <div className="relative mb-8 lg:mb-10">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-brand-accent/20 rounded-full" />
                <p className="text-xl md:text-3xl text-brand-text font-medium leading-tight pl-6 max-w-xl">
                  Where healthy pets find happy homes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-12 lg:mb-16">
                <Link 
                  to="/pets" 
                  className="btn-premium px-8 lg:px-10 py-4 lg:py-5 rounded-2xl text-brand-bg-secondary font-bold transition-all flex items-center justify-center gap-3 group shadow-xl shadow-brand-primary/10"
                >
                  Find Your Companion
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/products" 
                  className="bg-brand-bg-secondary border border-brand-accent/20 hover:border-brand-accent text-brand-primary px-8 lg:px-10 py-4 lg:py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  Shop Accessories
                </Link>
              </div>

              {/* Trust Badges - Horizontal Row */}
              <div className="flex flex-wrap gap-6 lg:gap-8 pt-6 lg:pt-8 border-t border-brand-primary/10">
                <div className="flex items-center gap-2 lg:gap-3">
                  <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-brand-accent" />
                  <span className="text-[10px] lg:text-sm font-bold uppercase tracking-wider text-brand-primary/70">Certified Breeds</span>
                </div>
                <div className="flex items-center gap-2 lg:gap-3">
                  <Heart className="w-4 h-4 lg:w-5 lg:h-5 text-brand-accent" />
                  <span className="text-[10px] lg:text-sm font-bold uppercase tracking-wider text-brand-primary/70">Expert Care</span>
                </div>
                <div className="flex items-center gap-2 lg:gap-3">
                  <Award className="w-4 h-4 lg:w-5 lg:h-5 text-brand-accent" />
                  <span className="text-[10px] lg:text-sm font-bold uppercase tracking-wider text-brand-primary/70">15+ Years Experience</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Desktop Visual - 5 columns (Hidden on mobile/tablet) */}
          <div className="hidden lg:block lg:col-span-5 relative order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden hardware-border shadow-2xl">
                <img 
                  src={getImageUrl("https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=1000")} 
                  alt="Happy Dog" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-brand-primary text-brand-bg-secondary p-6 rounded-3xl shadow-xl z-20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-accent rounded-2xl flex items-center justify-center">
                    <Dog className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest opacity-70 mb-1">Quality & Care</div>
                    <div className="text-xl font-bold leading-none">Premium Breeds</div>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Circle */}
              <div className="absolute -top-10 -right-10 w-40 h-40 border-2 border-dashed border-brand-accent/30 rounded-full animate-[spin_20s_linear_infinite] z-0" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
