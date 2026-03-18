import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Heart, Info, AlertTriangle } from 'lucide-react';

const guidelines = [
  {
    title: "Lifetime Commitment",
    desc: "Owning a pet is a long-term commitment. Ensure you are ready for the responsibility of care, time, and financial needs.",
    icon: Heart
  },
  {
    title: "Health & Nutrition",
    desc: "Regular veterinary check-ups, timely vaccinations, and a balanced diet are essential for a pet's healthy life.",
    icon: ShieldCheck
  },
  {
    title: "Safe Environment",
    desc: "Provide a safe, clean, and comfortable living space. Ensure your home is pet-proofed and secure.",
    icon: Info
  },
  {
    title: "Legal Compliance",
    desc: "Be aware of local pet ownership laws, registration requirements, and community guidelines.",
    icon: AlertTriangle
  }
];

const ResponsibleOwnership = () => {
  return (
    <section className="py-16 lg:py-32 bg-brand-bg-secondary border-y border-brand-accent-secondary/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <div className="micro-label mb-4 text-brand-accent">Our Philosophy</div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold tracking-tighter uppercase leading-[0.85] text-brand-primary mb-6 break-words">
            Responsible <br />
            <span className="text-brand-accent">Pet Ownership</span>
          </h2>
          <p className="text-brand-text text-xl leading-relaxed">
            At K9 SNIPERS, we believe that every pet deserves a loving and responsible home. We encourage all potential pet owners to consider these essential guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guidelines.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-brand-bg border border-brand-accent-secondary/10 rounded-[2.5rem] flex gap-6 items-start group hover:bg-brand-primary transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-bg-secondary flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-brand-bg-secondary transition-all shrink-0">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-2xl font-display font-bold text-brand-primary uppercase tracking-tighter mb-3 group-hover:text-brand-bg-secondary transition-colors">
                  {item.title}
                </h4>
                <p className="text-brand-text leading-relaxed group-hover:text-brand-bg-secondary/70 transition-colors">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-brand-accent/5 rounded-[2.5rem] border border-brand-accent/10 text-center">
          <p className="text-brand-primary font-medium italic">
            "A pet is not just a possession; it's a family member that depends on you for its entire life."
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResponsibleOwnership;
