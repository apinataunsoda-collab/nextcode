import { NextRequest, NextResponse } from "next/server";
import { readSessionFromCookies } from "@/lib/auth";
import { buildUserAutoReply } from "@/emails/userAutoReply";
import { buildAdminNotification } from "@/emails/adminNotification";
import { getSiteSettings } from "@/lib/settings";
import { sendEmail } from "@/lib/mailer";
import type { EmailLead } from "@/emails/shared";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = readSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type, to } = (await req.json()) as { type: "user" | "admin"; to: string };
  if (!to) return NextResponse.json({ error: "กรุณาใส่อีเมลปลายทาง" }, { status: 400 });

  const sample: EmailLead = {
    id: "test-" + Math.random().toString(36).slice(2, 8),
    name: "ทดสอบระบบ",
    phone: "081-234-5678",
    email: to,
    message: "นี่คืออีเมลทดสอบระบบ Auto-Reply",
    productName: "เว็บไซต์ร้านอาหาร",
    productSlug: "restaurant",
    addOns: [
      { label: "จดโดเมน .com / .co.th", price: 1290 },
      { label: "บริการ SEO On-Page ด้วย AI", price: 4900 },
    ],
    totalPrice: 14090,
    createdAt: new Date(),
  };

  const s = await getSiteSettings();
  const tpl =
    type === "admin"
      ? buildAdminNotification(sample, s)
      : buildUserAutoReply(sample, s);

  try {
    const res = await sendEmail({
      to,
      subject: `[ทดสอบ] ${tpl.subject}`,
      html: tpl.html,
      text: tpl.text,
    });
    return NextResponse.json({ ok: true, result: res });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "ส่งไม่สำเร็จ" }, { status: 500 });
  }
}
