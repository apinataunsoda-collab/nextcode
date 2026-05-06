const testimonials = [
  {
    name: "คุณสมชาย",
    biz: "ร้านอาหารญี่ปุ่น",
    text: "ทำเว็บเสร็จไว ลูกค้าจองโต๊ะผ่านเว็บเพิ่มขึ้น 40% ภายในเดือนแรก",
    rating: 5,
  },
  {
    name: "คุณนภา",
    biz: "คลินิกความงาม",
    text: "เว็บสวยมาก ลูกค้าหาเจอใน Google ได้เลย ไม่ต้องพึ่งโฆษณาอย่างเดียว",
    rating: 5,
  },
  {
    name: "คุณวิทย์",
    biz: "โรงงานผลิตบรรจุภัณฑ์",
    text: "ได้ลูกค้า B2B จากต่างประเทศผ่านเว็บ เพราะมีระบบ 2 ภาษาและ SEO ดี",
    rating: 5,
  },
];

export default function SocialProof() {
  return (
    <section className="py-16">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">ลูกค้าของเราพูดอะไร</h2>
          <p className="section-subtitle">
            กว่า 200 ธุรกิจที่ไว้วางใจให้เราดูแลเว็บไซต์
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-card"
            >
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-4 border-t border-slate-100 pt-3">
                <div className="text-sm font-semibold text-slate-900">
                  {t.name}
                </div>
                <div className="text-xs text-slate-500">{t.biz}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
