import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readSessionFromCookies } from "@/lib/auth";

function requireAuth() {
  const s = readSessionFromCookies();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = requireAuth();
  if (unauth) return unauth;

  const body = await req.json();
  const {
    name,
    slug,
    categoryId,
    image,
    basePrice,
    serviceType,
    shortDescription,
    features,
    tags,
    addOnIds,
    isActive,
  } = body;

  const data: any = {};
  if (name !== undefined) data.name = name;
  if (slug !== undefined) data.slug = slug;
  if (categoryId !== undefined) data.categoryId = categoryId;
  if (image !== undefined) data.image = image;
  if (basePrice !== undefined) data.basePrice = Number(basePrice);
  if (serviceType !== undefined) data.serviceType = serviceType;
  if (shortDescription !== undefined) data.shortDescription = shortDescription;
  if (features !== undefined) data.features = JSON.stringify(features);
  if (tags !== undefined) data.tags = JSON.stringify(tags);
  if (isActive !== undefined) data.isActive = Boolean(isActive);

  const product = await prisma.product.update({
    where: { id: params.id },
    data,
  });

  // ถ้าส่ง addOnIds มา → sync ใหม่
  if (Array.isArray(addOnIds)) {
    await prisma.productAddOn.deleteMany({ where: { productId: params.id } });
    if (addOnIds.length) {
      await prisma.productAddOn.createMany({
        data: addOnIds.map((addOnId: string) => ({ productId: params.id, addOnId })),
      });
    }
  }

  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = requireAuth();
  if (unauth) return unauth;

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
