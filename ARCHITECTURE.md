# 🏗️ Mulatiyana Restaurant — Application Architecture

> **Last updated:** May 21, 2026 — Phase 2 Complete / Phase 3 Ready
>
> **Business Logic:** Order Ahead for Pick-up or Dine-in only. No home delivery. Pay at Counter.
>
> **Deployment:** Vercel SPA — `vercel.json` catch-all rewrite to `/index.html`

---

## 🎉 Phase 1 & 2: Customer Web App — COMPLETE ✅

---

## 📁 Final Project Structure

```
mulatiyana-restaurant/
├── public/
│   ├── favicon.svg              # ✅ Brand favicon (amber circle, fork+spoon)
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   └── ui/
│   │       ├── AnimatedSection.jsx        # ✅ Framer Motion scroll-reveal wrapper
│   │       ├── FloatingActionButtons.jsx  # ✅ WhatsApp FAB + Scroll-to-Top FAB
│   │       ├── FoodCard.jsx               # ✅ Clickable card → /menu/:id
│   │       ├── ModernSelect.jsx           # ✅ Premium animated custom dropdown
│   │       └── SlideCart.jsx              # ✅ Slide-over cart → /checkout
│   ├── layouts/
│   │   ├── MainWebLayout.jsx              # ✅ Navbar + MobileDrawer + SlideCart + FABs
│   │   └── POSLayout.jsx                  # ✅ Fixed sidebar + scrollable main
│   ├── pages/
│   │   ├── web/
│   │   │   ├── HomePage.jsx               # ✅ Hero + Popular Items
│   │   │   ├── MenuPage.jsx               # ✅ Filters + Search + Sort + Pagination
│   │   │   ├── ProductViewPage.jsx        # ✅ Detail + Qty + Suggestions
│   │   │   ├── AboutPage.jsx              # ✅ Story + Values + Gallery
│   │   │   ├── ContactPage.jsx            # ✅ Details + Map + Form
│   │   │   ├── CheckoutPage.jsx           # ✅ Order form + Discount + Pay at Counter
│   │   │   └── OrderSuccessPage.jsx       # ✅ Confirmation + Discount + Grand Total
│   │   └── pos/
│   │       └── POSDashboardPage.jsx       # 🔜 Phase 3 — placeholder
│   ├── routes/
│   │   └── index.jsx                      # ✅ All routes registered
│   └── utils/
│       ├── constants.js                   # ✅ FALLBACK_IMAGE_URL
│       ├── menuData.js                    # ✅ MENU_ITEMS[] + CATEGORIES[]
│       ├── store.js                       # ✅ useCartStore (Zustand + persist)
│       └── ThemeContext.jsx               # ✅ ThemeProvider + useTheme()
├── index.html                             # ✅ Meta tags, favicon, page title
├── vercel.json                            # ✅ SPA catch-all rewrite
├── tailwind.config.js                     # ✅ darkMode: 'class'
├── DATABASE_SCHEMA.md                     # ✅ Prisma schema (discount fields)
├── RULES.md                               # ✅ All rules incl. deployment
├── WORKSPACE.md                           # ✅ Phase 2 complete, Phase 3 defined
└── ARCHITECTURE.md                        # ✅ This file
```

---

## 🌐 Full Route Tree

```
/ → MainWebLayout
│   (Navbar: Home · Menu · About · Contact | ThemeToggle · CartButton · Hamburger)
│   (Footer: © 2026 NebulaInfinite Software Solutions)
│   (SlideCart: slide-over from right, z-50)
│   (FloatingActionButtons: WhatsApp + ScrollTop, z-40, bottom-right)
│
├── /              → HomePage
├── /menu          → MenuPage          ✅ URL-synced filters
├── /menu/:id      → ProductViewPage   ✅ Detail + suggestions
├── /about         → AboutPage         ✅
├── /contact       → ContactPage       ✅
├── /cart          → placeholder
├── /checkout      → CheckoutPage      ✅
└── /order-success → OrderSuccessPage  ✅

/pos → POSLayout  (Phase 3)
└── /pos/dashboard → POSDashboardPage  🔜
```

---

## 🧩 UI Component Library

### `AnimatedSection`
```
Props: delay, duration, y, className
Behaviour: whileInView fade+slide, once:true, margin:-50px
Usage: wrap any section or card for scroll-reveal
```

### `ModernSelect`
```
Props: options[{label,value}], value, onChange, className
Behaviour: AnimatePresence dropdown, click-outside close, Escape close
Active option: amber bg + Check icon
Dark mode: bg-gray-900, border-gray-800, hover:bg-gray-800
```

### `FloatingActionButtons`
```
Position: fixed bottom-6 right-6, z-40 (below SlideCart z-50)
WhatsApp: always visible, bg-[#25D366], spring pop-in
ScrollTop: visible when scrollY > 300px, AnimatePresence pop-in/out
Both: hover tooltip (right-aligned, dark mode)
```

### `FoodCard`
```
Wrapper: <Link to="/menu/:id"> — entire card navigable
Add button: e.preventDefault + e.stopPropagation → addToCart()
Styles: bg-amber-50 dark:bg-gray-800, shadow-lg, rounded-3xl
Hover: shadow-2xl, -translate-y-1.5, border-amber-300
```

### `SlideCart`
```
Width: w-[min(100vw,24rem)] — safe on all screen sizes
Triggers: CartButton in Navbar, "Add to Cart" in FoodCard
CTA: "Proceed to Checkout" → toggleCart() + navigate('/checkout')
Footer note: "Pick-up or Dine-in · Pay at the counter"
```

---

## 🛒 Full Order Flow

```
Browse Menu (MenuPage / HomePage)
  └── FoodCard → addToCart() → useCartStore (auto-opens SlideCart)
        └── SlideCart → "Proceed to Checkout" → /checkout
              └── CheckoutPage
                  ├── Order Type: PICKUP | DINE_IN
                  ├── Customer: name + phone
                  ├── Expected Arrival: date + time (optional)
                  ├── Discount / Promo: % or Rs. fixed (optional)
                  │   discountAmount = min(raw, subtotal)
                  │   grandTotal     = max(0, subtotal − discountAmount)
                  └── "Confirm Pre-Order" → clearCart() + navigate('/order-success', state)
                        └── OrderSuccessPage
                            ├── #ORD-XXX
                            ├── Order Type (Pick-up / Dine-in)
                            ├── Payment: Pay at Counter
                            ├── Expected Date + Time (if provided)
                            ├── Discount amount (if applied)
                            ├── Grand Total (if discount applied)
                            └── "Back to Home"
```

---

## 🎨 Theme System

```
ThemeProvider (src/utils/ThemeContext.jsx)
  State: 'light' | 'dark' | 'system'
  Persists: localStorage['mulatiyana-theme']
  Effect: toggles <html class="dark">
  OS listener: re-applies on prefers-color-scheme change

ThemeToggle in Navbar:
  light  → Sun    icon → next: dark
  dark   → Moon   icon → next: system
  system → Monitor icon → next: light
```

---

## 🔗 MenuPage — URL State

```
/menu?category=Mains&sort=price-low&price=1000&new=true&page=2

All filter state in useSearchParams — shareable, refresh-persistent
setParam() removes default values to keep URLs clean
Every filter change resets page to 1
Price param: searchParams.has('price') guard prevents 0-default bug
```

---

## 🚀 Deployment

```
Platform:     Vercel
Build cmd:    npm run build
Output dir:   dist/
SPA routing:  vercel.json → rewrites all paths to /index.html
Favicon:      /public/favicon.svg (amber circle, fork+spoon icon)
Page title:   "Mulatiyana Restaurant — Authentic Sri Lankan Flavours"
Theme color:  #F59E0B (amber-500)
```

---

## ✅ Final UI/UX Audit — All Issues Resolved

| Sprint | Component | Issue | Fix |
|--------|-----------|-------|-----|
| 6 | `SlideCart` | Overflow on tiny screens | `w-[min(100vw,24rem)]` ✅ |
| 6 | `CheckoutPage` | No date picker | Date + Time `sm:grid-cols-2` ✅ |
| 6 | `CheckoutPage` | Native pickers unstyled in dark | `dark:[color-scheme:dark]` ✅ |
| 7 | `MainWebLayout` | Mobile menu too short | `max-h-72` → `max-h-80` ✅ |
| 8 | `MainWebLayout` | Slide-down replaced | Left-side `MobileDrawer` ✅ |
| 8 | `MainWebLayout` | Horizontal scroll from drawer | `overflow-x-hidden` on root ✅ |
| 9 | `MenuPage` | Filter bar scrollbar visible | `hide-scrollbar` CSS utility ✅ |
| 9 | `FoodCard` | Add button triggered Link nav | `e.preventDefault + e.stopPropagation` ✅ |
| 10 | `ListItem` | Button text too wide on mobile | "Add" on `< sm` ✅ |
| 11 | `MenuPage` | Grid too wide inside 3-col area | `lg:grid-cols-3` ✅ |
| 11 | `MenuPage` | Filter changes didn't reset page | All setters call `resetPage()` ✅ |
| 12 | `FloatingActionButtons` | Could overlap SlideCart | FABs `z-40`, SlideCart `z-50` ✅ |
| 12 | `MenuPage` | State lost on refresh | `useSearchParams` ✅ |
| 13 | `MenuPage` | Price filter drops to 0 | `searchParams.has('price')` guard ✅ |
| 13 | `MenuPage` | Native select outdated | `ModernSelect` ✅ |
| 13 | `MenuPage` | Filter changes snap | `AnimatePresence mode="popLayout"` ✅ |
| 14 | `CheckoutPage` | `OrderTypeToggle` forces 2-col mobile | `grid-cols-1 sm:grid-cols-2` ✅ |
| 14 | `CheckoutPage` | Discount input overflows | `flex-col sm:flex-row`, `w-full sm:w-44` ✅ |
| 14 | `CheckoutPage` | Discount not passed to success page | Added to `navigate()` state ✅ |
| 14 | `OrderSuccessPage` | Discount/total not shown | Added conditional InfoRows ✅ |

---

## 🔜 Phase 3: Admin POS System

```
/pos → POSLayout (fixed dark sidebar)
├── /pos/login     → StaffLoginPage      (ADMIN | CASHIER auth)
├── /pos/dashboard → POSDashboardPage    (summary cards, recent orders)
├── /pos/orders    → OrderQueuePage      (live PENDING→PREPARING→READY→COMPLETED)
├── /pos/tables    → TableManagementPage (table grid)
├── /pos/menu      → MenuManagementPage  (CRUD)
├── /pos/reports   → ReportsPage         (charts, top items)
└── All routes protected by ProtectedRoute wrapper
```
