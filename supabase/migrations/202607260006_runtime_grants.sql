grant usage on schema public to anon, authenticated;

grant select on public.currencies to anon, authenticated;
grant select on public.exchange_rate_snapshots to anon, authenticated;
grant insert on public.exchange_rate_snapshots to authenticated;

grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;

grant select on public.admin_users to authenticated;
grant select, update on public.profiles to authenticated;

insert into public.currencies (code, name, symbol, status)
values
  ('GBP', 'British Pound', '£', 'active'),
  ('INR', 'Indian Rupee', '₹', 'active'),
  ('USD', 'US Dollar', '$', 'active'),
  ('EUR', 'Euro', '€', 'active'),
  ('AED', 'UAE Dirham', 'د.إ', 'active')
on conflict (code) do update set
  name = excluded.name,
  symbol = excluded.symbol,
  status = excluded.status;

drop policy if exists "Admins can insert rate snapshots" on public.exchange_rate_snapshots;
create policy "Admins can insert rate snapshots"
  on public.exchange_rate_snapshots for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can delete posts" on public.posts;
create policy "Admins can delete posts"
  on public.posts for delete
  to authenticated
  using (public.is_admin());
