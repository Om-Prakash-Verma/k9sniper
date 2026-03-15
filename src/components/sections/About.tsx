import React from 'react';
import { motion } from 'motion/react';
import { Dog } from 'lucide-react';

const About = () => {
  return (
    <section id="overview" className="relative py-24 lg:py-48 bg-brand-bg overflow-hidden">
      {/* Mobile/Tablet Unique Layout (hidden on lg) */}
      <div className="lg:hidden px-6 relative">
        <div className="flex gap-4">
          {/* Vertical Rail Title */}
          <div className="w-12 shrink-0 flex flex-col items-center border-r border-brand-accent/10 pt-4">
            <div className="writing-mode-vertical rotate-180 micro-label whitespace-nowrap mb-8 text-brand-accent">
              EST. PROFESSIONAL CARE
            </div>
            <div className="w-px h-32 bg-gradient-to-b from-brand-accent to-transparent" />
          </div>
          
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-6xl font-display font-bold tracking-tighter uppercase leading-[0.8] mb-12 text-brand-primary">
                K9 <br />
                <span className="text-brand-accent">Snipers</span>
              </h2>
              
              <div className="relative mb-16">
                <div className="p-3 bg-brand-bg-secondary rounded-[2rem] border border-brand-accent-secondary/20 rotate-2 shadow-sm">
                  <div className="rounded-2xl overflow-hidden aspect-video">
                    <img 
                      src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=1000" 
                      alt="Happy Dog"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-4 bg-brand-accent px-4 py-2 rounded-xl text-brand-bg-secondary font-bold text-sm shadow-xl -rotate-3">
                  15+ YEARS
                </div>
              </div>

              <div className="space-y-6 text-lg text-brand-text leading-relaxed">
                <p className="text-brand-primary font-bold">
                  Trusted and professionally managed pet store in New Delhi.
                </p>
                <p>
                  We provide a wide variety of pets including dogs, cats, birds, and aquatic life. Along with premium accessories and professional guidance.
                </p>
              </div>

              <div className="mt-12 p-6 bg-brand-bg-secondary border border-brand-accent-secondary/20 rounded-3xl shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-bg bg-brand-bg-secondary overflow-hidden">
                        <img src={`https://picsum.photos/seed/mobpet${i}/100/100`} alt="User" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">500+ Families</span>
                </div>
                <div className="text-[10px] text-brand-accent uppercase tracking-widest">Trusted across Delhi NCR</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Desktop Layout (hidden on mobile/tablet) */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-3/5"
          >
            <div className="micro-label mb-8">About K9 Snipers</div>
            <h2 className="editorial-title mb-12">
              A World of <br />
              <span className="text-brand-accent">Pets, Care</span> <br />
              & Comfort
            </h2>
            <div className="space-y-8 text-xl md:text-2xl text-brand-text leading-relaxed max-w-2xl">
              <p className="font-bold text-brand-primary">
                K9 Snipers Dog Shop is a trusted and professionally managed pet store located in New Kondli Market, New Delhi.
              </p>
              <p>
                We provide a wide variety of pets including dogs, cats, birds, and aquatic life. Along with pets, we offer premium accessories, food, and professional guidance to ensure every pet enjoys a healthy and happy life.
              </p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-16 flex items-center gap-6"
            >
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-brand-bg bg-brand-bg-secondary overflow-hidden">
                    <img src={`https://picsum.photos/seed/pet${i}/100/100`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="text-brand-primary font-bold">500+ Happy Families</div>
                <div className="text-brand-accent">Trusted by pet lovers across Delhi</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-2/5 relative"
          >
            <div className="p-4 bg-brand-bg-secondary rounded-[2.5rem] border border-brand-accent-secondary/20 shadow-sm">
              <div className="rounded-[2rem] overflow-hidden aspect-[3/4]">
                <img 
                  src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=1000" 
                  alt="Happy Dog"
                  className="w-full h-full object-cover transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-6 flex justify-between items-end">
                <div>
                  <div className="micro-label">Location</div>
                  <div className="text-brand-primary font-bold">New Delhi, India</div>
                </div>
                <div className="w-12 h-12 rounded-full border border-brand-accent-secondary/20 flex items-center justify-center text-brand-accent">
                  <Dog className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            {/* Floating Detail */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 bg-brand-accent p-6 rounded-[2rem] shadow-2xl hidden md:block"
            >
              <div className="text-brand-bg-secondary font-bold text-4xl">15+</div>
              <div className="text-brand-bg-secondary/80 text-xs font-bold uppercase tracking-widest">Years Experience</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
