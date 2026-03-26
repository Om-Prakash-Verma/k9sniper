import React from 'react';
import { motion } from 'motion/react';
import { FileText, ShieldCheck, Search, Truck, Globe } from 'lucide-react';

const services = [
  {
    title: "Health Certification",
    icon: ShieldCheck,
    desc: "Expert guidance on health certification requirements subject to government regulations."
  },
  {
    title: "Documentation Assistance",
    icon: FileText,
    desc: "Complete assistance with mandatory documentation and cross-border paperwork requirements."
  },
  {
    title: "Breed Consultation",
    icon: Search,
    desc: "Professional breed selection consultation tailored for international relocation and adaptation."
  },
  {
    title: "Transport Coordination",
    icon: Truck,
    desc: "Seamless transport coordination ensuring safe and compliant pet mobility across borders."
  }
];

const ExportServices = () => {
  return (
    <section id="services" className="relative py-16 lg:py-32 bg-brand-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-12 lg:mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="micro-label mb-4 text-brand-accent">Global Logistics</div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold tracking-tighter uppercase leading-[0.8] text-brand-primary mb-4 break-words">
              Global <br />
              <span className="text-brand-accent">Pet Mobility</span>
            </h2>
            <div className="h-px w-32 bg-brand-accent" />
          </div>
          <div className="lg:max-w-xs pt-4">
            <p className="text-brand-text text-xl leading-relaxed">
              We specialize in the safe and professional transport of pets across borders, ensuring a stress-free journey.
            </p>
          </div>
        </div>

        {/* Hero Image for Services */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-16 aspect-[21/9] rounded-[3rem] overflow-hidden border border-brand-accent-secondary/10 shadow-2xl"
        >
          <img 
            src="/global-transport.jpg" 
            alt="Global Pet Transport" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Technical Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-12 bg-brand-bg-secondary border border-brand-accent-secondary/10 rounded-[3rem] hover:bg-brand-primary transition-all duration-700 shadow-sm hover:shadow-2xl overflow-hidden"
            >
              <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
                <div className="w-20 h-20 rounded-3xl bg-brand-bg flex items-center justify-center text-brand-accent shadow-lg group-hover:bg-brand-accent group-hover:text-brand-bg-secondary transition-all duration-500 shrink-0">
                  <service.icon className="w-10 h-10" />
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-mono text-[10px] text-brand-accent tracking-widest uppercase group-hover:text-brand-bg-secondary/50 transition-colors">LOG_ID: {index + 100}</span>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Active Service</span>
                    </div>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-display font-bold text-brand-primary uppercase tracking-tighter leading-none mb-6 group-hover:text-brand-bg-secondary transition-colors duration-500 break-words">
                    {service.title}
                  </h3>
                  <p className="text-brand-text text-lg leading-relaxed mb-8 group-hover:text-brand-bg-secondary/70 transition-colors duration-500">
                    {service.desc}
                  </p>
                  <button className="px-8 py-4 border border-brand-accent-secondary/20 rounded-2xl text-brand-primary font-bold uppercase text-[10px] tracking-widest group-hover:bg-brand-accent group-hover:border-brand-accent group-hover:text-brand-bg-secondary transition-all duration-500">
                    Learn More
                  </button>
                </div>
              </div>
              
              {/* Decorative Background Number */}
              <div className="absolute -bottom-12 -right-12 font-display font-bold text-[15rem] text-brand-primary/[0.02] group-hover:text-white/[0.02] transition-colors duration-500 pointer-events-none">
                0{index + 1}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technical Footer */}
        <div className="mt-16 p-12 bg-brand-bg-secondary border border-brand-accent-secondary/10 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-12 shadow-sm">
          <div className="flex items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-accent flex items-center justify-center text-brand-bg-secondary shadow-xl">
              <Globe className="w-8 h-8" />
            </div>
            <div>
              <div className="text-brand-primary font-bold text-2xl uppercase tracking-tighter">Pan-India Network</div>
              <div className="text-brand-accent text-[10px] font-bold uppercase tracking-widest">All Major Cities Supported</div>
            </div>
          </div>
          <div className="flex gap-12">
            <div className="text-center">
              <div className="text-brand-primary font-bold text-3xl">100%</div>
              <div className="text-brand-text text-[10px] font-bold uppercase tracking-widest">Safety Record</div>
            </div>
            <div className="text-center">
              <div className="text-brand-primary font-bold text-3xl">24/7</div>
              <div className="text-brand-text text-[10px] font-bold uppercase tracking-widest">Live Tracking</div>
            </div>
          </div>
          <button className="px-12 py-6 bg-brand-primary text-brand-bg-secondary rounded-[2rem] font-bold uppercase text-xs tracking-widest hover:bg-brand-accent transition-all duration-500 shadow-2xl">
            Request Quote
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExportServices;
