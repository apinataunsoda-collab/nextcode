import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readSessionFromCookies } from "@/lib/auth";
import { ensureSettingsRow, getSiteSettings } from "@/lib/settings";

export const runtime = "nodejs";

export async function GET() {
  const session = readSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureSettingsRow();
  return NextResponse.json(await getSiteSettings());
}

export async function PUT(req: NextRequest) {
  const session = readSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  await ensureSettingsRow();

  const data: any = {};
  const str = (k: string) => {
    if (typeof body[k] === "string") data[k] = body[k].trim();
  };

  [
    "name",
    "tagline",
    "description",
    "url",
    "address",
    "phone",
    "mobile",
    "email",
    "lineId",
    "facebook",
    "instagram",
    "tiktok",
    "youtube",
    "logoUrl",
    "faviconUrl",
    "footerText",
  ].forEach(str);

  if (Array.isArray(body.nav)) {
    const cleaned = body.nav
      .filter(
        (x: any) =>
          x &&
          typeof x.label === "string" &&
          typeof x.href === "string" &&
          x.label.trim() &&
          x.href.trim(),
      )
      .slice(0, 12)
      .map((x: any) => ({ label: x.label.trim(), href: x.href.trim() }));
    data.navJson = JSON.stringify(cleaned);
  }

  const updated = await prisma.siteSetting.update({
    where: { id: 1 },
    data,
  });

  return NextResponse.json({ ok: true, updatedAt: updated.updatedAt });
}
