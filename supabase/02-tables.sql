-- Profiles (one row per auth.users entry, auto-created via trigger)
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

-- Admin emails (admin gating)
create table if not exists public.admin_emails (
  email      text primary key,
  added_at   timestamptz not null default now()
);

insert into public.admin_emails (email)
values ('barath.senthil1602@gmail.com')
on conflict (email) do nothing;

-- Products
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

-- Product files (downloadable assets)
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

-- Orders
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

-- Order items
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

-- Reviews (one per user per product)
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

-- Wishlist
create table if not exists public.wishlist (
  user_id     uuid not null references auth.users(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- Cart (server-side, for cross-device sync)
create table if not exists public.cart_items (
  user_id      uuid not null references auth.users(id) on delete cascade,
  product_id   uuid not null references public.products(id) on delete cascade,
  quantity     integer not null default 1 check (quantity > 0),
  license_type text not null default 'standard',
  added_at     timestamptz not null default now(),
  primary key (user_id, product_id)
);
