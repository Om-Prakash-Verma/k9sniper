import React from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingBag, 
  Utensils, 
  Bone, 
  Waves, 
  Bed, 
  ShieldCheck, 
  Gamepad2, 
  Scissors, 
  Box, 
  Settings 
} from 'lucide-react';

const products = [
  { title: "Premium Nutrition", icon: Utensils, desc: "High-performance meals for all breeds and life stages." },
  { title: "Comfort Living", icon: Bed, desc: "Orthopedic and plush bedding for restorative rest." },
  { title: "Active Lifestyle", icon: Gamepad2, desc: "Interactive gear designed for physical and mental agility." },
  { title: "Professional Care", icon: Scissors, desc: "Specialized hygiene and grooming solutions for a healthy coat." }
];

const Accessories = () => {
  return (
    <section id="accessories" className="relative py-16 lg:py-32 bg-brand-bg overflow-hidden border-b border-brand-accent-secondary/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 lg:mb-16">
          <div className="micro-label mb-4 text-brand-accent">Premium Catalog</div>
          <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter uppercase leading-[0.8] text-brand-primary mb-8">
            The <span className="text-brand-accent italic">Essentials</span> <br />
            Collection
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <p className="text-brand-text text-xl max-w-xl leading-relaxed">
              Elevate your pet's lifestyle with our curated selection of high-quality food, toys, and grooming essentials.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-brand-accent-secondary/20 flex items-center justify-center text-brand-accent">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="text-brand-primary font-bold uppercase tracking-widest text-xs">Available In-Store</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-accent-secondary/10 border border-brand-accent-secondary/10 rounded-[3rem] overflow-hidden shadow-2xl">
          {products.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-brand-bg group relative p-12 flex flex-col justify-between min-h-[500px] hover:bg-brand-primary transition-colors duration-700"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-brand-bg-secondary flex items-center justify-center text-brand-accent mb-8 group-hover:bg-brand-accent group-hover:text-brand-bg-secondary transition-all duration-500 shadow-lg">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-display font-bold text-brand-primary uppercase tracking-tighter leading-none mb-6 group-hover:text-brand-bg-secondary transition-colors duration-500">
                  {item.title}
                </h3>
                <p className="text-brand-text text-lg leading-relaxed group-hover:text-brand-bg-secondary/70 transition-colors duration-500">
                  {item.desc}
                </p>
              </div>

              <div className="relative z-10 mt-12">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-[10px] text-brand-accent tracking-widest uppercase">Stock Status</span>
                  <span className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock
                  </span>
                </div>
                <button className="w-full py-5 border border-brand-accent-secondary/20 rounded-2xl text-brand-primary font-bold uppercase text-[10px] tracking-widest group-hover:bg-brand-accent group-hover:border-brand-accent group-hover:text-brand-bg-secondary transition-all duration-500">
                  View Catalog
                </button>
              </div>

              {/* Background Decorative Number */}
              <div className="absolute top-12 right-12 font-display font-bold text-9xl text-brand-accent-secondary/5 group-hover:text-white/5 transition-colors duration-500 pointer-events-none">
                0{index + 1}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Brand Showcase */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
          {['Royal Canin', 'Pedigree', 'Whiskas', 'Drools', 'Farmina'].map((brand) => (
            <span key={brand} className="text-2xl font-display font-bold text-brand-primary uppercase tracking-widest">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Accessories;
