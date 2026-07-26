# Cloudflare Deployment

Use Cloudflare Pages for the current static frontend.

1. Connect the GitHub repository to Cloudflare Pages.
2. Select the production branch.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add public environment variables only where needed.
6. Add server-only secrets to Cloudflare when Pages Functions or Workers are introduced.
7. Configure `poundtoinr.co.uk` as the primary domain and redirect `www` to the root domain.
8. Use preview deployments for pull requests where practical.
9. Roll back through the Cloudflare Pages deployments list if needed.

Future API routes should be implemented as Cloudflare Pages Functions or a Worker so private exchange-rate keys are never exposed in browser JavaScript.

## ExchangeRate-API Environment Variables

Set these in Cloudflare Pages project settings, not in browser code:

```text
EXCHANGE_RATE_API_PROVIDER=exchangerate-api
EXCHANGE_RATE_API_KEY=<rotate-and-paste-your-key>
EXCHANGE_RATE_API_BASE_URL=https://v6.exchangerate-api.com/v6
EXCHANGE_RATE_CACHE_TTL_SECONDS=3600
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<server-only-service-role-key>
```

The current server route is:

```text
/api/rates/current?base=GBP&quote=INR
```

It calls ExchangeRate-API from the Cloudflare side and returns a normalised response to the browser.
When `SUPABASE_SERVICE_ROLE_KEY` is configured, the same route also stores a real GBP/INR snapshot in Supabase for the public history chart. Never expose the service-role key through `VITE_` variables.
