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
    <section className="py-24 md:py-32 bg-brand-bg-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter"
            >
              Care Beyond <span className="text-brand-accent">Adoption</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-text-body mb-12 leading-relaxed"
            >
              Our responsibility does not end after the sale. We guide every pet owner to ensure proper care and long-term health.
            </motion.p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  className="flex items-center gap-6 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center group-hover:bg-brand-accent transition-colors duration-500">
                    <feature.icon className="w-6 h-6 text-brand-accent group-hover:text-white transition-colors duration-500" />
                  </div>
                  <span className="text-lg font-medium text-white/80 group-hover:text-white transition-colors duration-500">
                    {feature.title}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2 relative"
          >
            <div className="absolute -inset-4 bg-brand-accent/10 blur-3xl rounded-full" />
            <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-square">
              <img 
                src="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=1000" 
                alt="Pet Owner with Dog"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-brand-bg-secondary/40 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AfterCare;
