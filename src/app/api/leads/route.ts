import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readSessionFromCookies } from "@/lib/auth";
import { leadSchema } from "@/lib/validators";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { fanOutLead } from "@/lib/notifications";

export const runtime = "nodejs";

// POST /api/leads — ฟอร์มหน้าบ้าน (public)
export async function POST(req: NextRequest) {
  // 1) Rate limit ตาม IP
  const ip = getClientIp(req);
  const rl = checkRateLimit(`lead:${ip}`);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "ส่งคำขอบ่อยเกินไป กรุณาลองใหม่ในอีกสักครู่" },
      { status: 429 },
    );
  }

  // 2) Parse + validate
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "รูปแบบข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message || "ข้อมูลไม่ถูกต้อง", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { name, phone, email, message, productSlug, addOnCodes, totalPrice } = parsed.data;

  // 3) resolve product + add-ons จาก DB (กันฝั่ง client ส่งข้อมูลมั่ว)
  const product = productSlug
    ? await prisma.product.findUnique({ where: { slug: productSlug } })
    : null;

  const addOns = addOnCodes.length
    ? await prisma.addOn.findMany({ where: { code: { in: addOnCodes } } })
    : [];

  // คำนวณยอดใหม่ฝั่งเซิร์ฟเวอร์ เพื่อเทียบกับ totalPrice ที่ client ส่งมา
  const serverTotal =
    (product?.basePrice ?? 0) + addOns.reduce((s, a) => s + a.price, 0);
  const finalTotal = serverTotal > 0 ? serverTotal : Number(totalPrice) || 0;

  // 4) บันทึกลง DB (ของเดิม + snapshot add-on)
  const lead = await prisma.lead.create({
    data: {
      name,
      phone,
      email: email ?? null,
      message: message ?? null,
      totalPrice: finalTotal,
      productId: product?.id ?? null,
      addOns: {
        create: addOns.map((a) => ({
          addOnId: a.id,
          priceAtTime: a.price,
          label: a.label,
        })),
      },
    },
  });

  // 5) กระจายข้อมูลออกไประบบภายนอก (best-effort ไม่ block เคสที่ user มอง)
  fanOutLead({
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    message: lead.message,
    productName: product?.name ?? null,
    productSlug: product?.slug ?? null,
    addOns: addOns.map((a) => ({ label: a.label, price: a.price })),
    totalPrice: finalTotal,
    createdAt: lead.createdAt,
  }).catch((e) => console.error("[fanOutLead]", e));

  return NextResponse.json(
    {
      ok: true,
      leadId: lead.id,
      total: finalTotal,
      message: "ขอบคุณที่สนใจ เราจะติดต่อกลับโดยเร็วที่สุด",
    },
    { status: 201 },
  );
}

// GET /api/leads — admin only
export async function GET() {
  const session = readSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true, addOns: true },
  });
  return NextResponse.json(leads);
}
