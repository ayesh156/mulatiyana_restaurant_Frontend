# 🗄️ Mulatiyana Restaurant — Database Schema

> Prisma schema representing the core data model.
> **Business Logic:** No home delivery. Orders are strictly **Pick-up** or **Dine-in (Pre-order)**.
> Payment is always settled **at the restaurant counter** (Pay at Counter).
>
> Last updated: May 21, 2026

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
  PENDING     // Order received, not yet started
  PREPARING   // Kitchen is preparing the order
  READY       // Order is ready for pick-up / serving
  COMPLETED   // Order handed to customer
}

enum PaymentStatus {
  UNPAID  // Default — customer pays at counter on arrival
  PAID    // Cashier has confirmed payment
}

// ─────────────────────────────────────────────
// MODELS
// ─────────────────────────────────────────────

/// Staff accounts — no customer accounts needed (orders are walk-in / pre-order)
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

/// Menu items available for ordering
model Product {
  id          Int         @id @default(autoincrement())
  name        String
  description String?
  price       Decimal     @db.Decimal(10, 2)
  category    String      // e.g. "Street Food", "Rice Dishes", "Noodles"
  imageUrl    String?
  calories    Int?
  prepTime    String?     // e.g. "15 min"
  isAvailable Boolean     @default(true)
  isNew       Boolean     @default(false)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  orderItems  OrderItem[]

  @@map("products")
}

/// A customer pre-order (Pick-up or Dine-in)
model Order {
  id              Int           @id @default(autoincrement())
  orderRef        String        @unique @default(cuid()) // e.g. used to generate #ORD-492

  // Customer info (no account required)
  customerName    String
  customerPhone   String

  // Business logic
  orderType       OrderType                          // PICKUP | DINE_IN
  expectedArrival DateTime?                          // Optional arrival time provided by customer
  status          OrderStatus   @default(PENDING)
  paymentStatus   PaymentStatus @default(UNPAID)    // Always UNPAID until cashier confirms

  // Totals (denormalised for quick reads)
  subtotal        Decimal       @db.Decimal(10, 2)
  discountType    String?                            // 'percentage' | 'fixed' | null (no discount)
  discountAmount  Decimal       @db.Decimal(10, 2)  @default(0)
  total           Decimal       @db.Decimal(10, 2)  // subtotal − discountAmount

  // Notes
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
  unitPrice Decimal @db.Decimal(10, 2)  // Snapshot of price at time of order
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
User (staff only)
  └── Role: ADMIN | CASHIER

Product
  └── OrderItem (many)

Order
  ├── orderType:     PICKUP | DINE_IN
  ├── status:        PENDING → PREPARING → READY → COMPLETED
  ├── paymentStatus: UNPAID → PAID  (updated by cashier at counter)
  └── OrderItem[] (many)
       └── Product (one)
```

---

## 🔑 Key Business Rules Encoded in Schema

| Rule | How it's enforced |
|------|-------------------|
| No delivery | No `deliveryAddress` field on `Order` |
| Pay at counter | `paymentStatus` defaults to `UNPAID`; only staff can update to `PAID` |
| Pick-up or Dine-in only | `orderType` is a required ENUM — no `DELIVERY` value exists |
| No customer accounts | `User` model is staff-only; customer identity captured as plain text fields |
| Price snapshot | `unitPrice` on `OrderItem` stores price at order time, independent of `Product.price` changes |
| Discount | `discountType` ('percentage' \| 'fixed' \| null) + `discountAmount` stored; `total = subtotal − discountAmount` |
