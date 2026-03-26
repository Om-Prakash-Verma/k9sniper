import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, CheckCircle2, ShieldCheck } from 'lucide-react';

const MissionVision = () => {
  const missionPoints = [
    "Provide healthy and well-maintained pets",
    "Educate customers about proper pet care",
    "Promote ethical pet sourcing practices",
    "Offer professional after-sale guidance",
    "Ensure long-term pet well-being"
  ];

  const visionPoints = [
    "Maintaining high standards of pet health and hygiene",
    "Expanding our services to include safe pet export assistance",
    "Offering a complete ecosystem of pets, accessories, and guidance",
    "Building trust with every pet lover who visits us"
  ];

  return (
    <section className="relative py-16 lg:py-32 bg-brand-bg overflow-hidden border-b border-brand-accent-secondary/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-brand-accent-secondary/10 border border-brand-accent-secondary/10 rounded-[3rem] overflow-hidden shadow-2xl">
          
          {/* Mission Block */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-brand-bg p-10 md:p-16 flex flex-col"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                <Target className="w-6 h-6" />
              </div>
              <div className="micro-label text-brand-accent">Our Purpose</div>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-display font-bold text-brand-primary uppercase tracking-tighter leading-[0.85] mb-8">
              Our <br />
              <span className="text-brand-accent italic">Commitment</span>
            </h2>
            
            <p className="text-brand-text text-xl font-bold mb-6 leading-relaxed">
              At K9SNIPERS Pet Shop, we are committed to providing healthy pets, quality accessories, and expert guidance to ensure a happy and fulfilling life for every pet and their owner.
            </p>

            <p className="text-brand-text/60 font-bold uppercase tracking-widest text-[10px] mb-6">We strive to:</p>

            <ul className="space-y-4 mb-12">
              {missionPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3 group">
                  <CheckCircle2 className="w-5 h-5 text-brand-accent mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-brand-text font-medium">{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8 border-t border-brand-accent-secondary/10">
              <p className="text-brand-primary font-serif italic text-lg">
                "We believe informed pet owners create happier pets and stronger bonds."
              </p>
            </div>
          </motion.div>

          {/* Vision Block */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-brand-bg-secondary p-10 md:p-16 flex flex-col"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <Eye className="w-6 h-6" />
              </div>
              <div className="micro-label text-brand-primary">Our Future</div>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-display font-bold text-brand-primary uppercase tracking-tighter leading-[0.85] mb-8">
              Our <br />
              <span className="text-brand-accent italic">Vision</span>
            </h2>
            
            <p className="text-brand-text text-xl font-bold mb-10 leading-relaxed">
              Our vision is to become one of Delhi’s most trusted and responsible pet care providers.
            </p>

            <div className="space-y-8">
              <p className="text-brand-text/60 font-bold uppercase tracking-widest text-[10px]">We aim to achieve this by:</p>
              <div className="grid grid-cols-1 gap-6">
                {visionPoints.map((point, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-brand-bg rounded-2xl border border-brand-accent-secondary/5 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-brand-accent" />
                    <span className="text-brand-primary font-bold text-sm uppercase tracking-tight">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-12 flex justify-end">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-brand-accent" />
                <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">Certified Excellence</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default MissionVision;
