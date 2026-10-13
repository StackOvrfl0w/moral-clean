-- REVIEWED PREPARATION ONLY. Not executed by the application or Netlify build.
-- First run supabase/schema.sql and its catalog-index migration in a NEW empty test project.
-- Then SET moralclean.trial_project_ref = '<the actual isolated project reference>';
-- This manual declaration is a guard, not automatic proof of database identity.
do $$
begin
  if coalesce(current_setting('moralclean.trial_project_ref', true), '') in ('', 'sjlmjakninsenljyastk') then
    raise exception 'Refusing bootstrap without a declared isolated project reference';
  end if;
end $$;

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  user_id uuid unique not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  constraint admin_identity_matches check (id = user_id)
);
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text,
  updated_at timestamptz default now()
);
alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
grant select on public.admin_users to authenticated;
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
create policy "Trial admin reads own membership" on public.admin_users
  for select to authenticated using (id = (select auth.uid()));
create policy "Trial public reads settings" on public.site_settings
  for select to anon, authenticated using (true);

create schema if not exists private;
create or replace function private.is_trial_admin() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.admin_users where id = (select auth.uid())); $$;
revoke all on function private.is_trial_admin() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_trial_admin() to authenticated;

do $$
declare trial_table text;
begin
  foreach trial_table in array array['categories','products','product_images','tags','product_tags','services','blog_posts','contact_submissions','site_settings'] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', trial_table);
    execute format('create policy "Trial admin manages records" on public.%I for all to authenticated using ((select private.is_trial_admin())) with check ((select private.is_trial_admin()))', trial_table);
  end loop;
end $$;

-- The application uses the bucket ID with a space. The old schema's note says
-- product-images; that note does not match the actual code.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product images', 'product images', true, 5242880,
  array['image/jpeg','image/png','image/gif','image/webp']);
create policy "Trial admins manage images" on storage.objects
  for all to authenticated
  using (bucket_id = 'product images' and (select private.is_trial_admin()))
  with check (bucket_id = 'product images' and (select private.is_trial_admin()));

-- After creating a dedicated test admin through the isolated Auth dashboard:
-- insert into public.admin_users(id,user_id) values ('<test-user-uuid>','<test-user-uuid>');
-- Also create a second test user WITHOUT membership to prove RLS denial.
-- Seed fictional catalog content only; never export customer enquiries or real auth users.
