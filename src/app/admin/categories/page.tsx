import { prisma } from "@/lib/prisma";
import CategoriesManager from "@/components/admin/CategoriesManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">หมวดหมู่</h1>
        <p className="mt-1 text-sm text-slate-500">
          จัดการหมวดหมู่สินค้า และตั้งค่าลิงก์ตัวอย่าง (Prototype) ของแต่ละหมวด
        </p>
      </div>
      <CategoriesManager
        initial={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          demoUrl: (c as any).demoUrl || "",
          productCount: c._count.products,
        }))}
      />
    </div>
  );
}
