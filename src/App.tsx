/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ShopDataProvider } from './context/ShopDataContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Footer from './components/sections/Footer';
import AdminPanel from './components/AdminPanel';
import LoginPage from './components/LoginPage';
import HomePage from './pages/HomePage';
import PetsPage from './pages/PetsPage';
import ProductsPage from './pages/ProductsPage';
import PetDetailPage from './pages/PetDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';
import UserDashboard from './pages/UserDashboard';
import Notification from './components/Notification';
import { useCart } from './context/CartContext';
import { AnimatePresence } from 'motion/react';
import { Navigate } from 'react-router-dom';

function AppContent() {
  const { user, isAdmin, isUnverifiedAdmin, loading: authLoading } = useAuth();
  const { notification, setNotification } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="bg-brand-bg min-h-screen selection:bg-brand-accent/30 relative overflow-x-hidden">
      <Navbar onLogin={() => setShowLoginModal(true)} />
      
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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pets" element={<PetsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/pet/:slug" element={<PetDetailPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/user" element={
            authLoading ? (
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
              </div>
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
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
              </div>
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
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ShopDataProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </ShopDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

