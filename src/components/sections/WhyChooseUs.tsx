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
  { 
    title: "Wide Variety of Pets", 
    description: "From premium dog breeds to exotic birds and aquatic life, we offer the most diverse selection in Delhi NCR.",
    icon: CheckCircle2,
    code: "VAR_01"
  },
  { 
    title: "Health-Focused", 
    description: "Every pet undergoes rigorous health checks and vaccinations before finding their forever home.",
    icon: HeartPulse,
    code: "HLT_02"
  },
  { 
    title: "Transparent Trust", 
    description: "Honest documentation and clear communication at every step of your pet ownership journey.",
    icon: MessageSquare,
    code: "TRN_03"
  },
  { 
    title: "After-Care Support", 
    description: "Our relationship doesn't end at the sale. We provide lifelong guidance for your pet's well-being.",
    icon: LifeBuoy,
    code: "SUP_04"
  },
  { 
    title: "Global Exports", 
    description: "Professional assistance for international pet transport and documentation compliance.",
    icon: Plane,
    code: "EXP_05"
  },
  { 
    title: "Complete Solutions", 
    description: "A curated range of premium food, accessories, and grooming essentials for every pet type.",
    icon: Package,
    code: "ACC_06"
  },
  { 
    title: "Digital Payments", 
    description: "Secure and flexible payment options including all major digital wallets and cards.",
    icon: CreditCard,
    code: "PAY_07"
  }
];

const WhyChooseUs = () => {
  return (
    <section className="relative py-16 lg:py-32 bg-brand-bg overflow-hidden border-y border-brand-accent-secondary/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-12 lg:mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="micro-label mb-4 text-brand-accent">The K9 Standard</div>
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter uppercase leading-[0.8] text-brand-primary mb-4">
              Why <br />
              <span className="text-brand-accent">K9 Snipers</span>
            </h2>
            <div className="h-px w-32 bg-brand-accent" />
          </div>
          <div className="lg:max-w-xs pt-4">
            <p className="text-brand-text text-xl leading-relaxed italic font-serif">
              "Setting the benchmark for pet care, variety, and customer trust in New Delhi since inception."
            </p>
          </div>
        </div>

        {/* Technical Data Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-brand-accent-secondary/10">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 lg:p-12 border-r border-b border-brand-accent-secondary/10 hover:bg-brand-primary transition-all duration-500 relative flex flex-col min-h-[320px]"
            >
              {/* Technical Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 rounded-2xl bg-brand-bg-secondary border border-brand-accent-secondary/20 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-brand-bg-secondary transition-all duration-500">
                  <reason.icon className="w-6 h-6" />
                </div>
                <div className="font-mono text-[10px] text-brand-accent tracking-widest opacity-50 group-hover:opacity-100 group-hover:text-brand-bg-secondary transition-all">
                  {reason.code}
                </div>
              </div>

              {/* Content */}
              <div className="mt-auto">
                <h4 className="text-2xl font-display font-bold text-brand-primary leading-tight uppercase tracking-tighter mb-4 group-hover:text-brand-bg-secondary transition-colors">
                  {reason.title}
                </h4>
                <p className="text-brand-text text-sm leading-relaxed group-hover:text-brand-bg-secondary/70 transition-colors">
                  {reason.description}
                </p>
              </div>

              {/* Index Indicator */}
              <div className="absolute bottom-4 right-4 font-mono text-[10px] text-brand-primary/10 group-hover:text-brand-bg-secondary/20">
                (0{index + 1})
              </div>
            </motion.div>
          ))}
          
          {/* Empty Filler Card for Grid Balance */}
          <div className="hidden lg:flex p-12 border-r border-b border-brand-accent-secondary/10 bg-brand-bg-secondary/30 items-center justify-center">
            <div className="text-center">
              <div className="micro-label text-brand-accent mb-2">Join the Family</div>
              <div className="text-brand-primary/20 font-display font-bold text-4xl uppercase tracking-tighter">K9S</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
