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
    <section className="relative py-24 lg:py-48 bg-brand-bg-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 lg:mb-24 gap-12">
          <div className="max-w-xl">
            <div className="micro-label mb-4">The K9 Standard</div>
            <h2 className="text-5xl md:text-8xl font-display font-bold tracking-tighter uppercase leading-[0.85] text-brand-primary">
              Why <br />
              <span className="text-brand-accent">K9 Snipers</span>
            </h2>
          </div>
          <p className="text-brand-text text-xl max-w-xs lg:text-right">
            We set the benchmark for pet care, variety, and customer trust in New Delhi.
          </p>
        </div>

        {/* Mobile/Tablet Unique Layout (hidden on lg) */}
        <div className="lg:hidden relative">
          {/* Vertical Rail */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-brand-accent-secondary/20" />
          
          <div className="space-y-8">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-16 py-4"
              >
                {/* Rail Icon */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-brand-bg border border-brand-accent-secondary/20 flex items-center justify-center z-10 shadow-sm">
                  <reason.icon className="w-5 h-5 text-brand-accent" />
                </div>
                
                <div className="p-6 bg-brand-bg rounded-2xl border border-brand-accent-secondary/10 shadow-sm">
                  <div className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-2">Benefit 0{index + 1}</div>
                  <h4 className="text-lg font-display font-bold text-brand-primary uppercase tracking-tighter leading-tight">
                    {reason.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop Layout (hidden on mobile/tablet) */}
        <div className="hidden lg:grid grid-cols-4 gap-px bg-brand-accent-secondary/20 border border-brand-accent-secondary/20">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group p-12 bg-brand-bg-secondary hover:bg-brand-bg transition-all duration-500 relative"
            >
              <div className="w-12 h-12 rounded-full border border-brand-accent-secondary/20 flex items-center justify-center mb-12 group-hover:bg-brand-accent transition-all duration-500">
                <reason.icon className="w-5 h-5 text-brand-accent group-hover:text-brand-bg-secondary transition-colors" />
              </div>
              <h4 className="text-xl font-display font-bold text-brand-primary leading-tight uppercase tracking-tight group-hover:text-brand-accent transition-colors">
                {reason.title}
              </h4>
              
              {/* Hardware Detail */}
              <div className="absolute top-4 right-4 text-[10px] font-bold text-brand-primary/10 group-hover:text-brand-accent/30 transition-colors">
                REF_0{index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
