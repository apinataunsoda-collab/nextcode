import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "ตัวอย่างเว็บคลินิก | NxtCode Solution",
  robots: { index: false },
};

const SERVICES = [
  { name: "โบท็อกซ์ลดริ้วรอย", price: "เริ่มต้น ฿2,900", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=60" },
  { name: "ฟิลเลอร์ปรับรูปหน้า", price: "เริ่มต้น ฿5,900", img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=400&q=60" },
  { name: "เลเซอร์หน้าใส", price: "เริ่มต้น ฿1,500", img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=60" },
  { name: "ร้อยไหมยกกระชับ", price: "เริ่มต้น ฿9,900", img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=60" },
];

const REVIEWS = [
  { name: "คุณมิ้นท์", text: "หมอมือเบามาก ไม่เจ็บเลย ผลลัพธ์เป็นธรรมชาติ", rating: 5 },
  { name: "คุณเบล", text: "คลินิกสะอาด พนักงานดูแลดี อธิบายทุกขั้นตอน", rating: 5 },
  { name: "คุณแพร", text: "ทำเลเซอร์มา 3 ครั้ง หน้าใสขึ้นเห็นได้ชัด", rating: 5 },
];

export default function DemoClinicPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="text-xl font-bold text-pink-600">✨ Glow Clinic</div>
          <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
            <span className="cursor-pointer hover:text-slate-900">หน้าแรก</span>
            <span className="cursor-pointer hover:text-slate-900">บริการ</span>
            <span className="cursor-pointer hover:text-slate-900">โปรโมชั่น</span>
            <span className="cursor-pointer hover:text-slate-900">รีวิว</span>
            <span className="cursor-pointer hover:text-slate-900">นัดหมาย</span>
          </nav>
          <button className="rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-white">นัดหมายเลย</button>
        </div>
      </header>

      <section className="relative h-[450px] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=60" alt="Clinic" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-4">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">สวยมั่นใจ<br/>ในทุกมุมมอง</h1>
            <p className="mt-3 max-w-md text-white/80">คลินิกความงามมาตรฐาน โดยแพทย์ผู้เชี่ยวชาญ ปลอดภัย ผลลัพธ์เป็นธรรมชาติ</p>
            <button className="mt-6 rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-white">ดูบริการทั้งหมด</button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-slate-900">บริการของเรา</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <div key={s.name} className="group overflow-hidden rounded-2xl border border-slate-200 transition hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={s.img} alt={s.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">{s.name}</h3>
                  <p className="mt-1 text-sm font-medium text-pink-600">{s.price}</p>
                  <button className="mt-2 text-xs text-pink-600 hover:underline">นัดหมาย →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-pink-50 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-2xl font-bold text-slate-900">รีวิวจากลูกค้าจริง</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {REVIEWS.map((r) => (
              <div key={r.name} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="text-amber-400">{"★".repeat(r.rating)}</div>
                <p className="mt-2 text-sm text-slate-700">&ldquo;{r.text}&rdquo;</p>
                <p className="mt-3 text-xs font-semibold text-slate-900">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-lg px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900">นัดหมายออนไลน์</h2>
          <div className="mt-6 space-y-3">
            <input placeholder="ชื่อ-นามสกุล" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            <input placeholder="เบอร์โทร" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm">
              <option>เลือกบริการ</option>
              <option>โบท็อกซ์</option>
              <option>ฟิลเลอร์</option>
              <option>เลเซอร์</option>
              <option>ร้อยไหม</option>
            </select>
            <input type="date" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            <button className="w-full rounded-xl bg-pink-500 py-3 font-semibold text-white">นัดหมาย</button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-900 py-8 text-center text-sm text-slate-400">
        © 2026 Glow Clinic | Powered by NxtCode Solution
      </footer>
    </div>
  );
}
