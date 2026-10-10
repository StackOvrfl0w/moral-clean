const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const siteUrl = configuredSiteUrl && !/localhost|127\.0\.0\.1/i.test(configuredSiteUrl)
  ? configuredSiteUrl.replace(/\/$/, "") : "https://moralclean.com";
const guides = [...require("./src/content/guides.json"), ...require("./src/content/additional-guides.json")];
const pages = ["/", "/about", "/services", "/contact", "/products", "/blog", "/guides", ...guides.map(({ slug }) => `/guides/${slug}`)];

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  autoLastmod: false,
  exclude: ["/admin", "/admin/*", "/api/*", "/catalog-sitemap.xml"],
  transform: async (_config, path) => pages.includes(path) ? { loc: path } : null,
  additionalPaths: async () => pages.map((loc) => ({ loc })),
  robotsTxtOptions: {
    additionalSitemaps: [`${siteUrl}/catalog-sitemap.xml`],
    // Allow admin crawling so its noindex meta/header can be read. Auth protects data.
    policies: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
  },
};
