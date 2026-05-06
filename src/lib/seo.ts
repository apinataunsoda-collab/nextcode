import type { Metadata } from "next";
import type { CatalogProduct } from "@/lib/catalog";
import { formatTHB } from "@/lib/money";
import { getSiteSettings } from "@/lib/settings";

function truncate(s: string, n: number) {
  if (!s) return "";
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + "…";
}

/** สร้าง Metadata ของหน้าสินค้า (Dynamic) */
export async function productMetadata(p: CatalogProduct): Promise<Metadata> {
  const s = await getSiteSettings();
  const url = `${s.url.replace(/\/$/, "")}/products/${p.slug}`;
  const priceLabel = `เริ่มต้น ${formatTHB(p.basePrice)}`;
  const title = truncate(`${p.name} ${priceLabel} | ${s.name}`, 60);
  const descRaw =
    `${p.shortDescription} · ${p.categoryName}` +
    (p.features.length ? ` — ${p.features.slice(0, 3).join(", ")}` : "") +
    ` · รับทำเว็บไซต์ ${priceLabel} รองรับ SEO ด้วย AI`;
  const description = truncate(descRaw, 160);
  const image = p.image || s.logoUrl || "/og-default.png";
  const keywords = [
    "รับทำเว็บไซต์",
    p.name,
    p.categoryName,
    ...p.tags,
    "SEO",
    "เว็บ AI",
  ];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: s.name,
      images: [{ url: image, alt: p.name }],
      locale: "th_TH",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/** JSON-LD: ProfessionalService (หน้าแรก) */
export async function professionalServiceJsonLd(minPrice?: number) {
  const s = await getSiteSettings();
  const socials = Object.values(s.social).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: s.name,
    url: s.url,
    description: s.description,
    image: s.logoUrl || `${s.url}/og-default.png`,
    telephone: s.mobile || s.phone || undefined,
    email: s.email || undefined,
    address: s.address
      ? {
          "@type": "PostalAddress",
          streetAddress: s.address,
          addressCountry: "TH",
        }
      : undefined,
    areaServed: "TH",
    priceRange: "฿฿",
    ...(minPrice
      ? {
          makesOffer: {
            "@type": "Offer",
            priceCurrency: "THB",
            price: String(minPrice),
            availability: "https://schema.org/InStock",
            description: `รับทำเว็บไซต์ เริ่มต้น ${formatTHB(minPrice)}`,
          },
        }
      : {}),
    sameAs: socials,
  };
}

/** JSON-LD: SoftwareApplication (หน้ารายละเอียดแพ็กเกจ) */
export async function softwareApplicationJsonLd(p: CatalogProduct) {
  const s = await getSiteSettings();
  const url = `${s.url.replace(/\/$/, "")}/products/${p.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: p.name,
    description: p.shortDescription,
    url,
    image: p.image,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    provider: { "@type": "Organization", name: s.name, url: s.url },
    offers: {
      "@type": "Offer",
      priceCurrency: "THB",
      price: String(p.basePrice),
      availability: "https://schema.org/InStock",
      url,
    },
    keywords: [p.categoryName, ...p.tags].join(", "),
    featureList: p.features,
  };
}

/** JSON-LD: BreadcrumbList (หน้าสินค้า) */
export async function breadcrumbJsonLd(p: CatalogProduct) {
  const s = await getSiteSettings();
  const base = s.url.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าแรก", item: base },
      { "@type": "ListItem", position: 2, name: "แคตตาล็อก", item: `${base}/#catalog` },
      {
        "@type": "ListItem",
        position: 3,
        name: p.name,
        item: `${base}/products/${p.slug}`,
      },
    ],
  };
}
