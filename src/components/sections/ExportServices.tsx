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
    <section id="services" className="py-24 md:py-32 bg-brand-bg relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-brand-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-brand-accent/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter"
          >
            Pet <span className="text-brand-accent">Export Services</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-text-body max-w-3xl mx-auto"
          >
            We assist customers with pet export services in accordance with government regulations and documentation requirements.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative p-[1px] rounded-3xl overflow-hidden transition-all duration-500"
            >
              {/* Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-accent to-brand-accent-light opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative h-full bg-brand-bg-secondary p-8 rounded-[23px] flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <service.icon className="w-8 h-8 text-brand-accent" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4 leading-tight">{service.title}</h4>
                <p className="text-text-body leading-relaxed text-sm">
                  {service.desc}
                </p>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-brand-accent/0 group-hover:bg-brand-accent/5 transition-colors duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExportServices;
