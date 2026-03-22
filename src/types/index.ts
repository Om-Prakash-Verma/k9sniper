
export interface Pet {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  slug?: string;
  updatedAt?: string;
  createdAt?: string;
  status?: 'available' | 'sold';
  lastAccessed?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  slug?: string;
  updatedAt?: string;
  createdAt?: string;
  status?: 'in-stock' | 'out-of-stock';
  lastAccessed?: number;
  variations?: string[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: 'pet' | 'product';
}

export interface Order {
  id: string;
  userId: string;
  items: Omit<CartItem, 'image'>[];
  amount: number;
  deliveryInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  razorpay_order_id: string;
  razorpay_payment_id: string;
  status: 'paid' | 'pending' | 'failed';
  createdAt: any; // Firestore Timestamp
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'admin' | 'client';
  createdAt: string;
  updatedAt: string;
}

export interface Metadata {
  id: string; // 'pets' or 'products'
  lastUpdated: number;
  version: number;
}

export interface ShopSettings {
  deliveryFeeThreshold: number;
  fixedDeliveryFee: number;
}
