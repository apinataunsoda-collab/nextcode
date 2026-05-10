import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/settings";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const s = await getSiteSettings();
  const base = s.url.replace(/\/$/, "");
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin"] },
      { userAgent: "facebookexternalhit", allow: "/" },
      { userAgent: "Twitterbot", allow: "/" },
      { userAgent: "LinkedInBot", allow: "/" },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
