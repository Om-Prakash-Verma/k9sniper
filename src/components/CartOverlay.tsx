import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageHelper';

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

import Notification, { NotificationType } from './Notification';

const CartOverlay: React.FC<CartOverlayProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: NotificationType } | null>(null);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    try {
      // 1. Create Order on Backend
      const response = await fetch('/api/payments/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPrice,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`
        })
      });

      const order = await response.json();

      // 2. Open Razorpay Checkout
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      
      if (!razorpayKey) {
        throw new Error('Razorpay Key ID is missing. Please set VITE_RAZORPAY_KEY_ID in your environment.');
      }

      if (!(window as any).Razorpay) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "K9 SNIPERS",
        description: "Pet & Accessories Purchase",
        order_id: order.id,
        handler: async (response: any) => {
          // 3. Verify Payment on Backend
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          });

          const result = await verifyRes.json();
          if (result.status === 'success') {
            setNotification({ message: 'Payment Successful! Thank you for your purchase.', type: 'success' });
            setTimeout(() => {
              clearCart();
              onClose();
            }, 2000);
          } else {
            setNotification({ message: 'Payment Verification Failed.', type: 'error' });
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#FF6321"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Checkout error:', error);
      setNotification({ message: 'Something went wrong during checkout.', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-primary/40 backdrop-blur-sm z-[60]"
          />
          
          <AnimatePresence>
            {notification && (
              <Notification 
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification(null)}
              />
            )}
          </AnimatePresence>

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-bg shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-brand-accent-secondary/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-brand-accent w-5 h-5 md:w-6 md:h-6" />
                <h2 className="text-xl md:text-2xl font-display font-bold text-brand-primary uppercase tracking-tighter">Your Cart</h2>
                <span className="bg-brand-accent text-brand-bg-secondary text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-brand-accent/10 rounded-full transition-colors">
                <X className="text-brand-primary w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-accent/5 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-brand-accent/20" />
                  </div>
                  <p className="text-brand-text/60 font-medium text-sm md:text-base">Your cart is empty</p>
                  <button onClick={onClose} className="mt-4 text-brand-accent font-bold uppercase text-xs md:text-sm tracking-widest hover:underline">
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 md:gap-4 group">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-brand-bg-secondary border border-brand-accent-secondary/10 shrink-0">
                      <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-brand-primary font-bold uppercase tracking-tighter truncate pr-2 text-sm md:text-base">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-brand-text/40 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-brand-accent font-bold mb-2 md:mb-3 text-sm md:text-base">₹{item.price.toLocaleString()}</div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-brand-accent-secondary/20 rounded-lg overflow-hidden">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-brand-accent/10 transition-colors">
                            <Minus className="w-3 h-3 text-brand-primary" />
                          </button>
                          <span className="px-2 md:px-3 text-[10px] md:text-xs font-bold text-brand-primary">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-brand-accent/10 transition-colors">
                            <Plus className="w-3 h-3 text-brand-primary" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-4 md:p-6 border-t border-brand-accent-secondary/10 bg-brand-bg-secondary/50">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <span className="text-brand-text/60 font-medium text-sm md:text-base">Total Amount</span>
                  <span className="text-2xl md:text-3xl font-display font-bold text-brand-primary tracking-tighter">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full btn-premium py-3 md:py-4 rounded-2xl flex items-center justify-center gap-3 text-brand-bg-secondary font-bold uppercase text-xs md:text-sm tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-brand-bg-secondary/30 border-t-brand-bg-secondary rounded-full animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Checkout
                    </>
                  )}
                </button>
                <p className="text-[8px] md:text-[10px] text-center text-brand-text/40 mt-3 md:mt-4 uppercase tracking-widest">
                  Secure Payment Powered by Razorpay
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartOverlay;
