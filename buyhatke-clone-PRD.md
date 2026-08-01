# Product Requirements Document (PRD)
## Project: "PriceHatke" — A Buyhatke.com Clone (Price Tracking & Deal Discovery Platform)

**Version:** 2.0 (Antigravity-ready)
**Owner:** Product/Engineering
**Target Deployment:** Frontend → Vercel | Backend → Render
**Reference site:** https://buyhatke.com
**Intended executor:** This PRD is written to be handed directly to an agentic coding tool (Google Antigravity / Gemini 3 Pro agents). Section 0 and Section 14 exist specifically to make it agent-executable.

---

## 0. Instructions for the Coding Agent

Read this section first, before writing any code.

1. **Work in two repositories** (create both as separate git repos/workspaces):
   - `pricehatke-api` — backend (Section 8)
   - `pricehatke-web` — frontend (Section 7)
   - Optionally a third, `pricehatke-extension`, for the browser extension (Section 4.6) — build this last, only after Phase 1 tasks are complete.
2. **Follow Section 14 (Build Order / Task Checklist) top to bottom.** Each task has an explicit "Definition of Done" — do not mark a task complete or move to the next one until its Definition of Done is verifiably true (run the build/test/lint command and confirm it passes).
3. **Do not invent scope.** If a feature is marked "Phase 2" or "Phase 3" in Section 11, stub it (route exists, returns placeholder/"coming soon" UI) but do not fully implement it in Phase 1.
4. **Do not implement real scraping of Amazon/Flipkart/etc.** Use the `IStoreProvider` mock interface described in Section 8.2 with seeded fixture data (Section 14, Task B4). This is a hard constraint, not a suggestion — see Section 9 and 13.
5. **After each task**, run the relevant verification command (`npm run build`, `npm run lint`, `npm run test`, or the equivalent) and fix failures before proceeding.
6. **Use the exact package versions/choices given** in Sections 7.1 and 8.1 unless a chosen package is genuinely unavailable/deprecated, in which case pick the closest actively-maintained equivalent and note the substitution in a `DECISIONS.md` file at the repo root.
7. **Commit after every completed task** in Section 14 with a message referencing the task ID (e.g. `feat(B3): implement price-history endpoint`).
8. **Ask/flag, don't guess, on the Open Questions in Section 13** — where a real decision is needed (payment provider, email provider, data source), implement against the sandbox/mock default named in this doc, and leave a clearly marked `TODO(decision-needed):` comment.
9. **Token/quota budget is constrained** — see Section 15 for hard rules on model selection, context hygiene, and per-task scoping. These rules are not optional; they exist because Antigravity's usage is metered and this project must not blow through quota on a single feature.

---

## 1. Executive Summary

PriceHatke is a price-history and deal-discovery platform that lets shoppers:
- Track the historical price of any product from Amazon, Flipkart, Myntra, Ajio, Meesho, Nykaa, Tata Cliq, and other Indian e-commerce sites.
- Get alerted when a tracked product's price drops.
- Browse curated/verified deals, coupons, and gift cards.
- Compare prices for the same product across stores.
- Use auxiliary tools: Spend Lens (spending analytics), Product Lens (AI product insights/reviews), Grocery Compare, Ride Compare (Ola vs Uber), and a browser extension for on-page price history + auto-coupons.

The MVP scope for this clone focuses on the **core price-tracking engine** (search → price history chart → alerts) plus **deals, gift cards, and a lightweight browser extension**, with the AI/analytics tools (Spend Lens, Product Lens, Ride Compare) planned as fast-follow phases.

---

## 2. Goals & Non-Goals

### 2.1 Goals
1. Let a user paste/search a product URL or keyword and see its price history across marketplaces.
2. Let users set price-drop alerts (email/push) for tracked products.
3. Show a feed of curated/verified deals with filters (store, discount %, category).
4. Offer a gift-card storefront (browse, purchase flow — mocked/sandboxed payment).
5. Provide user auth (signup/login), a dashboard of tracked products, and alert management.
6. Ship a minimal browser extension that shows price history when visiting a supported product page.
7. Be deployable end-to-end: frontend on Vercel, backend + workers + DB on Render.

### 2.2 Non-Goals (Phase 1)
- Real production scraping of Amazon/Flipkart at scale (ToS-sensitive) — Phase 1 uses a pluggable "Provider" interface with mock/sample data + optional legitimate API/RSS/affiliate feed integration where available.
- Real payment processing for gift cards (use a stub/sandbox — Stripe test mode or Razorpay test mode).
- Full AI recommendation engine (Product Lens) — stub in Phase 1, real LLM-backed feature in Phase 2.
- Native mobile apps (web-responsive only in Phase 1).

---

## 3. Target Users / Personas

| Persona | Need |
|---|---|
| Budget Shopper | Wants to know "is this actually a good price right now?" before buying |
| Deal Hunter | Browses daily for best % discounts and flash deals |
| Gift Buyer | Wants discounted gift cards for brands |
| Power User | Tracks 20+ products, wants alerts and a dashboard |

---

## 4. Feature Set (Derived from buyhatke.com)

### 4.1 Core — Price Tracking (P0)
- **Universal search bar**: paste a product URL (Amazon/Flipkart/etc.) or type a product name.
- **"Magic trick" URL prefix**: `pricehatke.com/<original-url>` redirects into the price-history page for that product (mirrors Buyhatke's `buyhatke.com/amazon...` trick).
- **Price History Page**:
  - Interactive line chart (all-time, 6mo, 3mo, 1mo, 7d) of price over time, per store.
  - Current price, lowest-ever price, highest-ever price, average price.
  - Cross-store comparison table (same product on Amazon vs Flipkart vs others, if matched).
  - "Set Alert" CTA with target price input.
  - Deep link / "Buy Now" affiliate-style outbound link to the original store.
- **Price Drop Alerts**:
  - Users set a target price or "notify on any drop."
  - Notification via email (and optionally web push).
  - Alerts dashboard: active, triggered, expired.

### 4.2 Deals Feed (P0)
- `/deals` page: grid of deals with image, title, current price, original price, discount %, store badge.
- Filters: store, minimum discount (40/50/60/70%), category.
- Sort: Popularity, Price (asc/desc), Discount %, Newest.
- "Verified by Deal Scanner" badge for curated/validated deals.
- Deal detail modal/page linking out to store.

### 4.3 Gift Cards (P1)
- `/gift-cards` catalog grouped by brand (Amazon Pay, Flipkart, Myntra, Croma, Decathlon, Google Play, JioMart, MakeMyTrip, Nykaa, Shoppers Stop, Steam, Tata Cliq, Uber, Zepto, etc.)
- Brand detail page: denominations, discount %, T&Cs.
- Checkout flow (sandbox payment) → order confirmation → (mock) e-code delivery via email.
- Order history in user dashboard.

### 4.4 User Accounts (P0)
- Email/password + Google OAuth signup/login.
- JWT-based session (access + refresh tokens).
- Dashboard: tracked products, active alerts, gift-card orders, referral code.
- Referral program (P2): invite link, reward tracking.

### 4.5 Auxiliary Tools (P2 — stubbed in Phase 1, real in Phase 2)
- **Spend Lens**: connects (mock) transaction data or manual entry to show spend-by-category charts.
- **Product Lens**: AI-generated pros/cons/review summary for a product (LLM call).
- **Grocery Compare**: compare grocery item prices across Blinkit/Zepto/Instamart-style mock data.
- **Ride Compare**: compare Ola/Uber/Rapido fare estimates (mock/static data or public fare APIs).

### 4.6 Browser Extension (P1)
- Chrome/Edge (Manifest V3) extension.
- On supported product pages, injects a floating widget showing: price history mini-chart, lowest price ever, "Set Alert" button.
- Auto-coupon suggestion at checkout (P2).
- Communicates with backend via REST API using the same auth as web (token stored in extension storage).

### 4.7 Content / SEO Pages (P2)
- Static/CMS-driven pages: About, How We Earn, Supported Stores, FAQs, Blog/Quiz-answers pages (SEO traffic drivers in the original).

### 4.8 Cross-cutting
- Responsive design (mobile-first, matches Buyhatke's clean white/orange-accent aesthetic).
- Global stats banner: "100M+ Shoppers", "₹200Cr+ Saved", "100+ Stores Tracked", "4.8 Rating" (dynamic from DB counters, admin-editable).
- Footer with product/company/legal link groups.
- Cookie consent, Privacy Policy, Terms pages.

---

## 5. Information Architecture / Sitemap

```
/                          Home
/deals                     Deals feed
/deals/:id                 Deal detail
/gift-cards                Gift card catalog
/gift-cards/:brand         Brand detail + purchase
/price-alert               Alerts landing / manage
/track/:storeSlug/*        Price history page (product deep link, mirrors "magic trick")
/product/:productId        Canonical price-history page
/spending-calculator       Spend Lens
/product-lens              Product Lens
/grocery-price-comparison  Grocery Compare
/food-compare              Food/Ride style compare (P2)
/flights                   (P2 stub)
/login /signup             Auth
/dashboard                 User dashboard (tracked items, alerts, orders)
/about /contact-us /what-we-do /how-we-earn
/supported-stores
/terms /privacy
```

---

## 6. System Architecture (High Level)

```
+---------------------+        HTTPS/REST        +---------------------------+
|  Frontend (Vercel)   | ------------------------>|  Backend API (Render)     |
|  Next.js 14 (React)  | <-------------------------|  Node.js / NestJS (TS)   |
|  + Tailwind CSS       |        JSON               +-------------+-------------+
+----------+------------+                                        |
           |                                                     |
           | (extension talks directly to API too)               |
           v                                                     v
+-----------------------+                          +-----------------------------+
| Browser Extension      |                          | PostgreSQL (Render DB)     |
| (MV3, vanilla/React)   |                          | + Redis (cache/queue)      |
+------------------------+                          +--------------+--------------+
                                                                    |
                                                        +-----------v-----------+
                                                        | Background Workers     |
                                                        | (Render Worker/Cron)   |
                                                        | - Price scraper/poller |
                                                        | - Alert evaluator      |
                                                        | - Email/push sender    |
                                                        +------------------------+
```

- **Frontend**: Next.js (App Router), deployed on Vercel. Server components for SEO pages (deals, product pages), client components for interactive charts/dashboard.
- **Backend**: Node.js + NestJS REST API, deployed on Render as a Web Service.
- **Database**: PostgreSQL (Render managed Postgres).
- **Cache/Queue**: Redis (Render managed Redis or Upstash) for rate limiting, session cache, and job queue (BullMQ).
- **Workers**: Render Background Worker / Cron Job service running scheduled price-poll and alert-evaluation jobs.
- **Storage**: Product images/assets via Cloudinary (free tier acceptable for MVP).
- **Email**: Resend for transactional email (alerts, gift-card delivery, auth).

---

## 7. Frontend Requirements

### 7.1 Tech Stack (pin these exact choices)
- Framework: **Next.js 14+ (App Router, TypeScript)**, created via `npx create-next-app@latest pricehatke-web --typescript --tailwind --app --eslint`
- Styling: **Tailwind CSS** + **shadcn/ui** component primitives (`npx shadcn@latest init`)
- Charts: **Recharts**
- Data fetching/server-state: **TanStack Query (React Query) v5**
- Client state: **Zustand**
- Auth: **NextAuth.js v5 (Auth.js)** — Credentials provider + Google provider
- Forms/validation: **React Hook Form** + **Zod**
- Icons: **lucide-react**
- HTTP client: native `fetch` wrapped in a small `lib/api.ts` client
- Hosting: **Vercel**

### 7.2 Repository / Folder Structure

```
pricehatke-web/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                  # Home
│   │   ├── about/page.tsx
│   │   ├── contact-us/page.tsx
│   │   ├── what-we-do/page.tsx
│   │   ├── how-we-earn/page.tsx
│   │   ├── supported-stores/page.tsx
│   │   ├── terms/page.tsx
│   │   └── privacy/page.tsx
│   ├── deals/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── gift-cards/
│   │   ├── page.tsx
│   │   └── [brand]/page.tsx
│   ├── product/[productId]/page.tsx
│   ├── track/[...slug]/page.tsx      # "magic trick" URL resolver
│   ├── price-alert/page.tsx
│   ├── spending-calculator/page.tsx  # Phase 2 stub
│   ├── product-lens/page.tsx         # Phase 2 stub
│   ├── grocery-price-comparison/page.tsx # Phase 2 stub
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # tracked products
│   │   ├── alerts/page.tsx
│   │   ├── orders/page.tsx
│   │   └── settings/page.tsx
│   ├── api/auth/[...nextauth]/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                           # shadcn components
│   ├── layout/ (Navbar, Footer, StatsBar)
│   ├── search/ (SearchBar, UrlResolverInput)
│   ├── product/ (PriceHistoryChart, PriceStatCards, StoreCompareTable, SetAlertModal)
│   ├── deals/ (DealCard, DealFilters, DealGrid)
│   └── gift-cards/ (BrandCard, DenominationSelector, CheckoutForm)
├── lib/
│   ├── api.ts                        # fetch wrapper, base URL from env
│   ├── auth.ts                       # NextAuth config
│   ├── validators/                   # Zod schemas
│   └── utils.ts
├── store/ (Zustand stores)
├── public/
├── .env.local.example
├── next.config.ts
├── package.json
└── tsconfig.json
```

### 7.3 Environment Variables (`.env.local.example`)
```
NEXT_PUBLIC_API_BASE_URL=https://pricehatke-api.onrender.com
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace_me
GOOGLE_CLIENT_ID=replace_me
GOOGLE_CLIENT_SECRET=replace_me
```

### 7.4 Key Screens & Components (mapped to files above)
1. **Home** (`app/(marketing)/page.tsx`) — Hero search bar, hot deals carousel, "Why use PriceHatke" feature grid, supported stores logo strip, stats banner, FAQ accordion, footer.
2. **Search / URL Resolver** (`components/search/UrlResolverInput.tsx`) — Input accepts URL or keyword → calls `POST /products/resolve` → routes to `app/product/[productId]`.
3. **Product Price History Page** (`app/product/[productId]/page.tsx`) — `PriceHistoryChart` (range toggle: 7D/1M/3M/6M/All), `PriceStatCards`, `StoreCompareTable`, `SetAlertModal`, share button.
4. **Deals Page** (`app/deals/page.tsx`) — `DealFilters` (store checkboxes, discount slider, category), sort dropdown, paginated `DealGrid`, skeleton loading states.
5. **Gift Cards** (`app/gift-cards/`) — Brand grid → brand detail (denomination selector, quantity, discount shown) → `CheckoutForm` → confirmation.
6. **Auth Pages** (`app/login`, `app/signup`) — Credentials + Google OAuth buttons via NextAuth.
7. **Dashboard** (`app/dashboard/`) — Tabs: Tracked Products, My Alerts, Orders, Referral, Profile/Settings.
8. **Spend Lens / Product Lens / Grocery Compare** — Phase 2 pages; Phase 1 renders a static "Coming soon" card, route must exist and be linked from nav.

### 7.5 Non-functional (Frontend)
- Lighthouse Performance ≥ 85, Accessibility ≥ 90.
- Mobile-first responsive breakpoints (matches Buyhatke's compact mobile hero/search).
- SEO: dynamic `<meta>`/OG tags per product & deal page (Next.js Metadata API), `sitemap.xml`, `robots.txt`.
- Skeleton loaders / optimistic UI for chart and deal-grid fetches.

---

## 8. Backend Requirements

### 8.1 Tech Stack (pin these exact choices)
- Runtime: **Node.js 20 + TypeScript**
- Framework: **NestJS** (`npx @nestjs/cli new pricehatke-api`)
- ORM: **Prisma** (Postgres)
- Queue/Jobs: **BullMQ** on Redis
- Auth: JWT (access 15min + refresh 7d) via `@nestjs/jwt`, `bcrypt` for hashing, `passport-google-oauth20` for Google
- Validation: `class-validator` + `class-transformer` DTOs
- API docs: `@nestjs/swagger` at `/api/docs`
- Logging: `nestjs-pino`
- Hosting: **Render** — one Web Service (API), one Background Worker, one Cron Job, one Postgres instance, one Redis instance (or Upstash Redis)

### 8.2 Repository / Module Structure

```
pricehatke-api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── auth/            # signup, login, refresh, google oauth, guards, strategies
│   ├── users/            # profile, dashboard aggregation
│   ├── products/         # resolve, detail, history, compare, track
│   │   └── providers/    # IStoreProvider interface + mock implementations
│   │       ├── store-provider.interface.ts
│   │       ├── amazon.provider.ts   (mock/fixture-backed)
│   │       ├── flipkart.provider.ts (mock/fixture-backed)
│   │       └── generic.provider.ts  (fallback)
│   ├── alerts/            # create/list/delete, evaluator job trigger
│   ├── deals/             # list/filter, admin seed
│   ├── gift-cards/        # catalog, checkout (sandbox), orders
│   ├── notifications/     # email templates + send service (Resend)
│   ├── extension/         # quick-check endpoint for the browser extension
│   ├── jobs/              # BullMQ processors: price-poll, alert-evaluate, deal-refresh, stats-rollup
│   ├── prisma/            # PrismaService, schema.prisma
│   ├── common/            # guards, interceptors, filters, decorators
│   └── health/            # GET /health
├── prisma/
│   ├── schema.prisma
│   └── seed.ts            # seeds Products, StoreListings, PriceSnapshots, Deals, GiftCardBrands
├── test/
├── .env.example
├── nest-cli.json
├── package.json
└── tsconfig.json
```

### 8.3 Environment Variables (`.env.example`)
```
DATABASE_URL=postgresql://user:pass@host:5432/pricehatke
REDIS_URL=redis://default:pass@host:6379
JWT_ACCESS_SECRET=replace_me
JWT_REFRESH_SECRET=replace_me
GOOGLE_CLIENT_ID=replace_me
GOOGLE_CLIENT_SECRET=replace_me
RESEND_API_KEY=replace_me
RAZORPAY_KEY_ID=replace_me
RAZORPAY_KEY_SECRET=replace_me
FRONTEND_URL=http://localhost:3000
PORT=8080
```

### 8.4 Core Modules & Responsibilities (endpoint-level detail)

**Auth Module**
- `POST /auth/signup`, `POST /auth/login`, `POST /auth/refresh`, `GET /auth/google`, `GET /auth/google/callback`
- Password reset: `POST /auth/forgot-password`, `POST /auth/reset-password`

**Product/Tracking Module**
- `POST /products/resolve` — body `{ input: string }` (URL or keyword) → identify store + extract product identifier; create/find `Product` + `StoreListing`; enqueue `price-poll` job if snapshot stale (>6h); returns `{ productId }`.
- `GET /products/:id` — product detail + latest price snapshot per store.
- `GET /products/:id/history?range=7d|1m|3m|6m|all` — historical price points for chart.
- `GET /products/:id/compare` — matched product across other stores (fuzzy title match on `canonicalTitle`).
- `POST /products/:id/track` — (auth required) associate product with logged-in user's watchlist.

**Provider/Scraper Abstraction**
- `IStoreProvider` interface: `resolve(url: string): Promise<ResolvedProduct>`, `fetchPrice(storeProductId: string): Promise<PricePoint>`.
- Phase 1: all providers implemented against **local fixture/mock data** (see Task B4) — no live network scraping. Must be swappable later without touching controllers/services outside `products/providers/`.

**Alerts Module**
- `POST /alerts` (auth) — `{ productId, targetPrice? }` — omit `targetPrice` for "any drop".
- `GET /alerts` (auth) — list user alerts.
- `DELETE /alerts/:id` (auth)
- **Alert Evaluator Job** (BullMQ repeatable, every 15 min): for each active alert, compare latest `PriceSnapshot` to target; if triggered, enqueue `notifications` job, set alert status to `triggered`.

**Deals Module**
- `GET /deals?store=&minDiscount=&category=&sort=&page=` — paginated, filterable.
- `POST /deals` (admin guard) — for seeding/curation in Phase 1 (no admin UI required, just an authenticated endpoint + seed script).

**Gift Cards Module**
- `GET /gift-cards` — brand list with discount %.
- `GET /gift-cards/:brand` — denominations.
- `POST /gift-cards/checkout` (auth) — creates order, integrates **Razorpay test mode**; on success, triggers mock e-code email via Resend.
- `GET /gift-cards/orders` (auth) — user's order history.

**Notification Module**
- Email via **Resend** (alert triggered, signup welcome, gift-card delivery, password reset). Templates as React Email or plain HTML strings — keep simple in Phase 1.

**Extension API**
- `GET /extension/quick-check?url=` — fast single-product lookup optimized for the content script (no auth required for the price-history read, auth required only to set an alert).

**Health**
- `GET /health` — returns `{ status: 'ok', db: boolean, redis: boolean }`, used as Render's health check.

### 8.5 Data Model (Prisma schema outline)

```prisma
model User {
  id             String   @id @default(uuid())
  email          String   @unique
  passwordHash   String?
  name           String?
  provider       String   @default("credentials")
  referralCode   String   @unique
  createdAt      DateTime @default(now())
  trackedProducts TrackedProduct[]
  alerts          Alert[]
  giftCardOrders  GiftCardOrder[]
}

model Product {
  id             String   @id @default(uuid())
  canonicalTitle String
  category       String?
  imageUrl       String?
  createdAt      DateTime @default(now())
  storeListings  StoreListing[]
  trackedBy      TrackedProduct[]
  alerts         Alert[]
}

model StoreListing {
  id             String   @id @default(uuid())
  productId      String
  product        Product  @relation(fields: [productId], references: [id])
  store          String   // amazon | flipkart | myntra | ajio | meesho | nykaa | tatacliq
  storeUrl       String
  storeProductId String
  priceSnapshots PriceSnapshot[]
}

model PriceSnapshot {
  id             String   @id @default(uuid())
  storeListingId String
  storeListing   StoreListing @relation(fields: [storeListingId], references: [id])
  price          Decimal
  mrp            Decimal?
  capturedAt     DateTime @default(now())
}

model TrackedProduct {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  createdAt   DateTime @default(now())
}

model Alert {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  targetPrice Decimal?
  status      String   @default("active") // active | triggered | expired
  createdAt   DateTime @default(now())
}

model Deal {
  id               String   @id @default(uuid())
  title            String
  imageUrl         String?
  store            String
  price            Decimal
  mrp              Decimal?
  discountPct      Int
  category         String?
  verified         Boolean  @default(false)
  popularityScore  Int      @default(0)
  createdAt        DateTime @default(now())
}

model GiftCardBrand {
  id            String   @id @default(uuid())
  name          String
  slug          String   @unique
  logoUrl       String?
  denominations GiftCardDenomination[]
}

model GiftCardDenomination {
  id           String        @id @default(uuid())
  brandId      String
  brand        GiftCardBrand @relation(fields: [brandId], references: [id])
  faceValue    Decimal
  sellPrice    Decimal
  discountPct  Int
}

model GiftCardOrder {
  id             String   @id @default(uuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id])
  denominationId String
  amount         Decimal
  status         String   @default("pending") // pending | paid | fulfilled | failed
  createdAt      DateTime @default(now())
}
```

### 8.6 Background Jobs (BullMQ, run inside `pricehatke-worker`)

| Job | Frequency | Description |
|---|---|---|
| `price-poll` | Every 1–6h per product (staggered), also triggered on-demand from `resolve` | Fetch latest price via provider, write `PriceSnapshot` |
| `alert-evaluate` | Every 15 min | Compare snapshots to alert targets, enqueue notifications |
| `deal-refresh` | Hourly | Recompute popularity/verified scores, expire stale deals |
| `stats-rollup` | Daily | Update homepage stats counters |

---

## 9. Non-Functional Requirements

- **Security**: HTTPS everywhere, bcrypt (cost ≥ 12), JWT rotation, rate limiting (`@nestjs/throttler` + Redis) per-IP and per-user, input validation via DTOs on all endpoints, CORS locked to the Vercel frontend origin only, `helmet` middleware.
- **Scalability**: Stateless API pods (Render horizontal scaling), Redis cache for hot product/deal reads, DB indexes on `productId`, `capturedAt`, `store`.
- **Reliability**: `/health` endpoint for Render health checks, BullMQ retry/backoff on job failure, idempotent scrape jobs (safe to re-run).
- **Compliance**: Phase 1 defaults to mock/fixture data, not unauthorized scraping. This is a hard requirement for the agent building this — see Section 0.4.
- **Observability**: Structured JSON logs (`nestjs-pino`), Render metrics dashboard, optional Sentry DSN wiring on both frontend and backend (leave as an easy env-var toggle, not required to be active by default).

---

## 10. Deployment Plan

### 10.1 Frontend (Vercel)
- Repo: `pricehatke-web`.
- Vercel project settings: Framework preset = Next.js, Build Command = `next build`, Output = default.
- Env vars (Section 7.3) set in Vercel dashboard for Production + Preview.
- Vercel Preview Deployments per PR; Production on `main` merge.

### 10.2 Backend (Render)
- **Web Service**: `pricehatke-api` — Build: `npm install && npx prisma generate && npm run build`; Start: `npm run start:prod`; Health Check Path: `/health`.
- **Background Worker**: `pricehatke-worker` — same repo, Start: `npm run start:worker` (separate entrypoint that boots only the BullMQ processors, not the HTTP server).
- **Cron Job**: `pricehatke-cron` — Render native Cron Job service, runs `npm run job:deal-refresh` and `npm run job:stats-rollup` on their own schedules (or trigger both via one `npm run job:cron` script).
- **Postgres**: Render Managed Postgres (Starter tier minimum for production).
- **Redis**: Render Managed Redis or Upstash.
- Deploy hook runs `npx prisma migrate deploy` before start.
- Env vars per Section 8.3, set in Render dashboard for each service; `FRONTEND_URL` must equal the deployed Vercel URL for CORS to work.

### 10.3 Browser Extension
- Separate build (Vite + React, MV3 manifest). `NEXT_PUBLIC_API_BASE_URL`-equivalent points at the same Render API URL. Build this only after Phase 1 (Section 14, Tasks A/B) is fully done and deployed.

### 10.4 CI/CD
- GitHub Actions on both repos: install → lint → typecheck → test on every PR.
- Vercel auto-builds `pricehatke-web` on push to `main`.
- Render auto-deploys `pricehatke-api` on push to `main`, running `prisma migrate deploy` in the deploy hook.

---

## 11. Phased Roadmap

**Phase 1 (MVP)**
- Auth, product resolve + price history (mock/provider-abstracted data), alerts (email), deals feed, basic dashboard, responsive homepage matching Buyhatke's structure.

**Phase 2**
- Gift cards + sandbox checkout, browser extension, referral program, web push notifications.

**Phase 3**
- Spend Lens, Product Lens (LLM-backed), Grocery Compare, Ride Compare, real scraper/partner integrations (subject to legal review), admin CMS for deals/content.

---

## 12. Success Metrics

- # of products tracked, # of active alerts, alert-to-click-through rate on triggered emails.
- Deals page CTR to outbound store links.
- Gift-card conversion rate (checkout completion).
- Weekly active users / retention (D7, D30).
- Core Web Vitals (LCP < 2.5s, CLS < 0.1) on Vercel.

---

## 13. Open Questions / Risks (decision defaults for the agent to build against)

1. **Data sourcing**: default to mock/fixture data in Phase 1 (Section 0.4). Do not implement live scraping without explicit human sign-off.
2. **Gift card fulfillment**: default to sandbox/mock fulfillment (Razorpay test mode + a fake e-code string emailed via Resend) until real brand partnerships exist.
3. **Render cold starts**: recommend Starter (paid) tier for `pricehatke-api` in production; note this in `README.md` but default to Free tier for local/dev setup instructions.
4. **Extension store review time**: not a blocker for Phase 1/2 development — package the extension as an unpacked/`.zip` build for manual side-loading; submission to Chrome Web Store is a separate, later task outside this PRD's build order.

---

## 14. Build Order / Task Checklist (execute top to bottom)

Each task lists **Scope**, **Files/Areas touched**, and **Definition of Done (DoD)** — a concrete, checkable condition. Task IDs: `B` = backend, `F` = frontend, `X` = extension, `D` = deployment.

### Phase 1 — Backend Foundations
- **B1. Scaffold NestJS project + Prisma + Postgres connection**
  - Scope: `npx @nestjs/cli new pricehatke-api`, add Prisma, connect to local Postgres via `DATABASE_URL`.
  - DoD: `npm run start:dev` boots without error; `GET /health` returns `{status:"ok"}`.
- **B2. Implement Prisma schema (Section 8.5) + initial migration + seed script**
  - Scope: `prisma/schema.prisma`, `prisma/seed.ts`.
  - DoD: `npx prisma migrate dev` succeeds; `npx prisma db seed` populates at least 10 Products, 20 StoreListings, 200 PriceSnapshots (spread over 6 months), 15 Deals, 5 GiftCardBrands with 3 denominations each.
- **B3. Auth module** (signup/login/refresh, Google OAuth, guards)
  - DoD: Postman/curl test — signup → login returns access+refresh JWT; protected route rejects without token, accepts with valid token.
- **B4. Provider abstraction + mock providers**
  - Scope: `products/providers/*`, fixture JSON files with realistic sample price series per store.
  - DoD: calling `AmazonProvider.resolve(url)` and `.fetchPrice(id)` returns deterministic mock data with no outbound network call.
- **B5. Products module** (`resolve`, detail, history, compare, track)
  - DoD: `POST /products/resolve` with a sample Amazon-style URL returns a `productId`; `GET /products/:id/history?range=1m` returns a non-empty time series matching seeded data.
- **B6. Alerts module + alert-evaluate job**
  - DoD: creating an alert with a target price above the current lowest seeded price causes the job (run manually via a test trigger) to mark it `triggered` and enqueue a notification job (verify via job log, email sending can be mocked/logged in dev).
- **B7. Deals module**
  - DoD: `GET /deals?minDiscount=50&sort=discount` returns only seeded deals ≥50% off, sorted descending by discount.
- **B8. Notifications module (Resend integration, dev-mode logs if no API key set)**
  - DoD: triggering an alert in dev without `RESEND_API_KEY` logs the would-be email to console instead of throwing.
- **B9. Health, logging, rate limiting, CORS, Swagger docs**
  - DoD: `/api/docs` renders Swagger UI listing all endpoints above; hitting an endpoint >N times/min from one IP returns 429.

### Phase 1 — Frontend Foundations
- **F1. Scaffold Next.js app + Tailwind + shadcn/ui**
  - DoD: `npm run build` succeeds; a placeholder home page renders locally.
- **F2. Layout shell** (Navbar, Footer, StatsBar) matching Buyhatke's structure (logo left, nav links, Login button; footer with Products/Price History Tracker/Company/Other columns)
  - DoD: shell renders on every route via `app/layout.tsx`; responsive at 375px and 1440px widths.
- **F3. Home page** (hero + search bar, hot deals section, feature grid, stores logo strip, stats banner, FAQ accordion)
  - DoD: page matches the section list in 7.4.1; search bar submit calls `POST /products/resolve` and navigates to `/product/:id` on success, shows inline error on failure.
- **F4. Product Price History page** (chart, stat cards, compare table, set-alert modal)
  - DoD: loading `/product/:id` for a seeded product renders a Recharts line chart with real data from `GET /products/:id/history`; range toggle re-fetches and re-renders; "Set Alert" modal successfully calls `POST /alerts` when logged in, redirects to login when not.
- **F5. Deals page** (filters, sort, grid, pagination)
  - DoD: changing a filter/sort control updates the URL query params and re-fetches from `GET /deals`; empty-state message shown when no deals match.
- **F6. Auth pages + NextAuth wiring**
  - DoD: signup → auto-login → redirected to `/dashboard`; Google OAuth button completes a full round trip in dev.
- **F7. Dashboard** (tracked products, alerts, orders stub, settings)
  - DoD: logged-in user sees their tracked products and alerts pulled live from the API; removing a tracked product calls the delete endpoint and updates the list without a full page reload.
- **F8. Gift cards catalog + brand detail (browse only, no checkout yet)**
  - DoD: `/gift-cards` lists seeded brands; brand detail page shows denominations with discount %.
- **F9. SEO stub pages** (About, Contact, What We Do, How We Earn, Supported Stores, Terms, Privacy) + Phase-2 "coming soon" stubs (Spend Lens, Product Lens, Grocery Compare)
  - DoD: every link in the footer/nav resolves to a real route (no 404s).

### Phase 2 — Gift Card Checkout + Extension
- **B10. Gift card checkout endpoint (Razorpay test mode) + order history**
  - DoD: test-mode payment completes end-to-end in Razorpay's sandbox; order status transitions `pending → paid → fulfilled`; confirmation email logged/sent.
- **F10. Gift card checkout flow UI**
  - DoD: user can select denomination, pay via Razorpay test checkout, land on a confirmation page, and see the order in `/dashboard/orders`.
- **X1. Extension scaffold (MV3) + quick-check widget**
  - DoD: loading an unpacked extension in Chrome on a sample product-style page injects a floating widget showing mock price-history data fetched from `GET /extension/quick-check`.

### Deployment
- **D1. Deploy backend to Render** (Web Service + Worker + Cron + Postgres + Redis), run `prisma migrate deploy`, verify `/health` is green from the public URL.
  - DoD: public Render URL responds to `GET /health` and `GET /api/docs`.
- **D2. Deploy frontend to Vercel**, point `NEXT_PUBLIC_API_BASE_URL` at the Render URL, verify CORS.
  - DoD: production Vercel URL loads the home page, search → product page → chart renders using live Render API data (not localhost).
- **D3. Smoke test the full deployed flow**: signup → search/resolve a product → view chart → set an alert → see it in dashboard.
  - DoD: all five steps succeed against the production URLs with no console errors.

---

## 15. Token / Quota Budget Guidance (Antigravity-specific)

Antigravity's usage is metered (requests **and** tokens), and cost scales with both context size and model tier. Apply these rules for the entire build, not just at the start.

### 15.1 Model selection per activity
Don't run everything on the strongest model. Set/verify Antigravity's per-feature model config (Settings → Models) as follows:
- **Exploration / reading code / simple CRUD boilerplate** (most of Section 14's `B1, B2, B4, B7, F1, F2, F9`): use a **Flash/Fast-tier model** (e.g. Gemini 3 Flash).
- **Non-trivial logic** (auth flows, the alert-evaluator job, the provider abstraction, checkout/payment integration, chart data-shaping): use a **Pro/Thinking-tier model**, but only for that specific task — switch back to Flash afterward.
- **Code review / verifying a Definition of Done**: use a stronger model but scope it to the changed files only, never "review the whole repo."
- Leave the **AI Credits toggle disabled** unless a task explicitly needs overage capacity — it's a common source of unexpected quota burn.

### 15.2 One task, one prompt, one repo
- Execute Section 14 exactly one task ID at a time (e.g. just `B5`). Do not batch multiple task IDs into a single prompt/agent run — this multiplies context per turn and makes failures harder to isolate.
- Never point the agent at both `pricehatke-api` and `pricehatke-web` in the same session/window. Keep them as separate Antigravity workspaces so neither's file index bleeds into the other's context.
- Start a **fresh agent session per task** where practical rather than continuing one long-running conversation — context (and therefore token cost) accumulates every turn, and by turn ~15 a one-sentence follow-up can silently drag in 50k+ tokens of history.

### 15.3 Context hygiene
- Add an `.antigravityignore` (mirroring `.gitignore`) at the root of both repos, excluding at minimum: `node_modules/`, `dist/`, `.next/`, `coverage/`, `*.lock`, `prisma/migrations/` (after they're generated). Unindexed build output and lockfiles are a common silent token sink.
- Keep a short `gemini.md` (or `AGENTS.md`) at each repo root containing only: the relevant excerpt of this PRD's folder structure (Section 7.2 or 8.2), the current task ID being worked on, and any `DECISIONS.md` deviations — not the entire PRD. This file gets prepended to every prompt, so keep it under ~500 words.
- Before starting a task, close/unpin any open editor tabs or attached files not relevant to that task; review Antigravity's "included files" context tray before sending a prompt.
- When asking the agent to fix a bug, point it at the specific file/function, not "debug the app."

### 15.4 Plan externally, execute internally
- Do the planning/design thinking (e.g. "how should the alert-evaluator job be structured") outside Antigravity where possible — in this chat, in a notes doc, or in NotebookLM — and paste only the resulting concrete plan into Antigravity. Reserve Antigravity's own token budget for actual code generation and verification, not open-ended brainstorming.
- Reuse Section 14's Definition-of-Done text verbatim as the closing instruction in each task prompt (e.g. "Done when: `GET /health` returns `{status:\"ok\"}`") so the agent has a crisp stop condition instead of continuing to iterate/explore.

### 15.5 Verification without re-reading everything
- Prefer running the project's own build/lint/test commands (Section 0.5) to confirm a task is done over asking the agent to "review the code and confirm it's correct" — the former is cheap (terminal output only), the latter re-reads and re-reasons over large file spans.
- Commit after each task (Section 0.7) so a new session can `git log`/`git diff` the last commit for context instead of re-deriving project state from scratch.

---

*End of PRD.*
