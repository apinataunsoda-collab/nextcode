"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [tab, setTab] = useState<"site" | "admin">("site");

  // ดึง slug จาก path เช่น /demo/ecommerce → ecommerce
  const slug = pathname.split("/demo/")[1]?.split("/")[0] || "";

  return (
    <>
      {/* Demo banner */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-slate-900 px-4 py-2">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-sm text-white">
            <strong>ตัวอย่างเว็บไซต์</strong> — Prototype เพื่อให้เห็นภาพก่อนตัดสินใจ
          </span>
          <div className="flex gap-2">
            <Link
              href="/#catalog"
              className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20"
            >
              ← กลับแคตตาล็อก
            </Link>
            <Link
              href="/#contact"
              className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white hover:bg-brand-700"
            >
              สนใจแบบนี้? สั่งเลย
            </Link>
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="sticky top-[41px] z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-1 px-4 py-2">
          <button
            onClick={() => setTab("site")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === "site"
                ? "bg-brand-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            หน้าเว็บหลัก
          </button>
          <button
            onClick={() => setTab("admin")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === "admin"
                ? "bg-brand-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            หลังบ้าน (Admin)
          </button>
          <span className="ml-auto text-xs text-slate-400">
            /{slug}
          </span>
        </div>
      </div>

      {/* Content */}
      {tab === "site" ? (
        children
      ) : (
        <DemoAdmin slug={slug} />
      )}
    </>
  );
}

function DemoAdmin({ slug }: { slug: string }) {
  const adminData: Record<string, { orders: number; revenue: string; products: number }> = {
    ecommerce: { orders: 156, revenue: "฿248,500", products: 89 },
    restaurant: { orders: 84, revenue: "฿67,200", products: 32 },
    factory: { orders: 12, revenue: "฿1,450,000", products: 18 },
    clinic: { orders: 67, revenue: "฿385,000", products: 15 },
    "real-estate": { orders: 23, revenue: "฿8,900,000", products: 45 },
    portfolio: { orders: 34, revenue: "฿170,000", products: 12 },
  };

  const data = adminData[slug] || { orders: 42, revenue: "฿125,000", products: 20 };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-60 border-r border-slate-200 bg-white p-4 lg:block min-h-screen">
          <div className="mb-6 text-sm font-bold text-slate-900">📊 Admin Panel</div>
          <nav className="space-y-1 text-sm">
            {["Dashboard", "คำสั่งซื้อ", "สินค้า", "ลูกค้า", "รายงาน", "ตั้งค่า"].map((item, i) => (
              <div
                key={item}
                className={`rounded-lg px-3 py-2 ${
                  i === 0 ? "bg-brand-50 font-medium text-brand-700" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">ภาพรวมร้านค้าของคุณ</p>

          {/* Stats */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard label="คำสั่งซื้อเดือนนี้" value={String(data.orders)} color="blue" />
            <StatCard label="รายได้เดือนนี้" value={data.revenue} color="green" />
            <StatCard label="สินค้าในระบบ" value={String(data.products)} color="purple" />
          </div>

          {/* Recent orders */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">คำสั่งซื้อล่าสุด</h3>
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-slate-500">
                <tr>
                  <th className="pb-2">เลขที่</th>
                  <th className="pb-2">ลูกค้า</th>
                  <th className="pb-2">สถานะ</th>
                  <th className="pb-2 text-right">ยอด</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "#1089", name: "คุณสมชาย", status: "จัดส่งแล้ว", amount: "฿2,490", color: "green" },
                  { id: "#1088", name: "คุณนภา", status: "กำลังจัดส่ง", amount: "฿1,890", color: "blue" },
                  { id: "#1087", name: "คุณวิทย์", status: "รอชำระเงิน", amount: "฿3,280", color: "amber" },
                  { id: "#1086", name: "คุณแพร", status: "จัดส่งแล้ว", amount: "฿890", color: "green" },
                  { id: "#1085", name: "คุณเบล", status: "จัดส่งแล้ว", amount: "฿4,590", color: "green" },
                ].map((o) => (
                  <tr key={o.id} className="border-t border-slate-100">
                    <td className="py-3 font-mono text-xs">{o.id}</td>
                    <td className="py-3">{o.name}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium bg-${o.color}-100 text-${o.color}-700`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium">{o.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Chart placeholder */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">ยอดขายรายสัปดาห์</h3>
            <div className="flex h-40 items-end justify-between gap-2 px-4">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-lg bg-brand-500"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] text-slate-500">
                    {["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
    purple: "border-purple-200 bg-purple-50",
  };
  return (
    <div className={`rounded-2xl border p-5 ${colors[color] || ""}`}>
      <div className="text-sm text-slate-600">{label}</div>
      <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}
