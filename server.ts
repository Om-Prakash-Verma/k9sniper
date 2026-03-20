import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { adminAuth, adminDb } from "./src/lib/firebase-admin";
import { authenticate, authorizeAdmin, rotateSession, AuthRequest } from "./server/middleware/auth";
import { validate } from "./server/middleware/validation";
import { CreateOrderSchema, VerifyPaymentSchema } from "./server/schemas/payment";
import { OrderService } from "./server/services/orderService";
import { PaymentService } from "./server/services/paymentService";
import { logger } from "./server/utils/logger";
import xss from "xss";
import Razorpay from "razorpay";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Security Headers (Helmet) - Disabled in dev for easier debugging
  if (process.env.NODE_ENV === "production") {
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          imgSrc: ["'self'", "data:", "https://picsum.photos", "https://images.unsplash.com", "https://firebasestorage.googleapis.com"],
          connectSrc: ["'self'", "https://api.razorpay.com", "https://lumberjack.razorpay.com", "https://*.firebaseio.com", "https://*.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          frameSrc: ["'self'", "https://api.razorpay.com"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }));
  } else {
    // Basic helmet in dev without strict CSP
    app.use(helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }));
  }

  // 2. Cookie Parser
  app.use(cookieParser());

  // 3. CORS Restriction
  const allowedOrigins = [
    process.env.APP_URL,
    process.env.SHARED_APP_URL,
    "http://localhost:3000"
  ].filter(Boolean) as string[];

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.security('CORS blocked', { origin });
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }));

  // 4. Global Rate Limiting for API routes
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Increased for development
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." },
  });
  app.use("/api", globalLimiter);

  // 5. Request Body Parsing with Size Limits
  app.use(express.json({ limit: "10kb" })); // Prevent large payload attacks

  // Session Auth Routes
  app.post("/api/auth/login", async (req, res) => {
    const idToken = req.body.idToken;
    if (!idToken) return res.status(400).json({ error: 'ID Token required' });

    try {
      await rotateSession(req as AuthRequest, res, idToken);
      res.json({ status: 'success' });
    } catch (error) {
      logger.error("Session Cookie Error:", { error: (error as Error).message });
      res.status(401).json({ error: "Unauthorized" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("session");
    res.json({ status: "success" });
  });

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

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Sensitive Route Rate Limiting (Payments)
  const paymentLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 payment requests per hour
    message: { error: "Too many payment attempts, please try again later." },
  });

  // Create Razorpay Order
  app.post(
    "/api/payments/order",
    paymentLimiter,
    authenticate, // Require authentication
    validate(CreateOrderSchema), // Validate input
    async (req: AuthRequest, res) => {
      try {
        const { items, deliveryInfo } = req.body;
        const userId = req.user!.uid;

        // 1. Create pending order on backend (calculates amount securely)
        const orderId = await OrderService.createPendingOrder(userId, items, deliveryInfo);

        // 2. Fetch the calculated amount
        const orderData = await OrderService.getOrder(orderId);
        if (!orderData) throw new Error('Failed to retrieve created order');

        // 3. Create Razorpay order
        const razorpayOrder = await PaymentService.createOrder(orderData.amount, orderId);

        res.json({
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          orderId: orderId // Internal order ID
        });
      } catch (error) {
        logger.error("Razorpay Order Error:", { error: (error as Error).message });
        res.status(500).json({ error: "Failed to create order. Please try again later." });
      }
    }
  );

  // Verify Razorpay Payment
  app.post(
    "/api/payments/verify",
    paymentLimiter,
    authenticate, // Require authentication
    validate(VerifyPaymentSchema), // Validate input
    async (req: AuthRequest, res) => {
      try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, internal_order_id } = req.body;

        // 1. Verify Razorpay Signature
        const isValid = PaymentService.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        if (!isValid) {
          return res.status(400).json({ error: 'Invalid payment signature' });
        }

        // 2. Verify Order Integrity
        const orderData = await OrderService.getOrder(internal_order_id);
        if (!orderData || orderData.userId !== req.user!.uid) {
          logger.security('Order integrity check failed', { internal_order_id, uid: req.user!.uid });
          return res.status(400).json({ error: 'Order mismatch' });
        }

        // 3. Mark Order as Paid on Backend
        await OrderService.markOrderAsPaid(internal_order_id, razorpay_payment_id);

        res.json({ status: "success", message: "Payment verified successfully", orderId: internal_order_id });
      } catch (error) {
        logger.error("Razorpay Verification Error:", { error: (error as Error).message });
        res.status(500).json({ error: "Verification failed. Please contact support." });
      }
    }
  );

  // Profile Update (with Sanitization)
  app.patch('/api/user/profile', authenticate, async (req: AuthRequest, res) => {
    try {
      const { displayName } = req.body;
      if (!displayName) return res.status(400).json({ error: 'DisplayName required' });

      const sanitizedName = xss(displayName);
      await adminAuth.updateUser(req.user!.uid, { displayName: sanitizedName });
      await adminDb.collection('users').doc(req.user!.uid).update({ displayName: sanitizedName });

      res.json({ status: 'success', displayName: sanitizedName });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // Example Admin Route
  app.get("/api/admin/stats", authenticate, authorizeAdmin, async (req, res) => {
    try {
      const ordersSnapshot = await adminDb.collection('orders').count().get();
      const usersSnapshot = await adminDb.collection('users').count().get();
      res.json({ message: "Welcome Admin", stats: { users: usersSnapshot.data().count, orders: ordersSnapshot.data().count } });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // 5. Centralized Error Handler (Prevent leaking stack traces)
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error("Unhandled Error:", { error: err.message, stack: err.stack });
    res.status(err.status || 500).json({
      error: process.env.NODE_ENV === "production" ? "An internal server error occurred" : err.message,
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Started and listening on 0.0.0.0:${PORT}`);
    console.log(`[SERVER] Mode: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
