"use client";

import { useState } from "react";
import Link from "next/link";
import { formatTHB } from "@/lib/money";

type Quotation = {
  id: string;
  number: string;
  status: string;
  customerName: string;
  customerPhone: string;
  total: number;
  createdAt: string;
};

const STATUSES = [
  "DRAFT",
  "WAITING",
  "NEGOTIATING",
  "CONFIRMED",
  "LOST",
  "CANCELLED",
] as const;

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "ร่าง",
  WAITING: "รอการพิจารณา",
  NEGOTIATING: "กำลังเจรจา/แก้ไข",
  CONFIRMED: "ยืนยันการจ้าง",
  LOST: "ปิดการขายไม่ได้",
  CANCELLED: "ยกเลิกรายการ",
  // legacy values
  SENT: "ส่งแล้ว",
  ACCEPTED: "ลูกค้ายอมรับ",
  REJECTED: "ปฏิเสธ",
  EXPIRED: "หมดอายุ",
};

const STATUS_COLOR: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  WAITING: "bg-blue-100 text-blue-700",
  NEGOTIATING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-green-100 text-green-700",
  LOST: "bg-red-100 text-red-700",
  CANCELLED: "bg-slate-200 text-slate-600",
  SENT: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  EXPIRED: "bg-amber-100 text-amber-700",
};

export default function QuotationsTable({ initial }: { initial: Quotation[] }) {
  const [quotations, setQuotations] = useState(initial);

  const updateStatus = async (id: string, status: string) => {
    setQuotations((qs) =>
      qs.map((q) => (q.id === id ? { ...q, status } : q)),
    );
    await fetch(`/api/quotations/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  const remove = async (id: string) => {
    if (!confirm("ลบใบเสนอราคานี้?")) return;
    setQuotations((qs) => qs.filter((q) => q.id !== id));
    await fetch(`/api/quotations/${id}`, { method: "DELETE" });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">เลขที่</th>
            <th className="px-4 py-3">ลูกค้า</th>
            <th className="px-4 py-3">วันที่</th>
            <th className="px-4 py-3 text-right">ยอดรวม</th>
            <th className="px-4 py-3">สถานะ</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {quotations.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                ยังไม่มีใบเสนอราคา
              </td>
            </tr>
          )}
          {quotations.map((q) => (
            <tr key={q.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-mono text-xs">{q.number}</td>
              <td className="px-4 py-3">
                <div className="font-medium">{q.customerName}</div>
                <div className="text-xs text-slate-500">{q.customerPhone}</div>
              </td>
              <td className="px-4 py-3 text-slate-500">
                {new Date(q.createdAt).toLocaleDateString("th-TH")}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-brand-700">
                {formatTHB(q.total)}
              </td>
              <td className="px-4 py-3">
                <select
                  value={q.status}
                  onChange={(e) => updateStatus(q.id, e.target.value)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold outline-none ${STATUS_COLOR[q.status] ?? "bg-slate-100 text-slate-700"}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/quotation/${q.id}`}
                  target="_blank"
                  className="mr-3 text-xs text-brand-700 hover:underline"
                >
                  ดู ↗
                </Link>
                <button
                  onClick={() => remove(q.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
