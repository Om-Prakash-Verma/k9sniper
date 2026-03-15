/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dog, ChevronRight, Menu, X } from 'lucide-react';

import ScrollytellingCanvas from './components/ScrollytellingCanvas';
import About from './components/sections/About';
import OurPets from './components/sections/OurPets';
import Accessories from './components/sections/Accessories';
import ExportServices from './components/sections/ExportServices';
import AfterCare from './components/sections/AfterCare';
import WhyChooseUs from './components/sections/WhyChooseUs';
import VisitStore from './components/sections/VisitStore';
import Footer from './components/sections/Footer';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Overview', id: 'overview' },
    { name: 'Pets', id: 'pets' },
    { name: 'Accessories', id: 'accessories' },
    { name: 'Services', id: 'services' },
    { name: 'Contact', id: 'contact' }
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled || isMobileMenuOpen ? 'glass-nav py-4' : 'bg-transparent py-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
              <Dog className="text-brand-bg-secondary w-5 h-5" />
            </div>
            <span className="text-brand-primary font-bold tracking-tighter text-xl">K9 SNIPERS</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={`#${item.id}`}
                className="text-sm font-medium text-brand-text hover:text-brand-primary transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:flex btn-premium px-6 py-2 rounded-full text-sm font-semibold text-brand-bg-secondary items-center gap-2 group">
              Visit Store
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              className="md:hidden text-brand-primary p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden bg-brand-bg pt-24 px-6"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((item) => (
                <a
                  key={item.name}
                  href={`#${item.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-3xl font-bold text-brand-primary hover:text-brand-accent transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <button className="mt-8 btn-premium text-brand-bg-secondary px-8 py-4 rounded-full font-bold text-lg">
                Visit Store
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="bg-brand-bg min-h-screen selection:bg-brand-accent/30 relative">
      <Navbar />
      <main className="relative">
        <ScrollytellingCanvas />
        <About />
        <OurPets />
        <Accessories />
        <ExportServices />
        <AfterCare />
        <WhyChooseUs />
        <VisitStore />
      </main>
      <Footer />
    </div>
  );
}
