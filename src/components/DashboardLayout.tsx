import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogOut, LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path?: string;
}

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  navItems: NavItem[];
  activeTab: string;
  onTabChange: (id: any) => void;
  onLogout: () => void;
  children: React.ReactNode;
  brandName?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  subtitle,
  navItems,
  activeTab,
  onTabChange,
  onLogout,
  children,
  brandName = "K9 SNIPER"
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-8">
        <Link to="/" className="block">
          <h1 className="text-2xl font-display font-bold text-brand-primary uppercase tracking-tighter italic">
            {brandName}<br/>
            <span className="text-brand-accent not-italic text-sm tracking-widest">{title}</span>
          </h1>
        </Link>
        {subtitle && (
          <p className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest mt-2">{subtitle}</p>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              onTabChange(item.id);
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all ${
              activeTab === item.id 
                ? 'bg-brand-accent text-brand-bg-secondary shadow-lg shadow-brand-accent/20' 
                : 'text-brand-text/60 hover:bg-brand-accent/5 hover:text-brand-primary'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-8 border-t border-brand-accent-secondary/5">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold uppercase text-xs tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-80 bg-brand-bg-secondary border-r border-brand-accent-secondary/5 flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-brand-bg-secondary/80 backdrop-blur-md border-b border-brand-accent-secondary/5 z-40 flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-brand-primary font-bold tracking-tighter text-lg uppercase italic">{brandName} <span className="text-brand-accent not-italic text-xs">{title}</span></span>
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-3 bg-brand-accent/10 text-brand-accent rounded-xl hover:bg-brand-accent hover:text-brand-bg-secondary transition-all"
          aria-label="Open Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-brand-primary/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-brand-bg-secondary z-[60] lg:hidden shadow-2xl"
            >
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-6 right-6 p-2 text-brand-primary hover:bg-brand-accent/10 rounded-full transition-colors"
                aria-label="Close Menu"
              >
                <X className="w-6 h-6" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto pt-20 lg:pt-0">
          <div className="p-6 md:p-10 lg:p-16 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
