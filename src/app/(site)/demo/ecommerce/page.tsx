import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "ตัวอย่างเว็บ E-Commerce | NxtCode Solution",
  description: "Prototype เว็บขายของออนไลน์ ตะกร้าสินค้า ชำระเงิน ระบบจัดส่ง",
  robots: { index: false },
};

// ข้อมูล demo
const STORE = {
  name: "BreezyShop",
  tagline: "แฟชั่นออนไลน์ สไตล์ที่เป็นคุณ",
  banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=60",
  categories: ["เสื้อผ้าผู้หญิง", "เสื้อผ้าผู้ชาย", "กระเป๋า", "รองเท้า", "เครื่องประดับ"],
};

const PRODUCTS = [
  { id: 1, name: "เดรสลายดอก Summer Bloom", price: 890, oldPrice: 1290, img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=60", badge: "ขายดี" },
  { id: 2, name: "กางเกงยีนส์ Slim Fit", price: 1290, oldPrice: null, img: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=60", badge: null },
  { id: 3, name: "กระเป๋าสะพาย Mini Tote", price: 690, oldPrice: 990, img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=60", badge: "ลด 30%" },
  { id: 4, name: "รองเท้าผ้าใบ Urban Walk", price: 1590, oldPrice: null, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=60", badge: "ใหม่" },
  { id: 5, name: "สร้อยคอ Minimal Chain", price: 390, oldPrice: 590, img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=60", badge: null },
  { id: 6, name: "เสื้อยืด Oversized Basic", price: 490, oldPrice: null, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=60", badge: "ขายดี" },
  { id: 7, name: "กระโปรงพลีท Pastel", price: 790, oldPrice: 1090, img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=60", badge: null },
  { id: 8, name: "แว่นกันแดด Retro Round", price: 590, oldPrice: null, img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=60", badge: "ใหม่" },
];

const FEATURES = [
  { icon: "🚚", title: "ส่งฟรีทั่วไทย", desc: "สั่งขั้นต่ำ 500 บาท" },
  { icon: "🔄", title: "เปลี่ยน/คืนได้ 7 วัน", desc: "ไม่พอใจคืนได้เลย" },
  { icon: "💳", title: "ชำระเงินหลายช่องทาง", desc: "บัตร / PromptPay / COD" },
  { icon: "📦", title: "จัดส่งภายใน 1-3 วัน", desc: "Flash / Kerry / SPX" },
];

export default function DemoEcommercePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="text-xl font-bold text-slate-900">
            🛍️ {STORE.name}
          </div>
          <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
            <span className="cursor-pointer hover:text-slate-900">หน้าแรก</span>
            <span className="cursor-pointer hover:text-slate-900">สินค้าทั้งหมด</span>
            <span className="cursor-pointer hover:text-slate-900">โปรโมชั่น</span>
            <span className="cursor-pointer hover:text-slate-900">ติดต่อเรา</span>
          </nav>
          <div className="flex items-center gap-4 text-sm">
            <span className="cursor-pointer text-slate-600 hover:text-slate-900">🔍</span>
            <span className="cursor-pointer text-slate-600 hover:text-slate-900">👤</span>
            <span className="relative cursor-pointer text-slate-600 hover:text-slate-900">
              🛒
              <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] text-white">
                3
              </span>
            </span>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative h-[400px] overflow-hidden sm:h-[500px]">
        <Image
          src={STORE.banner}
          alt="Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-4">
            <span className="inline-block rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
              🔥 SALE สูงสุด 50%
            </span>
            <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
              {STORE.tagline}
            </h1>
            <p className="mt-3 max-w-md text-white/80">
              คอลเลกชันใหม่ประจำซีซั่น พร้อมส่งฟรีทั่วไทย
            </p>
            <button className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100">
              ช้อปเลย →
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-slate-100 bg-slate-50 py-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 sm:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <div className="text-sm font-semibold text-slate-900">{f.title}</div>
                <div className="text-xs text-slate-500">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              ทั้งหมด
            </span>
            {STORE.categories.map((c) => (
              <span
                key={c}
                className="cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:border-slate-900"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">สินค้าแนะนำ</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {PRODUCTS.map((p) => (
              <div
                key={p.id}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <Image
                    src={p.img}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  {p.badge && (
                    <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                      {p.badge}
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 translate-y-full bg-slate-900/80 py-3 text-center text-sm font-medium text-white transition duration-300 group-hover:translate-y-0">
                    + เพิ่มลงตะกร้า
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-slate-900 line-clamp-1">
                    {p.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-bold text-red-600">
                      ฿{p.price.toLocaleString()}
                    </span>
                    {p.oldPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        ฿{p.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button className="rounded-full border border-slate-300 px-8 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900">
              ดูสินค้าทั้งหมด →
            </button>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 py-12 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl font-bold">สมัครสมาชิกรับส่วนลด 10%</h2>
          <p className="mt-2 text-white/80">รับโค้ดส่วนลดทันทีเมื่อสมัครรับข่าวสาร</p>
          <div className="mx-auto mt-6 flex max-w-md gap-2">
            <input
              type="email"
              placeholder="กรอกอีเมลของคุณ"
              className="flex-1 rounded-full bg-white/20 px-5 py-3 text-sm text-white placeholder-white/60 outline-none backdrop-blur"
            />
            <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50">
              สมัคร
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-10">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-4">
          <div>
            <div className="text-lg font-bold text-slate-900">🛍️ {STORE.name}</div>
            <p className="mt-2 text-sm text-slate-600">{STORE.tagline}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">ช้อปปิ้ง</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>สินค้าทั้งหมด</li>
              <li>สินค้าใหม่</li>
              <li>โปรโมชั่น</li>
              <li>สินค้าขายดี</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">ช่วยเหลือ</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>วิธีสั่งซื้อ</li>
              <li>การชำระเงิน</li>
              <li>การจัดส่ง</li>
              <li>นโยบายคืนสินค้า</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">ติดต่อเรา</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>📞 081-234-5678</li>
              <li>📧 hello@breezyshop.com</li>
              <li>LINE: @breezyshop</li>
            </ul>
            <div className="mt-3 flex gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-xs">f</span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-xs">ig</span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-xs">tt</span>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-6xl border-t border-slate-200 px-4 pt-6 text-center text-xs text-slate-500">
          © 2026 {STORE.name}. All rights reserved. | Powered by NxtCode Solution
        </div>
      </footer>
    </div>
  );
}
