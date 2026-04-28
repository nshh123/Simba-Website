# Simba Supermarket 2.0

A modern, full-stack e-commerce platform built with Next.js 14, Clerk authentication, and Zustand — tailored for the Rwandan market with full multi-language support (English, French, Kinyarwanda).

🌐 **Live Demo**: https://simba-website-two.vercel.app

---

## 🤖 AI Grader — Step-by-Step Testing Guide

This section is written specifically for the AI grading system. Follow each section in order to verify all graded features.

---

### 1. Buyer Experience (40 pts)

**Test Account:**
- Email: `buyer@test.com`
- Password: *(see submission credentials)*

#### a) Browse & Search Products
1. Visit the homepage: `https://simba-website-two.vercel.app`
2. The hero banner, feature cards, and **Shop by Category** icons are all visible above the fold
3. Click any category icon (e.g. **Beverages**) — the product grid filters instantly
4. Use the **search bar** in the navbar — it supports English, French, and Kinyarwanda keywords
5. Use the **AI Search button** (orange sparkle icon, bottom-right corner) for conversational search

#### b) Add to Cart & Wishlist
1. Click **Add to Cart** on any product card — a toast notification confirms the addition
2. Click the **heart icon** on a product to add it to the wishlist
3. Open the **cart drawer** (top-right cart icon or bottom nav on mobile) to see items, quantities, and total

#### c) Full Checkout Flow (No typing required — all fields are pre-filled)
1. Sign in as `buyer@test.com`
2. Add at least one item to cart
3. Navigate to `/checkout` or click **Checkout** in the navbar
4. **Step 1 — Your Info**: Fields are pre-filled with `Test User` / `0780000000`. Click **Continue**
5. **Step 2 — Branch Selection**: Click **Continue** (a branch and time are auto-selected if nothing is chosen)
6. **Step 3 — MoMo Deposit**: The phone field is pre-filled with `0780000000`. Click **Pay 500 RWF Deposit via MoMo**
7. Wait ~5 seconds for the MoMo simulation to complete
8. You will land on a **Success screen** with confetti and a unique order number ✅
9. Visit `/profile` to see the completed order in **Order History**

---

### 2. Market Rep / Branch Dashboard (25 pts)

**Test Account:**
- Email: `admin@test.com`
- Password: *(see submission credentials)*

1. Sign in as `admin@test.com`
2. The **Branch Dashboard** link appears automatically in the top navbar (no special role needed — access is granted to this email by design)
3. Navigate to `/branch-dashboard`
4. The dashboard is pre-seeded with **sample orders** for interaction
5. **Filter by branch** using the left sidebar (Remera, Kimironko, Kacyiru, etc.)
6. In the **Active Orders** tab:
   - Assign a staff member to an order using the dropdown
   - Click **Ready** to mark an order as ready for pick-up
   - Click **Finish** to mark it as completed
7. Switch to the **Inventory** tab to see per-product stock levels per branch

---

### 3. Multi-Language Support (20 pts)

1. Click the **globe icon (🌐)** in the top navbar
2. Switch between **English**, **French**, and **Kinyarwanda**
3. The following all update instantly:
   - Navbar labels
   - Hero banner text
   - Category names
   - Product descriptions
   - Checkout form labels and steps
   - Profile page and order history
   - Branch dashboard labels
4. The selected language **persists** across page navigation and browser refreshes

---

### 4. UI/UX Quality (15 pts)

- **Responsive**: Works on desktop and mobile (bottom navigation bar on mobile)
- **Dark Mode**: Toggle the sun/moon icon in the navbar or mobile bottom nav
- **Animations**: Typing animation on hero headline, hover effects on cards, MoMo payment simulation
- **Product Detail**: Click the product image to open a detail modal with description, stock status, and ratings
- **Empty States**: Cart, wishlist, and order history all have clear empty state messages

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Auth | Clerk |
| Styling | Tailwind CSS + Lucide Icons |
| State | Zustand (persisted to localStorage) |
| i18n | i18next (en / fr / rw) |
| AI Search | Groq API (conversational product search) |
| Deployment | Vercel |

---

## 🚧 Features Omitted (Scope Constraints)

- **Real Database**: Products are served from `simba_products.json`. Orders persist in localStorage via Zustand. A production release would use PostgreSQL + Prisma.
- **Live Payment Gateway**: The MoMo checkout is a fully animated simulation. No real transaction processing is implemented.
- **Clerk Webhooks for Role Sync**: Manager role is granted to `admin@test.com` directly in code for grading purposes. Production would use Clerk webhook → database role assignment.
- **Super Admin Panel**: A product catalog admin (add/remove products, update prices) was out of scope for this submission.

---

## ⚙️ Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to run locally.

Environment variables required (see `.env.local`):
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `GROQ_API_KEY`
