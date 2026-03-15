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
  { title: "Dog Food", icon: Utensils, desc: "Nutritious meals for all breeds and ages." },
  { title: "Cat Food", icon: Utensils, desc: "Premium wet and dry food options." },
  { title: "Bird Feed", icon: Bone, desc: "Specialized seeds and supplements." },
  { title: "Fish Feed", icon: Waves, desc: "High-quality flakes and pellets." },
  { title: "Pet Beds", icon: Bed, desc: "Orthopedic and plush comfort beds." },
  { title: "Collars & Leashes", icon: ShieldCheck, desc: "Durable and stylish walking gear." },
  { title: "Pet Toys", icon: Gamepad2, desc: "Interactive toys for mental stimulation." },
  { title: "Grooming Products", icon: Scissors, desc: "Shampoos, brushes, and hygiene kits." },
  { title: "Cages & Carriers", icon: Box, desc: "Safe and secure travel solutions." },
  { title: "Aquarium Equipment", icon: Settings, desc: "Filters, heaters, and lighting systems." }
];

const Accessories = () => {
  return (
    <section id="accessories" className="relative py-24 lg:py-48 bg-brand-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-24 gap-12">
          <div className="max-w-2xl">
            <div className="micro-label mb-4">The Catalog</div>
            <h2 className="text-5xl md:text-8xl font-display font-bold tracking-tighter uppercase leading-[0.85] text-brand-primary">
              Everything <br />
              <span className="text-brand-accent">They Need</span>
            </h2>
          </div>
          <div className="flex flex-col gap-6 items-start lg:items-end">
            <p className="text-brand-text text-xl max-w-sm lg:text-right">
              Premium accessories, toys, and food designed for comfort and happiness.
            </p>
            <button className="btn-premium px-10 py-5 rounded-full text-brand-bg-secondary font-bold uppercase tracking-tighter flex items-center gap-3 group">
              <ShoppingBag className="w-5 h-5" />
              Full Catalog
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Unique Layout (hidden on lg) */}
        <div className="lg:hidden space-y-4">
          {products.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="relative p-8 bg-brand-bg-secondary rounded-[32px] border border-brand-accent-secondary/10 overflow-hidden group shadow-sm"
            >
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-brand-bg flex items-center justify-center border border-brand-accent-secondary/20 text-brand-accent">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="micro-label mb-1 text-brand-accent">0{index + 1}</div>
                  <h4 className="text-xl font-display font-bold text-brand-primary uppercase tracking-tighter">{item.title}</h4>
                </div>
              </div>
              <p className="mt-6 text-brand-text text-sm leading-relaxed relative z-10">
                {item.desc}
              </p>
              
              {/* Background Accent Number */}
              <div className="absolute -bottom-4 -right-4 text-8xl font-display font-bold text-brand-primary/[0.03] select-none">
                0{index + 1}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop Layout (hidden on mobile/tablet) */}
        <div className="hidden lg:grid grid-cols-5 gap-px bg-brand-accent-secondary/20 border border-brand-accent-secondary/20">
          {products.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group bg-brand-bg p-10 hover:bg-brand-bg-secondary transition-all duration-500 relative"
            >
              <div className="w-12 h-12 rounded-full border border-brand-accent-secondary/20 flex items-center justify-center mb-12 group-hover:border-brand-accent/50 transition-colors">
                <item.icon className="w-5 h-5 text-brand-accent/60 group-hover:text-brand-accent transition-colors" />
              </div>
              <div className="micro-label mb-2 text-brand-accent">Category</div>
              <h4 className="text-xl font-display font-bold text-brand-primary mb-4 uppercase tracking-tight">{item.title}</h4>
              <p className="text-sm text-brand-text leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {item.desc}
              </p>
              
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-transparent group-hover:border-brand-accent/30 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Accessories;
