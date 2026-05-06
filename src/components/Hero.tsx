import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white"
    >
      <div className="container-page grid gap-10 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3 py-1 text-xs font-semibold text-brand-700">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            เสร็จไวใน 7 วัน
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            ทำเว็บให้ธุรกิจ
            <span className="text-brand-600"> หาเจอง่าย</span>บน Google
            <br />
            <span className="text-2xl sm:text-3xl text-slate-600 font-semibold">
              เริ่มต้นเพียง 4,900.-
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-600 sm:text-lg leading-relaxed">
            เบื่อไหม? จ้างทำเว็บแล้วเงียบหาย หาใน Google ไม่เจอ...
            เราช่วยให้เว็บของคุณ<strong className="text-slate-800">ทำงานได้จริง ขายของได้จริง</strong>{" "}
            ด้วยโครงสร้างที่ Google ชอบ และเนื้อหาที่ดึงดูดลูกค้า
          </p>
          <p className="mt-3 text-sm text-slate-500">
            ใช้เทคโนโลยี AI ช่วยวิเคราะห์คีย์เวิร์ดให้เว็บติดหน้าแรกได้เร็วขึ้น
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#catalog" className="btn-primary">
              ดูแพ็กเกจทั้งหมด
            </Link>
            <Link href="#contact" className="btn-ghost">
              รับคำปรึกษาฟรี
            </Link>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
            {[
              { k: "200+", v: "เว็บที่ส่งมอบ" },
              { k: "4.9/5", v: "คะแนนรีวิว" },
              { k: "7 วัน", v: "เริ่มใช้งานได้" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="text-2xl font-bold text-slate-900">{s.k}</dt>
                <dd className="text-xs text-slate-500">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-brand-200/40 blur-3xl" />
          <div className="overflow-hidden rounded-3xl border border-white/60 bg-white shadow-card">
            <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-slate-400">
                yourwebsite.com
              </span>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              {[
                "🔥 โหลดเร็ว 0.8s",
                "📱 ดูสวยทุกหน้าจอ",
                "🔎 ติดหน้าแรก Google",
                "🤖 AI ช่วยเขียนเนื้อหา",
              ].map((t) => (
                <div
                  key={t}
                  className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-700"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
