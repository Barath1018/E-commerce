-- products_with_stats view (live rating/review counts)
create or replace view public.products_with_stats as
select
  p.*,
  coalesce(round(avg(r.rating)::numeric, 2), 0)::numeric as avg_rating,
  count(r.id)::int                                       as review_count
from public.products p
left join public.reviews r on r.product_id = p.id
group by p.id;
