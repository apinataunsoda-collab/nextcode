import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readSessionFromCookies } from "@/lib/auth";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const session = readSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, slug, demoUrl } = await req.json();
  if (!name || !slug) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const cat = await prisma.category.create({ data: { name, slug, demoUrl: demoUrl || "" } });
  return NextResponse.json(cat, { status: 201 });
}
