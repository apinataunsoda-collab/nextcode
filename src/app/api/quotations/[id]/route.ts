import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readSessionFromCookies } from "@/lib/auth";

export const runtime = "nodejs";

// GET /api/quotations/:id — public (ลูกค้าเปิดดูได้)
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const q = await prisma.quotation.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!q) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(q);
}

// PATCH /api/quotations/:id — admin update status
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = readSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data: any = {};
  if (body.status) {
    data.status = body.status;
    if (body.status === "SENT") data.sentAt = new Date();
  }

  const q = await prisma.quotation.update({ where: { id: params.id }, data });
  return NextResponse.json(q);
}

// DELETE /api/quotations/:id — admin
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = readSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.quotation.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
