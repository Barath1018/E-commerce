-- =====================================================================
-- Aesthify Studio — Supabase schema
-- =====================================================================
-- Run this entire file once in the Supabase SQL editor.
-- It creates all tables, row-level security policies, storage buckets,
-- triggers, and seeds the initial admin email.
--
-- After running, also enable Email + Google providers under
-- Authentication ▸ Providers in the Supabase dashboard.
-- =====================================================================

-- Required extensions ---------------------------------------------------
create extension if not exists "pgcrypto";

-- =====================================================================
-- 1. PROFILES
-- =====================================================================
-- One row per auth.users entry. Auto-created via trigger.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique not null,
  full_name   text,
  username    text,
  avatar_url  text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- =====================================================================
-- 2. ADMIN EMAILS  (acts as the "Supabase secret" for admin gating)
-- =====================================================================
create table if not exists public.admin_emails (
  email      text primary key,
  added_at   timestamptz not null default now()
);

-- Seed your initial admin email here.
-- Replace with your real address; this is what unlocks the admin portal.
insert into public.admin_emails (email)
values ('barath.senthil1602@gmail.com')
on conflict (email) do nothing;

-- =====================================================================
-- 3. PRODUCTS
-- =====================================================================
create table if not exists public.products (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  description         text not null default '',
  short_description   text,
  price               numeric(10,2) not null default 0 check (price >= 0),
  is_free             boolean not null default false,
  category            text not null,
  tags                text[] not null default '{}',
  thumbnail_url       text not null,
  preview_images      text[] not null default '{}',
  license_type        text not null default 'standard'
    check (license_type in ('free', 'standard', 'extended', 'exclusive')),
  is_featured         boolean not null default false,
  is_best_seller      boolean not null default false,
  unique_code_enabled boolean not null default false,
  unique_code_prefix  text not null default 'AESTHIFY',
  reviews_enabled     boolean not null default true,
  download_count      integer not null default 0,
  created_by          uuid references auth.users(id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists products_category_idx       on public.products(category);
create index if not exists products_is_featured_idx    on public.products(is_featured);
create index if not exists products_is_best_seller_idx on public.products(is_best_seller);
create index if not exists products_created_at_idx     on public.products(created_at desc);

-- =====================================================================
-- 4. PRODUCT FILES  (downloadable assets attached to a product)
-- =====================================================================
create table if not exists public.product_files (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  name        text not null,
  url         text not null,
  storage_path text,
  size        text,
  mime_type   text,
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists product_files_product_idx on public.product_files(product_id);

-- =====================================================================
-- 5. ORDERS  +  ORDER ITEMS
-- =====================================================================
create table if not exists public.orders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  total       numeric(10,2) not null default 0 check (total >= 0),
  status      text not null default 'completed'
    check (status in ('pending', 'processing', 'completed', 'cancelled')),
  payment_id  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists orders_user_idx       on public.orders(user_id);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

create table if not exists public.order_items (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references public.orders(id) on delete cascade,
  product_id      uuid references public.products(id) on delete set null,
  product_name    text not null,
  price           numeric(10,2) not null,
  quantity        integer not null default 1 check (quantity > 0),
  license_type    text not null,
  download_limit  integer not null default 5,
  downloads_used  integer not null default 0,
  access_code     text,
  files           jsonb not null default '[]'::jsonb,
  created_at      timestamptz not null default now()
);

create index if not exists order_items_order_idx   on public.order_items(order_id);
create index if not exists order_items_product_idx on public.order_items(product_id);

-- =====================================================================
-- 6. REVIEWS  (one review per user per product)
-- =====================================================================
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  rating      integer not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (product_id, user_id)
);

create index if not exists reviews_product_idx on public.reviews(product_id);
create index if not exists reviews_user_idx    on public.reviews(user_id);

-- =====================================================================
-- 7. WISHLIST
-- =====================================================================
create table if not exists public.wishlist (
  user_id     uuid not null references auth.users(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- =====================================================================
-- 8. CART  (server-side cart — optional, kept for cross-device sync)
-- =====================================================================
create table if not exists public.cart_items (
  user_id      uuid not null references auth.users(id) on delete cascade,
  product_id   uuid not null references public.products(id) on delete cascade,
  quantity     integer not null default 1 check (quantity > 0),
  license_type text not null default 'standard',
  added_at     timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- =====================================================================
-- 9. DERIVED VIEW: products_with_stats  (live rating/review counts)
-- =====================================================================
create or replace view public.products_with_stats as
select
  p.*,
  coalesce(round(avg(r.rating)::numeric, 2), 0)::numeric as avg_rating,
  count(r.id)::int                                       as review_count
from public.products p
left join public.reviews r on r.product_id = p.id
group by p.id;

-- =====================================================================
-- 10. TRIGGER FUNCTIONS
-- =====================================================================

-- 10a. updated_at touch
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

drop trigger if exists trg_reviews_updated_at on public.reviews;
create trigger trg_reviews_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- 10b. Auto-create profile when a new auth user signs up.
-- If their email is in admin_emails, they automatically get role='admin'.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  is_admin boolean;
begin
  select exists (select 1 from public.admin_emails where email = new.email)
    into is_admin;

  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'avatar_url',
    case when is_admin then 'admin' else 'user' end
  )
  on conflict (id) do update
  set email   = excluded.email,
      role    = case when is_admin then 'admin' else public.profiles.role end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 10c. Helper: check whether the calling user is admin (used in RLS).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- =====================================================================
-- 11. ROW LEVEL SECURITY
-- =====================================================================

-- profiles --------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "profiles read all"           on public.profiles;
drop policy if exists "profiles update self"        on public.profiles;
drop policy if exists "profiles update by admin"    on public.profiles;

create policy "profiles read all"
  on public.profiles for select
  using (true);

create policy "profiles update self"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

create policy "profiles update by admin"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- admin_emails (only admins can manage) --------------------------------
alter table public.admin_emails enable row level security;

drop policy if exists "admin_emails admin only" on public.admin_emails;

create policy "admin_emails admin only"
  on public.admin_emails for all
  using (public.is_admin())
  with check (public.is_admin());

-- products --------------------------------------------------------------
alter table public.products enable row level security;

drop policy if exists "products read all"   on public.products;
drop policy if exists "products write admin" on public.products;

create policy "products read all"
  on public.products for select
  using (true);

create policy "products write admin"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- product_files ---------------------------------------------------------
alter table public.product_files enable row level security;

drop policy if exists "product_files read all"   on public.product_files;
drop policy if exists "product_files write admin" on public.product_files;

create policy "product_files read all"
  on public.product_files for select
  using (true);

create policy "product_files write admin"
  on public.product_files for all
  using (public.is_admin())
  with check (public.is_admin());

-- orders ----------------------------------------------------------------
alter table public.orders enable row level security;

drop policy if exists "orders read self or admin"   on public.orders;
drop policy if exists "orders insert self"          on public.orders;
drop policy if exists "orders update self or admin" on public.orders;

create policy "orders read self or admin"
  on public.orders for select
  using (auth.uid() = user_id or public.is_admin());

create policy "orders insert self"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "orders update self or admin"
  on public.orders for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- order_items -----------------------------------------------------------
alter table public.order_items enable row level security;

drop policy if exists "order_items read self or admin" on public.order_items;
drop policy if exists "order_items insert self"        on public.order_items;
drop policy if exists "order_items update self or admin" on public.order_items;

create policy "order_items read self or admin"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "order_items insert self"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

create policy "order_items update self or admin"
  on public.order_items for update
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );

-- reviews ---------------------------------------------------------------
alter table public.reviews enable row level security;

drop policy if exists "reviews read all"        on public.reviews;
drop policy if exists "reviews insert self"     on public.reviews;
drop policy if exists "reviews update self"     on public.reviews;
drop policy if exists "reviews delete self or admin" on public.reviews;

create policy "reviews read all"
  on public.reviews for select
  using (true);

create policy "reviews insert self"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "reviews update self"
  on public.reviews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "reviews delete self or admin"
  on public.reviews for delete
  using (auth.uid() = user_id or public.is_admin());

-- wishlist --------------------------------------------------------------
alter table public.wishlist enable row level security;

drop policy if exists "wishlist owner only" on public.wishlist;

create policy "wishlist owner only"
  on public.wishlist for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- cart_items ------------------------------------------------------------
alter table public.cart_items enable row level security;

drop policy if exists "cart owner only" on public.cart_items;

create policy "cart owner only"
  on public.cart_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =====================================================================
-- 12. STORAGE BUCKETS
-- =====================================================================
-- product-thumbnails  → public read, admin write
-- product-previews    → public read, admin write
-- product-files       → private (signed URLs only), admin write
-- =====================================================================

insert into storage.buckets (id, name, public)
values
  ('product-thumbnails', 'product-thumbnails', true),
  ('product-previews',   'product-previews',   true),
  ('product-files',      'product-files',      false)
on conflict (id) do update set public = excluded.public;

-- Storage policies ------------------------------------------------------
drop policy if exists "thumbnails public read"   on storage.objects;
drop policy if exists "thumbnails admin write"   on storage.objects;
drop policy if exists "previews public read"     on storage.objects;
drop policy if exists "previews admin write"     on storage.objects;
drop policy if exists "files admin manage"       on storage.objects;
drop policy if exists "files owner read"         on storage.objects;

create policy "thumbnails public read"
  on storage.objects for select
  using (bucket_id = 'product-thumbnails');

create policy "thumbnails admin write"
  on storage.objects for all
  using (bucket_id = 'product-thumbnails' and public.is_admin())
  with check (bucket_id = 'product-thumbnails' and public.is_admin());

create policy "previews public read"
  on storage.objects for select
  using (bucket_id = 'product-previews');

create policy "previews admin write"
  on storage.objects for all
  using (bucket_id = 'product-previews' and public.is_admin())
  with check (bucket_id = 'product-previews' and public.is_admin());

-- product-files: only admins can write; reads happen via signed URLs
-- generated server-side or by anyone holding a valid signed URL.
create policy "files admin manage"
  on storage.objects for all
  using (bucket_id = 'product-files' and public.is_admin())
  with check (bucket_id = 'product-files' and public.is_admin());

-- =====================================================================
-- 13. REALTIME
-- =====================================================================
-- Make sure the buyer storefront receives live product updates.
-- (Supabase auto-publishes most public schema tables; this is explicit.)
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.product_files;
alter publication supabase_realtime add table public.reviews;

-- =====================================================================
-- DONE
-- =====================================================================
