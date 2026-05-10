import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogEditor from "@/components/admin/BlogEditor";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">แก้ไขบทความ</h1>
      <BlogEditor post={post} />
    </div>
  );
}
