import React from 'react';
import { motion } from 'motion/react';

const About = () => {
  return (
    <section id="overview" className="py-20 md:py-32 bg-brand-bg-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center lg:text-left"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 md:mb-8 tracking-tighter leading-tight">
              A World of <span className="text-brand-accent">Pets, Care & Comfort</span>
            </h2>
            <div className="space-y-6 text-base md:text-xl text-text-body leading-relaxed max-w-xl mx-auto lg:mx-0">
              <p>
                K9 Snipers Dog Shop is a trusted and professionally managed pet store located in New Kondli Market, Mayur Vihar Phase 3, New Delhi.
              </p>
              <p>
                We provide a wide variety of pets including dogs, cats, birds, aquatic pets, and rabbits. Along with pets, we offer premium accessories, food, and professional guidance to ensure every pet enjoys a healthy and happy life.
              </p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-10 md:mt-12 flex justify-center lg:justify-start"
            >
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-brand-accent" />
                <span className="text-xs uppercase tracking-[0.3em] font-bold text-brand-accent">Est. Professional Care</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-12 lg:mt-0"
          >
            <div className="absolute -inset-4 bg-brand-accent/10 blur-3xl rounded-full" />
            <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-[4/5] sm:aspect-square lg:aspect-square">
              <img 
                src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=1000" 
                alt="Happy Dog"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-bg-secondary via-transparent to-transparent opacity-40" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
