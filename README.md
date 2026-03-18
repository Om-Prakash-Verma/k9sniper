# K9 Shop - Production-Grade Offline-First Pet Shop

A high-performance, scalable, and resilient pet shop application built with React, Vite, Tailwind CSS, and Firebase. This project features a sophisticated **offline-first, low-read architecture** designed to provide a seamless user experience while operating efficiently within Firebase's free tier limits.

## 🚀 Tech Stack

- **Frontend**: React 18+, Vite, TypeScript
- **Styling**: Tailwind CSS
- **Database (Remote)**: Firebase Firestore
- **Authentication**: Firebase Auth (Google Login)
- **Database (Local)**: IndexedDB with [Dexie.js](https://dexie.org/)
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React

## 🏗️ Data Architecture

The application implements a multi-tier data strategy to ensure high performance and minimal remote reads.

### 1. Multi-Tier Storage
- **In-Memory Cache**: React state (Context API) for instant UI updates.
- **IndexedDB (Dexie.js)**: Persistent client-side storage for large datasets, supporting fast local queries and filtering.
- **Firestore**: Remote source of truth, only queried when local data is missing or outdated.

### 2. Delta Synchronization
Instead of refetching entire collections, the app uses **Delta Sync**:
- It tracks `lastSyncTime` locally for each collection (`pets`, `products`).
- Background checks query Firestore only for documents where `updatedAt > lastSyncTime`.
- This drastically reduces read costs and bandwidth usage as the catalog grows.

### 3. Split Metadata Strategy
- Update tracking is handled via separate documents in the `metadata` collection (e.g., `metadata/pets`, `metadata/products`).
- This avoids write bottlenecks on a single document and allows independent synchronization of different data types.
- Includes a **versioning system** to force a full cache rebuild across all clients when critical schema changes occur.

### 4. LRU Cache Eviction
To prevent unbounded storage growth in IndexedDB:
- Every document includes a `lastAccessed` timestamp.
- The app implements a **Least Recently Used (LRU)** eviction strategy.
- When a collection exceeds a predefined limit (e.g., 100 items), the oldest items are automatically pruned.

### 5. Resilience & Reliability
- **Request Deduplication**: Uses `useRef` guards to prevent concurrent duplicate sync requests.
- **Exponential Backoff**: Failed sync operations are retried with progressively longer delays (up to 5 attempts).
- **Periodic Sync**: Background checks occur every 5 minutes and whenever the browser tab becomes visible again.
- **Self-Healing**: If IndexedDB corruption is detected, the app automatically clears and rebuilds the local cache from Firestore.

## 🛠️ Key Components

### `ShopDataContext.tsx`
The heart of the data layer. Manages the synchronization lifecycle, IndexedDB interactions, and global state for pets and products.

### `shopDb.ts`
Defines the Dexie database schema with performance-optimized indexes for fast local sorting and filtering.

### `metadataHelper.ts`
Utility for interacting with the split metadata documents in Firestore to track remote updates.

### `firestore.rules`
Production-ready security rules implementing:
- **Default Deny**: All access is blocked by default.
- **Public Reads**: Allowed for `pets`, `products`, and `metadata` to support the offline-first flow.
- **Admin-Only Writes**: Strict validation for data modifications, including immutable field protection and schema enforcement.
- **RBAC**: Role-based access control for administrative tasks.

## 📦 Getting Started

1. **Environment Variables**:
   Ensure your `.env` file contains the necessary Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## 🛡️ Security Note
The Firestore security rules are designed as a robust prototype. Before a wide public launch, it is recommended to further harden rules based on specific business logic and perform a full security audit.
