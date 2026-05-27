# 📋 Workspace — Senari Chinese Hotel

> **Last updated:** May 27, 2026

---

## ✅ Completed

### Phase 1 — Customer Web App
- [x] Project scaffold (Vite + React + Tailwind + Zustand + Framer Motion)
- [x] `ThemeContext` — light / dark / system with localStorage persistence
- [x] `MainWebLayout` — Navbar, MobileDrawer, SlideCart, FloatingActionButtons
- [x] `HomePage` — Hero + Popular Items
- [x] `MenuPage` — Filters + Search + Sort + Pagination (URL-synced state)
- [x] `ProductViewPage` — Detail + Qty + Suggestions
- [x] `AboutPage` — Story + Values + Gallery
- [x] `ContactPage` — Details + Google Map embed + Contact Form
- [x] `CheckoutPage` — Order form + Discount + Pay at Counter
- [x] `OrderSuccessPage` — Confirmation + Discount + Grand Total
- [x] `FoodCard` — Clickable card → `/menu/:id`
- [x] `SlideCart` — Slide-over cart → `/checkout`
- [x] `ModernSelect` — Premium animated custom dropdown (web app)
- [x] `AnimatedSection` — Framer Motion scroll-reveal wrapper
- [x] `FloatingActionButtons` — WhatsApp FAB + Scroll-to-Top FAB
- [x] `useCartStore` — Zustand cart with localStorage persistence
- [x] `vercel.json` — SPA catch-all rewrite

### Phase 2 — POS Admin System
- [x] `StaffLoginPage` — PIN pad, 3 staff cards, shake animation, keyboard support
- [x] `ProtectedRoute` — Auth guard redirecting to `/pos/login`
- [x] `POSLayout` — Collapsible sidebar (w-64↔w-20), live clock, theme-aware
- [x] `POSDashboardPage` — Metric cards, area chart, category stats, order table
- [x] `LiveOrdersPage` — 3-col Kanban, search+filter, 8/page pagination
- [x] `InvoicesPage` — Full CRUD, thermal receipt, InvoiceFormModal wizard
- [x] `InvoiceFormModal` — 3-step wizard (Details→Items→Review), edit mode
- [x] `FoodsListPage` — Table, More Options filters, 8/page ModernPagination
- [x] `FoodFormPage` — 2-col form, canvas compression, paste, SearchableSelect
- [x] `QuickPOSPage` — Full-screen touch POS, thermal print, F-key shortcuts, tax/service charge
- [x] `ThermalReceipt` — 80mm thermal receipt popup with `@page` CSS
- [x] `ReportsPage` — KPIs, area chart, pie chart, top/least selling foods
- [x] `SettingsPage` — 4 tabs: General, Business Hours, System Preferences, Messaging
- [x] `settingsStore` — Zustand store for billing/POS preferences (localStorage)
- [x] `SearchableSelect` — POS combobox with sticky search, clearable, framer-motion
- [x] `ModernPagination` — Orange→red gradient active page, smart ellipsis

### Phase 3 — Extended POS Modules
- [x] `InventoryPage` — CRUD, stock adjustments, table+grid view, sort, status badges
- [x] `MasterDataPage` — CRUD for food categories, inventory categories, units
- [x] `masterDataStore` — Zustand store for lookup lists (localStorage)
- [x] `CustomersPage` — Enterprise CRM: CRUD, avatar upload, partial payments, reminder system, history modal
- [x] `TableManagementPage` — Grid+list, click-to-cycle status, CRUD
- [x] `SuppliersPage` — Supplier CRUD, partial/full payment settle
- [x] `PurchaseOrdersPage` — 3-step wizard, view/delete, status badges, supplier+inventory integration

### Phase 4 — Dashboard Enhancements
- [x] `POSDashboardPage` — `QuickLinksPanel`: 4 shortcut cards (Low Stock · Pending Payables · Live Orders · Customers with Dues)
- [x] `POSDashboardPage` — `LowStockPanel`: conditional on `showLowStockOnDashboard` setting; grid of low/out-of-stock items with stock bars + "View All" → `/pos/inventory`
- [x] `settingsStore` — `showLowStockOnDashboard` default changed to `true`
- [x] `CustomersPage` — Avatar in table row: replaced fragile `style.display` trick with Tailwind `hidden`/`flex` classes + `onerror` fallback

### Phase 5 — Responsive Grid Views (All Core Pages)
- [x] `CustomersPage` — `CustomerCard` component: avatar (image or initials), name, phone, stats grid (Orders/Spent/Due), due badge, action buttons (View/Edit/Delete/Settle/Remind) in card footer
- [x] `CustomersPage` — `viewMode` auto-switch: `window.matchMedia('(max-width: 767px)')` listener sets grid on mobile, table on desktop; user can override via toggle
- [x] `CustomersPage` — Grid layout: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, shared `ModernPagination`, empty state
- [x] `CustomersPage` — Removed unused `Upload` and `Field` imports
- [x] `FoodsListPage` — Unified responsive grid: normalized `'card'` → `'grid'` viewMode value; auto-switch useEffect; segmented List/LayoutGrid toggle in filter bar
- [x] `InvoicesPage` — Responsive grid view: card shows INV#, date, customer, type badge, total, payment status pill, View/Delete actions; auto-switch useEffect; fixed pre-existing duplicate JSX corruption
- [x] `InventoryPage` — Responsive grid view: card shows item name, SKU, category pill, stock qty+value, status badge, Adjust/Edit/Delete actions; auto-switch useEffect added; toggle moved from inner header into filter bar; normalized `'card'` → `'grid'`
- [x] `SuppliersPage` — Full responsive grid added: card shows avatar initials, name, phone, category pill, purchases+payable stats, outstanding alert, Edit/Delete/Settle actions; `viewMode` state + auto-switch useEffect + `List`/`LayoutGrid` imports added; toggle in filter bar
- [x] `PurchaseOrdersPage` — Full responsive grid added: card shows PO#, date, status pill, supplier avatar, total/balance stats, items count, View/Delete actions; `viewMode` state + auto-switch useEffect + `List`/`LayoutGrid` imports added; toggle in filter bar; `ModernPagination` always rendered
- [x] `TableManagementPage` — Auto-switch useEffect added (defaults to grid, locks to grid on mobile); `useEffect` import added

---

## 🔜 Next Steps (Phase 5+)

### Medium Priority
- [ ] **Purchase Orders → Inventory sync (global store)** — Currently PO page syncs its own local `inventory` state. When a real store/API is added, the sync should propagate to `InventoryPage` state as well.
- [ ] **`/cart` route** — Currently a "coming soon" placeholder. Build a dedicated cart page or redirect to checkout.

### Phase 6 — Backend Integration (Future)
- [ ] Supabase / Prisma PostgreSQL backend
- [ ] Real authentication (replace PIN demo with JWT/session)
- [ ] API endpoints for all CRUD operations
- [ ] SMS integration for customer reminders
- [ ] Contact form email delivery

---

## 📊 Sprint Log

| Sprint | Feature | Status |
|--------|---------|--------|
| 1–7    | Customer Web App (all pages) | ✅ Done |
| 8–15   | POS Layout + Dashboard + Live Orders | ✅ Done |
| 16–18  | Invoices + Settings + Foods | ✅ Done |
| 19–22  | FoodForm + QuickPOS + Reports | ✅ Done |
| 23–25  | QuickPOS polish (shortcuts, tax, pagination) | ✅ Done |
| 26–28  | Inventory + Master Data + settingsStore wiring | ✅ Done |
| 29–31  | Customers CRM + Tables + Suppliers | ✅ Done |
| 33     | Dashboard QuickLinksPanel + LowStockPanel + customer avatar fix + settingsStore default | ✅ Done |
| 34     | CustomersPage responsive grid/card view + mobile auto-switch + CustomerCard component | ✅ Done |
| 35     | Unified responsive grid across all 6 core pages (Foods, Invoices, Inventory, Suppliers, PurchaseOrders, Tables) + InvoicesPage corruption fix | ✅ Done |
