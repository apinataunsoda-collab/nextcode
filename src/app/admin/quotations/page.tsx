import { prisma } from "@/lib/prisma";
import QuotationsTable from "@/components/admin/QuotationsTable";

export const dynamic = "force-dynamic";

export default async function AdminQuotationsPage() {
  const quotations = await prisma.quotation.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, lead: true },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ใบเสนอราคา</h1>
          <p className="mt-1 text-sm text-slate-500">
            สร้างและจัดการใบเสนอราคาให้ลูกค้า
          </p>
        </div>
        <a href="/admin/quotations/new" className="btn-primary">
          + สร้างใบเสนอราคา
        </a>
      </div>
      <QuotationsTable
        initial={quotations.map((q) => ({
          id: q.id,
          number: q.number,
          status: q.status,
          customerName: q.customerName,
          customerPhone: q.customerPhone,
          total: q.total,
          createdAt: q.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
