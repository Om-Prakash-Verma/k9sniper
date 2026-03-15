import React from 'react';
import { motion } from 'motion/react';
import { FileText, ShieldCheck, Search, Truck } from 'lucide-react';

const services = [
  {
    title: "Health Certification Guidance",
    icon: ShieldCheck,
    desc: "Expert advice on obtaining necessary health clearances and vaccinations."
  },
  {
    title: "Documentation Assistance",
    icon: FileText,
    desc: "Complete support for government regulations and required paperwork."
  },
  {
    title: "Breed Selection Consultation",
    icon: Search,
    desc: "Professional guidance on choosing the right breed for international travel."
  },
  {
    title: "Transport Coordination",
    icon: Truck,
    desc: "Seamless logistics planning for safe and comfortable pet relocation."
  }
];

const ExportServices = () => {
  return (
    <section id="services" className="relative py-24 lg:py-48 bg-brand-bg-secondary border-y border-brand-accent-secondary/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start mb-16 lg:mb-24">
          <div className="lg:w-1/2">
            <div className="micro-label mb-4">Global Reach</div>
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter uppercase leading-none mb-8 text-brand-primary">
              Pet <br />
              <span className="text-brand-accent">Export</span> <br />
              Services
            </h2>
          </div>
          <div className="lg:w-1/2">
            <p className="text-brand-text text-xl leading-relaxed">
              We assist customers with pet export services in accordance with government regulations and documentation requirements.
            </p>
          </div>
        </div>

        {/* Mobile/Tablet Unique Layout (hidden on lg) */}
        <div className="lg:hidden space-y-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-brand-bg rounded-[32px] border border-brand-accent-secondary/10 relative overflow-hidden shadow-sm"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-brand-bg-secondary border border-brand-accent-secondary/20 flex items-center justify-center text-brand-accent">
                  <service.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-brand-accent/10 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                  <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">Active</span>
                </div>
              </div>
              <h4 className="text-2xl font-display font-bold text-brand-primary uppercase tracking-tighter mb-4">{service.title}</h4>
              <p className="text-brand-text text-sm leading-relaxed">
                {service.desc}
              </p>
              
              {/* Module ID */}
              <div className="mt-8 pt-6 border-t border-brand-accent-secondary/10 flex justify-between items-center">
                <span className="text-[10px] font-bold text-brand-primary/20 uppercase tracking-widest">Service_0{index + 1}</span>
                <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">Ready for assistance</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop Layout (hidden on mobile/tablet) */}
        <div className="hidden lg:grid grid-cols-2 gap-px bg-brand-accent-secondary/20 border border-brand-accent-secondary/20">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-12 bg-brand-bg-secondary hover:bg-brand-bg transition-all duration-500 flex flex-col md:flex-row gap-10 items-start"
            >
              <div className="w-16 h-16 rounded-2xl border border-brand-accent-secondary/20 flex items-center justify-center shrink-0 group-hover:border-brand-accent/50 transition-colors">
                <service.icon className="w-8 h-8 text-brand-accent" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold text-brand-accent opacity-50">0{index + 1}</span>
                  <h4 className="text-2xl font-display font-bold text-brand-primary uppercase tracking-tight">{service.title}</h4>
                </div>
                <p className="text-brand-text text-lg leading-relaxed">
                  {service.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technical Footer */}
        <div className="mt-12 flex flex-wrap gap-8 justify-between items-center py-8 border-t border-brand-accent-secondary/10">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">System Status: Global Ready</span>
          </div>
          <div className="flex gap-12">
            <div>
              <div className="text-[10px] font-bold uppercase text-brand-accent mb-1">Regulations</div>
              <div className="text-brand-primary font-bold text-sm uppercase">IATA Compliant</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-brand-accent mb-1">Support</div>
              <div className="text-brand-primary font-bold text-sm uppercase">24/7 Logistics</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExportServices;
