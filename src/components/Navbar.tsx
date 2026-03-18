import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dog, ShoppingBag, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { getImageUrl } from '../utils/imageHelper';
import CartOverlay from './CartOverlay';

interface NavbarProps {
  onLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogin }) => {
  const { user, isAdmin } = useAuth();
  const { totalItems, isCartOpen, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Overview', id: 'overview', path: '/#overview' },
    { name: 'Pets', id: 'pets', path: '/pets' },
    { name: 'Accessories', id: 'accessories', path: '/products' },
    { name: 'Services', id: 'services', path: '/#services' },
    { name: 'Contact', id: 'contact', path: '/#contact' }
  ];

  const handleNavClick = (path: string) => {
    setIsMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      const id = path.substring(2);
      if (location.pathname === '/') {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      navigate(path);
      window.scrollTo(0, 0);
    }
  };

  const onLogout = () => signOut(auth);

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
          <Link to="/" className="flex items-center gap-2" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
              <Dog className="text-brand-bg-secondary w-5 h-5" />
            </div>
            <span className="text-brand-primary font-bold tracking-tighter text-lg md:text-xl">K9 SNIPERS</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.path)}
                className="text-sm font-medium text-brand-text hover:text-brand-primary transition-colors"
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link 
                to="/admin" 
                className="p-2 text-brand-accent hover:bg-brand-accent/10 rounded-full transition-colors"
                title="Admin Panel"
              >
                <Settings className="w-6 h-6" />
              </Link>
            )}

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-brand-primary hover:bg-brand-accent/10 rounded-full transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-brand-accent text-brand-bg-secondary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/user" className="transition-transform hover:scale-110">
                  {user.photoURL ? (
                    <img src={getImageUrl(user.photoURL)} alt="Profile" className="w-8 h-8 rounded-full border border-brand-accent" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-brand-bg-secondary font-bold text-xs">
                      {user.email?.[0].toUpperCase()}
                    </div>
                  )}
                </Link>
                <button onClick={onLogout} className="p-2 text-brand-text hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onLogin}
                className="hidden sm:flex btn-premium px-6 py-2 rounded-full text-sm font-semibold text-brand-bg-secondary items-center gap-2 group"
              >
                <User className="w-4 h-4" />
                Login
              </button>
            )}
            
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
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.path)}
                  className="text-left text-3xl font-bold text-brand-primary hover:text-brand-accent transition-colors"
                >
                  {item.name}
                </button>
              ))}
              {user && (
                <button
                  onClick={() => handleNavClick('/user')}
                  className="text-left text-3xl font-bold text-brand-primary hover:text-brand-accent transition-colors"
                >
                  My Account
                </button>
              )}
              {!user && (
                <button 
                  onClick={onLogin}
                  className="mt-4 btn-premium text-brand-bg-secondary px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2"
                >
                  <User className="w-5 h-5" />
                  Login
                </button>
              )}
              <button 
                onClick={() => handleNavClick('/#contact')}
                className="mt-4 bg-brand-bg-secondary border border-brand-accent-secondary/20 text-brand-primary px-8 py-4 rounded-full font-bold text-lg"
              >
                Visit Store
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartOverlay isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
