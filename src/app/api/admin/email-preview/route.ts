import { NextRequest, NextResponse } from "next/server";
import { readSessionFromCookies } from "@/lib/auth";
import { buildUserAutoReply } from "@/emails/userAutoReply";
import { buildAdminNotification } from "@/emails/adminNotification";
import { getSiteSettings } from "@/lib/settings";
import type { EmailLead } from "@/emails/shared";

export const runtime = "nodejs";

const sample: EmailLead = {
  id: "sample-123",
  name: "สมชาย ใจดี",
  phone: "081-234-5678",
  email: "somchai@example.com",
  message: "สนใจทำเว็บร้านกาแฟ งบประมาณ 15,000 บาท",
  productName: "เว็บไซต์ร้านอาหาร",
  productSlug: "restaurant",
  addOns: [
    { label: "จดโดเมน .com / .co.th", price: 1290 },
    { label: "บริการ SEO On-Page ด้วย AI", price: 4900 },
  ],
  totalPrice: 14090,
  createdAt: new Date(),
};

export async function GET(req: NextRequest) {
  const session = readSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const which = req.nextUrl.searchParams.get("type") || "user";
  const s = await getSiteSettings();
  const tpl =
    which === "admin"
      ? buildAdminNotification(sample, s)
      : buildUserAutoReply(sample, s);

  return new NextResponse(tpl.html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
