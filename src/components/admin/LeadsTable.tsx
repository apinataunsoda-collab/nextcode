"use client";

import { useState, useMemo } from "react";
import { formatTHB } from "@/lib/money";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  status: string;
  totalPrice: number;
  createdAt: string;
  product: { id: string; name: string; slug: string } | null;
  addOns: { label: string; priceAtTime: number }[];
};

const STATUSES = ["NEW", "CONTACTED", "QUOTED", "WON", "LOST"] as const;
const STATUS_LABEL: Record<string, string> = {
  NEW: "ใหม่",
  CONTACTED: "ติดต่อแล้ว",
  QUOTED: "เสนอราคาแล้ว",
  WON: "ปิดการขาย",
  LOST: "ไม่สนใจ",
};
const STATUS_COLOR: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-amber-100 text-amber-700",
  QUOTED: "bg-purple-100 text-purple-700",
  WON: "bg-green-100 text-green-700",
  LOST: "bg-slate-200 text-slate-600",
};

export default function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (filter !== "ALL" && l.status !== filter) return false;
      if (!q) return true;
      const hay = `${l.name} ${l.phone} ${l.email ?? ""} ${l.product?.name ?? ""}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [leads, q, filter]);

  const updateStatus = async (id: string, status: string) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  const remove = async (id: string) => {
    if (!confirm("ลบ Lead นี้?")) return;
    setLeads((ls) => ls.filter((l) => l.id !== id));
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ค้นหาชื่อ / เบอร์ / อีเมล"
          className="w-full flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-brand-500"
        >
          <option value="ALL">ทุกสถานะ</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">เวลา</th>
              <th className="px-4 py-3">ชื่อ</th>
              <th className="px-4 py-3">เบอร์</th>
              <th className="px-4 py-3">สินค้าที่สนใจ</th>
              <th className="px-4 py-3">Add-ons</th>
              <th className="px-4 py-3 text-right">ยอดรวม</th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
            {filtered.map((l) => (
              <>
                <tr key={l.id} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(l.createdAt).toLocaleString("th-TH")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{l.name}</div>
                    {l.email && <div className="text-xs text-slate-500">{l.email}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <a href={`tel:${l.phone}`} className="hover:text-brand-700">
                      {l.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3">{l.product?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    {l.addOns.length ? (
                      <ul className="space-y-0.5 text-xs">
                        {l.addOns.map((a, i) => (
                          <li key={i} className="text-slate-600">
                            • {a.label}{" "}
                            <span className="text-slate-400">({formatTHB(a.priceAtTime)})</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-brand-700">
                    {formatTHB(l.totalPrice)}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={l.status}
                      onChange={(e) => updateStatus(l.id, e.target.value)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOR[l.status] ?? ""}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setExpanded(expanded === l.id ? null : l.id)}
                      className="mr-2 text-xs text-brand-700 hover:underline"
                    >
                      {expanded === l.id ? "ซ่อน" : "ดูข้อความ"}
                    </button>
                    <a
                      href={`/admin/quotations/new?leadId=${l.id}`}
                      className="mr-2 text-xs text-green-700 hover:underline"
                    >
                      ออกใบเสนอราคา
                    </a>
                    <button
                      onClick={() => remove(l.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
                {expanded === l.id && (
                  <tr className="bg-slate-50">
                    <td colSpan={8} className="px-6 py-4 text-sm text-slate-700">
                      <p className="whitespace-pre-line">{l.message || "— ไม่มีข้อความ —"}</p>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
