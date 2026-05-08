import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "ตัวอย่างเว็บร้านอาหาร | NxtCode Solution",
  robots: { index: false },
};

const MENU_ITEMS = [
  { name: "ข้าวผัดปู", price: 180, img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=60", cat: "จานหลัก" },
  { name: "ต้มยำกุ้ง", price: 220, img: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&w=400&q=60", cat: "จานหลัก" },
  { name: "ส้มตำไทย", price: 89, img: "https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?auto=format&fit=crop&w=400&q=60", cat: "อาหารเรียกน้ำย่อย" },
  { name: "แกงเขียวหวาน", price: 160, img: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=400&q=60", cat: "จานหลัก" },
  { name: "ผัดไทยกุ้งสด", price: 150, img: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=400&q=60", cat: "จานหลัก" },
  { name: "มะม่วงข้าวเหนียว", price: 120, img: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=400&q=60", cat: "ของหวาน" },
];

export default function DemoRestaurantPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="text-xl font-bold text-slate-900">🍜 ครัวคุณแม่</div>
          <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
            <span className="cursor-pointer hover:text-slate-900">หน้าแรก</span>
            <span className="cursor-pointer hover:text-slate-900">เมนูอาหาร</span>
            <span className="cursor-pointer hover:text-slate-900">จองโต๊ะ</span>
            <span className="cursor-pointer hover:text-slate-900">ติดต่อเรา</span>
          </nav>
          <button className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
            จองโต๊ะ
          </button>
        </div>
      </header>

      <section className="relative h-[450px] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=60" alt="Restaurant" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">ครัวคุณแม่</h1>
            <p className="mt-3 text-lg text-white/80">อาหารไทยแท้ รสชาติต้นตำรับ ใจกลางเมือง</p>
            <div className="mt-6 flex justify-center gap-3">
              <button className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white">ดูเมนู</button>
              <button className="rounded-full border border-white px-6 py-3 text-sm font-semibold text-white">จองโต๊ะ</button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-slate-900">เมนูแนะนำ</h2>
          <p className="mt-2 text-center text-slate-600">คัดสรรวัตถุดิบสดใหม่ทุกวัน ปรุงสดใหม่ทุกจาน</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MENU_ITEMS.map((item) => (
              <div key={item.name} className="group overflow-hidden rounded-2xl border border-slate-200 transition hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={item.img} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-slate-700">{item.cat}</span>
                </div>
                <div className="flex items-center justify-between p-4">
                  <h3 className="font-semibold text-slate-900">{item.name}</h3>
                  <span className="text-lg font-bold text-orange-600">฿{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-orange-50 py-12">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900">จองโต๊ะออนไลน์</h2>
          <p className="mt-2 text-slate-600">เลือกวันเวลาที่สะดวก เราจัดเตรียมโต๊ะให้คุณ</p>
          <div className="mx-auto mt-6 grid max-w-md gap-3">
            <input placeholder="ชื่อ-นามสกุล" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            <input placeholder="เบอร์โทร" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <input type="date" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" />
              <input type="time" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            </div>
            <select className="rounded-xl border border-slate-200 px-4 py-3 text-sm">
              <option>จำนวนคน</option>
              <option>2 คน</option>
              <option>4 คน</option>
              <option>6 คน</option>
              <option>8+ คน</option>
            </select>
            <button className="rounded-xl bg-orange-500 py-3 font-semibold text-white">จองโต๊ะ</button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900">📍 แผนที่ & เวลาทำการ</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 aspect-video flex items-center justify-center text-slate-500">
              [Google Maps จะแสดงที่นี่]
            </div>
            <div className="text-left space-y-3">
              <p className="text-slate-700"><strong>ที่อยู่:</strong> 123 ถนนสุขุมวิท ซอย 55 กรุงเทพฯ</p>
              <p className="text-slate-700"><strong>เวลาทำการ:</strong> 10:00 - 22:00 (ทุกวัน)</p>
              <p className="text-slate-700"><strong>โทร:</strong> 02-123-4567</p>
              <p className="text-slate-700"><strong>LINE:</strong> @kruakunmae</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-900 py-8 text-center text-sm text-slate-400">
        © 2026 ครัวคุณแม่ | Powered by NxtCode Solution
      </footer>
    </div>
  );
}
