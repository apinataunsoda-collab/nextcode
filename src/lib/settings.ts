import { prisma } from "@/lib/prisma";
import { siteConfig as defaultConfig } from "@/data/site";

export type NavItem = { label: string; href: string };

export type SiteSettings = {
  name: string;
  tagline: string;
  description: string;
  url: string;

  address: string;
  phone: string;
  mobile: string;
  email: string;
  lineId: string;

  social: {
    facebook: string;
    instagram: string;
    tiktok: string;
    youtube: string;
  };

  logoUrl: string;
  faviconUrl: string;
  footerText: string;

  nav: NavItem[];
};

function safeParseNav(s: string): NavItem[] {
  try {
    const arr = JSON.parse(s);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x) => x && typeof x.label === "string" && typeof x.href === "string")
      .slice(0, 12);
  } catch {
    return [];
  }
}

/** ค่าเริ่มต้น — ใช้เมื่อ DB ยังไม่มี row หรืออ่านล้มเหลว */
export function defaultSettings(): SiteSettings {
  return {
    name: defaultConfig.name,
    tagline: defaultConfig.tagline,
    description: defaultConfig.description,
    url: defaultConfig.url,
    address: defaultConfig.contact.address,
    phone: defaultConfig.contact.phone,
    mobile: defaultConfig.contact.mobile,
    email: defaultConfig.contact.email,
    lineId: defaultConfig.contact.lineId,
    social: {
      facebook: defaultConfig.social.facebook,
      instagram: defaultConfig.social.instagram,
      tiktok: defaultConfig.social.tiktok,
      youtube: defaultConfig.social.youtube,
    },
    logoUrl: "",
    faviconUrl: "",
    footerText: "",
    nav: defaultConfig.nav,
  };
}

/**
 * ดึง settings จาก DB
 * - มี row (id=1) → ใช้ค่าจาก DB + fallback ทีละ field ถ้าเป็น ""
 * - ไม่มี row → ใช้ defaults
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { id: 1 } });
    const d = defaultSettings();
    if (!row) return d;

    const nav = safeParseNav(row.navJson);

    return {
      name: row.name || d.name,
      tagline: row.tagline || d.tagline,
      description: row.description || d.description,
      url: row.url || d.url,
      address: row.address || d.address,
      phone: row.phone || d.phone,
      mobile: row.mobile || d.mobile,
      email: row.email || d.email,
      lineId: row.lineId || d.lineId,
      social: {
        facebook: row.facebook || d.social.facebook,
        instagram: row.instagram || d.social.instagram,
        tiktok: row.tiktok || d.social.tiktok,
        youtube: row.youtube || d.social.youtube,
      },
      logoUrl: row.logoUrl || "",
      faviconUrl: row.faviconUrl || "",
      footerText: row.footerText || "",
      nav: nav.length ? nav : d.nav,
    };
  } catch (e) {
    console.warn("[settings] DB not ready, using defaults:", e);
    return defaultSettings();
  }
}

/** Ensure row id=1 exists and return it in DB shape */
export async function ensureSettingsRow() {
  return prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
}
