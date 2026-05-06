import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { formatTHB } from "@/lib/money";
import type { Metadata } from "next";
import PrintButton from "@/components/PrintButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const q = await prisma.quotation.findUnique({ where: { id: params.id } });
  if (!q) return {};
  return {
    title: `ใบเสนอราคา ${q.number}`,
    robots: { index: false, follow: false },
  };
}

export default async function QuotationPublicPage({ params }: { params: { id: string } }) {
  const q = await prisma.quotation.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!q) notFound();

  const s = await getSiteSettings();
  const issueDate = new Date(q.createdAt);
  const expireDate = new Date(issueDate.getTime() + q.validDays * 86400000);
  const isExpired = new Date() > expireDate && q.status !== "ACCEPTED";

  return (
    <div className="min-h-screen bg-slate-100 py-8 print:bg-white print:py-0">
      <div className="container-page max-w-3xl">
        {/* Print button */}
        <div className="mb-4 flex justify-end print:hidden">
          <PrintButton />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card print:rounded-none print:border-0 print:shadow-none">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              {s.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.logoUrl} alt={s.name} className="mb-2 h-12 w-auto" />
              ) : (
                <div className="mb-2 text-2xl font-bold text-brand-700">{s.name}</div>
              )}
              <div className="text-xs text-slate-500 whitespace-pre-line">
                {s.address}
                {s.mobile && `\nโทร ${s.mobile}`}
                {s.email && `\nอีเมล ${s.email}`}
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-slate-900">ใบเสนอราคา</h1>
              <p className="mt-1 font-mono text-sm text-slate-600">{q.number}</p>
              {isExpired && (
                <span className="mt-1 inline-block rounded-full bg-red-100 px-3 py-0.5 text-xs font-semibold text-red-700">
                  หมดอายุ
                </span>
              )}
            </div>
          </div>

          {/* Info grid */}
          <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
            <div>
              <div className="text-xs text-slate-500">ลูกค้า</div>
              <div className="font-semibold">{q.customerName}</div>
              {q.companyName && <div className="text-slate-600">{q.companyName}</div>}
              <div className="text-slate-600">{q.customerPhone}</div>
              {q.customerEmail && <div className="text-slate-600">{q.customerEmail}</div>}
            </div>
            <div className="text-right sm:text-right">
              <div className="text-xs text-slate-500">วันที่ออก</div>
              <div>{issueDate.toLocaleDateString("th-TH", { dateStyle: "long" })}</div>
              <div className="mt-2 text-xs text-slate-500">ใช้ได้ถึง</div>
              <div>{expireDate.toLocaleDateString("th-TH", { dateStyle: "long" })}</div>
            </div>
          </div>

          {/* Items table */}
          <table className="mt-6 min-w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200 text-left text-xs uppercase text-slate-500">
                <th className="pb-2 pr-2">#</th>
                <th className="pb-2 pr-2">รายละเอียด</th>
                <th className="pb-2 pr-2 text-center">จำนวน</th>
                <th className="pb-2 pr-2 text-right">ราคา/หน่วย</th>
                <th className="pb-2 text-right">รวม</th>
              </tr>
            </thead>
            <tbody>
              {q.items.map((item, i) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="py-3 pr-2 text-slate-400">{i + 1}</td>
                  <td className="py-3 pr-2">{item.description}</td>
                  <td className="py-3 pr-2 text-center">{item.quantity}</td>
                  <td className="py-3 pr-2 text-right">{formatTHB(item.unitPrice)}</td>
                  <td className="py-3 text-right font-medium">{formatTHB(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-4 flex justify-end">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">รวมรายการ</span>
                <span>{formatTHB(q.subtotal)}</span>
              </div>
              {q.discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>ส่วนลด</span>
                  <span>-{formatTHB(q.discount)}</span>
                </div>
              )}
              {q.includeVat && (
                <div className="flex justify-between">
                  <span className="text-slate-500">VAT 7%</span>
                  <span>{formatTHB(q.vat)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-200 pt-2 text-lg font-bold">
                <span>ยอดรวมสุทธิ</span>
                <span className="text-brand-700">{formatTHB(q.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          {q.notes && (
            <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm text-slate-700">
              <div className="mb-1 text-xs font-semibold text-blue-700">หมายเหตุ</div>
              <p className="whitespace-pre-line">{q.notes}</p>
            </div>
          )}
          {q.terms && (
            <div className="mt-4 text-xs text-slate-500">
              <div className="mb-1 font-semibold text-slate-700">เงื่อนไข</div>
              <p className="whitespace-pre-line">{q.terms}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
            สร้างโดย {s.name} · {s.url}
          </div>
        </div>
      </div>
    </div>
  );
}
