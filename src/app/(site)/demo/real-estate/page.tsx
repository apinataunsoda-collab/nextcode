import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "ตัวอย่างเว็บอสังหาริมทรัพย์ | NxtCode Solution",
  robots: { index: false },
};

const UNITS = [
  { name: "1 Bed 35 ตร.ม.", price: "3.29 ล้าน", floor: "ชั้น 12", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=60", status: "ว่าง" },
  { name: "2 Bed 55 ตร.ม.", price: "5.19 ล้าน", floor: "ชั้น 18", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=60", status: "ว่าง" },
  { name: "Studio 28 ตร.ม.", price: "2.49 ล้าน", floor: "ชั้น 8", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=60", status: "จอง" },
  { name: "Penthouse 120 ตร.ม.", price: "12.9 ล้าน", floor: "ชั้น 30", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=60", status: "ว่าง" },
];

export default function DemoRealEstatePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="text-xl font-bold text-slate-900">🏢 The Skyline Residence</div>
          <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
            <span className="cursor-pointer hover:text-slate-900">ภาพรวม</span>
            <span className="cursor-pointer hover:text-slate-900">ยูนิต</span>
            <span className="cursor-pointer hover:text-slate-900">สิ่งอำนวยความสะดวก</span>
            <span className="cursor-pointer hover:text-slate-900">ทำเล</span>
            <span className="cursor-pointer hover:text-slate-900">นัดชม</span>
          </nav>
          <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">นัดชมโครงการ</button>
        </div>
      </header>

      <section className="relative h-[500px] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=60" alt="Condo" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8">
          <div className="mx-auto max-w-6xl">
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">เปิดจองแล้ว</span>
            <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">The Skyline Residence</h1>
            <p className="mt-2 text-white/80">คอนโดหรูใจกลางสุขุมวิท เริ่มต้น 2.49 ล้าน</p>
            <div className="mt-4 flex gap-3">
              <button className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white">ดูยูนิตทั้งหมด</button>
              <button className="rounded-full border border-white px-6 py-3 text-sm font-semibold text-white">นัดชมห้องตัวอย่าง</button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-slate-900">ยูนิตที่เปิดขาย</h2>
          <div className="mt-4 flex justify-center gap-2">
            <span className="rounded-full bg-slate-900 px-4 py-1.5 text-sm text-white">ทั้งหมด</span>
            <span className="rounded-full border border-slate-200 px-4 py-1.5 text-sm">Studio</span>
            <span className="rounded-full border border-slate-200 px-4 py-1.5 text-sm">1 Bed</span>
            <span className="rounded-full border border-slate-200 px-4 py-1.5 text-sm">2 Bed</span>
            <span className="rounded-full border border-slate-200 px-4 py-1.5 text-sm">Penthouse</span>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {UNITS.map((u) => (
              <div key={u.name} className="group overflow-hidden rounded-2xl border border-slate-200 transition hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={u.img} alt={u.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
                  <span className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-semibold text-white ${u.status === "ว่าง" ? "bg-emerald-500" : "bg-amber-500"}`}>{u.status}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">{u.name}</h3>
                  <p className="text-xs text-slate-500">{u.floor}</p>
                  <p className="mt-1 text-lg font-bold text-emerald-700">{u.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-emerald-50 py-12">
        <div className="mx-auto max-w-lg px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900">นัดชมโครงการ</h2>
          <div className="mt-6 space-y-3">
            <input placeholder="ชื่อ-นามสกุล" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            <input placeholder="เบอร์โทร" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            <input type="date" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            <button className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white">นัดชม</button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-900 py-8 text-center text-sm text-slate-400">
        © 2026 The Skyline Residence | Powered by NxtCode Solution
      </footer>
    </div>
  );
}
