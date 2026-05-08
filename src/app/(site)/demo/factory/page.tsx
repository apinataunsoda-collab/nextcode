import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "ตัวอย่างเว็บโรงงาน B2B | NxtCode Solution",
  robots: { index: false },
};

const PRODUCTS = [
  { name: "กล่องกระดาษลูกฟูก 3 ชั้น", img: "https://images.unsplash.com/photo-1607166452427-7e4477c5e768?auto=format&fit=crop&w=400&q=60" },
  { name: "ถุงพลาสติก PE คุณภาพสูง", img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=400&q=60" },
  { name: "บรรจุภัณฑ์อาหาร Food Grade", img: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=400&q=60" },
  { name: "ฟิล์มยืดพันพาเลท", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=60" },
];

const CERTS = ["ISO 9001:2015", "ISO 14001", "GMP", "HACCP"];

export default function DemoFactoryPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="text-xl font-bold text-slate-900">🏭 Thai Pack Industries</div>
          <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
            <span className="cursor-pointer hover:text-slate-900">Home</span>
            <span className="cursor-pointer hover:text-slate-900">Products</span>
            <span className="cursor-pointer hover:text-slate-900">About Us</span>
            <span className="cursor-pointer hover:text-slate-900">Certifications</span>
            <span className="cursor-pointer hover:text-slate-900">Contact</span>
          </nav>
          <div className="flex gap-2 text-xs">
            <span className="rounded bg-slate-100 px-2 py-1 font-medium">TH</span>
            <span className="rounded bg-brand-600 px-2 py-1 font-medium text-white">EN</span>
          </div>
        </div>
      </header>

      <section className="relative h-[450px] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=60" alt="Factory" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-4">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">ผู้นำด้านบรรจุภัณฑ์<br/>ครบวงจร</h1>
            <p className="mt-3 max-w-lg text-white/80">กำลังการผลิต 10,000 ตัน/เดือน มาตรฐาน ISO ส่งออกทั่วอาเซียน</p>
            <div className="mt-6 flex gap-3">
              <button className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white">ขอใบเสนอราคา</button>
              <button className="rounded-full border border-white px-6 py-3 text-sm font-semibold text-white">ดูสินค้า</button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 px-4">
          {CERTS.map((c) => (
            <span key={c} className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700">{c}</span>
          ))}
          <span className="text-sm text-slate-500">| กำลังการผลิต 10,000 ตัน/เดือน</span>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-slate-900">สินค้าของเรา</h2>
          <p className="mt-2 text-center text-slate-600">บรรจุภัณฑ์คุณภาพสูง ตอบโจทย์ทุกอุตสาหกรรม</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((p) => (
              <div key={p.name} className="group overflow-hidden rounded-2xl border border-slate-200 transition hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <Image src={p.img} alt={p.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-slate-900">{p.name}</h3>
                  <button className="mt-2 text-xs text-brand-700 hover:underline">ขอใบเสนอราคา →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-12 text-white">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-2xl font-bold">ขอใบเสนอราคา (RFQ)</h2>
          <p className="mt-2 text-center text-white/70">กรอกข้อมูลเบื้องต้น ทีมขายจะติดต่อกลับภายใน 24 ชม.</p>
          <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
            <input placeholder="ชื่อบริษัท" className="rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none" />
            <input placeholder="ชื่อผู้ติดต่อ" className="rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none" />
            <input placeholder="อีเมล" className="rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none" />
            <input placeholder="เบอร์โทร" className="rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none" />
            <textarea placeholder="รายละเอียดสินค้าที่ต้องการ / จำนวน" rows={3} className="rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none sm:col-span-2" />
            <button className="rounded-xl bg-brand-600 py-3 font-semibold text-white sm:col-span-2">ส่งคำขอ</button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © 2026 Thai Pack Industries Co., Ltd. | Powered by NxtCode Solution
      </footer>
    </div>
  );
}
