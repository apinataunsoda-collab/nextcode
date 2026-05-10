import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import JsonLd from "@/components/JsonLd";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post || post.status !== "PUBLISHED") return {};
  const s = await getSiteSettings();
  const title = post.metaTitle || post.title;
  const description = post.metaDesc || post.excerpt;
  const url = `${s.url}/blog/${post.slug}`;

  return {
    title,
    description,
    keywords: post.keywords || undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : undefined,
      publishedTime: post.publishedAt?.toISOString(),
      authors: post.author ? [post.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post || post.status !== "PUBLISHED") notFound();
  const s = await getSiteSettings();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDesc || post.excerpt,
    image: post.coverImage || undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: post.author || s.name },
    publisher: { "@type": "Organization", name: s.name, url: s.url },
    mainEntityOfPage: `${s.url}/blog/${post.slug}`,
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <article className="py-12">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <nav className="mb-6 text-sm text-slate-500">
              <Link href="/" className="hover:text-brand-700">หน้าแรก</Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-brand-700">บทความ</Link>
              <span className="mx-2">/</span>
              <span className="text-slate-700">{post.title}</span>
            </nav>

            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl leading-tight">
              {post.title}
            </h1>

            <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
              {post.author && <span>โดย {post.author}</span>}
              {post.publishedAt && (
                <span>{new Date(post.publishedAt).toLocaleDateString("th-TH", { dateStyle: "long" })}</span>
              )}
            </div>

            {post.coverImage && (
              <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
                <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
              </div>
            )}

            <div
              className="prose prose-slate mt-8 max-w-none prose-headings:font-bold prose-a:text-brand-700 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
            />

            <div className="mt-12 border-t border-slate-200 pt-8">
              <Link href="/blog" className="text-sm text-brand-700 hover:underline">
                ← กลับไปหน้าบทความทั้งหมด
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

function renderContent(content: string) {
  // Simple markdown-like rendering (paragraphs + headings + bold + links)
  return content
    .split("\n\n")
    .map((block) => {
      if (block.startsWith("### ")) return `<h3>${block.slice(4)}</h3>`;
      if (block.startsWith("## ")) return `<h2>${block.slice(3)}</h2>`;
      if (block.startsWith("# ")) return `<h1>${block.slice(2)}</h1>`;
      if (block.startsWith("- ")) {
        const items = block.split("\n").map((l) => `<li>${l.slice(2)}</li>`).join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${block.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");
}
