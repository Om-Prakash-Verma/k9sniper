
export interface Pet {
  id: string;
  name: string;
  description: string;
  image: string;
  images?: string[];
  price?: number;
  category: string;
  breed?: string;
  age?: string;
  gender?: 'male' | 'female' | 'unknown';
  color?: string;
  weight?: string;
  location?: string;
  isFeatured?: boolean;
  features?: string[];
  vaccinationStatus?: string;
  origin?: string;
  healthStatus?: string;
  energyLevel?: string;
  sheddingLevel?: string;
  groomingNeeds?: string;
  temperament?: string;
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
  images?: string[];
  price: number;
  category: string;
  brand?: string;
  stock?: number;
  isFeatured?: boolean;
  specifications?: { key: string; value: string }[];
  variations?: { label: string; price: number }[];
  ingredients?: string;
  usageInstructions?: string;
  slug?: string;
  updatedAt?: string;
  createdAt?: string;
  status?: 'in-stock' | 'out-of-stock';
  lastAccessed?: number;
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
