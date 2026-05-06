import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/settings";
import { getCatalog } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const s = await getSiteSettings();
  const base = s.url.replace(/\/$/, "");
  const products = await getCatalog();
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
