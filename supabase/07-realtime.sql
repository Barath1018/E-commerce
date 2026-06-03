-- Enable realtime for storefront
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.product_files;
alter publication supabase_realtime add table public.reviews;
