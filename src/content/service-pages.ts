import pages from "./service-pages.json";

export const servicePages = pages;
export const getServicePage = (slug: string) => servicePages.find((page) => page.slug === slug);
export const getServicePageByCatalogSlug = (slug: string) => servicePages.find((page) => page.serviceSlug === slug);
