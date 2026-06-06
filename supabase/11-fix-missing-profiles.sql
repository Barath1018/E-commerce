-- Create profiles for any auth.users that don't have one yet
insert into public.profiles (id, email, full_name, avatar_url, role)
select
  au.id,
  au.email,
  coalesce(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', au.email),
  au.raw_user_meta_data->>'avatar_url',
  case when exists (select 1 from public.admin_emails ae where ae.email = au.email)
       then 'admin' else 'user' end
from auth.users au
left join public.profiles p on p.id = au.id
where p.id is null
on conflict (id) do nothing;
