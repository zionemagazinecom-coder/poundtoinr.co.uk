create table if not exists public.currencies (
  code text primary key,
  name text not null,
  symbol text not null,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now()
);

create table if not exists public.exchange_rate_snapshots (
  id uuid primary key default gen_random_uuid(),
  base_currency text not null references public.currencies(code),
  quote_currency text not null references public.currencies(code),
  rate numeric(20, 8) not null check (rate > 0),
  provider_name text not null,
  provider_timestamp timestamptz,
  fetched_at timestamptz not null,
  data_status text not null check (data_status in ('live', 'delayed', 'cached', 'mock')),
  created_at timestamptz not null default now()
);

create index if not exists exchange_rate_snapshots_pair_fetched_idx
  on public.exchange_rate_snapshots (base_currency, quote_currency, fetched_at desc);

alter table public.currencies enable row level security;
alter table public.exchange_rate_snapshots enable row level security;

create policy "Public can read active currencies"
  on public.currencies for select
  using (status = 'active');

create policy "Public can read approved rate snapshots"
  on public.exchange_rate_snapshots for select
  using (data_status in ('live', 'delayed', 'cached', 'mock'));
