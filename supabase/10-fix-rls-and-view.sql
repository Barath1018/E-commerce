-- Fix RLS policies to be simpler and not block onboarding upserts

-- profiles: allow self-insert and self-update without role check
drop policy if exists "profiles insert self" on public.profiles;
create policy "profiles insert self" on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles update self" on public.profiles;
create policy "profiles update self" on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Recreate the products_with_stats view to be sure it works
create or replace view public.products_with_stats as
select
  p.*,
  coalesce(round(avg(r.rating)::numeric, 2), 0)::numeric as avg_rating,
  count(r.id)::int as review_count
from public.products p
left join public.reviews r on r.product_id = p.id
group by p.id;

-- Ensure the view is accessible
grant select on public.products_with_stats to authenticated;
grant select on public.products_with_stats to anon;
