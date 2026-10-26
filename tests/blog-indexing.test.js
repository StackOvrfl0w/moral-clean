import { beforeEach, expect, mock, test } from "bun:test";

let totalCount;
mock.module("@/config/env", () => ({ env: { siteUrl: "https://moralclean.com" } }));
mock.module("@/lib/queries/blog", () => ({ getAllPosts: async () => ({
  posts: [], totalCount, page: 1, pageCount: 1, limit: 9,
}) }));
const { generateMetadata } = await import("../src/app/(public)/blog/page");
beforeEach(() => { totalCount = 0; });

test("an empty blog is excluded while retaining its canonical and followable guide links", async () => {
  const metadata = await generateMetadata({});
  expect(metadata.robots.index).toBe(false);
  expect(metadata.robots.googleBot.index).toBe(false);
  expect(metadata.robots.follow).toBe(true);
  expect(metadata.alternates.canonical).toBe("https://moralclean.com/blog");
});

test("a published article makes the blog eligible for indexing automatically", async () => {
  totalCount = 1;
  const metadata = await generateMetadata({});
  expect(metadata.robots).toBeUndefined();
  expect(metadata.alternates.canonical).toBe("https://moralclean.com/blog");
});
