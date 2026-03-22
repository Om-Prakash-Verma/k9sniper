import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const router = express.Router();

// Razorpay Lazy Initialization
let razorpayInstance: Razorpay | null = null;
const getRazorpay = () => {
  if (!razorpayInstance) {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!key_id || !key_secret) {
      throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables are required");
    }
    
    razorpayInstance = new Razorpay({
      key_id,
      key_secret,
    });
  }
  return razorpayInstance;
};

// Create Razorpay Order
router.post("/order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, notes } = req.body;
    const razorpay = getRazorpay();

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt,
      notes,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    // Sanitize error for client
    res.status(500).json({ error: "Failed to create payment order. Please try again." });
  }
});

// Verify Razorpay Payment and Save Order
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, deliveryInfo, items, userId, amount } = req.body;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret) {
      throw new Error("RAZORPAY_KEY_SECRET is missing");
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", key_secret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment verified, now save order to Firestore securely
      const db = getFirestore();
      const orderData = {
        userId: userId || 'anonymous',
        items: items.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          type: item.type
        })),
        amount: amount,
        deliveryInfo,
        razorpay_order_id,
        razorpay_payment_id,
        status: 'paid',
        createdAt: FieldValue.serverTimestamp()
      };

      const orderRef = await db.collection('orders').add(orderData);
      
      res.json({ 
        status: 'success', 
        message: 'Payment verified and order saved successfully',
        orderId: orderRef.id 
      });
    } else {
      res.status(400).json({ status: "failure", message: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Razorpay Verification/Save Error:", error);
    // Sanitize error for client
    res.status(500).json({ error: "Payment verification failed. Please contact support." });
  }
});

export default router;
