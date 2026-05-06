import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatTHB } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, addOns: true },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">สินค้า (เว็บไซต์)</h1>
          <p className="mt-1 text-sm text-slate-500">
            จัดการแบบเว็บไซต์ที่คุณรับทำ
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          + เพิ่มสินค้า
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">ชื่อสินค้า</th>
              <th className="px-4 py-3">หมวดหมู่</th>
              <th className="px-4 py-3">ประเภทบริการ</th>
              <th className="px-4 py-3">Add-ons</th>
              <th className="px-4 py-3 text-right">ราคาฐาน</th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.image && (
                      <img
                        src={p.image}
                        alt=""
                        className="h-10 w-14 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium text-slate-900">{p.name}</div>
                      <div className="text-xs text-slate-500">/{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{p.category.name}</td>
                <td className="px-4 py-3">{p.serviceType}</td>
                <td className="px-4 py-3">{p.addOns.length} รายการ</td>
                <td className="px-4 py-3 text-right font-semibold text-brand-700">
                  {formatTHB(p.basePrice)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      p.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {p.isActive ? "เปิดขาย" : "ปิด"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-sm text-brand-700 hover:underline"
                  >
                    แก้ไข
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                  ยังไม่มีสินค้า
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
