import { prisma } from "@/lib/prisma";
import AddOnsManager from "@/components/admin/AddOnsManager";

export const dynamic = "force-dynamic";

export default async function AdminAddOnsPage() {
  const addOns = await prisma.addOn.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">บริการเสริม (Add-ons)</h1>
        <p className="mt-1 text-sm text-slate-500">
          ตั้งค่าบริการเสริมและราคาที่ลูกค้าจะเลือกได้ในหน้าสินค้า
        </p>
      </div>
      <AddOnsManager initial={addOns} />
    </div>
  );
}
