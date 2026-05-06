import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readSessionFromCookies } from "@/lib/auth";

// GET /api/products — list ทั้งหมด (public)
export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      addOns: { include: { addOn: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      shortDescription: p.shortDescription,
      image: p.image,
      basePrice: p.basePrice,
      serviceType: p.serviceType,
      features: safeParseArray(p.features),
      tags: safeParseArray(p.tags),
      isActive: p.isActive,
      category: { id: p.category.id, name: p.category.name, slug: p.category.slug },
      addOns: p.addOns.map((pa) => ({
        id: pa.addOn.id,
        code: pa.addOn.code,
        label: pa.addOn.label,
        description: pa.addOn.description,
        price: pa.priceOverride ?? pa.addOn.price,
      })),
    })),
  );
}

// POST /api/products — admin only
export async function POST(req: NextRequest) {
  const session = readSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    slug,
    name,
    categoryId,
    image,
    basePrice,
    serviceType,
    shortDescription,
    features = [],
    tags = [],
    addOnIds = [],
    isActive = true,
  } = body;

  if (!slug || !name || !categoryId || basePrice == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      slug,
      name,
      categoryId,
      image: image || "",
      basePrice: Number(basePrice),
      serviceType: serviceType || "ออกแบบ + ส่งมอบ",
      shortDescription: shortDescription || "",
      features: JSON.stringify(features),
      tags: JSON.stringify(tags),
      isActive,
      addOns: {
        create: (addOnIds as string[]).map((addOnId) => ({ addOnId })),
      },
    },
  });

  return NextResponse.json(product, { status: 201 });
}

function safeParseArray(s: string): string[] {
  try {
    const arr = JSON.parse(s);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
