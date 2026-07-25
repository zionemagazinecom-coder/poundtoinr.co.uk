# PoundToINR.co.uk

A standalone React and TypeScript currency conversion and financial information platform for `poundtoinr.co.uk`.

## Status

Phase 1 has been started. The exchange-rate API will be connected later through a provider adapter; the current app uses deterministic demo rates so development and tests remain stable.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Architecture

- React, TypeScript, Vite and Tailwind CSS.
- Supabase planned for PostgreSQL, Auth and Storage.
- Cloudflare Pages planned for frontend deployment.
- Cloudflare server routes planned for exchange-rate API proxying and caching.

## Security

Never put `SUPABASE_SERVICE_ROLE_KEY`, `EXCHANGE_RATE_API_KEY` or email provider secrets in browser-exposed variables. Only variables prefixed with `VITE_` are intended for browser code.

## Exchange-Rate API

The browser calls `/api/rates/current?base=GBP&quote=INR`. In production this is handled by a Cloudflare Pages Function, which calls ExchangeRate-API server-side and caches the response.

For production, set `EXCHANGE_RATE_API_KEY` in Cloudflare Pages environment variables. Do not commit it to Git.

## Account Setup Order

1. Create or log in to the new GitHub account and create the repository.
2. Push this project to that repository.
3. Create or log in to the new Supabase account and create the project.
4. Run migrations from `supabase/migrations`.
5. Create or log in to the new Cloudflare account and connect the GitHub repository to Cloudflare Pages.
6. Add server-side environment variables in Cloudflare Pages.
7. Connect the Hostinger domain to Cloudflare when ready.
