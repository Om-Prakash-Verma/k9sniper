import { z } from 'zod';

export const CreateOrderSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
      type: z.enum(['pet', 'product']),
    })).min(1, 'At least one item is required').max(50, 'Too many items'),
    deliveryInfo: z.object({
      name: z.string().min(2).max(100),
      email: z.string().email(),
      phone: z.string().min(10).max(15),
      address: z.string().min(10).max(500),
      city: z.string().min(2).max(100),
      pincode: z.string().min(6).max(10),
    }),
  }),
});

export const VerifyPaymentSchema = z.object({
  body: z.object({
    razorpay_order_id: z.string().min(1, 'Razorpay Order ID is required'),
    razorpay_payment_id: z.string().min(1, 'Razorpay Payment ID is required'),
    razorpay_signature: z.string().min(1, 'Razorpay Signature is required'),
    internal_order_id: z.string().min(1, 'Internal Order ID is required'),
  }),
});
