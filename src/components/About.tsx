import React from 'react';
import { motion } from 'motion/react';
import { getImageUrl } from '../utils/imageHelper';

const About: React.FC = () => {
  return (
    <section id="overview" className="py-32 bg-[#0A0A0C] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white/90 mb-8 tracking-tighter leading-tight">
              A World of <br />
              <span className="text-[#C47A2C]">Pets, Care & Comfort</span>
            </h2>
            <div className="space-y-6 text-lg text-white/60 leading-relaxed font-medium">
              <p>
                K9 Snipers Dog Shop is a trusted and professionally managed pet store located in 
                New Kondli Market, Mayur Vihar Phase 3, New Delhi.
              </p>
              <p>
                We provide a wide variety of pets including dogs, cats, birds, aquatic pets, and rabbits. 
                Along with pets, we offer premium accessories, food, and professional guidance to ensure 
                every pet enjoys a healthy and happy life.
              </p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-12"
            >
              <div className="h-px w-24 bg-[#C47A2C] mb-6" />
              <p className="text-sm uppercase tracking-[0.3em] text-[#FFB347] font-bold">
                Established Excellence
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-[#C47A2C]/10 blur-3xl rounded-full" />
            <div className="relative rounded-3xl overflow-hidden border border-white/5 aspect-[4/5]">
              <img 
                src={getImageUrl("about-hero.jpg")} 
                alt="Premium Pet Care"
                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent opacity-60" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
