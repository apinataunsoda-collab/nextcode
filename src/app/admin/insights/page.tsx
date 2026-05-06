import { prisma } from "@/lib/prisma";
import { formatTHB } from "@/lib/money";

export const dynamic = "force-dynamic";

type Row = { label: string; count: number; value: number };

export default async function AdminInsightsPage() {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [total30d, totalAll, leads, addOnCounts] = await Promise.all([
    prisma.lead.count({ where: { createdAt: { gte: since } } }),
    prisma.lead.count(),
    prisma.lead.findMany({
      include: { product: { include: { category: true } }, addOns: true },
    }),
    prisma.leadAddOn.groupBy({
      by: ["addOnId", "label"],
      _count: { _all: true },
      _sum: { priceAtTime: true },
      orderBy: { _count: { addOnId: "desc" } },
    }),
  ]);

  // --- aggregate ฝั่ง JS (SQLite ไม่รองรับ groupBy ที่ซับซ้อนกับ include) ---
  const byProduct = new Map<string, Row>();
  const byCategory = new Map<string, Row>();

  for (const l of leads) {
    const pName = l.product?.name ?? "ไม่ระบุ";
    const cName = l.product?.category?.name ?? "ไม่ระบุ";

    const p = byProduct.get(pName) || { label: pName, count: 0, value: 0 };
    p.count += 1;
    p.value += l.totalPrice;
    byProduct.set(pName, p);

    const c = byCategory.get(cName) || { label: cName, count: 0, value: 0 };
    c.count += 1;
    c.value += l.totalPrice;
    byCategory.set(cName, c);
  }

  const productRows = [...byProduct.values()].sort((a, b) => b.count - a.count);
  const categoryRows = [...byCategory.values()].sort((a, b) => b.count - a.count);

  const topCount = productRows[0]?.count ?? 0;
  const topCatCount = categoryRows[0]?.count ?? 0;
  const topAddOnCount = addOnCounts[0]?._count._all ?? 0;

  const statusCounts = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Insights</h1>
        <p className="mt-1 text-sm text-slate-500">
          วิเคราะห์ว่าลูกค้าสนใจเว็บแนวไหนมากที่สุด และบริการเสริมไหนขายดี
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <StatCard label="Leads 30 วัน" value={String(total30d)} />
        <StatCard label="Leads ทั้งหมด" value={String(totalAll)} />
        <StatCard
          label="ยอดประเมินทั้งหมด"
          value={formatTHB(leads.reduce((s, l) => s + l.totalPrice, 0))}
        />
        <StatCard
          label="สถานะ NEW"
          value={String(statusCounts["NEW"] ?? 0)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <BarPanel
          title="แพ็กเกจที่ลูกค้าสนใจ"
          subtitle="นับจาก Leads ที่อ้างอิงสินค้าตัวนั้น"
          rows={productRows}
          max={topCount}
        />
        <BarPanel
          title="หมวดหมู่ที่มาแรง"
          subtitle="กลุ่มธุรกิจของแพ็กเกจที่ถูกเลือก"
          rows={categoryRows}
          max={topCatCount}
        />
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-1 text-sm font-semibold text-slate-900">
          บริการเสริมยอดนิยม
        </div>
        <p className="mb-4 text-xs text-slate-500">
          นับจาก add-on ที่ลูกค้าติ๊กตอนส่งฟอร์ม
        </p>
        {addOnCounts.length === 0 ? (
          <p className="text-sm text-slate-500">ยังไม่มีข้อมูล</p>
        ) : (
          <div className="space-y-2">
            {addOnCounts.map((a) => {
              const count = a._count._all;
              const revenue = a._sum.priceAtTime ?? 0;
              const pct = topAddOnCount ? Math.round((count / topAddOnCount) * 100) : 0;
              return (
                <div key={a.addOnId} className="text-sm">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-medium text-slate-800">{a.label}</span>
                    <span className="text-slate-500">
                      {count} ครั้ง · รวม {formatTHB(revenue)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-brand-600"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function BarPanel({
  title,
  subtitle,
  rows,
  max,
}: {
  title: string;
  subtitle: string;
  rows: Row[];
  max: number;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-1 text-sm font-semibold text-slate-900">{title}</div>
      <p className="mb-4 text-xs text-slate-500">{subtitle}</p>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">ยังไม่มีข้อมูล</p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const pct = max ? Math.round((r.count / max) * 100) : 0;
            return (
              <div key={r.label} className="text-sm">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium text-slate-800">{r.label}</span>
                  <span className="text-slate-500">
                    {r.count} leads · {formatTHB(r.value)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-600"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
