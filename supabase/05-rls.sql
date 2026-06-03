-- profiles
alter table public.profiles enable row level security;
drop policy if exists "profiles read all"        on public.profiles;
drop policy if exists "profiles update self"     on public.profiles;
drop policy if exists "profiles update by admin" on public.profiles;

create policy "profiles read all" on public.profiles for select using (true);
create policy "profiles update self" on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));
create policy "profiles update by admin" on public.profiles for update
  using (public.is_admin()) with check (public.is_admin());

-- admin_emails
alter table public.admin_emails enable row level security;
drop policy if exists "admin_emails admin only" on public.admin_emails;
create policy "admin_emails admin only" on public.admin_emails for all
  using (public.is_admin()) with check (public.is_admin());

-- products
alter table public.products enable row level security;
drop policy if exists "products read all"   on public.products;
drop policy if exists "products write admin" on public.products;
create policy "products read all" on public.products for select using (true);
create policy "products write admin" on public.products for all
  using (public.is_admin()) with check (public.is_admin());

-- product_files
alter table public.product_files enable row level security;
drop policy if exists "product_files read all"   on public.product_files;
drop policy if exists "product_files write admin" on public.product_files;
create policy "product_files read all" on public.product_files for select using (true);
create policy "product_files write admin" on public.product_files for all
  using (public.is_admin()) with check (public.is_admin());

-- orders
alter table public.orders enable row level security;
drop policy if exists "orders read self or admin"   on public.orders;
drop policy if exists "orders insert self"          on public.orders;
drop policy if exists "orders update self or admin" on public.orders;
create policy "orders read self or admin" on public.orders for select
  using (auth.uid() = user_id or public.is_admin());
create policy "orders insert self" on public.orders for insert
  with check (auth.uid() = user_id);
create policy "orders update self or admin" on public.orders for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- order_items
alter table public.order_items enable row level security;
drop policy if exists "order_items read self or admin" on public.order_items;
drop policy if exists "order_items insert self"        on public.order_items;
drop policy if exists "order_items update self or admin" on public.order_items;
create policy "order_items read self or admin" on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_items.order_id and (o.user_id = auth.uid() or public.is_admin())));
create policy "order_items insert self" on public.order_items for insert
  with check (exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid()));
create policy "order_items update self or admin" on public.order_items for update
  using (exists (select 1 from public.orders o where o.id = order_items.order_id and (o.user_id = auth.uid() or public.is_admin())));

-- reviews
alter table public.reviews enable row level security;
drop policy if exists "reviews read all"            on public.reviews;
drop policy if exists "reviews insert self"         on public.reviews;
drop policy if exists "reviews update self"         on public.reviews;
drop policy if exists "reviews delete self or admin" on public.reviews;
create policy "reviews read all" on public.reviews for select using (true);
create policy "reviews insert self" on public.reviews for insert
  with check (auth.uid() = user_id);
create policy "reviews update self" on public.reviews for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reviews delete self or admin" on public.reviews for delete
  using (auth.uid() = user_id or public.is_admin());

-- wishlist
alter table public.wishlist enable row level security;
drop policy if exists "wishlist owner only" on public.wishlist;
create policy "wishlist owner only" on public.wishlist for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- cart_items
alter table public.cart_items enable row level security;
drop policy if exists "cart owner only" on public.cart_items;
create policy "cart owner only" on public.cart_items for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
