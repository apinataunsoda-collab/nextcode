import { NextRequest, NextResponse } from "next/server";
import { readSessionFromCookies } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = readSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const allowed = ["jpg", "jpeg", "png", "webp", "gif", "svg", "ico"];
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: "ชนิดไฟล์ไม่รองรับ" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "ไฟล์ใหญ่เกิน 5MB" }, { status: 400 });
  }

  // ใช้ Vercel Blob ถ้ามี BLOB_READ_WRITE_TOKEN
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`uploads/${Date.now()}.${ext}`, file, {
      access: "public",
    });
    return NextResponse.json({ url: blob.url });
  }

  // Fallback: เขียนลง filesystem (dev only)
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const crypto = await import("node:crypto");

  const buf = Buffer.from(await file.arrayBuffer());
  const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, name), buf);

  return NextResponse.json({ url: `/uploads/${name}` });
}
