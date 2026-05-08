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
  const configs: Record<string, { title: string; stats: { label: string; value: string; color: string }[]; tableTitle: string; columns: string[]; rows: string[][] }> = {
    ecommerce: {
      title: "E-Commerce Dashboard",
      stats: [
        { label: "คำสั่งซื้อเดือนนี้", value: "156", color: "blue" },
        { label: "รายได้เดือนนี้", value: "฿248,500", color: "green" },
        { label: "สินค้าในระบบ", value: "89", color: "purple" },
      ],
      tableTitle: "คำสั่งซื้อล่าสุด",
      columns: ["เลขที่", "ลูกค้า", "สถานะ", "ยอด"],
      rows: [
        ["#1089", "คุณสมชาย", "จัดส่งแล้ว", "฿2,490"],
        ["#1088", "คุณนภา", "กำลังจัดส่ง", "฿1,890"],
        ["#1087", "คุณวิทย์", "รอชำระเงิน", "฿3,280"],
        ["#1086", "คุณแพร", "จัดส่งแล้ว", "฿890"],
        ["#1085", "คุณเบล", "จัดส่งแล้ว", "฿4,590"],
      ],
    },
    restaurant: {
      title: "ระบบจัดการร้านอาหาร",
      stats: [
        { label: "จองโต๊ะวันนี้", value: "12", color: "blue" },
        { label: "จองสัปดาห์นี้", value: "47", color: "green" },
        { label: "โต๊ะว่าง", value: "8/20", color: "purple" },
      ],
      tableTitle: "รายการจองโต๊ะวันนี้",
      columns: ["เวลา", "ชื่อ", "จำนวนคน", "สถานะ"],
      rows: [
        ["11:30", "คุณสมชาย", "4 คน", "ยืนยันแล้ว"],
        ["12:00", "คุณนภา", "2 คน", "ยืนยันแล้ว"],
        ["12:30", "คุณวิทย์", "6 คน", "รอยืนยัน"],
        ["18:00", "คุณแพร", "4 คน", "ยืนยันแล้ว"],
        ["18:30", "คุณเบล", "8 คน", "รอยืนยัน"],
        ["19:00", "คุณมิ้นท์", "2 คน", "ยืนยันแล้ว"],
      ],
    },
    factory: {
      title: "ระบบจัดการเว็บโรงงาน",
      stats: [
        { label: "ผู้เข้าชมเดือนนี้", value: "3,842", color: "blue" },
        { label: "ผู้ติดต่อเข้ามา", value: "28", color: "green" },
        { label: "ใบเสนอราคาที่ส่ง", value: "15", color: "purple" },
      ],
      tableTitle: "ผู้ติดต่อเข้ามาล่าสุด (RFQ)",
      columns: ["วันที่", "บริษัท", "สินค้าที่สนใจ", "สถานะ"],
      rows: [
        ["7 พ.ค.", "ABC Trading Co.", "กล่องลูกฟูก 3 ชั้น", "ส่งใบเสนอราคาแล้ว"],
        ["6 พ.ค.", "XYZ Import", "ฟิล์มยืดพันพาเลท", "รอติดต่อกลับ"],
        ["5 พ.ค.", "Thai Foods Ltd.", "บรรจุภัณฑ์ Food Grade", "ปิดการขาย"],
        ["4 พ.ค.", "Global Pack", "ถุง PE คุณภาพสูง", "รอติดต่อกลับ"],
        ["3 พ.ค.", "Fresh Mart", "กล่องกระดาษ", "ส่งใบเสนอราคาแล้ว"],
      ],
    },
    clinic: {
      title: "ระบบจัดการคลินิก",
      stats: [
        { label: "นัดหมายวันนี้", value: "18", color: "blue" },
        { label: "นัดหมายสัปดาห์นี้", value: "72", color: "green" },
        { label: "คนไข้ทั้งหมด", value: "1,245", color: "purple" },
      ],
      tableTitle: "คิวนัดหมายวันนี้",
      columns: ["เวลา", "ชื่อ", "บริการ", "แพทย์"],
      rows: [
        ["09:00", "คุณมิ้นท์", "โบท็อกซ์ลดริ้วรอย", "พญ.นภา"],
        ["09:30", "คุณเบล", "เลเซอร์หน้าใส", "นพ.วิทย์"],
        ["10:00", "คุณแพร", "ฟิลเลอร์ปรับรูปหน้า", "พญ.นภา"],
        ["10:30", "คุณสมชาย", "ร้อยไหมยกกระชับ", "นพ.วิทย์"],
        ["11:00", "คุณนิด", "เลเซอร์หน้าใส", "พญ.นภา"],
        ["11:30", "คุณฝน", "โบท็อกซ์ลดริ้วรอย", "นพ.วิทย์"],
      ],
    },
    "real-estate": {
      title: "ระบบจัดการอสังหาริมทรัพย์",
      stats: [
        { label: "ยูนิตที่เปิดขาย", value: "45", color: "blue" },
        { label: "นัดชมเดือนนี้", value: "34", color: "green" },
        { label: "ปิดการขาย", value: "12", color: "purple" },
      ],
      tableTitle: "นัดชมโครงการล่าสุด",
      columns: ["วันที่", "ชื่อ", "ยูนิตที่สนใจ", "สถานะ"],
      rows: [
        ["8 พ.ค.", "คุณสมชาย", "2 Bed ชั้น 18", "นัดชมแล้ว"],
        ["8 พ.ค.", "คุณนภา", "Studio ชั้น 8", "รอติดต่อ"],
        ["7 พ.ค.", "คุณวิทย์", "Penthouse ชั้น 30", "ทำสัญญาแล้ว"],
        ["7 พ.ค.", "คุณแพร", "1 Bed ชั้น 12", "นัดชมแล้ว"],
        ["6 พ.ค.", "คุณเบล", "2 Bed ชั้น 22", "รอติดต่อ"],
      ],
    },
    portfolio: {
      title: "ระบบจัดการ Portfolio",
      stats: [
        { label: "ผู้เข้าชมเดือนนี้", value: "2,156", color: "blue" },
        { label: "คนที่ติดต่อเข้ามา", value: "14", color: "green" },
        { label: "โปรเจกต์ทั้งหมด", value: "12", color: "purple" },
      ],
      tableTitle: "ข้อความที่ติดต่อเข้ามา",
      columns: ["วันที่", "ชื่อ", "อีเมล", "เรื่อง"],
      rows: [
        ["7 พ.ค.", "John Smith", "john@agency.com", "Brand Identity Project"],
        ["6 พ.ค.", "คุณนภา", "napa@startup.co", "ออกแบบ App UI"],
        ["5 พ.ค.", "Mike Chen", "mike@corp.com", "Website Redesign"],
        ["4 พ.ค.", "คุณสมชาย", "somchai@biz.th", "ถ่ายภาพสินค้า"],
        ["3 พ.ค.", "Sarah Lee", "sarah@brand.io", "Social Media Campaign"],
      ],
    },
  };

  const config = configs[slug] || configs.ecommerce;

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
          <h1 className="text-2xl font-bold text-slate-900">{config.title}</h1>
          <p className="mt-1 text-sm text-slate-500">ภาพรวมระบบหลังบ้าน</p>

          {/* Stats */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {config.stats.map((s) => (
              <StatCard key={s.label} label={s.label} value={s.value} color={s.color} />
            ))}
          </div>

          {/* Table */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">{config.tableTitle}</h3>
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-slate-500">
                <tr>
                  {config.columns.map((col) => (
                    <th key={col} className="pb-2">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {config.rows.map((row, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    {row.map((cell, j) => (
                      <td key={j} className="py-3">
                        {j === config.columns.length - 1 ? (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                            {cell}
                          </span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Chart placeholder */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">สถิติรายสัปดาห์</h3>
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
