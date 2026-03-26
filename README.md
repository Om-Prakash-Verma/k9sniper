# K9 Premium Shop - High-Performance Pet E-Commerce

A sophisticated, production-grade pet shop application built with **React 19**, **Vite**, **Tailwind CSS 4**, and **Firebase**. This project features a cutting-edge **offline-first, low-read architecture** designed for extreme performance and cost-efficiency.

## ✨ Key Features

- **💎 Premium Design**: Immersive UI with high-contrast typography, smooth motion transitions, and a "hardware-inspired" aesthetic.
- **🚀 Offline-First Architecture**: Powered by **IndexedDB (Dexie.js)** for instant page loads and full offline browsing of the pet and product catalogs.
- **🔄 Delta Synchronization**: Intelligent background syncing that only fetches modified data, drastically reducing Firestore read costs.
- **🛡️ Multi-Layer Security**: Robust Firestore Security Rules combined with server-side payment verification via **Razorpay**.
- **📊 Advanced Admin Panel**: Comprehensive management suite for pets, products, orders, and global shop settings.
- **📱 Fully Responsive**: Optimized for everything from ultra-wide desktops to mobile touch devices.
- **🛒 Seamless Checkout**: Integrated cart system with real-time stock validation and secure payment processing.

## 🚀 Tech Stack

- **Frontend**: React 19 (Functional Components, Hooks, Context API)
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 (Utility-first, mobile-first)
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **Database (Remote)**: Firebase Firestore
- **Authentication**: Firebase Auth (Google OAuth)
- **Database (Local)**: IndexedDB with [Dexie.js](https://dexie.org/)
- **Payments**: Razorpay API
- **Backend**: Cloudflare Pages Functions (Serverless API)

## 🏗️ Data Architecture

The application implements a multi-tier data strategy to ensure high performance and minimal remote reads:

1.  **In-Memory Cache**: React state for instant UI updates.
2.  **IndexedDB (Dexie.js)**: Persistent client-side storage for large datasets, supporting fast local queries and filtering.
3.  **Firestore**: Remote source of truth, queried only when local data is missing or outdated.
4.  **LRU Eviction**: Automatic pruning of old cache entries to maintain optimal device storage.

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: Version 18.0.0 or higher.
- **npm**: Standard Node package manager.
- **Firebase Account**: Access to the [Firebase Console](https://console.firebase.google.com/).
- **Razorpay Account**: Access to [Razorpay Dashboard](https://dashboard.razorpay.com/) for API keys.

### Installation

1.  **Clone and Install**:
    ```bash
    npm install
    ```

2.  **Firebase Configuration**:
    - Create a Firebase project and enable **Firestore** and **Authentication** (Google provider).
    - Ensure `firebase-applet-config.json` is present in the root directory with your client-side settings.
    - Deploy the `firestore.rules` to your project via the Firebase Console.

3.  **Razorpay Configuration**:
    - Generate API keys (Key ID and Key Secret) from your Razorpay Dashboard.

4.  **Environment Variables**:
    Create a `.env` file for the frontend:
    ```env
    VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
    ```
    For local backend development with Wrangler, create a `.dev.vars` file:
    ```env
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    FIREBASE_PROJECT_ID=your_firebase_project_id
    FIREBASE_SERVICE_ACCOUNT='{"type": "service_account", ...}'
    ```

### Development Commands

- **Frontend Only**:
  ```bash
  npm run dev
  ```
  Runs the Vite dev server on `http://localhost:3000`.

- **Full-Stack (Frontend + API)**:
  ```bash
  npm run build
  npm run pages:dev
  ```
  Uses Wrangler to serve the built frontend and the Cloudflare Pages Functions locally.

## 🛡️ Security Implementation

### 1. Payment Security
- **Server-Side Validation**: Prices are recalculated on the server during order creation using the Firestore REST API.
- **Signature Verification**: Every Razorpay payment is cryptographically verified before being accepted.
- **Amount Confirmation**: The backend confirms the paid amount directly with Razorpay's API.

### 2. Firestore Security Rules
- **Default Deny**: All access is blocked unless explicitly permitted.
- **RBAC**: Role-Based Access Control ensures only verified admins can modify the catalog.
- **Data Validation**: Strict schema enforcement for all write operations.

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
