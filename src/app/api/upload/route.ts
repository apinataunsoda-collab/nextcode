import { NextRequest, NextResponse } from "next/server";
import { readSessionFromCookies } from "@/lib/auth";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = readSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = path.extname(file.name).toLowerCase() || ".bin";
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: "ชนิดไฟล์ไม่รองรับ" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "ไฟล์ใหญ่เกิน 5MB" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, name), buf);

  return NextResponse.json({ url: `/uploads/${name}` });
}
