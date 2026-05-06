import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";
import ThankYouTracker from "@/components/ThankYouTracker";

export const metadata: Metadata = {
  title: "ขอบคุณที่สนใจ เราจะติดต่อกลับโดยเร็วที่สุด",
  description: "ขอบคุณที่ไว้วางใจ ทีมงานจะติดต่อกลับภายใน 1 วันทำการ",
  robots: { index: false, follow: true },
  alternates: { canonical: "/thank-you" },
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams?: {
    id?: string;
    total?: string;
    product?: string;
    productName?: string;
  };
}) {
  const leadId = searchParams?.id;
  const totalNum = Number(searchParams?.total || 0);
  const productSlug = searchParams?.product;
  const productName = searchParams?.productName;
  const s = await getSiteSettings();

  const callNumber = s.mobile || s.phone;

  return (
    <section className="grid min-h-[70vh] place-items-center bg-gradient-to-b from-brand-50 to-white px-4 py-16">
      <Suspense fallback={null}>
        <ThankYouTracker
          leadId={leadId}
          totalPrice={totalNum}
          productSlug={productSlug}
          productName={productName}
        />
      </Suspense>

      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-100 text-4xl">
          ✅
        </div>
        <h1 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">
          ขอบคุณที่สนใจ เราจะติดต่อกลับโดยเร็วที่สุด
        </h1>
        <p className="mt-3 text-slate-600">
          ทีมงานจะติดต่อกลับทางเบอร์โทรที่คุณให้ไว้ภายใน 1 วันทำการ
          {productName && (
            <>
              <br />
              สำหรับแพ็กเกจ <span className="font-semibold">{productName}</span>
            </>
          )}
        </p>

        {leadId && (
          <p className="mt-2 text-sm text-slate-400">
            หมายเลขอ้างอิง: <code>{leadId}</code>
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {callNumber && (
            <a href={`tel:${callNumber}`} className="btn-primary">
              📞 โทรหาเราเลย {callNumber}
            </a>
          )}
          <Link href="/#catalog" className="btn-ghost">
            ดูแพ็กเกจอื่น
          </Link>
          <Link href="/" className="text-sm text-slate-500 hover:text-brand-700">
            กลับหน้าแรก
          </Link>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 text-left text-sm text-slate-600">
          <p className="font-semibold text-slate-800">ระหว่างรอเราติดต่อกลับ…</p>
          <ul className="mt-2 space-y-1 text-slate-500">
            {s.lineId && (
              <li>
                • เพิ่ม LINE: <span className="font-medium">{s.lineId}</span>
              </li>
            )}
            {s.email && (
              <li>
                • อีเมล: <span className="font-medium">{s.email}</span>
              </li>
            )}
            <li>• ตามผลงานล่าสุดที่ Social ของเรา</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
