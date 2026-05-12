export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number | null;
  created_at: string | null;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  long_description: string | null;
  specifications: Json | null;
  category_id: string | null;
  brand: string | null;
  model_code: string | null;
  featured: boolean | null;
  in_stock: boolean | null;
  sort_order: number | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ProductImage = {
  id: string;
  product_id: string | null;
  url: string;
  alt_text: string | null;
  is_primary: boolean | null;
  sort_order: number | null;
};

export type Tag = {
  id: string;
  slug: string;
  name: string;
};

export type ProductTag = {
  product_id: string;
  tag_id: string;
};

export type Service = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  long_description: string | null;
  icon_name: string | null;
  image_url: string | null;
  sort_order: number | null;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author_name: string | null;
  published: boolean | null;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ContactSubmission = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string;
  created_at: string | null;
};

export type AdminUser = {
  id: string;
  user_id: string;
  created_at: string | null;
};

export type ProductWithRelations = Product & {
  images: ProductImage[];
  category: Category | null;
  tags: Tag[];
};

type Insertable<T, RequiredKeys extends keyof T> = Partial<T> &
  Pick<T, RequiredKeys>;

type TableDefinition<Row, Insert, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      categories: TableDefinition<
        Category,
        Insertable<Category, "slug" | "name">
      >;
      products: TableDefinition<
        Product,
        Insertable<Product, "slug" | "name">
      >;
      product_images: TableDefinition<
        ProductImage,
        Insertable<ProductImage, "url">
      >;
      tags: TableDefinition<Tag, Insertable<Tag, "slug" | "name">>;
      product_tags: TableDefinition<ProductTag, ProductTag>;
      services: TableDefinition<Service, Insertable<Service, "slug" | "name">>;
      blog_posts: TableDefinition<
        BlogPost,
        Insertable<BlogPost, "slug" | "title" | "content">
      >;
      contact_submissions: TableDefinition<
        ContactSubmission,
        Insertable<ContactSubmission, "name" | "message">
      >;
      admin_users: TableDefinition<
        AdminUser,
        Insertable<AdminUser, "user_id">
      >;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
