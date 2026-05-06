import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "กรุณากรอกอีเมลและรหัสผ่าน" }, { status: 400 });
  }

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
  }

  const token = createSessionToken(user.email);
  setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
