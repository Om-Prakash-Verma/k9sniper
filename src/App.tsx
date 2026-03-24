/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ShopDataProvider } from './context/ShopDataContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Footer from './components/sections/Footer';
import Notification from './components/Notification';
import { useCart } from './context/CartContext';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle } from 'lucide-react';
import { auth } from './firebase';
import { sendEmailVerification } from 'firebase/auth';
import { HelmetProvider } from 'react-helmet-async';

// Lazy load pages and heavy components
const HomePage = lazy(() => import('./pages/HomePage'));
const PetsPage = lazy(() => import('./pages/PetsPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const PetDetailPage = lazy(() => import('./pages/PetDetailPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const LoginPage = lazy(() => import('./components/LoginPage'));

const LoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
  </div>
);

function AppContent() {
  const { user, isAdmin, isUnverifiedAdmin, loading: authLoading } = useAuth();
  const { notification, setNotification } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const location = useLocation();

  const handleSendVerification = async () => {
    if (!auth.currentUser) return;
    try {
      await sendEmailVerification(auth.currentUser);
      setVerificationSent(true);
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  };

  const isDashboardRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/user');

  return (
    <div className="bg-brand-bg min-h-screen selection:bg-brand-accent/30 relative overflow-x-hidden">
      {/* Global Verification Banner */}
      <AnimatePresence>
        {user && !user.emailVerified && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-brand-accent text-brand-bg-secondary py-2 px-4 relative z-[60] overflow-hidden"
          >
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Email Verification Required</span>
              </div>
              <p className="text-[10px] md:text-xs font-medium opacity-90">Please verify your email to access all features and track your orders.</p>
              <button 
                onClick={handleSendVerification}
                disabled={verificationSent}
                className="px-4 py-1 bg-brand-bg-secondary text-brand-primary rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-brand-bg-secondary transition-all disabled:opacity-50"
              >
                {verificationSent ? 'Verification Email Sent' : 'Resend Email'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isDashboardRoute && <Navbar onLogin={() => setShowLoginModal(true)} />}
      
      <AnimatePresence>
        {notification && (
          <Notification 
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      <AuthModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      <main className="relative">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pets" element={<PetsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/pet/:slug" element={<PetDetailPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/user" element={
              authLoading ? (
                <LoadingFallback />
              ) : user ? (
                <UserDashboard />
              ) : (
                <LoginPage 
                  user={user} 
                  isAdmin={isAdmin} 
                  onSuccess={() => {}} 
                  title="User Login"
                  description="Sign in to your dashboard to track your pet orders and manage your profile."
                />
              )
            } />
            <Route path="/admin" element={
              authLoading ? (
                <LoadingFallback />
              ) : isAdmin ? (
                <AdminPanel />
              ) : (
                <LoginPage 
                  user={user} 
                  isAdmin={isAdmin} 
                  isUnverifiedAdmin={isUnverifiedAdmin}
                  onSuccess={() => {}} 
                  title="Admin Access"
                  description="Please sign in with your administrator credentials to manage the catalog and orders."
                />
              )
            } />
          </Routes>
        </Suspense>
      </main>
      {!isDashboardRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <ShopDataProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </ShopDataProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

