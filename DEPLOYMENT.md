# PriceHatke — Deployment & Operations Guide

This guide provides step-by-step instructions for deploying the **PriceHatke** platform to production environments.

---

## 🏗 System Architecture Overview

PriceHatke consists of 4 main containerized services:
1. **Frontend (`pricehatke-web`)**: Next.js 14+ App Router, standalone Node server running on port `3000`.
2. **Backend API (`pricehatke-api`)**: NestJS API with Prisma ORM, NestJS Throttler, and BullMQ worker running on port `8080`.
3. **Database (`postgres`)**: PostgreSQL 16 server storing users, products, price snapshots, alerts, deals, and gift cards.
4. **Cache & Queue (`redis`)**: Redis 7 server powering BullMQ alert evaluation queues and caching.

---

## 🚀 Option A: Single-Server Deployment (Docker Compose)

Ideal for VPS instances (AWS EC2, DigitalOcean Droplet, Hetzner, Linode).

### Prerequisites
- Docker (v24+) & Docker Compose plugin (v2.20+)
- Domain name with A records pointing to your server IP

### Step 1: Clone Repository & Configure Production Environment
```bash
git clone https://github.com/your-org/pricehatke.git
cd pricehatke
```

### Step 2: Environment Variables Setup
Create `.env.production` in root or update `docker-compose.prod.yml`:

```env
# Database Credentials
POSTGRES_USER=postgres
POSTGRES_PASSWORD=YOUR_STRONG_POSTGRES_PASSWORD
POSTGRES_DB=pricehatke

# Redis Security
REDIS_PASSWORD=YOUR_STRONG_REDIS_PASSWORD

# JWT & Authentication
JWT_ACCESS_SECRET=YOUR_SUPER_SECRET_ACCESS_KEY
JWT_REFRESH_SECRET=YOUR_SUPER_SECRET_REFRESH_KEY

# Google OAuth Credentials (Optional)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Resend Email API Key (Optional)
RESEND_API_KEY=re_123456789_abcdef

# URLs
FRONTEND_URL=https://pricehatke.com
BACKEND_URL=https://api.pricehatke.com
```

### Step 3: Launch Production Stack
```bash
docker compose -f docker-compose.prod.yml up --build -d
```

### Step 4: Verify Container Health
```bash
docker compose -f docker-compose.prod.yml ps
```
All 4 containers (`postgres`, `redis`, `api`, `web`) should report `running` / `healthy`.

---

## ☁ Option B: Cloud Platform Deployment (Vercel + Managed Backend)

### 1. Frontend (`pricehatke-web`) on Vercel
1. Import repository on [Vercel](https://vercel.com).
2. Set Root Directory to `pricehatke-web`.
3. Framework Preset: **Next.js**.
4. Configure Environment Variables:
   - `NEXT_PUBLIC_API_BASE_URL`: `https://api.pricehatke.com`
   - `NEXTAUTH_URL`: `https://pricehatke.com`
   - `NEXTAUTH_SECRET`: `<random_secret>`

### 2. Backend (`pricehatke-api`) on Render / Railway / Fly.io / AWS ECS
1. Connect repository and set root directory to `pricehatke-api`.
2. Build Command: `npm install && npx prisma generate && npm run build`.
3. Start Command: `npx prisma migrate deploy && node dist/src/main.js`.
4. Attach Managed PostgreSQL and Managed Redis database instances.
5. Set Environment Variables (`DATABASE_URL`, `REDIS_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`).

---

## 🧪 Post-Deployment Sanity Check Checklist

- [ ] **Health Endpoint**: `curl https://api.pricehatke.com/health` returns `{"status":"ok","db":true,"redis":true}`.
- [ ] **Swagger Documentation**: Open `https://api.pricehatke.com/api/docs` to verify API schemas.
- [ ] **Auth Flow**: Sign up a new user at `https://pricehatke.com/signup` and test login redirect to `/dashboard`.
- [ ] **Price Search**: Enter an Amazon or Flipkart URL in the search bar to verify product resolution.
- [ ] **Price Drop Alert**: Create an alert and call `POST /alerts/evaluate` to confirm BullMQ job execution.
