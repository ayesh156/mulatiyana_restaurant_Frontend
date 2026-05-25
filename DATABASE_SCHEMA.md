# 🗄️ Mulatiyana Restaurant — Database Schema

> Prisma schema — finalized for Phase 3 (POS System).
> **Business Logic:** No home delivery. Pick-up or Dine-in only. Pay at Counter.
>
> Last updated: May 21, 2026 (Phase 3 — POS System)

---

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

enum Role {
  ADMIN
  CASHIER
}

enum OrderType {
  PICKUP    // Customer orders ahead and picks up at counter
  DINE_IN   // Customer pre-orders and pays when seated
}

enum OrderStatus {
  PENDING     // Received, not yet started
  PREPARING   // Kitchen is preparing
  READY       // Ready for pick-up / serving
  COMPLETED   // Handed to customer
}

enum PaymentStatus {
  UNPAID  // Default — customer pays at counter on arrival
  PAID    // Cashier confirmed payment
}

// ─────────────────────────────────────────────
// MODELS
// ─────────────────────────────────────────────

/// Staff accounts only — no customer accounts
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String   // bcrypt hashed
  role      Role     @default(CASHIER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

/// Menu categories (e.g. Street Food, Rice Dishes, Noodles, Mains, Desserts)
model Category {
  id        Int       @id @default(autoincrement())
  name      String    @unique
  sortOrder Int       @default(0)
  createdAt DateTime  @default(now())

  products  Product[]

  @@map("categories")
}

/// Menu items
model Product {
  id          Int       @id @default(autoincrement())
  name        String
  description String?
  price       Decimal   @db.Decimal(10, 2)
  imageUrl    String?
  calories    Int?
  prepTime    String?   // e.g. "15 min"
  isAvailable Boolean   @default(true)
  isNew       Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  category    Category  @relation(fields: [categoryId], references: [id])
  categoryId  Int

  orderItems  OrderItem[]

  @@map("products")
}

/// A customer pre-order (Pick-up or Dine-in)
model Order {
  id              Int           @id @default(autoincrement())

  /// Human-readable reference shown on receipts and POS screen (e.g. ORD-001)
  orderNumber     String        @unique

  // Customer info (no account required)
  customerName    String
  customerPhone   String

  // Business logic
  orderType       OrderType
  expectedArrival DateTime?
  status          OrderStatus   @default(PENDING)
  paymentStatus   PaymentStatus @default(UNPAID)

  // Financials
  subtotal        Decimal       @db.Decimal(10, 2)
  discountType    String?       // 'percentage' | 'fixed' | null
  discountAmount  Decimal       @db.Decimal(10, 2) @default(0)
  grandTotal      Decimal       @db.Decimal(10, 2) // subtotal − discountAmount

  notes           String?

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  items           OrderItem[]

  @@map("orders")
}

/// Line items within an order
model OrderItem {
  id        Int     @id @default(autoincrement())
  quantity  Int
  unitPrice Decimal @db.Decimal(10, 2)  // Price snapshot at order time
  subtotal  Decimal @db.Decimal(10, 2)  // quantity × unitPrice

  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId   Int

  product   Product @relation(fields: [productId], references: [id])
  productId Int

  @@map("order_items")
}
```

---

## 📊 Entity Relationships

```
User          — staff only (ADMIN | CASHIER)

Category
  └── Product[] (many)

Product
  └── OrderItem[] (many)

Order
  ├── orderNumber:    ORD-001, ORD-002 … (unique, human-readable)
  ├── orderType:      PICKUP | DINE_IN
  ├── status:         PENDING → PREPARING → READY → COMPLETED
  ├── paymentStatus:  UNPAID → PAID  (cashier updates at counter)
  ├── discountType:   'percentage' | 'fixed' | null
  ├── discountAmount: Rs. value saved
  ├── grandTotal:     subtotal − discountAmount
  └── OrderItem[] (many)
       └── Product (one)
```

---

## 🔑 Business Rules

| Rule | Enforcement |
|------|-------------|
| No delivery | No `deliveryAddress` on `Order` |
| Pay at counter | `paymentStatus` defaults `UNPAID`; only staff sets `PAID` |
| Pick-up or Dine-in only | `orderType` ENUM has no `DELIVERY` value |
| No customer accounts | `User` is staff-only; customer = plain text fields |
| Price snapshot | `unitPrice` on `OrderItem` is independent of `Product.price` changes |
| Discount | `discountType` + `discountAmount` stored; `grandTotal = subtotal − discountAmount` |
| Human-readable IDs | `orderNumber` (ORD-001) shown on POS; `id` is internal DB key |
