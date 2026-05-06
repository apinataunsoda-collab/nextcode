import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, addOns] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.addOn.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">เพิ่มสินค้าใหม่</h1>
      <ProductForm categories={categories} addOns={addOns} />
    </div>
  );
}
