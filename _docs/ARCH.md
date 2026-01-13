# Supply Chain Management Platform - Software Architecture

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Backend Folder Structure](#backend-folder-structure)
4. [Frontend Folder Structure](#frontend-folder-structure)
5. [Module Details](#module-details)
6. [Request Flow Examples](#request-flow-examples)
7. [Database Schema Summary](#database-schema-summary)
8. [Offline Strategy](#offline-strategy)
9. [Real-time Features](#real-time-features)
10. [Deployment Architecture](#deployment-architecture)

---

## 1. Architecture Overview

### Design Principles

- **Modular Monolith**: Single deployed service, modular internally for maintainability
- **Domain-Driven Design**: Each module owns its domain logic and data
- **GraphQL First**: Type-safe API with efficient data fetching
- **Offline First**: PWA with IndexedDB for offline transactions
- **Solo Dev Optimized**: Clear patterns, easy debugging, minimal boilerplate

### System Architecture

```
┌─────────────────────────────────────────────────────┐
│  Next.js PWA (Client)                                │
│  - Apollo Client (GraphQL)                           │
│  - IndexedDB (Offline Storage)                       │
│  - Service Worker (Background Sync)                  │
└─────────────────┬───────────────────────────────────┘
                  │ GraphQL over HTTPS
                  │ WebSocket for Real-time
┌─────────────────▼───────────────────────────────────┐
│  Apollo Server (GraphQL API)                         │
│  ┌─────────────────────────────────────────────┐    │
│  │  8 Core Modules (Modular Monolith)          │    │
│  │  - Organizations, Products, Transactions    │    │
│  │  - Inventory, Suppliers, Reorders           │    │
│  │  - Analytics, Settings                      │    │
│  └─────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────┐    │
│  │  Shared Services                             │    │
│  │  - Notifications, File Storage, Exports     │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────┬───────────────────────────────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
┌───────▼────────┐  ┌────────▼────────┐
│  PostgreSQL    │  │     Redis       │
│  (Drizzle ORM) │  │  Cache/PubSub   │
└────────────────┘  └─────────────────┘
```

---

## 2. Technology Stack

### Backend

- **Runtime**: Node.js 20+
- **API Framework**: Apollo Server 4
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL 15+
- **Cache/Queue**: Redis
- **WebSocket**: graphql-ws
- **File Upload**: graphql-upload
- **Validation**: Zod

### Frontend

- **Framework**: Next.js 14+ (App Router)
- **GraphQL Client**: Apollo Client 3
- **Styling**: TailwindCSS
- **State Management**: Apollo Cache + React Context
- **Offline Storage**: IndexedDB (via Dexie.js)
- **Service Worker**: Workbox
- **Forms**: React Hook Form + Zod

### DevOps & Infrastructure

- **Hosting**: Railway / Render
- **Object Storage**: Cloudflare R2 / AWS S3
- **CDN**: Cloudflare
- **Monitoring**: Sentry
- **CI/CD**: GitHub Actions

---

## 3. Backend Folder Structure

```
backend/
├── src/
│   ├── server.ts                    # Apollo Server setup
│   ├── context.ts                   # GraphQL context (db, services)
│   ├── config/
│   │   ├── database.ts              # DB connection config
│   │   ├── redis.ts                 # Redis client setup
│   │   └── env.ts                   # Environment variables
│   │
│   ├── db/
│   │   ├── index.ts                 # Drizzle instance
│   │   ├── schema/                  # Database schemas
│   │   │   ├── organizations.ts
│   │   │   ├── products.ts
│   │   │   ├── transactions.ts
│   │   │   ├── inventory.ts
│   │   │   ├── suppliers.ts
│   │   │   ├── reorders.ts
│   │   │   ├── settings.ts
│   │   │   └── index.ts             # Export all schemas
│   │   └── migrations/              # SQL migration files
│   │
│   ├── modules/
│   │   ├── organizations/
│   │   │   ├── schema.ts            # GraphQL type definitions
│   │   │   ├── resolvers.ts         # GraphQL resolvers
│   │   │   ├── services/
│   │   │   │   └── OrganizationService.ts
│   │   │   └── validators.ts        # Zod validation schemas
│   │   │
│   │   ├── products/
│   │   │   ├── schema.ts
│   │   │   ├── resolvers.ts
│   │   │   ├── services/
│   │   │   │   ├── ProductService.ts
│   │   │   │   └── ProductTemplateService.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── transactions/
│   │   │   ├── schema.ts
│   │   │   ├── resolvers.ts
│   │   │   ├── services/
│   │   │   │   ├── TransactionService.ts
│   │   │   │   └── ReceiptService.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── inventory/
│   │   │   ├── schema.ts
│   │   │   ├── resolvers.ts
│   │   │   ├── services/
│   │   │   │   ├── InventoryService.ts
│   │   │   │   └── InventoryLogService.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── suppliers/
│   │   │   ├── schema.ts
│   │   │   ├── resolvers.ts
│   │   │   ├── services/
│   │   │   │   └── SupplierService.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── reorders/
│   │   │   ├── schema.ts
│   │   │   ├── resolvers.ts
│   │   │   ├── services/
│   │   │   │   └── ReorderService.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── analytics/
│   │   │   ├── schema.ts
│   │   │   ├── resolvers.ts
│   │   │   ├── services/
│   │   │   │   ├── AnalyticsService.ts
│   │   │   │   └── ReportExportService.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── settings/
│   │   │   ├── schema.ts
│   │   │   ├── resolvers.ts
│   │   │   ├── services/
│   │   │   │   └── SettingsService.ts
│   │   │   └── validators.ts
│   │   │
│   │   └── messaging/               # Phase 2
│   │       ├── schema.ts
│   │       ├── resolvers.ts
│   │       ├── services/
│   │       │   └── MessagingService.ts
│   │       └── validators.ts
│   │
│   ├── shared/
│   │   ├── services/
│   │   │   ├── NotificationService.ts
│   │   │   ├── FileStorageService.ts
│   │   │   ├── ValidationService.ts
│   │   │   └── CacheService.ts
│   │   ├── utils/
│   │   │   ├── errors.ts            # Custom error classes
│   │   │   ├── logger.ts            # Winston logger
│   │   │   ├── pagination.ts        # Cursor pagination
│   │   │   └── dateHelpers.ts
│   │   └── types/
│   │       ├── context.ts           # GraphQL context type
│   │       └── common.ts            # Shared types
│   │
│   └── graphql/
│       ├── schema.ts                # Combined GraphQL schema
│       └── scalars.ts               # Custom scalars (DateTime, etc)
│
├── drizzle/
│   ├── migrations/                  # Generated SQL migrations
│   └── seed/                        # Database seed scripts
│       └── productTemplates.ts
│
├── tests/
│   ├── integration/
│   └── unit/
│
├── drizzle.config.ts                # Drizzle Kit config
├── package.json
├── tsconfig.json
└── .env
```

---

## 4. Frontend Folder Structure

```
frontend/
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Home/dashboard
│   │   ├── error.tsx                # Error boundary
│   │   ├── loading.tsx              # Loading state
│   │   │
│   │   ├── pos/                     # POS pages
│   │   │   ├── page.tsx             # Main POS interface
│   │   │   └── history/
│   │   │       └── page.tsx         # Transaction history
│   │   │
│   │   ├── products/                # Product pages
│   │   │   ├── page.tsx             # Product list
│   │   │   ├── new/
│   │   │   │   └── page.tsx         # Add product
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx         # Product details
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx     # Edit product
│   │   │   └── import/
│   │   │       └── page.tsx         # Bulk import
│   │   │
│   │   ├── inventory/               # Inventory pages
│   │   │   ├── page.tsx             # Inventory overview
│   │   │   ├── alerts/
│   │   │   │   └── page.tsx         # Stock alerts
│   │   │   └── logs/
│   │   │       └── page.tsx         # Inventory logs
│   │   │
│   │   ├── suppliers/               # Supplier pages
│   │   │   ├── page.tsx             # Supplier list
│   │   │   ├── new/
│   │   │   │   └── page.tsx         # Add supplier
│   │   │   └── [id]/
│   │   │       └── page.tsx         # Supplier details
│   │   │
│   │   ├── reorders/                # Reorder pages
│   │   │   ├── page.tsx             # Reorder history
│   │   │   └── new/
│   │   │       └── page.tsx         # New reorder
│   │   │
│   │   ├── analytics/               # Analytics pages
│   │   │   ├── page.tsx             # Dashboard
│   │   │   ├── sales/
│   │   │   │   └── page.tsx         # Sales reports
│   │   │   ├── products/
│   │   │   │   └── page.tsx         # Product performance
│   │   │   └── inventory/
│   │   │       └── page.tsx         # Inventory reports
│   │   │
│   │   ├── settings/                # Settings pages
│   │   │   ├── page.tsx             # Settings overview
│   │   │   ├── profile/
│   │   │   │   └── page.tsx         # Shop profile
│   │   │   ├── receipts/
│   │   │   │   └── page.tsx         # Receipt config
│   │   │   └── notifications/
│   │   │       └── page.tsx         # Notification prefs
│   │   │
│   │   └── api/                     # API routes (if needed)
│   │       └── graphql/
│   │           └── route.ts         # Proxy to backend
│   │
│   ├── components/                  # Reusable components
│   │   ├── ui/                      # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Badge.tsx
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── products/                # Product components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductSearch.tsx
│   │   │   └── ProductList.tsx
│   │   │
│   │   ├── pos/                     # POS components
│   │   │   ├── POSCart.tsx
│   │   │   ├── ProductSelector.tsx
│   │   │   ├── PaymentModal.tsx
│   │   │   └── Receipt.tsx
│   │   │
│   │   ├── inventory/               # Inventory components
│   │   │   ├── StockAlertCard.tsx
│   │   │   ├── StockAdjustForm.tsx
│   │   │   └── InventoryLogTable.tsx
│   │   │
│   │   └── shared/                  # Shared components
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorMessage.tsx
│   │       ├── EmptyState.tsx
│   │       ├── OfflineBanner.tsx
│   │       └── SyncIndicator.tsx
│   │
│   ├── lib/                         # Libraries & utilities
│   │   ├── apollo/
│   │   │   ├── client.ts            # Apollo Client setup
│   │   │   ├── cache.ts             # Cache configuration
│   │   │   ├── links.ts             # HTTP/WS links
│   │   │   └── queries/             # GraphQL queries
│   │   │       ├── products.ts
│   │   │       ├── transactions.ts
│   │   │       ├── inventory.ts
│   │   │       └── index.ts
│   │   │
│   │   ├── offline/
│   │   │   ├── db.ts                # IndexedDB setup (Dexie)
│   │   │   ├── sync.ts              # Sync logic
│   │   │   └── queue.ts             # Offline queue
│   │   │
│   │   ├── utils/
│   │   │   ├── currency.ts          # Currency formatting
│   │   │   ├── dates.ts             # Date formatting
│   │   │   ├── validation.ts        # Form validation
│   │   │   └── exports.ts           # CSV/PDF export
│   │   │
│   │   └── hooks/
│   │       ├── useOfflineSync.ts
│   │       ├── useLocalStorage.ts
│   │       ├── useDebounce.ts
│   │       └── useMediaQuery.ts
│   │
│   ├── styles/
│   │   └── globals.css              # Global styles + Tailwind
│   │
│   ├── types/
│   │   ├── graphql.ts               # Generated GraphQL types
│   │   └── app.ts                   # App-specific types
│   │
│   └── middleware.ts                # Next.js middleware
│
├── public/
│   ├── manifest.json                # PWA manifest
│   ├── sw.js                        # Service worker
│   ├── icons/                       # App icons
│   └── assets/                      # Static assets
│
├── codegen.yml                      # GraphQL Code Generator
├── next.config.js
├── tailwind.config.js
├── package.json
└── tsconfig.json
```

---

## 5. Module Details

### Module Structure Pattern

Each module follows this consistent pattern:

```typescript
// Example: Products Module

// 1. DATABASE SCHEMA (src/db/schema/products.ts)
import { pgTable, uuid, varchar, decimal } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  sellingPrice: decimal("selling_price", { precision: 10, scale: 2 }).notNull(),
  // ... other fields
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

// 2. GRAPHQL SCHEMA (src/modules/products/schema.ts)
export const productTypeDefs = `
  type Product {
    id: ID!
    organizationId: ID!
    name: String!
    sellingPrice: Float!
  }

  type Query {
    products(organizationId: ID!): [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product!
  }

  input CreateProductInput {
    organizationId: ID!
    name: String!
    sellingPrice: Float!
  }
`;

// 3. SERVICE LAYER (src/modules/products/services/ProductService.ts)
import { db } from "@/db";
import { products } from "@/db/schema/products";
import { eq } from "drizzle-orm";

export class ProductService {
  async list(organizationId: string) {
    return await db
      .select()
      .from(products)
      .where(eq(products.organizationId, organizationId));
  }

  async getById(id: string) {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    return product || null;
  }

  async create(data: NewProduct) {
    const [product] = await db.insert(products).values(data).returning();
    return product;
  }
}

// 4. RESOLVERS (src/modules/products/resolvers.ts)
import { ProductService } from "./services/ProductService";

export const productResolvers = {
  Query: {
    products: async (_, { organizationId }, context) => {
      const service = new ProductService();
      return await service.list(organizationId);
    },

    product: async (_, { id }, context) => {
      const service = new ProductService();
      return await service.getById(id);
    },
  },

  Mutation: {
    createProduct: async (_, { input }, context) => {
      const service = new ProductService();
      return await service.create(input);
    },
  },
};

// 5. VALIDATORS (src/modules/products/validators.ts)
import { z } from "zod";

export const createProductSchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string().min(1).max(255),
  sellingPrice: z.number().positive(),
  costPrice: z.number().positive().optional(),
});

export const updateProductSchema = createProductSchema.partial();
```

### Module Dependencies

```
Organizations (Root)
    ↓
Products ←→ Suppliers
    ↓
Inventory → Notifications
    ↓
Transactions → Analytics
    ↓
Reorders
```

**Dependency Rules:**

- Modules can depend on services from other modules
- No circular dependencies at service level
- Shared services are dependency-free
- Always depend downward in hierarchy

---

## 6. Request Flow Examples

### Example 1: Create Transaction (POS Sale)

```
┌──────────┐
│  CLIENT  │
└────┬─────┘
     │
     │ 1. GraphQL Mutation
     │    createTransaction(input: {...})
     │
┌────▼─────────────────────────────────┐
│  APOLLO SERVER                        │
│  ┌────────────────────────────────┐  │
│  │  Resolver: createTransaction   │  │
│  └────────┬───────────────────────┘  │
│           │                           │
│           │ 2. Call Service           │
│  ┌────────▼───────────────────────┐  │
│  │  TransactionService.create()   │  │
│  │  - Validate input              │  │
│  │  - Generate txn number         │  │
│  │  - Calculate totals            │  │
│  └────────┬───────────────────────┘  │
│           │                           │
│           │ 3. Insert to DB           │
│  ┌────────▼───────────────────────┐  │
│  │  Drizzle ORM                   │  │
│  │  db.insert(transactions)       │  │
│  │  db.insert(transaction_items)  │  │
│  └────────┬───────────────────────┘  │
│           │                           │
│           │ 4. Update Inventory       │
│  ┌────────▼───────────────────────┐  │
│  │  InventoryService.deductStock()│  │
│  │  - Reduce product quantities   │  │
│  │  - Create inventory logs       │  │
│  │  - Check low stock alerts      │  │
│  └────────┬───────────────────────┘  │
│           │                           │
│           │ 5. Send Notifications     │
│  ┌────────▼───────────────────────┐  │
│  │  NotificationService           │  │
│  │  - Low stock alerts (if any)   │  │
│  └────────┬───────────────────────┘  │
│           │                           │
│           │ 6. Publish Event          │
│  ┌────────▼───────────────────────┐  │
│  │  PubSub (Redis)                │  │
│  │  transactionCreated            │  │
│  └────────┬───────────────────────┘  │
└───────────┼───────────────────────────┘
            │
            │ 7. Return Result
┌───────────▼────────┐
│  CLIENT            │
│  - Update UI       │
│  - Save to IndexDB │
│  - Generate Receipt│
└────────────────────┘
```

### Example 2: Offline Transaction Sync

```
┌──────────────────────────────────────┐
│  CLIENT (Offline)                     │
│  1. User creates sale                 │
│     - Save to IndexedDB               │
│     - Queue for sync                  │
│     - Show "pending sync" indicator   │
└──────────────┬───────────────────────┘
               │
               │ Device goes online
               │
┌──────────────▼───────────────────────┐
│  SERVICE WORKER                       │
│  2. Detect online                     │
│     - Process sync queue              │
│     - Send queued mutations           │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│  APOLLO SERVER                        │
│  3. Receive queued transactions       │
│     - Validate data                   │
│     - Check for conflicts             │
│     - Process each transaction        │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│  CLIENT                               │
│  4. Sync complete                     │
│     - Update IndexedDB with server IDs│
│     - Remove from queue               │
│     - Show success notification       │
└───────────────────────────────────────┘
```

---

## 7. Database Schema Summary

### Core Tables

```sql
-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100),
  selling_price DECIMAL(10, 2) NOT NULL,
  cost_price DECIMAL(10, 2),
  inventory_type VARCHAR(20) NOT NULL,
  current_stock INT,
  low_stock_threshold INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  transaction_number VARCHAR(50) UNIQUE NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'COMPLETED',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transaction Items
CREATE TABLE transaction_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  line_total DECIMAL(10, 2) NOT NULL
);

-- Suppliers
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inventory Logs
CREATE TABLE inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  change_type VARCHAR(30) NOT NULL,
  quantity_before INT,
  quantity_after INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Stock Alerts
CREATE TABLE stock_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  alert_type VARCHAR(30) NOT NULL,
  dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes

```sql
-- Performance indexes
CREATE INDEX idx_products_org ON products(organization_id);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_transactions_org ON transactions(organization_id);
CREATE INDEX idx_transactions_date ON transactions(created_at);
CREATE INDEX idx_inventory_logs_product ON inventory_logs(product_id);
CREATE INDEX idx_stock_alerts_org ON stock_alerts(organization_id);
```

---

## 8. Offline Strategy

### IndexedDB Structure

```typescript
// src/lib/offline/db.ts
import Dexie, { Table } from "dexie";

export interface OfflineTransaction {
  id: string;
  organizationId: string;
  items: TransactionItem[];
  total: number;
  paymentMethod: string;
  createdAt: Date;
  synced: boolean;
}

export interface OfflineProduct {
  id: string;
  name: string;
  sellingPrice: number;
  currentStock: number;
  lastSynced: Date;
}

class OfflineDatabase extends Dexie {
  transactions!: Table<OfflineTransaction>;
  products!: Table<OfflineProduct>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super("SupplyChainDB");
    this.version(1).stores({
      transactions: "id, organizationId, createdAt, synced",
      products: "id, organizationId, name",
      syncQueue: "++id, type, timestamp",
    });
  }
}

export const offlineDb = new OfflineDatabase();
```

### Sync Strategy

```typescript
// src/lib/offline/sync.ts
export class SyncManager {
  async syncToServer() {
    // Get all unsynced items
    const unsyncedTransactions = await offlineDb.transactions
      .where("synced")
      .equals(false)
      .toArray();

    for (const txn of unsyncedTransactions) {
      try {
        // Send to server
        await apolloClient.mutate({
          mutation: CREATE_TRANSACTION,
          variables: { input: txn },
        });

        // Mark as synced
        await offlineDb.transactions.update(txn.id, { synced: true });
      } catch (error) {
        console.error("Sync failed for transaction:", txn.id, error);
        // Keep in queue for retry
      }
    }
  }

  async syncFromServer() {
    // Pull latest products
    const { data } = await apolloClient.query({
      query: GET_PRODUCTS,
      fetchPolicy: "network-only",
    });

    // Update IndexedDB
    await offlineDb.products.bulkPut(
      data.products.map((p) => ({ ...p, lastSynced: new Date() }))
    );
  }
}
```

---

## 9. Real-time Features (Phase 2)

### WebSocket Setup

```typescript
// src/server.ts
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

useServer(
  {
    schema,
    context: async (ctx) => {
      return { db, redis, pubsub };
    },
  },
  wsServer
);
```

### Subscriptions

```typescript
// GraphQL Subscription
type Subscription {
  transactionCreated(organizationId: ID!): Transaction!
  stockAlertCreated(organizationId: ID!): StockAlert!
  messageReceived(chatId: ID!): Message!
}

// Resolver
Subscription: {
  transactionCreated: {
    subscribe: (_, {
```
