/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Dog, ChevronRight } from 'lucide-react';

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'glass-nav py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center">
            <Dog className="text-white w-5 h-5" />
          </div>
          <span className="text-white font-bold tracking-tighter text-xl">K9 SNIPERS</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {[
            { name: 'Overview', id: 'overview' },
            { name: 'Pets', id: 'pets' },
            { name: 'Accessories', id: 'accessories' },
            { name: 'Services', id: 'services' },
            { name: 'Contact', id: 'contact' }
          ].map((item) => (
            <a
              key={item.name}
              href={`#${item.id}`}
              className="text-sm font-medium text-text-body hover:text-white transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        <button className="btn-premium px-6 py-2 rounded-full text-sm font-semibold text-white flex items-center gap-2 group">
          Visit Store
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.nav>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="bg-brand-bg min-h-screen selection:bg-brand-accent/30">
      <Navbar />
      <main>
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
