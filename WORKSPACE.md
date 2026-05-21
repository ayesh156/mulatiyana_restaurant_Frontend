# 🍽️ Mulatiyana Restaurant — Project Workspace

> Central sprint board for the **Customer Web App** and **Admin POS System**.
>
> **Business Logic:** Order Ahead for Pick-up or Dine-in only. No home delivery. Pay at Counter.

---

## 🎉 PHASE 1 & 2: CUSTOMER WEB APP — 100% COMPLETE ✅

> All pages built, audited, mobile-responsive, dark-mode ready, and Vercel-deployment ready.

---

## 🏃 Current Sprint

**Sprint #:** 13 — Phase 3: Admin POS System
**Goal:** Build the complete Admin POS System (Dashboard, Order Queue, Table Management, Menu CRUD, Reports, Staff Login)
**Dates:** Jun 2026 onwards

| # | Task | Status |
|---|------|--------|
| 1 | `StaffLoginPage` — secure login for ADMIN / CASHIER | 🔜 Next |
| 2 | `POSDashboardPage` — summary cards, recent orders | 🔜 Next |
| 3 | `OrderQueuePage` — live board (PENDING → PREPARING → READY → COMPLETED) | 🔜 Next |
| 4 | `TableManagementPage` — table grid (available / occupied / reserved) | 🔜 Next |
| 5 | `MenuManagementPage` — CRUD (add, edit, delete menu items) | 🔜 Next |
| 6 | `ReportsPage` — sales charts, top items | 🔜 Next |
| 7 | Route guards — protect all `/pos` routes | 🔜 Next |
| 8 | Cashier marks `paymentStatus` PAID at counter | 🔜 Next |

---

## 📋 To-Do — Phase 3 (POS System)

### 🖥️ POS Pages
- [ ] `StaffLoginPage`
- [ ] `POSDashboardPage`
- [ ] `OrderQueuePage`
- [ ] `TableManagementPage`
- [ ] `MenuManagementPage`
- [ ] `ReportsPage`

### 🧱 Shared UI Components (needed for POS)
- [ ] `Button` — primary / secondary / danger variants
- [ ] `Input` — reusable form input
- [ ] `Modal` — overlay dialog for CRUD
- [ ] `Badge` — order status labels (PENDING, PREPARING, READY, COMPLETED)
- [ ] `Spinner` — loading indicator
- [ ] `Toast` — action feedback notifications

### 🔧 Infrastructure
- [ ] Route guards (`ProtectedRoute` wrapper for `/pos`)
- [ ] API utility layer (`utils/api.js`)
- [ ] Backend (Node/Express or Next.js API routes)
- [ ] Prisma + PostgreSQL setup
- [ ] Environment variables (`.env` + `.env.example`)
- [ ] Code-split Framer Motion (lazy import) to reduce bundle size

---

## 🔄 In Progress

| Task | Notes |
|------|-------|
| — | — |

---

## ✅ Completed — Phase 1 & 2: Customer Web App

| Task | Completed On |
|------|-------------|
| Vite + React + Tailwind + full architecture | May 21, 2026 |
| `tailwind.config.js` — `darkMode: 'class'` | May 21, 2026 |
| `ThemeContext.jsx` — light / dark / system toggle | May 21, 2026 |
| `useCartStore` — Zustand + localStorage persist | May 21, 2026 |
| `AnimatedSection` — Framer Motion scroll-reveal | May 21, 2026 |
| `ModernSelect` — premium custom dropdown | May 21, 2026 |
| `FloatingActionButtons` — WhatsApp FAB + Scroll-to-Top | May 21, 2026 |
| `FoodCard` — link to `/menu/:id`, Add to Cart, dark mode | May 21, 2026 |
| `SlideCart` — slide-over panel, `w-[min(100vw,24rem)]` | May 21, 2026 |
| `MainWebLayout` — sticky Navbar, left-slide MobileDrawer, ThemeToggle | May 21, 2026 |
| `POSLayout` — fixed dark sidebar + scrollable main | May 21, 2026 |
| `menuData.js` — shared data source (8 items, CATEGORIES) | May 21, 2026 |
| `DATABASE_SCHEMA.md` — Prisma schema (discount fields added) | May 21, 2026 |
| `HomePage` — Hero + Popular Items (animated, mobile-first) | May 21, 2026 |
| `MenuPage` — sidebar, search, sort, grid/list, URL-synced pagination | May 21, 2026 |
| `ProductViewPage` — detail view, qty stepper, suggestions | May 21, 2026 |
| `AboutPage` — Hero, Story, Values, Gallery | May 21, 2026 |
| `ContactPage` — Details, Map embed, Contact Form | May 21, 2026 |
| `CheckoutPage` — Pick-up/Dine-in, Date+Time, Discount, Pay at Counter | May 21, 2026 |
| `OrderSuccessPage` — Order ID, type, date, time, discount, grand total | May 21, 2026 |
| Favicon (`/public/favicon.svg`) + `index.html` meta tags | May 21, 2026 |
| `vercel.json` — SPA catch-all rewrite for client-side routing | May 21, 2026 |
| `RULES.md` — deployment rules added | May 21, 2026 |
| **Full Mobile Responsiveness Audit — PASSED** | May 21, 2026 |
| **Final production build — PASSED (0 errors)** | May 21, 2026 |
