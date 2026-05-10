import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">บทความ / บล็อก</h1>
          <p className="mt-1 text-sm text-slate-500">เขียนบทความ SEO เพื่อดึงลูกค้าจาก Google</p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary">+ เขียนบทความ</Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">หัวข้อ</th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-4 py-3">วันที่</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-slate-500">ยังไม่มีบทความ</td></tr>
            )}
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{p.title}</div>
                  <div className="text-xs text-slate-500">/{p.slug}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                    {p.status === "PUBLISHED" ? "เผยแพร่" : "ร่าง"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("th-TH") : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/blog/${p.id}`} className="text-xs text-brand-700 hover:underline">แก้ไข</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
