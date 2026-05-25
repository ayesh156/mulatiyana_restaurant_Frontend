# 🏗️ Mulatiyana Restaurant — Application Architecture

> **Last updated:** May 25, 2026 — Quick POS Phase 4 Complete: Grid Pagination + Ref Wiring
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
│   │       ├── ModernPagination.jsx       # ✅ Orange→red gradient active page, smart ellipsis, "Showing X to Y of Z"
│   │       ├── ModernSelect.jsx           # ✅ Premium animated custom dropdown (web app)
│   │       ├── SearchableSelect.jsx       # ✅ POS combobox: framer-motion, sticky search, clearable
│   │       ├── SlideCart.jsx              # ✅ Slide-over cart → /checkout
│   │       └── ThermalReceipt.jsx         # ✅ 80mm thermal receipt: popup window, @page CSS, monospace layout
│   ├── layouts/
│   │   ├── MainWebLayout.jsx              # ✅ Navbar + MobileDrawer (POS Admin link) + SlideCart + FABs
│   │   └── POSLayout.jsx                  # ✅ Theme-aware sidebar, collapsible w-64↔w-20, ChevronLeft/Right
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
│   │       ├── POSDashboardPage.jsx       # ✅ Metric cards (amber-50/gray-800) + bar chart + category meters + order table
│   │       ├── LiveOrdersPage.jsx         # ✅ 3-col Kanban, search+type filter, 8-per-page pagination
│   │       ├── InvoicesPage.jsx           # ✅ Full CRUD: More Options filters, 8-per-page ModernPagination, InvoiceModal + print, Add/Edit/Delete
│   │       ├── InvoiceFormModal.jsx       # ✅ 3-step wizard (Details→Items→Review), edit mode via initialOrder prop
│   │       ├── FoodsListPage.jsx          # ✅ Table, More Options filters (price range + new-only), 8-per-page ModernPagination
│   │       ├── FoodFormPage.jsx           # ✅ 2-col form, Canvas compression, paste, SearchableSelect
│   │       ├── QuickPOSPage.jsx           # ✅ Full-screen touch POS: 3-col layout, thermal print, toast, mobile drawer
│   │       └── SettingsPage.jsx           # ✅ 3-tab: General · Business Hours · System Preferences
│   ├── routes/
│   │   └── index.jsx                      # ✅ All routes registered
│   └── utils/
│       ├── constants.js                   # ✅ FALLBACK_IMAGE_URL
│       ├── menuData.js                    # ✅ MENU_ITEMS[] + CATEGORIES[]
│       ├── mockOrders.js                  # ✅ 8 mock orders + derived selectors
│       ├── posAnalytics.js                # ✅ Hourly sales, category stats, weekly revenue
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

### `SearchableSelect` (POS)
```
Props: options[{label,value}], value, onChange, placeholder, searchPlaceholder,
       className, triggerClassName, clearable
Behaviour:
  - framer-motion AnimatePresence dropdown (opacity+y+scale, 140ms easeOut)
  - Sticky search input at top of dropdown (auto-focused on open, cleared on close)
  - Filters options client-side as user types; shows "No results" empty state
  - Click-outside + Escape to close
  - clearable=true shows × button on trigger to reset value to ''
  - z-[200] on dropdown — clears all overflow:hidden ancestors
Used in: FoodsListPage (Category + Availability), FoodFormPage (Category),
         LiveOrdersPage (Type filter)
```

### `SearchableSelect` vs `ModernSelect`
```
ModernSelect  — customer-facing web app (MenuPage sort/filter)
SearchableSelect — POS admin pages (searchable combobox with sticky search)
```
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
| 15 | `POSDashboardPage` | Bar chart clips on mobile | `overflow-x-auto` + `pl-10` offset ✅ |
| 15 | `POSDashboardPage` | Tooltip z-index stacking | `absolute z-10` on tooltip div ✅ |
| 15 | `POSDashboardPage` | Status badges low contrast | `bg-*/10 text-* border border-*/20` pattern ✅ |
| 15 | `MainWebLayout` | POS link hidden on mobile | `hidden md:flex` — intentional (mobile drawer has cart) ✅ |
| 16 | `POSLayout` | Sidebar always dark in light mode | Full theme-aware classes on sidebar + header ✅ |
| 16 | `POSLayout` | No collapse on desktop | `isSidebarCollapsed` state, `w-64`↔`w-20` transition ✅ |
| 16 | `LiveOrdersPage` | Kanban stacks on mobile | `grid-cols-1 md:grid-cols-3` ✅ |
| 17 | `LiveOrdersPage` | OrderCards flat/low contrast | `bg-amber-50 dark:bg-gray-800 shadow-md hover:-translate-y-0.5` ✅ |
| 17 | `MenuManagementPage` | Table overflows on mobile | `overflow-x-auto min-w-[700px]` ✅ |
| 17 | `MenuManagementPage` | Modal behind POSLayout header | `fixed inset-0 z-50 backdrop-blur-sm` ✅ |
| 17 | `MenuManagementPage` | Native select in modal | Acceptable for internal admin tool (no customer-facing) ✅ |
| 18 | `POSDashboardPage` | MetricCards inconsistent with OrderCards | `bg-amber-50 dark:bg-gray-800 border-amber-100 dark:border-gray-700 shadow-md` ✅ |
| 18 | `SettingsPage` | Time inputs unstyled in dark mode | `dark:[color-scheme:dark]` on all time inputs ✅ |
| 18 | `SettingsPage` | Tab rail overflows on mobile | `flex-row overflow-x-auto hide-scrollbar` → `md:flex-col` ✅ |
| 18 | `SettingsPage` | Dark mode toggle disconnected | Wired to real `useTheme()` / `toggleTheme()` ✅ |
| 19 | `FoodsListPage` | Table overflows on mobile | `overflow-x-auto min-w-[680px]` ✅ |
| 19 | `FoodsListPage` | Delete modal z-index | `fixed inset-0 z-50 bg-black/70 backdrop-blur-sm` ✅ |
| 19 | `FoodFormPage` | Form 2-col clips on small screens | `grid-cols-1 lg:grid-cols-2` stacks cleanly ✅ |
| 19 | `FoodFormPage` | Category uses native select | `ModernSelect` per RULES.md ✅ |
| 19 | `FoodFormPage` | Image URL vs upload conflict | URL input hidden when data: URI present ✅ |
| 20 | `SearchableSelect` | Dropdown clipped by overflow:hidden | `z-[200]` on dropdown div ✅ |
| 20 | `FoodFormPage` | Large images slow the form | Canvas compression maxDim=1200 quality=0.82 ✅ |
| 20 | `FoodFormPage` | No paste support | Global `document.addEventListener('paste')` in useEffect ✅ |
| 20 | `LiveOrdersPage` | No way to find specific order | Search bar (order ID + customer name) ✅ |
| 20 | `LiveOrdersPage` | Columns overflow with many orders | 8-per-page `ColumnPager` with page clamp ✅ |
| 20 | `LiveOrdersPage` | Filter state stale after advance | `useMemo` recomputes on every `orders` change ✅ |
| 21 | `FoodsListPage` | No price filtering | Price Range SearchableSelect (5 bands) ✅ |
| 21 | `FoodsListPage` | No new-items filter | Sparkles toggle button, amber active state ✅ |
| 21 | `FoodsListPage` | No table pagination | 8-per-page TablePager, page clamps on filter ✅ |
| 21 | `InvoicesPage` | Modal overflows on small screens | `max-h-[90vh] flex flex-col overflow-hidden` + scrollable body ✅ |
| 21 | `InvoicesPage` | Table overflows on mobile | `overflow-x-auto min-w-[700px]` ✅ |
| 22 | `InvoicesPage` | No create/edit/delete | `InvoiceFormModal` wizard + `DeleteModal` ✅ |
| 22 | `InvoiceFormModal` | Edit mode needs pre-fill | `initialOrder` prop seeds all 3 step states ✅ |
| 22 | `InvoicesPage` | Old TablePager replaced | `ModernPagination` — orange→red gradient, smart ellipsis ✅ |
| 22 | `FoodsListPage` | Old TablePager replaced | `ModernPagination` — consistent with Invoices ✅ |
| 22 | `InvoicesPage` + `FoodsListPage` | All filters always visible | "More Options" expandable row (max-h CSS transition) ✅ |
| 22 | `DeleteModal` (Invoices) | z-index below InvoiceFormModal | `z-[60]` — above InvoiceModal `z-50` ✅ |
| 23 | `QuickPOSPage` | Tablet: grid too wide with cart | `grid-cols-2 sm:grid-cols-3` + cart `minWidth:260px` ✅ |
| 23 | `QuickPOSPage` | Mobile: no cart access | Bottom-sheet `MobileCartDrawer` + FAB with badge ✅ |
| 23 | `QuickPOSPage` | Mobile: category overflow | Horizontal `MobileCategoryBar` with `overflow-x-auto` ✅ |
| 23 | `ThermalReceipt` | Popup blocked silently | `try/catch` restores cart + shows red error toast ✅ |
| 23 | `ThermalReceipt` | Print dialog leaves popup open | `onafterprint` closes popup; 30s timeout fallback ✅ |
| 23 | `CartPanel` | No feedback during print | Spinner + "Processing…" replaces button text while `isPaying` ✅ |
| 24 | `QuickPOSPage` | All items rendered at once (no pagination) | `ITEMS_PER_PAGE=15`, `currentPage` state, `paginatedItems` slice, `ModernPagination` pinned below grid ✅ |
| 24 | `QuickPOSPage` | F8/F9 refs not wired to inputs | `discountInputRef` → discount `<input>`, `customerCashInputRef` → cash `<input>` ✅ |

---

## 🔜 Phase 3: Admin POS System

```
/pos → POSLayout
│   (Sidebar: Dashboard · Live Orders · Invoices · Foods · Settings)
│   (Sidebar footer: Globe "View Live Website" → /)
│   (Header: Live clock · ThemeToggle · Cashier badge)
│   (Mobile: off-canvas sidebar with backdrop)
│
├── /pos/dashboard  → POSDashboardPage  ✅ Full SaaS overhaul
│   ├── MetricCards ×4 — animated hover scale, accent bar, trend badge
│   │   (Revenue · Total Orders · Prep Queue · Active Dine-ins)
│   ├── Analytics Split (lg:grid-cols-12)
│   │   ├── SalesOverviewChart (lg:col-span-8) — pure Tailwind bar chart
│   │   │   (14 hourly bars, hover tooltip, peak highlight, y-axis guides)
│   │   └── PopularCategories (lg:col-span-4) — progress meter rows
│   │       (5 categories, colored bars, conic-gradient donut ring)
│   └── Live Incoming Orders table + Completed Orders table
│       (status badges: bg-*/10 text-* border border-*/20 pattern)
│
├── /pos/orders     → LiveOrdersPage     ✅ Kanban board + filters + pagination
│   ├── Filter bar: search (order ID / customer name) + SearchableSelect type filter + Clear
│   ├── useMemo filtered orders with active filter summary line
│   ├── Pending column   (amber, 9 orders, 2 pages)
│   ├── Preparing column (blue,  7 orders, 1 page)
│   └── Ready column     (purple,4 orders, 1 page)
│       Each column: 8 items/page · ColumnPager prev/next · page clamps on filter change
│
├── /pos/invoices   → InvoicesPage       ✅ Full CRUD invoices module — 100% COMPLETE
│   ├── Header: title + revenue pill + "Add Invoice" button (orange→red gradient)
│   ├── Filter bar: search + Payment Status + Date Range (primary) | Order Type (More Options expand)
│   ├── Data table (min-w-[700px]): Invoice ID · Date/Time · Customer · Type · Total · PaymentBadge · Eye/Edit/Delete
│   ├── 8-per-page ModernPagination ("Showing X to Y of Z", orange→red active page, smart ellipsis)
│   ├── InvoiceModal (z-50, max-h-[90vh] overflow-y-auto)
│   │   ├── Restaurant header (logo, address)
│   │   ├── Invoice meta grid (2-col: Invoice#, Order#, Date, Time, Customer, Phone, Type, Payment)
│   │   ├── Itemised table (Item · Qty · Unit Price · Total)
│   │   ├── Totals block (Subtotal · Discount · Grand Total dashed border)
│   │   └── "Print Invoice" → window.open() with embedded CSS for clean A4 print
│   ├── InvoiceFormModal (z-[60], 3-step wizard)
│   │   ├── Step 1 — Customer Name · Phone · Order Type toggle · Table Number (conditional)
│   │   ├── Step 2 — Item search dropdown (live filter MENU_ITEMS) · qty steppers · remove · running subtotal
│   │   ├── Step 3 — Order summary card · Discount input · Payment Method (Cash/Card) · Payment Status (Paid/Unpaid)
│   │   ├── Create mode: nextId prop, prepends to orders list
│   │   └── Edit mode: initialOrder prop pre-fills all 3 steps, updates in-place
│   └── DeleteModal (z-[60], gradient-danger header, confirms invoice ID + customer + total)
│
├── /pos/foods          → FoodsListPage      ✅ ecotec-system design standard
│   ├── Filter bar: search + Category + Availability (primary) | Price Range + New Only (More Options expand)
│   ├── Sortable table: thumbnail · name+NEW · CategoryPill · price · AvailabilityBadge · Edit/Delete
│   ├── 8-per-page ModernPagination (orange→red active page, "Showing X to Y of Z")
│   ├── Edit → navigate('/pos/foods/edit/:id')
│   └── Delete → gradient-red modal (ecotec DeleteConfirmationModal pattern)
│
├── /pos/foods/add      → FoodFormPage       ✅ Add mode
├── /pos/foods/edit/:id → FoodFormPage       ✅ Edit mode (pre-fills from menuData.js)
│   ├── Top bar: ChevronLeft "Back" + gradient title
│   ├── 2-col desktop layout (stacks to 1-col on mobile)
│   │   ├── Left: Name · Description · Price (Rs. prefix) · Category (SearchableSelect)
│   │   └── Right: Image upload/drag/paste(Ctrl+V)/URL + Canvas compression + Loader2 overlay
│   │              Available toggle · isNew toggle · price preview card
│   └── Action bar: "Add Food"/"Save Changes" (amber gradient) + "Cancel"
│
└── /pos/settings   → SettingsPage      ✅ 3-tab settings
    ├── Tab rail: horizontal on mobile → vertical on md+
    ├── General tab: Restaurant Identity + Contact Details
    ├── Business Hours tab: per-day toggle + time inputs (dark:[color-scheme:dark])
    └── System Preferences tab: auto-accept, order sound, dark mode (ThemeContext), compact view, clear cache

/pos/quick → QuickPOSPage  ✅ Full-screen (no POSLayout wrapper)
│   Top-level route — bypasses POSLayout sidebar/header entirely
│   (Top bar: ChevronLeft "Dashboard" back button + logo + "Quick Invoice" title + mobile cart FAB)
│
├── Left (140px): CategorySidebar — redesigned touch-friendly vertical buttons
│   ├── Each button: emoji icon + label, rounded-xl, active = amber-500 bg + left accent bar
│   ├── Hover: scale-110 emoji, bg-gray-100 dark:bg-gray-800
│   ├── Scrolls silently: [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
│   └── Hidden on mobile → replaced by horizontal MobileCategoryBar (emoji pills)
│
├── Middle (flex-1): flex-col — OrderModeTabs on top, scrollable grid below
│   ├── OrderModeTabs bar (shrink-0, border-b):
│   │   ├── New Order tab     (ClipboardList icon, amber active)
│   │   ├── Ongoing Orders tab (Clock icon, blue active)
│   │   ├── Online Orders tab  (Wifi icon, violet active)
│   │   └── SearchableSelect "Select Customer" (w-44, hidden on mobile)
│   │       options: Walk-in + 5 named customers (static, ready for API)
│   └── Scrollable item grid (flex-1 overflow-y-auto overflow-x-hidden)
│       ├── 2-col (mobile) → 3-col (sm/lg) → 4-col (xl) → 5-col (2xl)
│       ├── MenuCard: image (4:3 aspect), name, price, qty badge overlay, hover + indicator
│       ├── Tap card → addItem() (increments if already in cart)
│       └── ModernPagination (pinned below grid, hidden when totalPages ≤ 1)
│           ├── ITEMS_PER_PAGE = 15 (constant)
│           ├── currentPage state — resets to 1 on category/search/filter change
│           ├── paginatedItems = filteredItems.slice((page-1)*15, page*15)
│           └── orange→red gradient active page, "Showing X to Y of Z", smart ellipsis
│
└── Right (w-80 shrink-0): CartPanel — persistent ticket
    ├── Header: ShoppingCart icon badge + "Order Ticket" title + count pill + "Clear all"
    ├── Scrollable items ONLY (flex-1 min-h-0 overflow-y-auto):
    │   ├── CartRow: thumbnail · name · unit price · line total · smart stepper
    │   │   (qty=1: minus morphs to Trash2 red; hover: X remove fades in)
    │   └── Empty state: amber icon + "Ticket is empty" copy
    └── Pinned footer (shrink-0 border-t):
        ├── OrderDetailsStrip (always visible):
        │   ├── Order Type: segmented pill toggle [Dine-in][Takeaway]
        │   ├── Customer Name input (Takeaway only, uncontrolled ref)
        │   ├── Discount: [%][Rs.] toggle + number input (F8 badge) — ref: discountInputRef
        │   └── Customer Cash input (F9 badge) — ref: customerCashInputRef + live Change/Short-by pill
        │       (emerald when change ≥ 0, red when short)
        ├── Totals: Subtotal · Discount (emerald) · dashed divider · Grand Total (amber xl)
        └── PAY & PRINT button (amber gradient, shadow, py-4, F12 badge)
            └── handlePay():
                1. nextInvoiceNumber() → QR-0001 … (sessionStorage counter)
                2. Reads orderType, customerName ref, discountAmt, customerCash
                3. printThermalReceipt(receiptData) → opens 340×600 popup
                4. Optimistic clear: cart + discount + customerCash + customerName ref
                5. onafterprint → popup closes, Promise resolves
                6. showToast('Invoice generated successfully') — 3.2s green toast
                7. On popup-blocked: restores cart + red error toast
    Keyboard shortcuts (global, e.preventDefault on all):
        F4  → focus search bar (searchRef)
        F8  → focus Discount input
        F9  → focus Customer Cash input
        F12 → trigger handlePay() via stable handlePayRef (no stale closure)
    Mobile: CartPanel lives inside MobileCartDrawer (bottom-sheet, slide-up, max-h-[85vh])

### ThermalReceipt — printThermalReceipt(receiptData)
```
Technique: window.open() popup (340×600) with self-contained HTML
@page CSS: size: 80mm auto; margin: 4mm 3mm
Font: 'Courier New' monospace — authentic thermal printer look
Width: 74mm (80mm - 2×3mm margin) = ~32 chars per line
Layout:
  MULATIYANA (logo text, centered, uppercase)
  Tagline + address
  ─────────────────────────────────
  Invoice · Date · Time · Type · Cashier
  ─────────────────────────────────
  ORDER ITEMS
  ·································
  Item Name
  Qty x Rs. Price          Rs. Total
  ·································
  Subtotal                 Rs. X,XXX
  - Discount               Rs. X,XXX  (if > 0)
  ═════════════════════════════════
  TOTAL                    Rs. X,XXX
  ─────────────────────────────────
  Payment: Cash | PAID
  ─────────────────────────────────
  ||||| QR-0001 |||||  (barcode placeholder)
  THANK YOU!
  www.mulatiyana.lk
Screen preview: white card, 80mm wide, box-shadow
Print: @media print hides screen chrome, outputs clean receipt
```
```

### POSLayout — Collapsible Sidebar
```
isSidebarCollapsed (useState, default: false)
  false → w-64: logo text + nav labels + user card visible
  true  → w-20: icon-only, labels hidden, tooltips via title attr
  Toggle: ChevronLeft/ChevronRight button in brand header (desktop only)
  Transition: transition-all duration-300 ease-in-out on <aside>

Theme-aware classes (light + dark):
  Sidebar bg:  bg-white dark:bg-gray-950
  Border:      border-gray-200 dark:border-gray-800
  Header bg:   bg-white dark:bg-gray-950
  Nav links:   text-gray-500 dark:text-gray-400
               hover:bg-gray-100 dark:hover:bg-gray-800
  Active link: bg-amber-500 text-white shadow-md shadow-amber-500/20
  User card:   bg-gray-100 dark:bg-gray-800/60
```
```
MainWebLayout Navbar (desktop):
  LayoutDashboard icon + "POS" label → /pos
  (hidden md:flex, subtle border, hover amber)

MainWebLayout MobileDrawer (mobile):
  "Admin" section divider (border-t + label)
  LayoutDashboard icon + "POS Admin" + ADMIN badge → /pos
  (bg-amber-500/10 text-amber-600 dark:text-amber-400, closes drawer on tap)

POSLayout Sidebar footer:
  Globe icon + "View Live Website" → /
  (text-gray-400, hover:text-white, hover:bg-gray-800)
```
