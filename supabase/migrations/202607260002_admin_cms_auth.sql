create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null default 'editor' check (role in ('owner', 'editor')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft', 'review', 'published')),
  excerpt text not null default '',
  featured_image_url text,
  categories text[] not null default '{}',
  blocks jsonb not null default '[]'::jsonb,
  seo_title text not null default '',
  meta_description text not null default '',
  focus_keyword text not null default '',
  internal_links text[] not null default '{}',
  external_links text[] not null default '{}',
  word_count integer not null default 0,
  seo_score integer not null default 0 check (seo_score >= 0 and seo_score <= 100),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_status_published_idx
  on public.posts (status, published_at desc);

create index if not exists posts_slug_idx
  on public.posts (slug);

alter table public.admin_users enable row level security;
alter table public.posts enable row level security;

create or replace function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and is_active = true
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_admin_users_updated_at on public.admin_users;
create trigger touch_admin_users_updated_at
before update on public.admin_users
for each row execute function public.touch_updated_at();

drop trigger if exists touch_posts_updated_at on public.posts;
create trigger touch_posts_updated_at
before update on public.posts
for each row execute function public.touch_updated_at();

drop trigger if exists set_post_author_fields on public.posts;
create or replace function public.set_post_author_fields()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    new.created_by = auth.uid();
  end if;
  new.updated_by = auth.uid();
  return new;
end;
$$;

create trigger set_post_author_fields
before insert or update on public.posts
for each row execute function public.set_post_author_fields();

drop policy if exists "Admins can read their allowlist row" on public.admin_users;
create policy "Admins can read their allowlist row"
  on public.admin_users for select
  to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')) and is_active = true);

drop policy if exists "Active admins can read posts" on public.posts;
create policy "Active admins can read posts"
  on public.posts for select
  to authenticated
  using (public.is_active_admin());

drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
  on public.posts for select
  to anon
  using (status = 'published');

drop policy if exists "Authenticated users can read published posts" on public.posts;
create policy "Authenticated users can read published posts"
  on public.posts for select
  to authenticated
  using (status = 'published');

drop policy if exists "Active admins can insert posts" on public.posts;
create policy "Active admins can insert posts"
  on public.posts for insert
  to authenticated
  with check (public.is_active_admin());

drop policy if exists "Active admins can update posts" on public.posts;
create policy "Active admins can update posts"
  on public.posts for update
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());

drop policy if exists "Only owners can manage admin users" on public.admin_users;
create policy "Only owners can manage admin users"
  on public.admin_users for all
  to authenticated
  using (
    exists (
      select 1 from public.admin_users
      where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
        and role = 'owner'
        and is_active = true
    )
  )
  with check (
    exists (
      select 1 from public.admin_users
      where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
        and role = 'owner'
        and is_active = true
    )
  );

-- After running this migration, add your admin email once:
-- insert into public.admin_users (email, role) values ('you@example.com', 'owner')
-- on conflict (email) do update set role = excluded.role, is_active = true;
