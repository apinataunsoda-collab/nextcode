import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatTHB } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [leadCount, newLeadCount, productCount, addOnCount, totalValue] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.product.count(),
    prisma.addOn.count(),
    prisma.lead.aggregate({ _sum: { totalPrice: true } }),
  ]);

  const latestLeads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { product: true },
  });

  const cards = [
    { label: "Leads ทั้งหมด", value: leadCount, href: "/admin/leads" },
    { label: "Leads ใหม่", value: newLeadCount, href: "/admin/leads" },
    { label: "สินค้าในระบบ", value: productCount, href: "/admin/products" },
    { label: "บริการเสริม", value: addOnCount, href: "/admin/addons" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">ภาพรวม</h1>
      <p className="mt-1 text-sm text-slate-500">
        ยอดประเมินจาก Leads ทั้งหมด: {formatTHB(totalValue._sum.totalPrice ?? 0)}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-card"
          >
            <div className="text-sm text-slate-500">{c.label}</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{c.value}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Leads ล่าสุด</h2>
          <Link href="/admin/leads" className="text-sm text-brand-700 hover:underline">
            ดูทั้งหมด →
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">เวลา</th>
                <th className="px-4 py-3">ชื่อ</th>
                <th className="px-4 py-3">เบอร์</th>
                <th className="px-4 py-3">สินค้าที่สนใจ</th>
                <th className="px-4 py-3 text-right">ยอดรวม</th>
              </tr>
            </thead>
            <tbody>
              {latestLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    ยังไม่มีข้อมูล
                  </td>
                </tr>
              )}
              {latestLeads.map((l) => (
                <tr key={l.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(l.createdAt).toLocaleString("th-TH")}
                  </td>
                  <td className="px-4 py-3 font-medium">{l.name}</td>
                  <td className="px-4 py-3">{l.phone}</td>
                  <td className="px-4 py-3">{l.product?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-right">{formatTHB(l.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
