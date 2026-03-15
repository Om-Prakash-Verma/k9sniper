import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  HeartPulse, 
  MessageSquare, 
  LifeBuoy, 
  Plane, 
  Package, 
  CreditCard 
} from 'lucide-react';

const reasons = [
  { title: "Wide Variety of Pets Under One Roof", icon: CheckCircle2 },
  { title: "Health-Focused Approach", icon: HeartPulse },
  { title: "Transparent Customer Interaction", icon: MessageSquare },
  { title: "After-Care Guidance", icon: LifeBuoy },
  { title: "Export Assistance", icon: Plane },
  { title: "Complete Accessory Solutions", icon: Package },
  { title: "Multiple Digital Payment Options", icon: CreditCard }
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 md:py-32 bg-brand-bg relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tighter"
          >
            Why Choose <span className="text-brand-accent">K9 Snipers</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group p-6 md:p-8 rounded-3xl bg-brand-bg-secondary border border-white/5 hover:border-brand-accent/20 transition-all duration-500 relative overflow-hidden"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-brand-accent/5 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-brand-accent/10 transition-colors duration-500">
                <reason.icon className="w-5 h-5 md:w-6 md:h-6 text-brand-accent" />
              </div>
              <h4 className="text-base md:text-lg font-bold text-white leading-tight group-hover:text-brand-accent transition-colors duration-500">
                {reason.title}
              </h4>
              
              {/* Soft Glow Border Effect */}
              <div className="absolute inset-0 border border-brand-accent/0 group-hover:border-brand-accent/20 rounded-3xl transition-colors duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
