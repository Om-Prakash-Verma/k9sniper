import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Syringe, 
  GraduationCap, 
  Sparkles, 
  Users,
  ShieldCheck
} from 'lucide-react';

const features = [
  { title: "Feeding Guidelines", icon: Heart, desc: "Customized nutritional plans focusing on proper nutrition and exercise for your pet's growth." },
  { title: "Vaccination Guidance", icon: Syringe, desc: "Professional schedule guidance for essential immunizations and long-term health monitoring." },
  { title: "Training & Social", icon: GraduationCap, desc: "Basic training advice and social behavior guidance for a well-adjusted companion." },
  { title: "Grooming & Hygiene", icon: Sparkles, desc: "Breed-specific care instructions and grooming recommendations for optimal hygiene." },
  { title: "Owner Consultation", icon: Users, desc: "Dedicated consultation for first-time pet owners to ensure a smooth transition and well-being." }
];

const AfterCare = () => {
  return (
    <section id="aftercare" className="relative py-16 lg:py-32 bg-brand-bg-secondary overflow-hidden border-b border-brand-accent-secondary/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-12 lg:mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="micro-label mb-4 text-brand-accent">Lifelong Support</div>
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter uppercase leading-[0.8] text-brand-primary mb-4">
              Beyond the <br />
              <span className="text-brand-accent italic">First Day</span>
            </h2>
            <div className="h-px w-32 bg-brand-accent" />
          </div>
          <div className="lg:max-w-xs pt-4">
            <p className="text-brand-text text-xl leading-relaxed">
              Our commitment to your pet doesn't end at the store. We provide continuous care and professional guidance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group p-12 bg-brand-bg border border-brand-accent-secondary/10 rounded-[3rem] hover:bg-brand-primary transition-all duration-700 shadow-sm hover:shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand-bg-secondary flex items-center justify-center text-brand-accent mb-8 group-hover:bg-brand-accent group-hover:text-brand-bg-secondary transition-all duration-500 shadow-lg">
                <step.icon className="w-8 h-8" />
              </div>
              
              <div className="font-mono text-[10px] text-brand-accent mb-4 tracking-widest uppercase group-hover:text-brand-bg-secondary/50 transition-colors">
                Service Phase 0{index + 1}
              </div>
              
              <h3 className="text-4xl font-display font-bold text-brand-primary uppercase tracking-tighter leading-none mb-6 group-hover:text-brand-bg-secondary transition-colors duration-500">
                {step.title}
              </h3>
              
              <p className="text-brand-text text-lg leading-relaxed mb-12 group-hover:text-brand-bg-secondary/70 transition-colors duration-500">
                {step.desc}
              </p>

              <div className="pt-8 border-t border-brand-accent-secondary/10 group-hover:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-accent group-hover:bg-brand-bg-secondary" />
                  <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest group-hover:text-brand-bg-secondary transition-colors">
                    Professional Consultation Included
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Emergency Support Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 bg-brand-accent rounded-[3rem] flex flex-col justify-between shadow-2xl relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-brand-bg-secondary mb-8">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-5xl font-display font-bold text-brand-bg-secondary uppercase tracking-tighter leading-[0.85] mb-6">
                10AM - 7PM <br />
                Priority <br />
                <span className="text-brand-primary">Support</span>
              </h3>
              <p className="text-brand-bg-secondary/80 text-lg">
                Available on working days. Emergencies on non-working days are handled via our specialized protocol.
              </p>
            </div>
            <button className="relative z-10 w-full py-5 bg-brand-primary text-brand-bg-secondary rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-white hover:text-brand-primary transition-all duration-500 shadow-xl">
              Get Support Now
            </button>
            
            {/* Decorative Background Icon */}
            <ShieldCheck className="absolute -bottom-12 -right-12 w-64 h-64 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AfterCare;
