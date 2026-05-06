const steps = [
  {
    num: "1",
    title: "เลือกแพ็กเกจ",
    desc: "เลือกแบบเว็บที่ตรงกับธุรกิจของคุณ เพิ่มบริการเสริมได้ตามต้องการ",
  },
  {
    num: "2",
    title: "คุยรายละเอียด",
    desc: "ทีมงานโทรกลับภายใน 24 ชม. เพื่อเข้าใจธุรกิจและเป้าหมายของคุณ",
  },
  {
    num: "3",
    title: "ตรวจสอบงาน",
    desc: "ดูตัวอย่างเว็บก่อนเปิดใช้จริง แก้ไขได้ 2 รอบจนพอใจ",
  },
  {
    num: "4",
    title: "เว็บออนไลน์!",
    desc: "เว็บพร้อมใช้งาน ติดอันดับ Google ลูกค้าหาเจอได้ทันที",
  },
];

export default function ProcessSteps() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-brand-50/30">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">ขั้นตอนง่ายๆ แค่ 4 ขั้น</h2>
          <p className="section-subtitle">
            ไม่ต้องเตรียมอะไรมาก แค่บอกเราว่าธุรกิจคุณทำอะไร ที่เหลือเราจัดการให้
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.num}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 text-center transition hover:border-brand-300 hover:shadow-card"
            >
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-600 text-lg font-bold text-white">
                {s.num}
              </div>
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 text-2xl text-slate-300 lg:block">
                  →
                </div>
              )}
              <h3 className="mt-4 text-base font-semibold text-slate-900">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
