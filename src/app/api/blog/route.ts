import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readSessionFromCookies } from "@/lib/auth";

export const runtime = "nodejs";

// GET /api/blog — public (published only) or admin (all)
export async function GET(req: NextRequest) {
  const session = readSessionFromCookies();
  const isAdmin = Boolean(session);
  const all = req.nextUrl.searchParams.get("all") === "1";

  const posts = await prisma.blogPost.findMany({
    where: isAdmin && all ? {} : { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
      status: true,
      author: true,
      publishedAt: true,
      createdAt: true,
    },
  });
  return NextResponse.json(posts);
}

// POST /api/blog — admin create
export async function POST(req: NextRequest) {
  const session = readSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { slug, title, excerpt, content, coverImage, metaTitle, metaDesc, keywords, author, status } = body;

  if (!slug || !title) {
    return NextResponse.json({ error: "กรุณากรอก slug และ title" }, { status: 400 });
  }

  const post = await prisma.blogPost.create({
    data: {
      slug,
      title,
      excerpt: excerpt || "",
      content: content || "",
      coverImage: coverImage || "",
      metaTitle: metaTitle || "",
      metaDesc: metaDesc || "",
      keywords: keywords || "",
      author: author || "",
      status: status || "DRAFT",
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });
  return NextResponse.json(post, { status: 201 });
}
