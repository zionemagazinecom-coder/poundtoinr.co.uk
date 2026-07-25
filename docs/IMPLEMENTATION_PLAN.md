# PoundToINR.co.uk Implementation Plan

## Current Decision

The API will be supplied later, so the application starts with a provider-agnostic exchange-rate interface and a deterministic mock provider. API keys must remain server-side when the real provider is connected.

## Architecture

- Frontend: React, TypeScript, Vite and Tailwind CSS.
- Hosting target: Cloudflare Pages for the static frontend, with Cloudflare Workers or Pages Functions for server-side exchange-rate proxy routes in a later phase.
- Database: Supabase PostgreSQL with migrations and Row Level Security.
- Auth: Supabase Auth with manually assigned administrator roles.
- Rate data: normalised provider adapters, Cloudflare cache, Supabase snapshots where permitted.

## Phase 1

- Inspect repository and initialise project.
- Add strict TypeScript, linting, tests and production build.
- Add design tokens and responsive homepage shell.
- Add environment placeholders without secrets.
- Add CI workflow.

## Phase 2

- Build currency calculation engine.
- Build GBP-to-INR and INR-to-GBP converter.
- Add formatting, validation, reverse rates and conversion tables.
- Add unit tests for conversion and calculator formulas.

## Phase 3

- Add server-side exchange-rate API proxy.
- Add real provider adapter selected by environment variable.
- Add retry, caching, stale-rate labelling and fallback behaviour.
- Add provider health logging without sensitive data.

## Phase 4

- Add historical-rate storage and chart pages.
- Add accessible data tables and CSV/print outputs.
- Add statistics for high, low, average and period movement.

## Phase 5

- Expand Supabase migrations.
- Add Auth, admin roles, storage policies and data access layer.
- Ensure draft content and admin writes are protected by RLS.

## Phase 6-10

- Complete public routes, calculators, editorial system, admin CMS, alerts, security hardening, accessibility review, performance review and deployment documentation.

## Verification After Each Phase

Run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## API Integration Notes

When the API is provided, add a new adapter that implements `ExchangeRateProvider`, keep the key out of `VITE_` variables, and route browser requests through a Cloudflare server function.
