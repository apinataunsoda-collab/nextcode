import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readSessionFromCookies } from "@/lib/auth";

export const runtime = "nodejs";

// GET /api/quotations — admin list
export async function GET() {
  const session = readSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const quotations = await prisma.quotation.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, lead: true },
  });
  return NextResponse.json(quotations);
}

// POST /api/quotations — สร้างใบเสนอราคาใหม่
export async function POST(req: NextRequest) {
  const session = readSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    leadId,
    customerName,
    customerPhone,
    customerEmail,
    companyName,
    notes,
    terms,
    items = [],
    discount = 0,
    includeVat = false,
    validDays = 30,
  } = body;

  if (!customerName || !customerPhone || !items.length) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลลูกค้าและรายการอย่างน้อย 1 รายการ" }, { status: 400 });
  }

  // สร้างเลขที่ใบเสนอราคา
  const year = new Date().getFullYear();
  const count = await prisma.quotation.count({
    where: { number: { startsWith: `QT-${year}` } },
  });
  const number = `QT-${year}-${String(count + 1).padStart(4, "0")}`;

  // คำนวณยอด
  const parsedItems = (items as any[]).map((item) => ({
    description: String(item.description || ""),
    quantity: Number(item.quantity) || 1,
    unitPrice: Number(item.unitPrice) || 0,
    total: (Number(item.quantity) || 1) * (Number(item.unitPrice) || 0),
  }));

  const subtotal = parsedItems.reduce((s, i) => s + i.total, 0);
  const afterDiscount = subtotal - Number(discount);
  const vat = includeVat ? Math.round(afterDiscount * 0.07) : 0;
  const total = afterDiscount + vat;

  const quotation = await prisma.quotation.create({
    data: {
      number,
      leadId: leadId || null,
      customerName,
      customerPhone,
      customerEmail: customerEmail || null,
      companyName: companyName || null,
      notes: notes || null,
      terms: terms || null,
      validDays: Number(validDays) || 30,
      discount: Number(discount),
      includeVat,
      subtotal,
      vat,
      total,
      items: { create: parsedItems },
    },
    include: { items: true },
  });

  return NextResponse.json(quotation, { status: 201 });
}
