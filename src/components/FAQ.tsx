"use client";

import { useState } from "react";

const faqs = [
  {
    q: "มีค่ารายปีไหม?",
    a: "ค่าทำเว็บจ่ายครั้งเดียว ส่วนค่าโดเมนและโฮสติ้งจะมีค่าต่ออายุรายปี (ประมาณ 1,200-2,500 บาท/ปี) ซึ่งเราจะแจ้งล่วงหน้าเสมอ",
  },
  {
    q: "แก้ไขเว็บเองได้ไหม?",
    a: "ได้ครับ เราจะสอนวิธีแก้ไขเนื้อหาพื้นฐาน เช่น เปลี่ยนรูป แก้ข้อความ เพิ่มเมนู ผ่านระบบจัดการที่ใช้งานง่าย",
  },
  {
    q: "จดโดเมนชื่ออะไรก็ได้ใช่ไหม?",
    a: "ได้ครับ ตราบใดที่ชื่อนั้นยังว่างอยู่ เราจะช่วยเช็คและแนะนำชื่อที่เหมาะกับ SEO ให้ด้วย",
  },
  {
    q: "ใช้เวลาทำนานแค่ไหน?",
    a: "แพ็กเกจมาตรฐานใช้เวลา 7-14 วันทำการ ขึ้นอยู่กับความซับซ้อนและความพร้อมของเนื้อหาจากลูกค้า",
  },
  {
    q: "ถ้าไม่พอใจงานทำอย่างไร?",
    a: "เราให้แก้ไขฟรี 2 รอบ ถ้ายังไม่พอใจสามารถคุยกับทีมงานเพื่อหาทางออกร่วมกัน เรามีนโยบายคืนเงินภายใน 7 วันหลังเริ่มงาน",
  },
  {
    q: "รองรับมือถือไหม?",
    a: "ทุกเว็บที่เราทำเป็น Responsive 100% ดูสวยทั้งบนมือถือ แท็บเล็ต และคอมพิวเตอร์",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-16">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">คำถามที่พบบ่อย</h2>
          <p className="section-subtitle">
            คำตอบสำหรับข้อสงสัยที่ลูกค้าถามเราบ่อยที่สุด
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white transition hover:border-brand-300"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-semibold text-slate-900">
                  {faq.q}
                </span>
                <span className="ml-4 text-xl text-slate-400">
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <div className="border-t border-slate-100 px-6 py-4 text-sm text-slate-600 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
