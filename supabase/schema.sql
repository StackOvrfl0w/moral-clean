create extension if not exists pgcrypto;
create extension if not exists pg_trgm with schema extensions;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  parent_id uuid references public.categories(id) on delete set null,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_description text,
  long_description text,
  specifications jsonb default '{}'::jsonb,
  category_id uuid references public.categories(id) on delete set null,
  brand text,
  model_code text,
  featured boolean default false,
  in_stock boolean default true,
  sort_order int default 0,
  meta_title text,
  meta_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  url text not null,
  alt_text text,
  is_primary boolean default false,
  sort_order int default 0
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null
);

create table if not exists public.product_tags (
  product_id uuid references public.products(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (product_id, tag_id)
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_description text,
  long_description text,
  icon_name text,
  image_url text,
  sort_order int default 0
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text not null,
  cover_image_url text,
  author_name text default 'Moral Clean',
  published boolean default false,
  published_at timestamptz,
  meta_title text,
  meta_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  message text not null,
  created_at timestamptz default now()
);

create index if not exists categories_parent_id_idx on public.categories(parent_id);
create index if not exists categories_sort_name_idx
  on public.categories(sort_order asc, name asc);
create index if not exists products_featured_sort_name_idx
  on public.products(featured desc, sort_order asc, name asc);
create index if not exists products_category_featured_sort_name_idx
  on public.products(category_id, featured desc, sort_order asc, name asc);
create index if not exists products_brand_featured_sort_name_idx
  on public.products(brand, featured desc, sort_order asc, name asc)
  where brand is not null;
create index if not exists products_created_at_idx
  on public.products(created_at desc);
create index if not exists products_name_trgm_idx
  on public.products using gin (name extensions.gin_trgm_ops);
create index if not exists products_short_description_trgm_idx
  on public.products using gin (short_description extensions.gin_trgm_ops);
create index if not exists products_brand_trgm_idx
  on public.products using gin (brand extensions.gin_trgm_ops);
create index if not exists products_model_code_trgm_idx
  on public.products using gin (model_code extensions.gin_trgm_ops);
create index if not exists product_images_product_sort_idx
  on public.product_images(product_id, is_primary desc, sort_order asc);
create index if not exists product_tags_tag_product_idx
  on public.product_tags(tag_id, product_id);
create index if not exists services_sort_name_idx
  on public.services(sort_order asc, name asc);
create index if not exists blog_posts_published_published_at_idx
  on public.blog_posts(published, published_at desc);
create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions(created_at desc);

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.tags enable row level security;
alter table public.product_tags enable row level security;
alter table public.services enable row level security;
alter table public.blog_posts enable row level security;
alter table public.contact_submissions enable row level security;

grant select on public.categories to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.product_images to anon, authenticated;
grant select on public.tags to anon, authenticated;
grant select on public.product_tags to anon, authenticated;
grant select on public.services to anon, authenticated;
grant select on public.blog_posts to anon, authenticated;
grant insert on public.contact_submissions to anon, authenticated;

drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories"
  on public.categories
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read products" on public.products;
create policy "Public read products"
  on public.products
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read product images" on public.product_images;
create policy "Public read product images"
  on public.product_images
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read tags" on public.tags;
create policy "Public read tags"
  on public.tags
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read product tags" on public.product_tags;
create policy "Public read product tags"
  on public.product_tags
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read services" on public.services;
create policy "Public read services"
  on public.services
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read published blog posts" on public.blog_posts;
create policy "Public read published blog posts"
  on public.blog_posts
  for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Public create contact submissions" on public.contact_submissions;
create policy "Public create contact submissions"
  on public.contact_submissions
  for insert
  to anon, authenticated
  with check (true);

-- Storage bucket policy note:
-- Manually create a public Supabase Storage bucket named "product-images"
-- from the Supabase dashboard for product catalog images. This schema does not
-- create storage buckets or storage policies.
