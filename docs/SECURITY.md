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
