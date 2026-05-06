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

// PUT /api/admin/users/:id — แก้ไข user
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const caller = await getCallerUser();
  if (!caller || !hasPermission(caller.role, caller.permissions, "users", "edit")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const target = await prisma.adminUser.findUnique({ where: { id: params.id } });
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // ห้าม non-owner แก้ owner
  if (target.role === "owner" && caller.role !== "owner") {
    return NextResponse.json({ error: "ไม่สามารถแก้ไข Owner ได้" }, { status: 403 });
  }

  const body = await req.json();
  const data: any = {};

  if (body.name !== undefined) data.name = body.name;
  if (body.email !== undefined) data.email = body.email;
  if (body.role !== undefined) {
    if (body.role === "owner" && caller.role !== "owner") {
      return NextResponse.json({ error: "เฉพาะ Owner เท่านั้นที่ตั้ง Owner ได้" }, { status: 403 });
    }
    data.role = body.role;
  }
  if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);
  if (body.permissions !== undefined) {
    data.permissions = JSON.stringify(
      Array.isArray(body.permissions) ? body.permissions : [],
    );
  }
  if (body.password && body.password.length >= 6) {
    data.passwordHash = hashPassword(body.password);
  }

  const updated = await prisma.adminUser.update({
    where: { id: params.id },
    data,
    select: { id: true, email: true, name: true, role: true, isActive: true, permissions: true },
  });

  return NextResponse.json(updated);
}

// DELETE /api/admin/users/:id
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const caller = await getCallerUser();
  if (!caller || !hasPermission(caller.role, caller.permissions, "users", "edit")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (params.id === caller.id) {
    return NextResponse.json({ error: "ไม่สามารถลบตัวเองได้" }, { status: 400 });
  }

  const target = await prisma.adminUser.findUnique({ where: { id: params.id } });
  if (target?.role === "owner" && caller.role !== "owner") {
    return NextResponse.json({ error: "ไม่สามารถลบ Owner ได้" }, { status: 403 });
  }

  await prisma.adminUser.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
