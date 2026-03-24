# K9 Premium Shop - High-Performance Pet E-Commerce

A sophisticated, production-grade pet shop application built with **React 18**, **Vite**, **Tailwind CSS**, and **Firebase**. This project features a cutting-edge **offline-first, low-read architecture** designed for extreme performance and cost-efficiency.

## ✨ Key Features

- **💎 Premium Design**: Immersive UI with high-contrast typography, smooth motion transitions, and a "hardware-inspired" aesthetic.
- **🚀 Offline-First Architecture**: Powered by **IndexedDB (Dexie.js)** for instant page loads and full offline browsing of the pet and product catalogs.
- **🔄 Delta Synchronization**: Intelligent background syncing that only fetches modified data, drastically reducing Firestore read costs.
- **🛡️ Multi-Layer Security**: Robust Firestore Security Rules combined with server-side payment verification via **Razorpay**.
- **📊 Advanced Admin Panel**: Comprehensive management suite for pets, products, orders, and global shop settings.
- **📱 Fully Responsive**: Optimized for everything from ultra-wide desktops to mobile touch devices.
- **🛒 Seamless Checkout**: Integrated cart system with real-time stock validation and secure payment processing.

## 🚀 Tech Stack

- **Frontend**: React 18 (Functional Components, Hooks, Context API)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (Utility-first, mobile-first)
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **Database (Remote)**: Firebase Firestore
- **Authentication**: Firebase Auth (Google OAuth)
- **Database (Local)**: IndexedDB with [Dexie.js](https://dexie.org/)
- **Payments**: Razorpay API (with Cloudflare Pages Functions for backend verification)

## 🏗️ Data Architecture

The application implements a multi-tier data strategy to ensure high performance and minimal remote reads:

1.  **In-Memory Cache**: React state for instant UI updates.
2.  **IndexedDB (Dexie.js)**: Persistent client-side storage for large datasets, supporting fast local queries and filtering.
3.  **Firestore**: Remote source of truth, queried only when local data is missing or outdated.
4.  **LRU Eviction**: Automatic pruning of old cache entries to maintain optimal device storage.

## 🛡️ Security Implementation

### 1. Payment Security
- **Server-Side Validation**: Prices are recalculated on the server during order creation.
- **Signature Verification**: Every Razorpay payment is cryptographically verified before being accepted.
- **Amount Confirmation**: The backend confirms the paid amount directly with Razorpay's API.

### 2. Firestore Security Rules
- **Default Deny**: All access is blocked unless explicitly permitted.
- **RBAC**: Role-Based Access Control ensures only verified admins can modify the catalog.
- **Data Validation**: Strict schema enforcement for all write operations.

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- Firebase Project
- Razorpay Account (for payments)

### Installation

1.  **Clone and Install**:
    ```bash
    npm install
    ```

2.  **Configuration**:
    The app uses `firebase-applet-config.json` for Firebase client settings. Ensure this file is present in the root directory.
    For backend functions, set the following environment variables in your deployment platform:
    - `RAZORPAY_KEY_ID`
    - `RAZORPAY_KEY_SECRET`
    - `FIREBASE_SERVICE_ACCOUNT`
    - `FIREBASE_PROJECT_ID`

3.  **Development**:
    ```bash
    npm run dev
    ```

4.  **Production Build**:
    ```bash
    npm run build
    ```

## 📂 Project Structure

- `/src/components`: Reusable UI components and section layouts.
- `/src/context`: Global state management (Auth, Cart, ShopData).
- `/src/pages`: Main application views (Home, Pets, Products, Details).
- `/src/db`: IndexedDB schema and database initialization.
- `/src/utils`: Helper functions for images, slugs, and error handling.
- `/functions`: Serverless API routes for payment processing.

---

## 🛡️ Security Note
The security rules and payment flows are designed for production use. However, always perform a final security audit and penetration test before a wide public launch.

