import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Coupon } from '../types';
import { useShopData } from './ShopDataContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  deliveryFee: number;
  discountAmount: number;
  appliedCoupon: { code: string; type: 'universal' | 'product' } | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  finalTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  setNotification: (notif: { message: string; type: 'success' | 'error' | 'info' } | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { shopSettings, products } = useShopData();
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('k9_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: 'universal' | 'product' } | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    localStorage.setItem('k9_cart', JSON.stringify(cart));
    // Recalculate discount if cart changes and coupon is applied
    if (appliedCoupon) {
      recalculateDiscount(appliedCoupon.code, appliedCoupon.type);
    }
  }, [cart]);

  const recalculateDiscount = async (code: string, type: 'universal' | 'product') => {
    if (type === 'universal') {
      const q = query(collection(db, 'coupons'), where('code', '==', code.toUpperCase()), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const coupon = snap.docs[0].data() as Coupon;
        if (coupon.isActive) {
          const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          let discount = 0;
          if (coupon.type === 'percentage') {
            discount = (subtotal * coupon.value) / 100;
          } else {
            discount = coupon.value;
          }
          setDiscountAmount(Math.min(discount, subtotal));
        }
      }
    } else {
      // Product specific
      let totalDiscount = 0;
      cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product && product.productCoupons) {
          const applicableCoupon = product.productCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());
          if (applicableCoupon) {
            if (applicableCoupon.type === 'percentage') {
              totalDiscount += (item.price * item.quantity * applicableCoupon.discount) / 100;
            } else {
              totalDiscount += applicableCoupon.discount * item.quantity;
            }
          }
        }
      });
      setDiscountAmount(totalDiscount);
    }
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    if (!code) return false;
    
    // 1. Check Universal Coupons
    const q = query(collection(db, 'coupons'), where('code', '==', code.toUpperCase()), limit(1));
    const snap = await getDocs(q);
    
    if (!snap.empty) {
      const coupon = { id: snap.docs[0].id, ...snap.docs[0].data() } as Coupon;
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Validation
      if (!coupon.isActive) {
        setNotification({ message: 'This coupon is no longer active.', type: 'error' });
        return false;
      }
      if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        setNotification({ message: 'This coupon has expired.', type: 'error' });
        return false;
      }
      if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
        setNotification({ message: `Minimum order value for this coupon is ₹${coupon.minOrderValue}`, type: 'error' });
        return false;
      }
      if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
        setNotification({ message: 'This coupon has reached its maximum usage limit.', type: 'error' });
        return false;
      }

      let discount = 0;
      if (coupon.type === 'percentage') {
        discount = (subtotal * coupon.value) / 100;
      } else {
        discount = coupon.value;
      }

      setAppliedCoupon({ code: coupon.code, type: 'universal' });
      setDiscountAmount(Math.min(discount, subtotal));
      setNotification({ message: 'Coupon applied successfully!', type: 'success' });
      return true;
    }

    // 2. Check Product Specific Coupons
    let foundProduct = false;
    let totalDiscount = 0;
    
    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product && product.productCoupons) {
        const applicableCoupon = product.productCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());
        if (applicableCoupon) {
          foundProduct = true;
          if (applicableCoupon.type === 'percentage') {
            totalDiscount += (item.price * item.quantity * applicableCoupon.discount) / 100;
          } else {
            totalDiscount += applicableCoupon.discount * item.quantity;
          }
        }
      }
    });

    if (foundProduct) {
      setAppliedCoupon({ code: code.toUpperCase(), type: 'product' });
      setDiscountAmount(totalDiscount);
      setNotification({ message: 'Product coupon applied!', type: 'success' });
      return true;
    }

    setNotification({ message: 'Invalid coupon code.', type: 'error' });
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setNotification({ message: 'Coupon removed.', type: 'info' });
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    if (item.type === 'pet') {
      console.warn('Pets cannot be added to cart directly.');
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setNotification({ message: `${item.name} added to cart!`, type: 'success' });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item).filter(item => item.quantity > 0));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const deliveryFee = totalPrice >= shopSettings.deliveryFeeThreshold ? 0 : shopSettings.fixedDeliveryFee;
  const finalTotal = Math.max(0, totalPrice - discountAmount + deliveryFee);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      totalItems, 
      totalPrice,
      deliveryFee,
      discountAmount,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      finalTotal,
      isCartOpen,
      setIsCartOpen,
      notification,
      setNotification
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
