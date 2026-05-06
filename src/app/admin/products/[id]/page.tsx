import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories, addOns] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: { addOns: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.addOn.findMany({ orderBy: { createdAt: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">แก้ไขสินค้า</h1>
      <ProductForm
        categories={categories}
        addOns={addOns}
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          image: product.image,
          basePrice: product.basePrice,
          serviceType: product.serviceType,
          shortDescription: product.shortDescription,
          isActive: product.isActive,
          categoryId: product.categoryId,
          features: safeParseArray(product.features),
          tags: safeParseArray(product.tags),
          addOnIds: product.addOns.map((a) => a.addOnId),
        }}
      />
    </div>
  );
}

function safeParseArray(s: string): string[] {
  try {
    const arr = JSON.parse(s);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
