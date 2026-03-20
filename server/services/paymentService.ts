import Razorpay from 'razorpay';
import crypto from 'crypto';
import { logger } from '../utils/logger';

let razorpayInstance: Razorpay | null = null;

export const getRazorpay = () => {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing');
    }

    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpayInstance;
};

export class PaymentService {
  static async createOrder(amount: number, orderId: string): Promise<any> {
    const razorpay = getRazorpay();
    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit
      currency: 'INR',
      receipt: `order_rcpt_${orderId}`,
    };

    try {
      const order = await razorpay.orders.create(options);
      logger.info('Razorpay order created', { razorpayOrderId: order.id, orderId, amount });
      return order;
    } catch (error) {
      logger.error('Failed to create Razorpay order', { error, orderId, amount });
      throw error;
    }
  }

  static verifySignature(razorpayOrderId: string, razorpayPaymentId: string, signature: string): boolean {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) throw new Error('RAZORPAY_KEY_SECRET is missing');

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === signature;
    if (!isValid) {
      logger.security('Invalid Razorpay signature', { razorpayOrderId, razorpayPaymentId });
    }
    return isValid;
  }
}
