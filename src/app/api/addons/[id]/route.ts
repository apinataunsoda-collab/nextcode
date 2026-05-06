import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readSessionFromCookies } from "@/lib/auth";

function requireAuth() {
  const s = readSessionFromCookies();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = requireAuth();
  if (unauth) return unauth;

  const body = await req.json();
  const data: any = {};
  (["code", "label", "description", "isActive"] as const).forEach((k) => {
    if (body[k] !== undefined) data[k] = body[k];
  });
  if (body.price !== undefined) data.price = Number(body.price);

  const addOn = await prisma.addOn.update({ where: { id: params.id }, data });
  return NextResponse.json(addOn);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const unauth = requireAuth();
  if (unauth) return unauth;

  await prisma.addOn.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
