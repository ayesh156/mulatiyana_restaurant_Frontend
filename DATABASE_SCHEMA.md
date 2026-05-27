# 🗄️ Senari Chinese Hotel — Data Schema Reference

> **Business logic:** Order ahead for pick-up or dine-in only. No home delivery. Pay at counter.
>
> Last updated: **May 26, 2026** (Phase 5 — Master Data, Inventory, Settings)

This document describes **current frontend state shapes** (Zustand + local/mock data) and the **target PostgreSQL/Prisma schema** for backend integration.

---

## 📦 Frontend State (Current — Pre-API)

### `authStore` (`sessionStorage` — `pos-auth`)

| Field | Type | Description |
|-------|------|-------------|
| `staff` | `Staff \| null` | Logged-in staff: `{ id, name, role, avatar }` |

Demo accounts: ADMIN (PIN 1234), CASHIER (5678), Nimal Silva (9012).

---

### `masterDataStore` (`localStorage` — `pos-master-data`)

| Field | Type | Description |
|-------|------|-------------|
| `foodCategories` | `string[]` | Menu categories (Foods filter + Food form) |
| `inventoryCategories` | `string[]` | Raw ingredient categories |
| `units` | `string[]` | Measurement units (kg, liters, pcs, portions, …) |

CRUD via **Master Data** page (`/pos/master-data`). Delete blocked when seed `MENU_ITEMS` / `INVENTORY_ITEMS` still reference a value.

---

### `settingsStore` (`localStorage` — `pos-settings`)

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `defaultTaxRate` | `number` | `5` | Default tax % on bills |
| `defaultServiceCharge` | `number` | `10` | Default service charge % |
| `applyTaxOnReceipt` | `boolean` | `true` | Show/apply tax on thermal receipt |
| `applyServiceChargeOnReceipt` | `boolean` | `true` | Show/apply service charge on receipt |
| `defaultOrderType` | `'Dine-in' \| 'Takeaway'` | `'Dine-in'` | Quick POS default order mode |
| `defaultDiscountType` | `'percent' \| 'fixed'` | `'percent'` | Quick POS default discount mode |
| `maxDiscountPercent` | `number` | `25` | Cap for % discounts |
| `inventoryLowStockAlerts` | `boolean` | `true` | Alert when qty ≤ min alert level |
| `enablePaymentReminders` | `boolean` | `true` | Customer due reminder feature |
| `showLowStockOnDashboard` | `boolean` | `false` | Surface low stock on dashboard (planned) |

Configured via **Settings → Billing & POS** (`/pos/settings`).

---

### Foods (`FoodsListPage` + `FoodFormPage`)

**Source:** `menuData.js` seed + page-local state (not yet persisted globally).

```ts
FoodItem {
  id:           number
  name:         string
  description?: string
  category:     string          // from masterDataStore.foodCategories
  price:        number          // LKR
  image?:       string
  isNew?:       boolean
  available:    boolean         // FoodsListPage only
  ingredients?: string[]
}
```

**Routes:** `/pos/foods`, `/pos/foods/add`, `/pos/foods/edit/:id`

---

### Invoices / Orders (`InvoicesPage`, `QuickPOSPage`, `mockOrders.js`)

```ts
Order {
  id:              number
  orderNumber?:    string        // e.g. INV-001
  customerName:    string
  customerPhone?:  string
  orderType:       'Dine-in' | 'Takeaway' | 'Online'
  status:          'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'PAID' | …
  items:           OrderLineItem[]
  subtotal:        number
  discountType?:   'percentage' | 'fixed' | '%' | 'Rs.'
  discountAmount?: number
  grandTotal:      number
  createdAt?:      string
  tableNumber?:    string
}

OrderLineItem {
  id:        number | string
  name:      string
  category?: string
  price:     number
  quantity:  number
  image?:    string
}
```

**Routes:** `/pos/invoices`, `/pos/quick` (full-screen register)

---

### Customers (`CustomersPage`)

```ts
Customer {
  id:              number
  name:            string
  phone:           string
  nic?:            string
  email?:          string
  address?:        string
  image?:          string          // base64 or URL
  totalOrders:     number
  totalSpent:      number
  dueAmount:       number
  reminderCount:   number
}
```

Reminder logs keyed by `customerId`. Message template in Settings → Messaging.

**Route:** `/pos/customers`

---

### Inventory (`InventoryPage` + `inventoryData.js` seed)

```ts
InventoryItem {
  id:               number
  itemName:         string
  sku:              string
  category:         string       // from masterDataStore.inventoryCategories
  quantityInStock:  number
  unit:             string       // from masterDataStore.units
  minAlertLevel:    number
  unitPrice:        number       // LKR per unit
}

// Derived (not stored):
stockStatus:  'in' | 'low' | 'out'   // out if qty≤0; low if qty≤minAlertLevel
stockValue:   quantityInStock * unitPrice
```

Adjustment reasons: New Delivery, Daily Usage, Damage/Waste, Inventory Count Correction, Other.

**Route:** `/pos/inventory`

---

### Suppliers (`SuppliersPage` + `mockSuppliers.js`)

```ts
Supplier {
  id:              number
  name:            string
  phone:           string
  email?:          string
  address?:        string
  category:        string       // Vegetables | Meat | Seafood | Groceries | …
  totalPurchases:  number       // LKR lifetime purchase volume
  payableAmount:   number       // Debt owed to supplier (payables)
}
```

**Route:** `/pos/suppliers` — CRUD, partial/full settle payment on `payableAmount`.

---

### Tables (`TableManagementPage`)

```ts
Table {
  id:       number
  number:   string        // e.g. T-01
  capacity: number
  status:   'AVAILABLE' | 'OCCUPIED' | 'RESERVED'
  note?:    string
}
```

**Route:** `/pos/tables`

---

### Master Data (lookup lists only)

No separate entity table in frontend — lists live in `masterDataStore` (see above).

**Route:** `/pos/master-data`

---

## 🗺️ Module → Storage Map

| POS Module | Primary state | Persistence |
|------------|---------------|-------------|
| Dashboard | `mockOrders`, `posAnalytics` | Mock |
| Quick Invoice | Cart + order draft | Session / navigate state |
| Invoices | `mockOrders` + local edits | In-memory per session |
| Live Orders | `mockOrders` | In-memory |
| Foods | `MENU_ITEMS` + page state | Mock + local edits |
| Inventory | `INVENTORY_ITEMS` + page state | Mock + local edits |
| Master Data | `masterDataStore` | `localStorage` |
| Customers | Page-local `customers[]` | In-memory per session |
| Suppliers | `MOCK_SUPPLIERS` + page state | Mock + local edits |
| Tables | Page-local `tables[]` | In-memory per session |
| Reports | `reportAnalytics.js` + `posAnalytics.js` + orders/inventory/suppliers | Mock aggregates |
| Settings | `settingsStore` + tab forms | `localStorage` (billing) / local (general) |
| Auth | `authStore` | `sessionStorage` |

---

## 🎯 Target Prisma Schema (Backend — Phase 6+)

Existing models remain the foundation. Planned extensions:

```prisma
// ── EXTENSIONS (planned) ──────────────────────────────────────────────────

model Customer {
  id            Int      @id @default(autoincrement())
  name          String
  phone         String
  nic           String?
  email         String?
  address       String?
  imageUrl      String?
  totalOrders   Int      @default(0)
  totalSpent    Decimal  @db.Decimal(12, 2) @default(0)
  dueAmount     Decimal  @db.Decimal(12, 2) @default(0)
  reminderCount Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  reminderLogs  ReminderLog[]
  @@map("customers")
}

model ReminderLog {
  id         Int      @id @default(autoincrement())
  message    String
  sentAt     DateTime @default(now())
  customer   Customer @relation(fields: [customerId], references: [id])
  customerId Int
  @@map("reminder_logs")
}

model InventoryItem {
  id              Int      @id @default(autoincrement())
  itemName        String
  sku             String   @unique
  category        String
  quantityInStock Decimal  @db.Decimal(12, 3)
  unit            String
  minAlertLevel   Decimal  @db.Decimal(12, 3)
  unitPrice       Decimal  @db.Decimal(10, 2)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  adjustments     StockAdjustment[]
  @@map("inventory_items")
}

model StockAdjustment {
  id              Int      @id @default(autoincrement())
  quantityBefore  Decimal  @db.Decimal(12, 3)
  quantityAfter   Decimal  @db.Decimal(12, 3)
  reason          String
  createdAt       DateTime @default(now())
  inventoryItem   InventoryItem @relation(fields: [inventoryItemId], references: [id])
  inventoryItemId Int
  staffId         Int?
  @@map("stock_adjustments")
}

model RestaurantTable {
  id       Int          @id @default(autoincrement())
  number   String       @unique
  capacity Int
  status   TableStatus  @default(AVAILABLE)
  note     String?
  @@map("restaurant_tables")
}

enum TableStatus {
  AVAILABLE
  OCCUPIED
  RESERVED
}

model Unit {
  id   Int    @id @default(autoincrement())
  name String @unique
  @@map("units")
}

model SystemSettings {
  id                        Int     @id @default(1)
  defaultTaxRate            Decimal @db.Decimal(5, 2)
  defaultServiceCharge      Decimal @db.Decimal(5, 2)
  applyTaxOnReceipt         Boolean @default(true)
  applyServiceChargeOnReceipt Boolean @default(true)
  defaultOrderType          String
  defaultDiscountType       String
  maxDiscountPercent        Decimal @db.Decimal(5, 2)
  inventoryLowStockAlerts   Boolean @default(true)
  enablePaymentReminders    Boolean @default(true)
  reminderMessageTemplate String?
  @@map("system_settings")
}
```

---

## 📊 Entity Relationships (Target)

```
Category ──< Product (Foods)
Product  ──< OrderItem ──> Order (Invoices / Quick POS)

Customer ──< ReminderLog

InventoryItem ──< StockAdjustment

RestaurantTable (standalone)

Unit, Category (Master Data — may merge with Category model)

User (staff) — auth only
SystemSettings — singleton row
```

---

## 🔑 Business Rules

| Rule | Enforcement |
|------|-------------|
| No delivery | No `deliveryAddress` on orders |
| Pay at counter | `paymentStatus` UNPAID until staff confirms |
| Pick-up or dine-in | `orderType` ∈ Dine-in, Takeaway (no Delivery) |
| Price snapshot | `unitPrice` on line items at order time |
| Discount cap | `maxDiscountPercent` in settings (Quick POS) |
| Stock status | `quantityInStock` vs `minAlertLevel`; alerts toggle in settings |
| Master data integrity | Block delete when seed/mock records reference lookup value |
| Currency | LKR — display as `Rs. X,XXX` |

---

## 📁 Related Files

| File | Purpose |
|------|---------|
| `src/utils/menuData.js` | Food seed data |
| `src/utils/inventoryData.js` | Inventory seed + status helpers |
| `src/utils/masterDataStore.js` | Categories & units |
| `src/utils/settingsStore.js` | Billing & POS preferences |
| `src/utils/authStore.js` | Staff session |
| `src/utils/mockOrders.js` | Invoice/order seed |
| `src/utils/mockSuppliers.js` | Supplier seed data |
| `src/utils/reportAnalytics.js` | Advanced Reports KPIs, charts, food rankings |

---

## 📈 Reports Analytics (`reportAnalytics.js`)

| Export | Description |
|--------|-------------|
| `getReportKPIs()` | `todayRevenue`, `totalProfit`, `totalStockValue`, `pendingPayables` |
| `REVENUE_LAST_7_DAYS` | 7-day revenue series for area chart |
| `TOP_CATEGORY_PIE` | Top 5 categories by revenue (pie chart) |
| `TOP_SELLING_FOODS` / `LEAST_SELLING_FOODS` | Ranked food items from `MOCK_ORDERS` + `MENU_ITEMS` |
| `PROFIT_MARGIN` | Default 38% margin constant |
