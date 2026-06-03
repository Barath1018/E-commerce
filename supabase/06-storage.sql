-- Storage buckets
insert into storage.buckets (id, name, public)
values
  ('product-thumbnails', 'product-thumbnails', true),
  ('product-previews',   'product-previews',   true),
  ('product-files',      'product-files',      false)
on conflict (id) do update set public = excluded.public;

-- Storage policies
drop policy if exists "thumbnails public read"  on storage.objects;
drop policy if exists "thumbnails admin write"  on storage.objects;
drop policy if exists "previews public read"    on storage.objects;
drop policy if exists "previews admin write"    on storage.objects;
drop policy if exists "files admin manage"      on storage.objects;

create policy "thumbnails public read" on storage.objects for select
  using (bucket_id = 'product-thumbnails');
create policy "thumbnails admin write" on storage.objects for all
  using (bucket_id = 'product-thumbnails' and public.is_admin())
  with check (bucket_id = 'product-thumbnails' and public.is_admin());

create policy "previews public read" on storage.objects for select
  using (bucket_id = 'product-previews');
create policy "previews admin write" on storage.objects for all
  using (bucket_id = 'product-previews' and public.is_admin())
  with check (bucket_id = 'product-previews' and public.is_admin());

create policy "files admin manage" on storage.objects for all
  using (bucket_id = 'product-files' and public.is_admin())
  with check (bucket_id = 'product-files' and public.is_admin());
