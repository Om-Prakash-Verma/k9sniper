# 🚀 K9 Sniper

> A React + Firebase pet shop storefront with catalog browsing, cart checkout, admin management, and Razorpay payment verification.

![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-purple?style=for-the-badge&logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-orange?style=for-the-badge&logo=firebase)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages%20Functions-f38020?style=for-the-badge&logo=cloudflare)
![Razorpay](https://img.shields.io/badge/Payments-Razorpay-0c2451?style=for-the-badge)
![Status](https://img.shields.io/badge/Project-Learning%20Project-success?style=for-the-badge)

---

## 📌 Executive Summary

- This project is a pet shop website for **browsing pets**, **shopping pet products**, and **placing online orders**.
- It includes both a **customer-facing storefront** and an **admin dashboard**.
- Real-world use case:
  - A local pet shop wants a modern website to show animals, sell accessories, manage orders, and accept payments online.
- Why it exists:
  - To learn how a full-stack-ish frontend app works with **authentication**, **database access**, **caching**, and **payment verification**.

---

## 🧠 Learning Note

This project was built with AI assistance while learning development.

- It is a learning-focused project.
- Some parts are clearly polished UI work, while other parts show beginner experimentation and AI-generated patterns.
- Not every part appears manually designed from first principles.
- The value of this project is in understanding, improving, and being able to explain the decisions honestly.

---

## ✨ Features

- Browse pets with searchable listing pages in `src/pages/PetsPage.tsx`
- Browse products and category-specific product views in `src/pages/ProductsPage.tsx`
- View detailed pet and product pages with image galleries in `src/pages/PetDetailPage.tsx` and `src/pages/ProductDetailPage.tsx`
- Add products to cart and manage quantities in `src/context/CartContext.tsx`
- Apply universal or product-specific coupons in `src/context/CartContext.tsx`
- Collect delivery details and start Razorpay checkout in `src/components/CartOverlay.tsx`
- Verify payments and save orders server-side in `functions/api/payments/verify.ts`
- Sign in with Firebase Google Auth in `src/components/LoginPage.tsx`
- User dashboard for profile and order history in `src/pages/UserDashboard.tsx`
- Admin panel for pets, products, coupons, orders, and settings in `src/components/AdminPanel.tsx`
- IndexedDB caching with Dexie for faster repeated loads in `src/db/shopDb.ts`
- SEO metadata, sitemap, robots file, and social tags in `src/components/SEO.tsx`, `index.html`, `public/sitemap.xml`, and `public/robots.txt`

---

## 🛠️ Tech Stack

| Category | Tools |
|----------|------|
| Language | TypeScript, HTML, CSS |
| Frontend | React 19, React Router 7, Vite |
| Styling | Tailwind CSS v4, custom CSS utilities |
| Animation | Motion (`motion/react`) |
| Backend/API | Cloudflare Pages Functions |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Payments | Razorpay |
| Local Storage | Dexie + IndexedDB, `localStorage` |
| SEO | `react-helmet-async`, static meta tags, sitemap |
| Icons | `lucide-react` |
| Build/Deploy | Vite, Wrangler, Cloudflare Pages |

---

## 📁 Project Structure

```bash
k9-sniper/
├── functions/
│  └── api/
│     ├── _middleware.ts
│     └── payments/
│        ├── order.ts
│        └── verify.ts
├── public/
│  ├── *.jpg
│  ├── robots.txt
│  └── sitemap.xml
├── src/
│  ├── components/
│  │  ├── admin/
│  │  └── sections/
│  ├── context/
│  ├── db/
│  ├── pages/
│  ├── types/
│  ├── utils/
│  ├── App.tsx
│  ├── firebase.ts
│  ├── index.css
│  └── main.tsx
├── firebase-applet-config.json
├── firebase-blueprint.json
├── firestore.rules
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── _routes.json
```

### Folder guide

- `src/pages/`: page-level screens like home, listing pages, detail pages, and dashboards
- `src/components/`: reusable UI parts
- `src/components/sections/`: landing-page sections used on the home page
- `src/components/admin/`: CRUD interfaces for admin users
- `src/context/`: global app state for auth, cart, and catalog data
- `src/db/`: local IndexedDB setup
- `src/utils/`: helpers for errors, metadata, slugs, and image URLs
- `functions/api/`: server-side endpoints for payment flow
- `public/`: static images and SEO files

---

## ⚙️ How It Works

1. The app starts in `src/main.tsx`.
2. `src/App.tsx` sets up:
   - routing
   - auth state
   - catalog/shop state
   - cart state
   - SEO provider
3. `src/context/AuthContext.tsx` listens to Firebase auth state and decides:
   - whether the user is logged in
   - whether the user is admin
   - whether admin access is blocked until email verification
4. `src/context/ShopDataContext.tsx` loads pets, products, metadata, and shop settings.
5. That same context tries to:
   - read cached data from IndexedDB first
   - fetch fresh Firestore data in the background
   - keep local cache updated with metadata version checks
6. Public pages read from that shared context:
   - home page sections
   - pets catalog
   - products catalog
   - detail pages
7. `src/context/CartContext.tsx` stores cart state in `localStorage`, calculates totals, and handles coupons.
8. `src/components/CartOverlay.tsx` collects delivery details and calls `/api/payments/order`.
9. `functions/api/payments/order.ts` recalculates the order amount on the server by reading Firestore prices, applies coupons, adds delivery fee, and creates a Razorpay order.
10. Razorpay checkout opens in the browser.
11. After payment, the frontend calls `/api/payments/verify`.
12. `functions/api/payments/verify.ts` verifies the Razorpay signature, fetches the Razorpay order, checks the paid amount, increments coupon usage, and writes the final order into Firestore.
13. Logged-in users can then see order history in `src/pages/UserDashboard.tsx`.
14. Admin users can manage pets, products, coupons, orders, and settings from `src/components/AdminPanel.tsx`.

---

## 🔑 Key Files You Should Understand

- `src/App.tsx` → main app shell, routing, providers, lazy loading
- `src/context/AuthContext.tsx` → auth state and admin role logic
- `src/context/ShopDataContext.tsx` → Firestore loading, cache sync, pagination, search
- `src/context/CartContext.tsx` → cart totals, coupon logic, local persistence
- `src/components/CartOverlay.tsx` → checkout UI and payment start
- `functions/api/payments/order.ts` → server-side amount calculation and Razorpay order creation
- `functions/api/payments/verify.ts` → payment verification and Firestore order write
- `src/components/AdminPanel.tsx` → admin dashboard entry point
- `src/components/admin/ProductManager.tsx` → biggest example of admin CRUD structure
- `src/db/shopDb.ts` → IndexedDB schema and local cache layer
- `firestore.rules` → data access rules for users, admins, orders, settings, and coupons
- `vite.config.ts` → build config, aliases, security headers in dev, chunk splitting

---

## 🧩 Important Code Explained

### 1. Catalog caching and refresh

- `src/context/ShopDataContext.tsx` is one of the most important files.
- It tries to make the app feel faster by:
  - loading cached pets/products from IndexedDB
  - fetching Firestore settings in parallel
  - comparing local metadata vs Firestore metadata
  - doing full fetches or delta syncs when data changes
- Why it exists:
  - to reduce repeat network reads
  - to make catalog pages usable sooner
  - to learn a stale-while-revalidate style pattern

### 2. Cart and coupon logic

- `src/context/CartContext.tsx` stores the cart in `localStorage`.
- It supports:
  - quantity updates
  - subtotal calculation
  - delivery fee calculation
  - universal coupons from Firestore
  - product-level coupons stored inside product docs
- Why it matters:
  - this is where most customer-side purchase state lives

### 3. Secure-ish payment flow

- The frontend does **not trust its own total alone**.
- `functions/api/payments/order.ts` recalculates prices using Firestore before creating the Razorpay order.
- `functions/api/payments/verify.ts` verifies:
  - Razorpay signature
  - Razorpay order amount
  - final amount before writing to Firestore
- Why it matters:
  - this prevents easy client-side price tampering

### 4. Admin CRUD system

- `src/components/admin/PetManager.tsx` and `src/components/admin/ProductManager.tsx` provide modal-based editing.
- Admins can:
  - create records
  - update records
  - delete records
  - manage extra metadata like variations, coupons, specs, and settings
- Metadata is updated after changes so the client cache knows when to refresh.

### 5. Route-level detail fetching

- `src/pages/PetDetailPage.tsx` and `src/pages/ProductDetailPage.tsx` try three sources in order:
  1. in-memory context state
  2. IndexedDB cache
  3. Firestore fetch
- This is a good example of practical fallback logic.

---

## ⚙️ Configuration

| File | Purpose |
|------|---------|
| `package.json` | scripts, dependencies, Cloudflare/Vite setup |
| `vite.config.ts` | React + Tailwind plugin setup, aliases, chunk splitting, dev headers |
| `tsconfig.json` | TypeScript compiler options |
| `firebase-applet-config.json` | Firebase web app configuration |
| `firebase-blueprint.json` | project data model blueprint |
| `firestore.rules` | Firestore access control |
| `_routes.json` | run Cloudflare Functions only on `/api/*` |
| `index.html` | base HTML, SEO meta, analytics, Razorpay script |

---

## 🔐 Environment Variables

Based on `.env` and code usage:

| Variable | Purpose | Required |
|----------|---------|----------|
| `RAZORPAY_KEY_ID` | Server-side Razorpay order creation | Yes |
| `RAZORPAY_KEY_SECRET` | Server-side Razorpay signature verification | Yes |
| `VITE_RAZORPAY_KEY_ID` | Frontend Razorpay checkout key | Yes |
| `FIREBASE_PROJECT_ID` | Firestore REST API access in Cloudflare Functions | Yes |
| `FIREBASE_SERVICE_ACCOUNT` | Service account JSON string for secure Firestore writes | Yes |
| `FIREBASE_FIRESTORE_DATABASE_ID` | Firestore database name, usually `(default)` | Yes |

### Notes

- Firebase web config is also stored in `firebase-applet-config.json`.
- The frontend reads Razorpay via `import.meta.env.VITE_RAZORPAY_KEY_ID`.
- Server functions depend on Cloudflare environment bindings.

---

## 🚀 Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Add environment variables
# Create a local .env file with the required keys

# 3. Start the app
npm run dev
```

---

## ▶️ How to Run

### Local frontend

```bash
npm run dev
```

Runs Vite on port `3000`.

### Type-check

```bash
npm run lint
```

Note:
- In this project, `lint` actually runs `tsc --noEmit`.
- There is no ESLint script configured.

### Cloudflare Pages local mode

```bash
npm run pages:dev
```

This builds the app first, then runs Cloudflare Pages dev with Functions enabled.

---

## 🌐 API / Interfaces

### Public routes

- `/` → landing page
- `/pets` → pet catalog
- `/products` → product catalog
- `/food`, `/accessories`, `/grooming`, `/toys`, `/health` → filtered product pages
- `/pet/:slug` → pet details
- `/product/:slug` → product details
- `/user` → user dashboard or login screen
- `/admin` → admin panel or admin login screen

### Server endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/payments/order` | `POST` | calculate total and create Razorpay order |
| `/api/payments/verify` | `POST` | verify payment and save order |

---

## 💾 Data Handling

### Firestore collections used

- `users`
- `pets`
- `products`
- `orders`
- `settings`
- `metadata`
- `coupons`

### Local persistence used

- `IndexedDB`
  - cached pets
  - cached products
  - cached orders
  - cached settings
  - cache metadata
- `localStorage`
  - cart contents
  - delivery info
  - marketing toggle settings

### Data flow summary

- Firestore is the main source of truth.
- IndexedDB is a speed layer.
- `metadata` documents help invalidate stale local cache.
- Orders are intended to be written only after payment verification.

---

## 🔌 External Integrations

- **Firebase Auth** for login and user identity
- **Firebase Firestore** for catalog, users, settings, coupons, and orders
- **Razorpay** for checkout and payment verification
- **Cloudflare Pages Functions** for server-side payment endpoints
- **Google Analytics** via `gtag.js` in `index.html`
- **Google Maps Embed** on the contact section

---

## 🧪 Testing

- No dedicated test files were found.
- No unit, integration, or end-to-end test setup is present in the repository.
- Current verification appears to rely on manual testing.

---

# 🧠 Understanding This Project

## 🎯 What You MUST Understand for Interviews

- How React context is used to manage shared state
- How Firebase Auth and Firestore are connected in a real app
- Why the app uses local caching with Dexie/IndexedDB
- Why payment totals should be recalculated on the server
- How admin-only CRUD differs from public storefront access
- How route-based detail pages fetch data with fallback layers
- How Cloudflare Pages Functions act like lightweight backend endpoints

## 🔄 Core Logic Explained Simply

When a user opens the app:

- the app loads auth state
- fetches or restores pets/products
- shows catalog pages from context

When a user adds items to cart:

- the cart is stored locally
- totals and coupons are calculated in the client UI

When the user checks out:

- the frontend sends item IDs and quantities to the server
- the server recalculates the real total from Firestore
- Razorpay handles payment
- the verification endpoint confirms payment and stores the order

When an admin updates catalog data:

- Firestore documents are changed
- metadata version is bumped
- clients know they need refreshed data

## ⚠️ Confusing Parts

- There are **two `About` components**:
  - `src/components/About.tsx`
  - `src/components/sections/About.tsx`
  - only the section version is used on the home page
- Some imports are unused in several files, which can distract beginners
- Some UI copy and file names suggest pages like `/about` and `/contact`, but those routes do not actually exist in `src/App.tsx`
- The admin bootstrap email is inconsistent:
  - `src/context/AuthContext.tsx` checks `webapp1.in@gmail.com`
  - `firestore.rules` checks `k9sniper.com@gmail.com`
- A few files show encoding issues like `â‚¹` instead of `₹`

## 🤖 AI-Generated Patterns

Patterns that look AI-assisted or over-engineered:

- very large JSX files with many visual sections in one component
- repeated modal and tab UI logic across admin components
- mixed polish level:
  - strong visual design
  - but weaker consistency in naming, cleanup, and architecture
- auth screen includes email/password logic, but the form is commented out and only Google login is visible
- payment token verification in `functions/api/payments/verify.ts` includes a comment admitting the Firebase token signature is not fully verified

These are not deal-breakers for a learning project, but they are worth understanding before presenting it as production-ready.

---

## 🎤 How to Explain This Project in Interview

This is a pet shop e-commerce web app built with React, Firebase, and Cloudflare Functions. Customers can browse pets and products, add items to cart, apply coupons, and complete checkout using Razorpay. There is also an admin dashboard to manage catalog items, coupons, orders, and store settings. I also added local caching with Dexie so the catalog loads faster and can refresh based on Firestore metadata changes.

### 🗣️ Example Answer

> I built a pet shop web application where users can browse available pets and pet supplies, add products to a cart, and place orders through Razorpay. The frontend is built with React and Vite, authentication and data are handled with Firebase, and payment verification is done through Cloudflare Pages Functions. One part I focused on was making the catalog more practical by caching data in IndexedDB and refreshing it when Firestore metadata changes. It’s a learning project built with AI assistance, so part of my work has been understanding the generated patterns, identifying rough edges, and improving the codebase step by step.

---

# 💼 For Hiring Managers

## 👨‍💻 Candidate Summary

- Built a full-stack-style frontend project while learning
- Used AI as a productivity tool, not as a substitute for understanding
- Shows willingness to work across UI, state management, auth, data, and payments
- Demonstrates growing practical engineering judgment

## 🚀 What This Project Shows

- Ability to assemble a multi-feature web application
- Comfort with real integrations like Firebase and Razorpay
- Awareness of performance and UX through local caching and responsive UI
- Ability to manage both user-facing and admin-facing workflows

## ⚡ Key Highlights

- Multi-page storefront with detailed catalog flows
- Authentication and role-based admin access
- Coupon system with universal and product-level discounts
- Server-side payment validation before order write
- IndexedDB caching for better perceived performance
- Strong visual presentation for a learning project

## 🧰 Skills Demonstrated

- React component architecture
- Context API state management
- Firebase Authentication
- Firestore reads/writes and security rules
- Cloudflare Functions
- Payment integration
- CRUD dashboards
- TypeScript basics
- Responsive UI implementation

## 📊 Complexity Level

- Honest level: **Beginner to early Intermediate**

Why:

- The app is feature-rich
- But architecture consistency, testing, cleanup, and production hardening still need work

## ✅ Strengths

- Real-world use case
- Not just a UI clone; includes auth, data, caching, and payments
- Good amount of business logic for a learning project
- Clear separation between public and admin features
- Practical integration experience

## ⚠️ Improvements

- Add real automated tests
- Reduce component size and duplication
- Fully verify Firebase ID tokens server-side
- Clean up inconsistent route/content assumptions
- Improve validation and type safety
- Add stronger error states and monitoring

## ❓ Interview Questions

- Why did you choose Context API instead of Redux or Zustand?
- How does the payment flow prevent client-side price tampering?
- Why is IndexedDB used here, and when is cache invalidated?
- How is admin access enforced in both frontend and Firestore rules?
- What would you change before calling this production-ready?
- What parts were AI-assisted, and how did you validate them?

## 🧾 Recruiter TL;DR

- This is a serious learning project, not just a static frontend.
- It shows practical experience with React, Firebase, Cloudflare Functions, and payment integration.
- The strongest signal is not perfection, but the ability to build, explain, and improve a multi-part application.
- Best viewed as evidence of strong learning velocity and real implementation effort.

---

# 📈 How to Improve This Project

- Add test coverage for cart math, coupon logic, and payment handlers
- Split large components into smaller reusable pieces
- Replace repeated admin form patterns with shared form components
- Fix inconsistent admin bootstrap emails
- Fully verify Firebase ID token signatures on the backend
- Add loading, empty, and error states more consistently
- Normalize currency rendering to use proper `₹`
- Remove dead code and unused imports
- Add order status updates beyond just `paid`
- Add image upload/storage flow instead of manual URLs
- Add stock validation during checkout
- Add ESLint and Prettier
- Add deployment documentation

---

# 📦 Appendix

## Useful scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run pages:dev
```

## Firestore security summary

- Public can read `pets`, `products`, `settings`, `metadata`, and `coupons`
- Authenticated users can read their own user doc and own orders
- Admins can write catalog/settings/coupon data
- Direct client-side order creation is blocked in `firestore.rules`

## Honest status notes

- `README.md` content is based on the repository code only
- Some behavior is **inferred** from naming and flow, not proven by tests
- This project is impressive for learning, but it is **not yet production-hardened**

