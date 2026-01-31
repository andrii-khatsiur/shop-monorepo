# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

E-commerce monorepo with three apps sharing TypeScript types:
- **API** (`apps/api`): Hono.js REST backend with SQLite, Google OAuth, JWT auth
- **Admin** (`apps/admin`): React 19 + Ant Design admin dashboard
- **Web** (`apps/web`): Solid.js public storefront with Vinxi

## Commands

```bash
# Development (from root)
bun dev                 # Start all apps concurrently
bun api:dev             # API only (port 3000)
bun admin:dev           # Admin only (port 3100)
bun web:dev             # Web only (port 3000, auto-opens browser)

# Build
bun build               # Build all apps

# Environment setup (run first)
bun env:copy            # Copy .env.example to .env for all apps
```

## Architecture

### Monorepo Structure
```
apps/
  api/        Hono.js backend
  admin/      React admin (serves built files via Bun)
  web/        Solid.js storefront (Vinxi SSR)
packages/
  types/      Shared TypeScript types (Product, Brand, Category)
```

### API Architecture (`apps/api/src/`)
- **Routes**: `routes/` - Hono route definitions
- **Handlers**: `handlers/` - Request handlers (auth, brand, category, product)
- **Repos**: `repos/` - Data access layer using repository pattern
- **Models**: `db/models/` - Abstract Model base class with CRUD operations
- **Middleware**: `middleware/` - Auth verification, request/error logging
- **Database**: SQLite with migrations in `db/migrations/`

### Admin Architecture (`apps/admin/src/`)
- **Pages**: `pages/` - Route components (Dashboard, Brands/, Categories/, Products/)
- **Hooks**: `hooks/` - TanStack React Query hooks for API data
- **Services**: `services/` - Axios HTTP client, auth utilities
- **Context**: `context/` - Modal state management

### Shared Types
Import from `@shop-monorepo/types`:
```typescript
import type { Product, Brand, Category } from "@shop-monorepo/types"
```

### Path Aliases
- Root: `@apps/*` -> `apps/*/src`, `@packages/*` -> `packages/*/src`
- Admin: `@/*` -> `./src/*`
- Web: `~/*` -> `./src/*`

## API Endpoints

Base URL: `/api`

- `GET /ping` - Health check
- `GET /auth/google` - Google OAuth flow
- Products: `GET|POST /products`, `GET|PUT|DELETE /products/{idOrSlug}`
- Brands: `GET|POST /brands`, `GET /brands/{slug}`, `PUT|DELETE /brands/{id}`
- Categories: `GET|POST /categories`, `GET /categories/{slug}`, `PUT|DELETE /categories/{id}`

All endpoints except `/ping` and `/auth/google` require JWT Bearer token.

## Database

SQLite database (`db.sqlite` in root). Migrations in `apps/api/src/db/migrations/`.

Tables: users, brands, categories, products, product_categories (junction).

## Environment Variables

Key variables per app (see `.env.example` files):
- **API**: PORT, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET, FRONTEND_URL
- **Admin**: PORT
- **Web**: PORT
