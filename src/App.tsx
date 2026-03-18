/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
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

function AppContent() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="bg-brand-bg min-h-screen selection:bg-brand-accent/30 relative">
      <Navbar onLogin={() => setShowLoginModal(true)} />
      
      <AuthModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      <main className="relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pets" element={<PetsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/pet/:slug" element={<PetDetailPage />} />
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
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

