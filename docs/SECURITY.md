# Security Notes

- Do not commit real `.env` files.
- Browser code may only use public Supabase configuration.
- Supabase service-role, exchange-rate API and email API keys must remain server-side.
- Administrators must be assigned manually through a restricted process.
- Row Level Security must be enabled for exposed Supabase tables.
- Draft posts, draft providers and private media metadata must not be publicly readable.
- Exchange-rate provider requests should go through Cloudflare server routes with caching and rate limiting.
- If an API key is ever visible in a screenshot, chat, recording or browser stream, rotate it before production use.
- User HTML and tool embeds require sanitisation and sandboxing before publication.
- Rate-alert and contact endpoints need validation, abuse prevention and duplicate submission controls.

## Admin CMS security

- `/admin` is hidden from public navigation and marked `noindex,nofollow`.
- The editor is gated by Supabase Auth and an `admin_users` allowlist.
- Run the latest migration in `supabase/migrations` before using the admin editor.
- Add the first admin email in Supabase SQL editor:

```sql
insert into public.admin_users (email, role)
values ('you@example.com', 'owner')
on conflict (email) do update set role = excluded.role, is_active = true;
```

- Set these Cloudflare Pages variables for frontend login:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
