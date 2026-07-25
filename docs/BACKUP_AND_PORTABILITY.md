# Backup And Portability

- Source code should live in the owner's GitHub repository.
- Supabase schema changes should be captured in `supabase/migrations`.
- Export Supabase data before major schema changes.
- Download Supabase Storage assets for periodic backups.
- Keep exchange-rate provider logic behind adapters so providers can be changed.
- Keep deployment documentation independent from Codex.
- Store production secrets in Cloudflare and Supabase, not in Git.
- Maintain a DNS rollback note before changing Hostinger nameservers.
