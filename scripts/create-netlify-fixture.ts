import fs from "node:fs";
import { mockProducts, mockCategories, mockBlogPosts, mockServices, mockTags } from "../src/lib/seed-data";

fs.mkdirSync(".trial-local", { recursive: true });
const products = Array.from({ length: 30 }, (_, index) => {
  const seed = mockProducts[index % mockProducts.length];
  return { ...seed, id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
    slug: `trial-equipment-${index + 1}`, name: `Trial Equipment ${index + 1}`, brand: "Trial Brand",
    images: [{ id: `fixture-${index}`, url: "/hero-placeholder.png", is_primary: true, sort_order: 0 }],
    product_tags: [], tags: [] };
});
fs.writeFileSync(".trial-local/fixture.json", JSON.stringify({ products, categories: mockCategories,
  blog_posts: mockBlogPosts.map((post) => ({ ...post, cover_image_url: "/hero-placeholder.png" })),
  services: mockServices, tags: mockTags, site_settings: [], product_tags: [] }, null, 2));
console.log("Created synthetic catalog fixture: 30 fictional products; no live records copied.");
