import { prisma } from "@/lib/prisma";

export type CatalogAddOn = {
  id: string;
  code: string;
  label: string;
  description: string | null;
  price: number;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  image: string;
  basePrice: number;
  serviceType: string;
  categoryName: string;
  categorySlug: string;
  features: string[];
  tags: string[];
  addOns: CatalogAddOn[];
};

function safeParseArray(s: string): string[] {
  try {
    const arr = JSON.parse(s);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export async function getCatalog(): Promise<CatalogProduct[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
      addOns: { include: { addOn: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    image: p.image,
    basePrice: p.basePrice,
    serviceType: p.serviceType,
    categoryName: p.category.name,
    categorySlug: p.category.slug,
    features: safeParseArray(p.features),
    tags: safeParseArray(p.tags),
    addOns: p.addOns
      .filter((pa) => pa.addOn.isActive)
      .map((pa) => ({
        id: pa.addOn.id,
        code: pa.addOn.code,
        label: pa.addOn.label,
        description: pa.addOn.description,
        price: pa.priceOverride ?? pa.addOn.price,
      })),
  }));
}

export async function getProductBySlugFromDb(slug: string) {
  const all = await getCatalog();
  return all.find((p) => p.slug === slug) ?? null;
}
