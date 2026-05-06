import { prisma } from "@/lib/prisma";
import LeadsTable from "@/components/admin/LeadsTable";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true, addOns: true },
  });

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads ลูกค้า</h1>
          <p className="mt-1 text-sm text-slate-500">
            รายชื่อลูกค้าที่กรอกฟอร์มเข้ามา พร้อมบริการเสริมที่เลือก
          </p>
        </div>
        <a href="/api/leads/export" className="btn-ghost whitespace-nowrap">
          ⬇︎ Export CSV
        </a>
      </div>
      <LeadsTable
        initialLeads={leads.map((l) => ({
          id: l.id,
          name: l.name,
          phone: l.phone,
          email: l.email,
          message: l.message,
          status: l.status,
          totalPrice: l.totalPrice,
          createdAt: l.createdAt.toISOString(),
          product: l.product ? { id: l.product.id, name: l.product.name, slug: l.product.slug } : null,
          addOns: l.addOns.map((a) => ({ label: a.label, priceAtTime: a.priceAtTime })),
        }))}
      />
    </div>
  );
}
