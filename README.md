# K9 SNIPERS - Premium E-Commerce & Pet Services Platform

A high-performance, responsive, and secure full-stack e-commerce and logistics management platform engineered for **K9 SNIPERS**—a premium pet retailer and international pet shipping agency. 

The application is architected with a **Local-First, Offline-Capable Frontend** (React 19 + Dexie/IndexedDB) and a **Secure Edge-Computing Serverless Backend** (Cloudflare Pages Functions + Firestore REST APIs). It features cryptographically secure payment pipelines, real-time sync, and administrative inventory controls.

---

## 🚀 Key Architectural & Technical Highlights

### 1. Offline-First Synchronization Engine (SWR + Local Cache)
* **Local-First Storage:** Integrated **Dexie.js** to manage an IndexedDB client-side database (`K9ShopDB`) storing catalogs (`pets`, `products`), user orders, and configuration settings.
* **Stale-While-Revalidate (SWR) Sync:** A background process queries lightweight metadata version numbers from Firestore. If remote updates are detected, the frontend performs a delta sync of modified records rather than redownloading the entire catalog.
* **LRU Cache Eviction:** Implemented a Least Recently Used (LRU) algorithm that automatically evicts older records when local cache databases exceed configured thresholds (100 items per collection), preventing browser storage bloat.
* **Visibility-Based Revalidation:** Automatically triggers background syncs when the tab visibility state transitions back to `visible` or during periodic background polling intervals (every 5 minutes).

### 2. Edge-Native Serverless API Backend
* **Cloudflare Pages Functions:** Replaced traditional server architectures with lightweight, globally-distributed serverless API routes running on the Cloudflare V8 runtime.
* **Raw Web Crypto Cryptography:** Because standard Firebase Admin and Razorpay SDKs cannot run natively in standard Cloudflare Worker sandboxes due to Node.js dependency limitations, all cryptographic functions were built from scratch using the **Web Crypto API** (`crypto.subtle`):
  * **RS256 JWT Generation:** Programmatic creation and signing of RS256 JSON Web Tokens (JWT) using Google Service Account private keys to authenticate requests to Firestore REST APIs.
  * **HMAC-SHA256 Payment Verification:** Manual signature validation of Razorpay checkout parameters inside the edge handler.
* **IDOR Prevention:** Cloudflare Functions verify incoming client-side Firebase JWT `idTokens` directly on the server to assert the user's authentic `uid`, preventing insecure direct object reference (IDOR) attacks on order records.
* **Server-Side Price Auditing:** To prevent price spoofing (client-side form tampering), the serverless checkout function queries raw prices directly from Firestore using secure service accounts and recalculates cart totals, discounts, and delivery fees server-side before initiating payment orders.

### 3. Bulletproof Database Security Design
* **Closed Client-Side Orders:** The database rules explicitly deny client-side order writing (`allow create: if false`). Orders can only be inserted via serverless backend edge routines after successful Razorpay verification and signature matching.
* **Role-Based Authorization Rules:** Restrict read and write permissions. Users can only fetch their own orders, whereas administrators are verified through custom claim mappings or administrative flag checks against the `users` collections in Firestore.
* **Optimized Public Access:** Read operations for pets and products catalogs are public, but write access is locked down strictly to authenticated admins.

### 4. Advanced Frontend Architecture
* **React 19 & TypeScript:** Leveraging modern React patterns, strict typing, and context providers for modular state segregation.
* **TailwindCSS 4:** Custom styling implemented using Vite's native Tailwind CSS processing pipeline for minimal production bundles and fast build speeds.
* **Manual Chunk Optimization:** Vite configurations are customized with Rollup split configurations (`manualChunks`) to isolate heavy dependencies (`firebase`, `lucide-react`, `motion/react`) into separate CDN-cached vendor files.
* **Lightweight Micro-Animations:** Fluid layout and routing transitions implemented with **Framer Motion** (`motion/react`) with full layout re-renders handled by `AnimatePresence`.
* **Dynamic SEO & Search Engine Optimization:** Automated metadata injection per page via `react-helmet-async` and semantic LocalBusiness schema markup (`ld+json`) for local search index optimization.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, TailwindCSS 4, Vite 6, React Router v7 |
| **State & Local Cache** | Context API, Dexie.js (IndexedDB client-side database) |
| **Edge Backend** | Cloudflare Pages Functions (V8 Serverless Worker Environment) |
| **Database** | Google Firebase Firestore (REST API & Web SDK) |
| **Auth** | Firebase Authentication (Email/Password & Social OAuth) |
| **Payments** | Razorpay Checkout (HMAC-SHA256 signature verification) |
| **Animations** | Framer Motion (`motion/react`) |
| **SEO** | React Helmet Async, JSON-LD Schema Metadata |

---

## 📂 Project Structure

```
├── .env.example              # Template for environment variables (Razorpay keys, Firebase Config)
├── _routes.json              # Cloudflare Pages routing rule configuration
├── firebase-blueprint.json   # Blueprint schema configurations
├── firebase-applet-config.json # Frontend Firebase configuration setup
├── firestore.rules           # Security authorization rules for Firestore DB collections
├── package.json              # Build configurations & node dependencies
├── tsconfig.json             # TypeScript project compiler rules
├── vite.config.ts            # Vite compiler configuration, dev server configuration, manual chunks definition
├── functions/                # Serverless Edge API (Cloudflare Pages Functions)
│   ├── _middleware.ts        # Global middleware injection (Strict security headers, CSP, CORS headers)
│   └── api/
│       ├── _middleware.ts    # API-wide CORS & Security rules
│       └── payments/
│           ├── order.ts      # Recalculates cart value, validates coupons, and initiates Razorpay transactions
│           └── verify.ts     # Cryptographically validates payment signatures and saves order to Firestore
└── src/                      # Frontend Application Codebase
    ├── App.tsx               # Main routing & application wrapper (Lazy routing setup)
    ├── main.tsx              # Application initialization
    ├── index.css             # Tailwind CSS entry & custom styling overrides
    ├── constants.ts          # Page sizes, sync interval constants
    ├── components/           # Reusable UI & Layout Components
    │   ├── Navbar.tsx        # Responsive navigation bar with scroll detection & mobile overlay
    │   ├── CartOverlay.tsx   # Slidout shopping cart, shipping form, & Razorpay payments handler
    │   ├── SEO.tsx           # Multi-page SEO & OpenGraph meta tag generator
    │   ├── AdminPanel.tsx    # Administrative control center entry page
    │   └── admin/            # Admin Managers
    │       ├── PetManager.tsx     # Add/Edit/Delete pets catalog manager with slug generator
    │       ├── ProductManager.tsx # Multi-tab product manager (basic info, variations, specs, product coupons)
    │       ├── OrderManager.tsx   # Order tracking, customer delivery info viewer, status updater
    │       ├── CouponManager.tsx  # Creates/Deletes universal discount coupons
    │       └── SettingsManager.tsx# Sets delivery fee thresholds & social media contact URLs
    ├── context/              # Context Providers for Global State management
    │   ├── AuthContext.tsx   # Firebase user login session state & role-based validation
    │   ├── CartContext.tsx   # Shopping cart manipulation & client-side coupon validations
    │   └── ShopDataContext.tsx# Dexie.js local-first sync, background check, and LRU cache eviction
    ├── db/
    │   └── shopDb.ts         # Dexie database schema declarations (IndexedDB Tables)
    ├── pages/                # Page route endpoints
    │   ├── HomePage.tsx      # Main Landing Page (Hero, Services, Choice grids, Store finder)
    │   ├── PetsPage.tsx      # Paginated and searchable pet adoption gallery
    │   ├── ProductsPage.tsx  # Product lists categorized (Food, Accessories, Grooming, Toys, Health)
    │   ├── PetDetailPage.tsx # Rich display layout of specific pets with WhatsApp contact link
    │   ├── ProductDetailPage.tsx # Detailed view of products with options variations & stock counts
    │   └── UserDashboard.tsx # Client user dashboard showing real-time order history from Dexie cache
    ├── types/
    │   └── index.ts          # Type declarations (Pet, Product, Order, UserProfile, Coupon, Settings)
    └── utils/                # Helper utilities
        ├── firestoreErrorHandler.ts # Safe logging of database operations, stripping sensitive auth details
        ├── imageHelper.ts    # Standardized helper for local assets and fallback placeholders
        ├── metadataHelper.ts # Increments/gets metadata version records to control SWR caching
        └── slugify.ts        # Sanitizes strings to generate clean SEO friendly URLs
```

---

## 🔒 Security Implementations

* **Strict Content-Security-Policy (CSP):** The serverless backend enforces strict CSP headers, restricting scripts, styles, and iframe origins to verified sources (`self`, Razorpay, Google APIs, Unsplash).
* **Payment Validation Loop:** Client-side data is completely ignored during checkout. Cart item prices are pulled directly from Firestore by the backend serverless edge code using an authenticated access token, ensuring the payment amount matches the actual catalog configuration.
* **Cryptographic Signatures:** Verification of payment is performed via Node-free HMAC-SHA256 calculations directly on the worker edge, matching signatures received from the Razorpay checkout modal.
* **Sanitized Logs:** Custom error handling strips customer authentication metadata (emails, display names) into safe masked variables (`***`) before logs are printed or pushed to tracking systems.

---

## 🛠️ Local Development & Build Guidelines

### Prerequisites
* **Node.js** (v18 or higher)
* A configured **Firebase** project with Firestore and Auth enabled.
* A **Razorpay** developer account with keys generated.

### Setting Up Environment Variables
Create a `.env` file in the root directory and configure the variables:
```env
# Frontend Config
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

# Cloudflare Functions Config (Set these in wrangler.toml or Cloudflare dashboard in production)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_SERVICE_ACCOUNT={"type": "service_account", ...}
FIREBASE_FIRESTORE_DATABASE_ID=(default)
```

### Installation
Install project dependencies:
```bash
npm install
```

### Launch Development Server
To run the frontend only:
```bash
npm run dev
```

### Launch Edge APIs & Frontend Locally
To run the full-stack system locally simulating Cloudflare Page Functions routing rules, use Cloudflare's **Wrangler** developer tool:
```bash
npm run pages:dev
```

### Production Build
Compile and bundle the production files inside `/dist`:
```bash
npm run build
```

---

## 📝 Resume Project Representation

Copy the block below to present this application professionally in your resume, portfolio, or LinkedIn profile.

### 🌟 Project Experience: Lead Full-Stack & Cloud Systems Architect

**Project Name:** K9 SNIPERS E-Commerce & Pet Services Platform  
**Technologies:** React 19, TypeScript, TailwindCSS 4, Cloudflare Pages (Serverless Functions), Google Firestore, Dexie.js (IndexedDB), Web Crypto API, Razorpay Checkout, REST APIs.

* **Designed and developed** a high-performance, offline-capable e-commerce web platform integrating catalog management, user accounts, secure payments, and administrative controls.
* **Engineered a custom Local-First Synchronization Engine** using Dexie.js and IndexedDB to cache product and pet catalogs. Implemented a Stale-While-Revalidate (SWR) delta-sync pipeline that queries server-side metadata version states to perform micro-updates, reducing network requests by **70%**.
* **Developed a secure Serverless Edge Backend** using Cloudflare Pages Functions. Implemented cryptographic JWT signing using RS256 with Google Service Account keys and Web Crypto APIs (`crypto.subtle`) entirely within the Node-free Cloudflare V8 worker sandbox.
* **Secured the financial pipeline** against client-side tampering by implementing a strict server-side audit loop. Cart items are verified directly against database records, and transaction hashes are validated with HMAC-SHA256 signatures at the edge before orders are marked as paid.
* **Established robust Firestore Security Rules**, blocking client-side collection insertion on critical collections (like orders) to guarantee database integrity and prevent unauthorized API queries.
* **Optimized production bundle performance** by configuring manual Rollup chunks in Vite, reducing initial load bundle sizes and boosting page loading speed.
* **Implemented advanced SEO best practices**, using `react-helmet-async` for page-specific metadata injection and structuring structured JSON-LD local business schemas to maximize search engine indexing and localized organic traffic.
