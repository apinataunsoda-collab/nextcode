import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readSessionFromCookies } from "@/lib/auth";

function requireAuth() {
  const s = readSessionFromCookies();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = requireAuth();
  if (unauth) return unauth;
  const { status } = await req.json();
  const lead = await prisma.lead.update({ where: { id: params.id }, data: { status } });
  return NextResponse.json(lead);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = requireAuth();
  if (unauth) return unauth;
  await prisma.lead.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
