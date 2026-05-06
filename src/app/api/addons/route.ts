import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readSessionFromCookies } from "@/lib/auth";

export async function GET() {
  const addOns = await prisma.addOn.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(addOns);
}

export async function POST(req: NextRequest) {
  const session = readSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { code, label, description, price, isActive = true } = body;

  if (!code || !label || price == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const addOn = await prisma.addOn.create({
    data: { code, label, description, price: Number(price), isActive },
  });
  return NextResponse.json(addOn, { status: 201 });
}
