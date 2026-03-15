import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Syringe, 
  GraduationCap, 
  Sparkles, 
  Users 
} from 'lucide-react';

const features = [
  { title: "Feeding Guidelines", icon: Heart },
  { title: "Vaccination Schedule Guidance", icon: Syringe },
  { title: "Basic Training Advice", icon: GraduationCap },
  { title: "Grooming Recommendations", icon: Sparkles },
  { title: "First-Time Pet Owner Consultation", icon: Users }
];

const AfterCare = () => {
  return (
    <section className="relative py-24 lg:py-48 bg-brand-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Mobile/Tablet Unique Layout (hidden on lg) */}
        <div className="lg:hidden">
          <div className="micro-label mb-6">Lifelong Support</div>
          <h2 className="text-5xl font-display font-bold tracking-tighter uppercase leading-[0.85] mb-12 text-brand-primary">
            Care Beyond <br />
            <span className="text-brand-accent">Adoption</span>
          </h2>
          
          <div className="relative space-y-12">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-brand-accent-secondary/20" />
            
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-16"
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-brand-bg border-2 border-brand-accent z-10" />
                
                <div className="p-8 bg-brand-bg-secondary rounded-[32px] border border-brand-accent-secondary/10 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-brand-bg flex items-center justify-center text-brand-accent mb-6">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div className="micro-label mb-2 text-brand-accent">Step 0{index + 1}</div>
                  <h4 className="text-xl font-display font-bold text-brand-primary uppercase tracking-tighter">{feature.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop Layout (hidden on mobile/tablet) */}
        <div className="hidden lg:flex flex-col lg:flex-row items-center gap-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:w-1/2 relative"
          >
            <div className="rounded-[3rem] overflow-hidden aspect-[4/5] relative z-10 shadow-sm border border-brand-accent-secondary/10">
              <img 
                src="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=1000" 
                alt="Pet Care"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/60 via-transparent to-transparent" />
            </div>
            {/* Decorative Circle */}
            <div className="absolute -top-12 -left-12 w-48 h-48 border border-brand-accent/20 rounded-full animate-[spin_10s_linear_infinite]" />
          </motion.div>

          <div className="lg:w-1/2">
            <div className="micro-label mb-6">Lifelong Support</div>
            <h2 className="editorial-title mb-12">
              Care Beyond <br />
              <span className="text-brand-accent">Adoption</span>
            </h2>
            <p className="text-brand-text text-xl mb-16 leading-relaxed">
              Our responsibility does not end after the sale. We guide every pet owner to ensure proper care and long-term health.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-brand-accent font-bold text-2xl opacity-30 group-hover:opacity-100 transition-opacity">0{index + 1}</span>
                    <div className="h-px w-8 bg-brand-accent-secondary/20 group-hover:w-12 group-hover:bg-brand-accent transition-all" />
                  </div>
                  <h4 className="text-lg font-display font-bold text-brand-primary uppercase tracking-tight group-hover:text-brand-accent transition-colors">
                    {feature.title}
                  </h4>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AfterCare;
