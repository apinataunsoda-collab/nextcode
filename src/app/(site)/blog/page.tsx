import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "บทความ | NxtCode Solution",
  description: "บทความเกี่ยวกับการทำเว็บไซต์ SEO การตลาดออนไลน์ และเทคโนโลยี",
};

export default async function BlogListPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <section className="py-16">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="section-title">บทความ & ความรู้</h1>
          <p className="section-subtitle">เคล็ดลับทำเว็บไซต์ให้ขายดี ติดอันดับ Google</p>
        </div>

        {posts.length === 0 ? (
          <p className="mt-12 text-center text-slate-500">ยังไม่มีบทความ — กำลังเตรียมเนื้อหาดีๆ ให้คุณ</p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-card"
              >
                {p.coverImage && (
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                    <Image
                      src={p.coverImage}
                      alt={p.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-brand-700">
                    {p.title}
                  </h2>
                  {p.excerpt && (
                    <p className="mt-2 text-sm text-slate-600 line-clamp-2">{p.excerpt}</p>
                  )}
                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                    {p.author && <span>{p.author}</span>}
                    {p.publishedAt && (
                      <span>{new Date(p.publishedAt).toLocaleDateString("th-TH")}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
