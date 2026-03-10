# 🚚 Dendritic — South African Vendor Delivery Platform

> Like Shein & Temu, but **proudly South African**. Register your small business, list products, and we deliver nationwide for a flat R49 fee.

---

## ✨ Tech Stack

| Layer       | Technology                              |
|-------------|----------------------------------------|
| Frontend    | React 18, React Router v6, Framer Motion |
| 3D Scene    | Three.js, @react-three/fiber, @react-three/drei |
| Backend     | Firebase Auth, Cloud Firestore, Cloud Storage |
| Functions   | Firebase Cloud Functions (Node 18)     |
| Hosting     | Netlify (frontend) + Firebase (backend) |
| Monetization| Google AdSense                         |
| Notifications| react-hot-toast                       |

---

## 🗂️ Project Structure

```
dendritic/
├── public/
│   └── index.html              # AdSense script goes here
├── src/
│   ├── firebase/
│   │   ├── config.js           # Firebase init (reads from .env)
│   │   ├── db.js               # All Firestore CRUD operations
│   │   └── storage.js          # Image upload/delete
│   ├── context/
│   │   ├── AuthContext.js      # Auth state + vendor profile
│   │   └── CartContext.js      # Shopping cart state
│   ├── components/
│   │   ├── Scene3D.js          # Three.js 3D delivery boxes scene
│   │   ├── Navbar.js           # Fixed navigation + cart badge
│   │   ├── AuthModal.js        # Sign in / Register modal
│   │   ├── ProtectedRoute.js   # Route guard for dashboard/orders
│   │   ├── Toast.js            # react-hot-toast with custom styling
│   │   └── AdSense.js          # Google AdSense components
│   ├── pages/
│   │   ├── Home.js             # Landing page with 3D hero
│   │   ├── Marketplace.js      # Product browsing (real Firestore data)
│   │   ├── Dashboard.js        # Vendor portal (products + orders)
│   │   ├── Cart.js             # Shopping cart + checkout
│   │   └── Orders.js           # Customer order history + tracker
│   ├── App.js                  # Routes + providers
│   └── index.js                # Entry point
├── functions/
│   └── index.js                # Cloud Functions (notifications, etc.)
├── firestore.rules             # Firestore security rules
├── firestore.indexes.json      # Composite indexes
├── storage.rules               # Storage security rules
├── firebase.json               # Firebase Hosting config
├── netlify.toml                # Netlify build + redirect config
├── .env.example                # Template for environment variables
└── package.json
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/ANELEMABASO/dendritic.git
cd dendritic
npm install
```

### 2. Set Up Firebase

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. **Create project** → name it `dendritic`
3. **Authentication** → Sign-in method → Enable **Email/Password** and **Google**
4. **Firestore Database** → Create database → Start in **production mode**
5. **Storage** → Get started
6. **Project Settings** → Your Apps → Add **Web App** → Copy config
7. Go to **Firestore → Rules** → paste contents of `firestore.rules`
8. Go to **Storage → Rules** → paste contents of `storage.rules`

### 3. Configure Environment

```bash
cp .env.example .env
```

Open `.env` and fill in your Firebase values:

```env
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=dendritic-xxx.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=dendritic-xxx
REACT_APP_FIREBASE_STORAGE_BUCKET=dendritic-xxx.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123...
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXX
```

### 4. Run Locally

```bash
npm start
# Opens http://localhost:3000
```

---

## ☁️ Deploy to Netlify

### Option A — Drag & Drop (easiest)

```bash
npm run build
# Drag the /build folder to https://app.netlify.com/drop
```

### Option B — Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Option C — GitHub Integration

1. Push to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → New site from Git
3. Connect your repo → Build command: `npm run build` → Publish dir: `build`
4. **Add environment variables** in Netlify → Site Settings → Environment Variables (paste all your `.env` values)
5. Deploy!

---

## 🔥 Deploy Cloud Functions

```bash
npm install -g firebase-tools
firebase login
firebase init functions   # Select your project
cd functions && npm install
cd ..
firebase deploy --only functions
```

---

## 💳 Payment Integration (Next Step)

Add PayFast or Yoco to the Cart checkout:

```bash
# PayFast (most popular in SA)
# No SDK needed — redirect to PayFast payment page
# See: https://developers.payfast.co.za

# Yoco (card payments)
npm install @yoco-sdk/web
```

---

## 📊 Firestore Data Model

```
vendors/{userId}
  businessName, category, province, phone,
  email, status, totalSales, totalOrders, rating

products/{productId}
  vendorId, name, description, price, category,
  imageUrl, available, sales, createdAt

orders/{orderId}
  vendorId, customerId, customerName, products[],
  total, deliveryFee (49), status, deliveryAddress,
  createdAt

reviews/{reviewId}
  vendorId, rating, comment, createdAt
```

---

## 📢 Google AdSense Setup

1. Apply at [google.com/adsense](https://www.google.com/adsense)
2. Get approved (takes a few days)
3. Replace in `public/index.html`:
   ```
   ca-pub-XXXXXXXXXXXXXXXXX → your real publisher ID
   ```
4. Replace slot IDs in `src/components/AdSense.js`

---

## 🇿🇦 Built with ❤️ for South Africa

Proudly South African · R49 flat delivery · 9 provinces
