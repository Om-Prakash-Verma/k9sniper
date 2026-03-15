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
import ResponsibleOwnership from './components/sections/ResponsibleOwnership';
import VisitStore from './components/sections/VisitStore';
import Footer from './components/sections/Footer';
import { CartProvider, useCart } from './context/CartContext';
import CartOverlay from './components/CartOverlay';
import { ShoppingBag, User, LogOut, Settings } from 'lucide-react';
import { auth, db } from './firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './utils/firestoreErrorHandler';
import AdminPanel from './components/AdminPanel';
import LoginPage from './components/LoginPage';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PetsPage from './pages/PetsPage';
import ProductsPage from './pages/ProductsPage';
import PetDetailPage from './pages/PetDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';
import { getImageUrl } from './utils/imageHelper';

// --- Components ---

interface NavbarProps {
  user: any;
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, isAdmin, onLogin, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();
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
            <span className="text-brand-primary font-bold tracking-tighter text-xl">K9 SNIPERS</span>
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
                {user.photoURL ? (
                  <img src={getImageUrl(user.photoURL)} alt="Profile" className="w-8 h-8 rounded-full border border-brand-accent" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-brand-bg-secondary font-bold text-xs">
                    {user.email?.[0].toUpperCase()}
                  </div>
                )}
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
              <button className="mt-8 btn-premium text-brand-bg-secondary px-8 py-4 rounded-full font-bold text-lg">
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

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (!userDoc.exists()) {
            const role = currentUser.email === 'flixwatch.pro@gmail.com' || currentUser.email === 'webapp1.in@gmail.com' ? 'admin' : 'client';
            await setDoc(doc(db, 'users', currentUser.uid), {
              email: currentUser.email,
              role: role
            });
            setIsAdmin(role === 'admin');
          } else {
            setIsAdmin(userDoc.data().role === 'admin');
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
        }
      } else {
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleLogout = () => signOut(auth);

  return (
    <BrowserRouter>
      <CartProvider>
        <div className="bg-brand-bg min-h-screen selection:bg-brand-accent/30 relative">
          <Navbar user={user} isAdmin={isAdmin} onLogin={handleLogin} onLogout={handleLogout} />
          
          <AnimatePresence>
            {showLoginModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-brand-primary/60 backdrop-blur-md" 
                  onClick={() => setShowLoginModal(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-md"
                >
                  <LoginPage 
                    user={user} 
                    isAdmin={isAdmin} 
                    onSuccess={() => setShowLoginModal(false)} 
                  />
                  <button 
                    onClick={() => setShowLoginModal(false)}
                    className="absolute top-6 right-6 p-2 text-brand-primary hover:bg-brand-accent/10 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <main className="relative">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/pets" element={<PetsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/pet/:id" element={<PetDetailPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/admin" element={
                authLoading ? (
                  <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
                  </div>
                ) : isAdmin ? (
                  <AdminPanel />
                ) : (
                  <LoginPage user={user} isAdmin={isAdmin} onSuccess={() => {}} />
                )
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
