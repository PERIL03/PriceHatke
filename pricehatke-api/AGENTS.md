# PriceHatke API — Agent Context

## Current Task: B1 — Scaffold NestJS + Prisma + Postgres

## Project Structure (Section 8.2 of PRD)
```
pricehatke-api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── prisma/       # PrismaService, PrismaModule
│   ├── health/       # GET /health
│   ├── auth/         # (B3)
│   ├── products/     # (B5) with providers/ (B4)
│   ├── alerts/       # (B6)
│   ├── deals/        # (B7)
│   ├── gift-cards/   # (B10)
│   ├── notifications/ # (B8)
│   ├── jobs/         # (B6) BullMQ processors
│   └── common/       # guards, interceptors, filters
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── .env.example
```

## Deviations: See DECISIONS.md
