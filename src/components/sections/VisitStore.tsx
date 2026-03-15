import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Clock, Navigation, Instagram, Mail, MessageSquare } from 'lucide-react';

const VisitStore = () => {
  return (
    <section id="contact" className="relative py-16 lg:py-32 bg-brand-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-12 lg:mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="micro-label mb-4 text-brand-accent">Get In Touch</div>
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter uppercase leading-[0.85] text-brand-primary">
              Connect <br />
              <span className="text-brand-accent">With Us</span>
            </h2>
          </div>
          <div className="lg:max-w-xs">
            <p className="text-brand-text text-lg leading-relaxed">
              Whether you're looking for a new companion or professional advice, our team is here to help you every step of the way.
            </p>
          </div>
        </div>

        {/* New Connect Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Contact Info & Socials */}
          <div className="lg:col-span-4 space-y-4">
            {/* Contact Cards */}
            <div className="grid grid-cols-1 gap-4">
              <motion.a 
                href="tel:+919643797801"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group p-8 bg-brand-bg-secondary border border-brand-accent-secondary/10 rounded-[2rem] flex items-center gap-6 hover:bg-brand-primary transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-bg flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-brand-bg-secondary transition-all">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-brand-accent group-hover:text-brand-bg-secondary/50 transition-colors">Call Support</div>
                  <div className="text-brand-primary font-bold text-xl group-hover:text-brand-bg-secondary transition-colors">+91 96437 97801</div>
                </div>
              </motion.a>

              <motion.a 
                href="mailto:info@k9snipers.com"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group p-8 bg-brand-bg-secondary border border-brand-accent-secondary/10 rounded-[2rem] flex items-center gap-6 hover:bg-brand-primary transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-bg flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-brand-bg-secondary transition-all">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-brand-accent group-hover:text-brand-bg-secondary/50 transition-colors">Email Us</div>
                  <div className="text-brand-primary font-bold text-xl group-hover:text-brand-bg-secondary transition-colors">info@k9snipers.com</div>
                </div>
              </motion.a>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-brand-bg-secondary border border-brand-accent-secondary/10 rounded-[2rem]"
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-4">Store Management</div>
              <div className="mb-6">
                <div className="text-brand-primary font-bold text-xl">Ankit Singh Chauhan</div>
                <div className="text-[10px] font-medium uppercase tracking-widest text-brand-text/60">Proprietor</div>
              </div>
              <div className="p-4 bg-brand-accent/10 rounded-xl border border-brand-accent/20">
                <div className="text-brand-accent font-bold text-sm uppercase tracking-tighter">Home Delivery Available</div>
                <div className="text-[10px] text-brand-text/80">Across Delhi NCR & Major Cities</div>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-brand-bg-secondary border border-brand-accent-secondary/10 rounded-[2rem]"
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-4">Follow Our Journey</div>
              <div className="flex gap-4">
                <a 
                  href="https://www.instagram.com/k9_snipers_petshop/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-brand-bg border border-brand-accent-secondary/20 flex items-center justify-center text-brand-primary hover:bg-brand-accent hover:text-brand-bg-secondary transition-all duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 rounded-xl bg-brand-bg border border-brand-accent-secondary/20 flex items-center justify-center text-brand-primary hover:bg-brand-accent hover:text-brand-bg-secondary transition-all duration-300">
                  <MessageSquare className="w-5 h-5" />
                </a>
              </div>
            </motion.div>

            {/* Hours */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-brand-primary rounded-[2rem] text-brand-bg-secondary"
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-brand-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Store Hours</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="font-medium">Mon – Sat</span>
                  <span className="font-bold">10 AM – 10 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Sunday</span>
                  <span className="font-bold">1 PM – 5 PM</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Map & Address */}
          <div className="lg:col-span-8 space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-[3rem] overflow-hidden border border-brand-accent-secondary/10 group shadow-2xl"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.562306721665!2d77.3243!3d28.6129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzQ2LjQiTiA3N8KwMTknMjcuNSJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'grayscale(1) contrast(1.1) brightness(0.9)' }} 
                allowFullScreen={true} 
                loading="lazy"
                title="K9 Snipers Location"
              ></iframe>
              <div className="absolute inset-0 bg-brand-primary/10 pointer-events-none group-hover:bg-transparent transition-all duration-700" />
              
              <div className="absolute bottom-8 left-8 right-8 p-8 bg-brand-bg-secondary/90 backdrop-blur-xl rounded-[2rem] border border-brand-accent-secondary/20 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-brand-accent flex items-center justify-center text-brand-bg-secondary shadow-lg">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">Flagship Store</div>
                    <div className="text-brand-primary font-bold text-lg leading-tight">Mayur Vihar Phase 3, New Delhi</div>
                  </div>
                </div>
                <a 
                  href="https://maps.app.goo.gl/YourActualMapLink" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full md:w-auto px-10 py-5 bg-brand-primary text-brand-bg-secondary rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-brand-accent transition-all duration-300"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
              </div>
            </motion.div>

            {/* Address Details */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-brand-bg-secondary border border-brand-accent-secondary/10 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-8"
            >
              <a 
                href="https://maps.app.goo.gl/YourActualMapLink" 
                target="_blank" 
                rel="noopener noreferrer"
                className="max-w-md group"
              >
                <div className="text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-4">Full Address (Click to View Map)</div>
                <p className="text-brand-primary text-xl font-medium leading-relaxed group-hover:text-brand-accent transition-colors">
                  Opposite Punjabi Dhaba, New Kondli Market, Mayur Vihar Phase 3, New Delhi – 110096
                </p>
              </a>
              <div className="flex gap-4 w-full md:w-auto">
                <button 
                  onClick={() => navigator.clipboard.writeText("Opposite Punjabi Dhaba, New Kondli Market, Mayur Vihar Phase 3, New Delhi – 110096")}
                  className="flex-1 md:flex-none px-10 py-5 bg-brand-bg border border-brand-accent-secondary/20 rounded-2xl text-brand-primary font-bold uppercase tracking-widest text-[10px] hover:bg-brand-primary hover:text-brand-bg-secondary transition-all"
                >
                  Copy Address
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default VisitStore;
