-- 1. Fix foreign keys to reference profiles(id) instead of auth.users(id)

alter table public.reviews drop constraint if exists reviews_user_id_fkey;
alter table public.reviews
  add constraint reviews_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.orders drop constraint if exists orders_user_id_fkey;
alter table public.orders
  add constraint orders_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.wishlist drop constraint if exists wishlist_user_id_fkey;
alter table public.wishlist
  add constraint wishlist_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.cart_items drop constraint if exists cart_items_user_id_fkey;
alter table public.cart_items
  add constraint cart_items_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;

-- 2. Add INSERT policy so onboarding can create/update profile rows

drop policy if exists "profiles insert self" on public.profiles;
create policy "profiles insert self" on public.profiles for insert
  with check (auth.uid() = id);
