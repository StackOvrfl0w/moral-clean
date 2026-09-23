create extension if not exists pg_trgm with schema extensions;

-- UNIQUE constraints already create B-tree indexes for these slugs.
drop index if exists public.categories_slug_idx;
drop index if exists public.products_slug_idx;
drop index if exists public.products_featured_idx;
drop index if exists public.products_category_id_idx;
drop index if exists public.blog_posts_slug_idx;

-- Listing filters and deterministic sort orders.
create index if not exists products_featured_sort_name_idx
  on public.products(featured desc, sort_order asc, name asc);
create index if not exists products_category_featured_sort_name_idx
  on public.products(category_id, featured desc, sort_order asc, name asc);
create index if not exists products_brand_featured_sort_name_idx
  on public.products(brand, featured desc, sort_order asc, name asc)
  where brand is not null;
create index if not exists products_created_at_idx
  on public.products(created_at desc);

-- ILIKE '%term%' search cannot use ordinary B-tree indexes.
create index if not exists products_name_trgm_idx
  on public.products using gin (name extensions.gin_trgm_ops);
create index if not exists products_short_description_trgm_idx
  on public.products using gin (short_description extensions.gin_trgm_ops);
create index if not exists products_brand_trgm_idx
  on public.products using gin (brand extensions.gin_trgm_ops);
create index if not exists products_model_code_trgm_idx
  on public.products using gin (model_code extensions.gin_trgm_ops);

-- Foreign-key joins used by embedded product cards and tag filters.
create index if not exists product_images_product_sort_idx
  on public.product_images(product_id, is_primary desc, sort_order asc);
create index if not exists product_tags_tag_product_idx
  on public.product_tags(tag_id, product_id);

create index if not exists categories_sort_name_idx
  on public.categories(sort_order asc, name asc);
create index if not exists services_sort_name_idx
  on public.services(sort_order asc, name asc);
create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions(created_at desc);
