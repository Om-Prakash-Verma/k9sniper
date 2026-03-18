import React from 'react';
import { motion } from 'motion/react';
import { Dog } from 'lucide-react';
import { getImageUrl } from '../../utils/imageHelper';

const About = () => {
  return (
    <section id="overview" className="relative bg-brand-bg overflow-hidden flex flex-col lg:flex-row border-b border-brand-accent-secondary/10">
      {/* Left Pane: Content */}
      <div className="lg:w-1/2 px-8 py-10 md:px-16 md:py-16 flex flex-col justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="micro-label mb-4 text-brand-accent">A World of Pets, Care & Comfort</div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold tracking-tighter uppercase leading-[0.85] text-brand-primary mb-8 break-words">
            Healthy Pets <br />
            <span className="text-brand-accent">Happy Homes</span>
          </h2>
          
          <div className="space-y-4 text-xl md:text-2xl text-brand-text leading-relaxed max-w-xl mb-10">
            <p className="font-bold text-brand-primary">
              K9 SNIPERS Dog Shop is a trusted and professionally managed pet store located at New Kondli Market, Mayur Vihar Phase 3, New Delhi.
            </p>
            <p className="font-serif italic">
              "We specialize in all major dog breeds, various cat breeds, birds, freshwater fishes, premium pet accessories and food, along with pet export assistance services."
            </p>
          </div>

          <div className="flex flex-wrap gap-8 items-center">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-14 h-14 rounded-full border-4 border-brand-bg bg-brand-bg-secondary overflow-hidden shadow-xl">
                  <img src={getImageUrl(`https://picsum.photos/seed/pet${i}/100/100`)} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div>
              <div className="text-brand-primary font-bold text-lg">500+ Happy Families</div>
              <div className="text-brand-accent text-sm font-bold uppercase tracking-widest">Trusted across Delhi NCR</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Pane: Immersive Image */}
      <div className="lg:w-1/2 h-[60vh] lg:h-auto relative overflow-hidden group">
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <img 
            src={getImageUrl("https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1000")} 
            alt="Happy Dog"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-primary/10 group-hover:bg-transparent transition-colors duration-700" />
        </motion.div>
        
        {/* Floating Technical Detail */}
        <div className="absolute bottom-12 right-12 bg-brand-bg-secondary/90 backdrop-blur-md p-8 rounded-[2rem] border border-brand-accent-secondary/20 shadow-2xl max-w-xs">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-accent flex items-center justify-center text-brand-bg-secondary">
              <Dog className="w-6 h-6" />
            </div>
            <div>
              <div className="text-brand-primary font-bold text-2xl">15+</div>
              <div className="text-brand-accent text-[10px] font-bold uppercase tracking-widest">Years Experience</div>
            </div>
          </div>
          <p className="text-brand-text text-sm leading-relaxed">
            Expert guidance and global standards in pet care, right here in New Delhi.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
