import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/shop",
    "/mens-formal-shoes",
    "/security-guard-shoes",
    "/office-wear-shoes",
    "/loafers",
    "/about",
    "/contact",
    "/shipping-policy",
    "/return-refund",
    "/privacy-policy",
    "/terms",
    "/size-guide",
    "/track-order",
    "/blog",
  ];

  return routes.map((route) => ({
    url: `https://pillaa.com${route}`,
    lastModified: new Date(),
  }));
}
