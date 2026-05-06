import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readSessionFromCookies } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = readSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true, addOns: true },
  });

  const headers = [
    "createdAt",
    "name",
    "phone",
    "email",
    "status",
    "product",
    "addOns",
    "totalPrice",
    "message",
  ];

  const rows = leads.map((l) => [
    l.createdAt.toISOString(),
    l.name,
    l.phone,
    l.email ?? "",
    l.status,
    l.product?.name ?? "",
    l.addOns.map((a) => `${a.label} (${a.priceAtTime})`).join(" | "),
    String(l.totalPrice),
    (l.message ?? "").replace(/\r?\n/g, " "),
  ]);

  const csv =
    headers.join(",") +
    "\n" +
    rows.map((r) => r.map(csvCell).join(",")).join("\n");

  return new NextResponse("\uFEFF" + csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

function csvCell(v: string) {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}
