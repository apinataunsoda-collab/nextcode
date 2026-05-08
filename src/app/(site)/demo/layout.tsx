import Link from "next/link";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Demo banner */}
      <div className="sticky top-0 z-50 flex items-center justify-between bg-slate-900 px-4 py-2 text-sm text-white">
        <span>
          🎨 <strong>ตัวอย่างเว็บไซต์</strong> — นี่คือ Prototype เพื่อให้คุณเห็นภาพก่อนตัดสินใจ
        </span>
        <div className="flex gap-3">
          <Link
            href="/#catalog"
            className="rounded-full bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
          >
            ← กลับแคตตาล็อก
          </Link>
          <Link
            href="/#contact"
            className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold hover:bg-brand-700"
          >
            สนใจแบบนี้? สั่งเลย
          </Link>
        </div>
      </div>
      {children}
    </>
  );
}
