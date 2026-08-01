# PriceHatke Web — Agent Context

## Current Task: F1 — Scaffold Next.js + Tailwind + shadcn/ui

## Project Structure (Section 7.2 of PRD)
```
pricehatke-web/
├── app/
│   ├── (marketing)/    # Home, About, Contact, etc.
│   ├── deals/          # (F5) Deals feed & detail
│   ├── gift-cards/     # (F8) Catalog & brand detail
│   ├── product/[id]/   # (F4) Price history page
│   ├── track/[...slug] # URL resolver ("magic trick")
│   ├── dashboard/      # (F7) User dashboard
│   ├── login/ signup/  # (F6) Auth
│   └── api/
├── components/
│   ├── ui/             # shadcn components
│   ├── layout/         # (F2) Navbar, Footer, StatsBar
│   ├── search/         # (F3) UrlResolverInput
│   ├── product/        # (F4) PriceHistoryChart, CompareTable
│   └── deals/          # (F5) DealCard, DealGrid
└── lib/
    ├── api.ts          # fetch wrapper
    └── utils.ts
```
