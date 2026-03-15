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
    <section id="accessories" className="relative py-20 md:py-32 bg-brand-bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 md:mb-16 gap-8 text-center lg:text-left">
          <div className="max-w-2xl mx-auto lg:mx-0">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tighter"
            >
              Everything Your <span className="text-brand-accent">Pet Needs</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-text-body"
            >
              Premium accessories, toys, food and care essentials designed for comfort and happiness.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end"
          >
            <button className="btn-premium px-8 py-4 rounded-full text-white font-bold flex items-center gap-3 group">
              <ShoppingBag className="w-5 h-5" />
              View Full Catalog
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {products.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="group p-6 md:p-8 rounded-3xl bg-brand-bg border border-white/5 hover:border-brand-accent/20 transition-all duration-500 relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-brand-accent/5 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-brand-accent/10 transition-colors duration-500">
                  <item.icon className="w-5 h-5 md:w-6 md:h-6 text-brand-accent" />
                </div>
                <h4 className="text-base md:text-lg font-bold text-white mb-2 group-hover:text-brand-accent transition-colors duration-500">{item.title}</h4>
                <p className="text-xs md:text-sm text-text-body leading-relaxed">{item.desc}</p>
              </div>

              {/* Hover Gradient Highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Accessories;
