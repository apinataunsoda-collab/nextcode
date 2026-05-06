import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/settings";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const s = await getSiteSettings();
  const base = s.url.replace(/\/$/, "");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
