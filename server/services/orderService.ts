import { adminDb } from '../../src/lib/firebase-admin';
import { logger } from '../utils/logger';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'pet' | 'product';
}

export interface OrderData {
  userId: string;
  items: OrderItem[];
  deliveryInfo: any;
  amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled' | 'completed';
  createdAt: any;
}

export class OrderService {
  static async calculateAmount(items: OrderItem[]): Promise<number> {
    let total = 0;
    for (const item of items) {
      const collection = item.type === 'pet' ? 'pets' : 'products';
      const doc = await adminDb.collection(collection).doc(item.id).get();
      
      if (!doc.exists) {
        throw new Error(`Item ${item.id} not found in ${collection}`);
      }
      
      const data = doc.data();
      total += (data?.price || 0) * item.quantity;
    }
    return total;
  }

  static async createPendingOrder(userId: string, items: OrderItem[], deliveryInfo: any): Promise<string> {
    const amount = await this.calculateAmount(items);
    
    const orderData: OrderData = {
      userId,
      items,
      deliveryInfo,
      amount,
      status: 'pending',
      createdAt: new Date(),
    };

    const orderRef = await adminDb.collection('orders').add(orderData);
    logger.info('Pending order created', { orderId: orderRef.id, userId, amount });
    return orderRef.id;
  }

  static async markOrderAsPaid(orderId: string, razorpayPaymentId: string): Promise<void> {
    const orderRef = adminDb.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      throw new Error(`Order ${orderId} not found`);
    }

    await orderRef.update({
      status: 'paid',
      razorpayPaymentId,
      paidAt: new Date(),
    });

    logger.info('Order marked as paid', { orderId, razorpayPaymentId });
  }

  static async getOrder(orderId: string): Promise<OrderData | null> {
    const doc = await adminDb.collection('orders').doc(orderId).get();
    return doc.exists ? (doc.data() as OrderData) : null;
  }
}
