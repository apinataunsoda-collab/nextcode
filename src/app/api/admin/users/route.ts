import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readSessionFromCookies, hashPassword } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";

export const runtime = "nodejs";

async function getCallerUser() {
  const session = readSessionFromCookies();
  if (!session) return null;
  return prisma.adminUser.findUnique({ where: { email: session.email } });
}

// GET /api/admin/users
export async function GET() {
  const caller = await getCallerUser();
  if (!caller || !hasPermission(caller.role, caller.permissions, "users", "view")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      permissions: true,
      isActive: true,
      createdAt: true,
    },
  });
  return NextResponse.json(users);
}

// POST /api/admin/users — สร้าง user ใหม่
export async function POST(req: NextRequest) {
  const caller = await getCallerUser();
  if (!caller || !hasPermission(caller.role, caller.permissions, "users", "edit")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { email, password, name, role = "viewer" } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "กรุณากรอกอีเมลและรหัสผ่าน" }, { status: 400 });
  }

  const exists = await prisma.adminUser.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "อีเมลนี้มีในระบบแล้ว" }, { status: 400 });
  }

  // ห้าม non-owner สร้าง owner
  if (role === "owner" && caller.role !== "owner") {
    return NextResponse.json({ error: "เฉพาะ Owner เท่านั้นที่สร้าง Owner ได้" }, { status: 403 });
  }

  const user = await prisma.adminUser.create({
    data: {
      email,
      passwordHash: hashPassword(password),
      name: name || null,
      role,
    },
    select: { id: true, email: true, name: true, role: true, isActive: true },
  });

  return NextResponse.json(user, { status: 201 });
}
