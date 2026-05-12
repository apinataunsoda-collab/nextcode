import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "ตัวอย่างเว็บบริษัท Corporate | NxtCode Solution",
  robots: { index: false },
};

const SERVICES = [
  { icon: "💡", title: "ที่ปรึกษาธุรกิจ", desc: "วางแผนกลยุทธ์และพัฒนาธุรกิจให้เติบโตอย่างยั่งยืน" },
  { icon: "📊", title: "วิเคราะห์ข้อมูล", desc: "ใช้ Data Analytics ช่วยตัดสินใจทางธุรกิจอย่างแม่นยำ" },
  { icon: "🚀", title: "Digital Transformation", desc: "ปรับองค์กรสู่ดิจิทัลด้วยเทคโนโลยีที่เหมาะสม" },
  { icon: "🛡️", title: "Cybersecurity", desc: "ปกป้องข้อมูลและระบบขององค์กรจากภัยคุกคาม" },
];

const PROJECTS = [
  { title: "ระบบ ERP สำหรับโรงงาน", client: "Thai Manufacturing Co.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=60" },
  { title: "แอปจัดการคลังสินค้า", client: "Logistics Plus Ltd.", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=60" },
  { title: "เว็บไซต์ E-Commerce B2B", client: "Global Trade Corp.", img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=60" },
];

const TEAM = [
  { name: "คุณสมชาย วิสัยทัศน์", role: "CEO & Founder", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=60" },
  { name: "คุณนภา ดิจิทัล", role: "CTO", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=60" },
  { name: "คุณวิทย์ กลยุทธ์", role: "COO", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=60" },
  { name: "คุณแพร ครีเอทีฟ", role: "Creative Director", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=60" },
];

const STATS = [
  { num: "10+", label: "ปีประสบการณ์" },
  { num: "200+", label: "โปรเจกต์สำเร็จ" },
  { num: "50+", label: "ลูกค้าองค์กร" },
  { num: "98%", label: "ความพึงพอใจ" },
];

const CLIENTS = [
  "SCG", "PTT", "AIS", "TRUE", "KBANK", "BBL", "CP", "MINOR"
];

export default function DemoCorporatePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-[73px] z-30">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white font-bold">V</div>
            <span className="text-xl font-bold text-slate-900">Visionex</span>
          </div>
          <nav className="hidden gap-8 text-sm font-medium text-slate-600 md:flex">
            <span className="cursor-pointer hover:text-indigo-600">หน้าแรก</span>
            <span className="cursor-pointer hover:text-indigo-600">บริการ</span>
            <span className="cursor-pointer hover:text-indigo-600">ผลงาน</span>
            <span className="cursor-pointer hover:text-indigo-600">ทีมงาน</span>
            <span className="cursor-pointer hover:text-indigo-600">ติดต่อ</span>
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 cursor-pointer hover:text-indigo-600">TH | EN</span>
            <button className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">ติดต่อเรา</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 h-72 w-72 rounded-full bg-indigo-500 blur-[100px]" />
          <div className="absolute bottom-10 left-10 h-60 w-60 rounded-full bg-purple-500 blur-[80px]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
              ✦ Digital Solutions Partner
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-6xl">
              ขับเคลื่อนธุรกิจ<br/>
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">ด้วยเทคโนโลยี</span>
            </h1>
            <p className="mt-5 text-lg text-slate-300 leading-relaxed">
              เราคือพาร์ทเนอร์ด้านดิจิทัลที่ช่วยให้องค์กรของคุณเติบโตอย่างยั่งยืน
              ด้วยทีมผู้เชี่ยวชาญกว่า 10 ปี
            </p>
            <div className="mt-8 flex gap-4">
              <button className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700">
                ปรึกษาฟรี
              </button>
              <button className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                ดูผลงาน
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-indigo-600">{s.num}</div>
              <div className="mt-1 text-sm text-slate-600">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:items-center">
          <div>
            <span className="text-sm font-semibold text-indigo-600">เกี่ยวกับเรา</span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              มากกว่า 10 ปี ที่เราช่วยองค์กร<br/>เปลี่ยนผ่านสู่ดิจิทัล
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Visionex ก่อตั้งขึ้นด้วยความเชื่อว่าเทคโนโลยีที่ดีต้องเข้าถึงได้ง่าย
              เราทำงานร่วมกับองค์กรชั้นนำทั้งในและต่างประเทศ
              เพื่อสร้างโซลูชันที่ตอบโจทย์ธุรกิจจริง
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2"><span className="text-indigo-600">✓</span> ทีมงานมืออาชีพกว่า 30 คน</li>
              <li className="flex items-center gap-2"><span className="text-indigo-600">✓</span> ได้รับรางวัล Best Digital Agency 2025</li>
              <li className="flex items-center gap-2"><span className="text-indigo-600">✓</span> ISO 27001 Certified</li>
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=60" alt="Office" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <span className="text-sm font-semibold text-indigo-600">บริการของเรา</span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">โซลูชันครบวงจร</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-indigo-300 hover:shadow-lg">
                <span className="text-3xl">{s.icon}</span>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <span className="text-sm font-semibold text-indigo-600">ผลงาน</span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">โปรเจกต์ที่ภูมิใจ</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((p) => (
              <div key={p.title} className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 transition hover:shadow-lg">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={p.img} alt={p.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900">{p.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{p.client}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <span className="text-sm font-semibold text-indigo-600">ทีมงาน</span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">ผู้เชี่ยวชาญของเรา</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((t) => (
              <div key={t.name} className="text-center">
                <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg">
                  <Image src={t.img} alt={t.name} fill className="object-cover" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{t.name}</h3>
                <p className="text-sm text-indigo-600">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-sm text-slate-500">ได้รับความไว้วางใจจากองค์กรชั้นนำ</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8">
            {CLIENTS.map((c) => (
              <span key={c} className="text-2xl font-bold text-slate-300">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold">พร้อมเริ่มต้นโปรเจกต์?</h2>
            <p className="mt-2 text-white/80">ติดต่อเราวันนี้ รับคำปรึกษาฟรี</p>
          </div>
          <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
            <input placeholder="ชื่อ-นามสกุล" className="rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none backdrop-blur" />
            <input placeholder="บริษัท" className="rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none backdrop-blur" />
            <input placeholder="อีเมล" className="rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none backdrop-blur" />
            <input placeholder="เบอร์โทร" className="rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none backdrop-blur" />
            <textarea placeholder="รายละเอียดโปรเจกต์" rows={3} className="rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none backdrop-blur sm:col-span-2" />
            <button className="rounded-xl bg-white py-3 font-semibold text-indigo-700 transition hover:bg-indigo-50 sm:col-span-2">
              ส่งข้อมูล
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 py-10 text-slate-400">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white text-sm font-bold">V</div>
              <span className="text-lg font-bold text-white">Visionex</span>
            </div>
            <p className="mt-3 text-sm">ขับเคลื่อนธุรกิจด้วยเทคโนโลยี</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">บริการ</h4>
            <ul className="mt-3 space-y-1 text-sm">
              <li>ที่ปรึกษาธุรกิจ</li>
              <li>วิเคราะห์ข้อมูล</li>
              <li>Digital Transformation</li>
              <li>Cybersecurity</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">บริษัท</h4>
            <ul className="mt-3 space-y-1 text-sm">
              <li>เกี่ยวกับเรา</li>
              <li>ทีมงาน</li>
              <li>ร่วมงานกับเรา</li>
              <li>ข่าวสาร</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">ติดต่อ</h4>
            <ul className="mt-3 space-y-1 text-sm">
              <li>📍 อาคาร One City Centre ชั้น 15</li>
              <li>📞 02-123-4567</li>
              <li>📧 hello@visionex.co.th</li>
              <li>LINE: @visionex</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-6xl border-t border-slate-800 px-4 pt-6 text-center text-xs">
          © 2026 Visionex Co., Ltd. All rights reserved. | Powered by NxtCode Solution
        </div>
      </footer>
    </div>
  );
}
