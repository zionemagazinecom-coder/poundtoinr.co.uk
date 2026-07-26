# Supabase CMS Setup

The admin CMS follows the same ownership/security pattern used on the insurance project:

- Supabase Auth for email/password login.
- `/auth` for login.
- `/admin` protected by a Supabase role check.
- `public.profiles.role = 'admin'` is the primary admin permission.
- `public.admin_users` remains as an email allowlist compatibility layer.
- `public.posts` stores drafts and published articles.
- Supabase Storage bucket `media` stores uploaded article images.
- Row Level Security protects drafts, writes and media uploads.

## Required Cloudflare Variables

Set these in Cloudflare Pages:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Do not expose the service-role key in browser variables.

## Migrations

Run all files in `supabase/migrations` in order. The CMS/security files are:

- `202607260002_admin_cms_auth.sql`
- `202607260003_profiles_auth_media.sql`

## First Admin

Create or invite this Supabase Auth user:

```text
zionemagazine.com@gmail.com
```

After the user exists, the migration promotes that email to `profiles.role = 'admin'`. If the user is created later, run this SQL once:

```sql
insert into public.profiles (id, email, display_name, role, is_active)
select id, email, split_part(email, '@', 1), 'admin', true
from auth.users
where lower(email) = lower('zionemagazine.com@gmail.com')
on conflict (id) do update
set role = 'admin',
    is_active = true,
    email = excluded.email,
    updated_at = now();
```

## Login

Use `/auth` to sign in, then open `/admin`.
