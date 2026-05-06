// ตัวช่วย shared สำหรับ email templates
// เก็บ style inline เพื่อให้ Gmail / Outlook render ได้ดี

import type { SiteSettings } from "@/lib/settings";
import { formatTHB } from "@/lib/money";

export type EmailLead = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  productName?: string | null;
  productSlug?: string | null;
  addOns: { label: string; price: number }[];
  totalPrice: number;
  createdAt: Date;
};

export const brand = {
  primary: "#1b6cf5",
  primaryDark: "#1757db",
  text: "#0f172a",
  muted: "#64748b",
  border: "#e2e8f0",
  bg: "#f8fafc",
  white: "#ffffff",
};

export function layout(
  opts: { preview: string; title: string; children: string },
  s: SiteSettings,
) {
  const logo = s.logoUrl
    ? `<img src="${escapeHtml(s.logoUrl)}" alt="${escapeHtml(s.name)}" height="28" style="display:inline-block;vertical-align:middle;margin-right:8px;max-height:28px;"/>`
    : `<span style="display:inline-block;width:28px;height:28px;line-height:28px;background:${brand.primary};color:${brand.white};border-radius:8px;text-align:center;margin-right:8px;">${escapeHtml((s.name || "N").charAt(0))}</span>`;

  return `<!doctype html>
<html lang="th">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(opts.title)}</title>
  </head>
  <body style="margin:0;padding:0;background:${brand.bg};font-family:'Helvetica Neue',Helvetica,Arial,'Noto Sans Thai',sans-serif;color:${brand.text};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(opts.preview)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${brand.bg};">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${brand.white};border:1px solid ${brand.border};border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:20px 28px;border-bottom:1px solid ${brand.border};">
                <table role="presentation" width="100%"><tr>
                  <td style="font-weight:700;font-size:18px;color:${brand.text};">
                    ${logo}${escapeHtml(s.name)}
                  </td>
                  <td align="right" style="font-size:12px;color:${brand.muted};">${escapeHtml(s.tagline)}</td>
                </tr></table>
              </td>
            </tr>
            <tr><td style="padding:28px;">${opts.children}</td></tr>
            <tr>
              <td style="padding:20px 28px;border-top:1px solid ${brand.border};font-size:12px;color:${brand.muted};">
                ${escapeHtml(s.name)}${s.address ? ` · ${escapeHtml(s.address)}` : ""}<br/>
                ${s.mobile ? `โทร ${escapeHtml(s.mobile)}` : ""}${s.email ? ` · อีเมล <a href="mailto:${escapeHtml(s.email)}" style="color:${brand.primary};text-decoration:none;">${escapeHtml(s.email)}</a>` : ""}
              </td>
            </tr>
          </table>
          <p style="font-size:11px;color:${brand.muted};margin:12px 0 0;">
            © ${new Date().getFullYear()} ${escapeHtml(s.name)}. สงวนลิขสิทธิ์.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function button(label: string, href: string) {
  return `<a href="${href}" style="display:inline-block;background:${brand.primary};color:${brand.white};text-decoration:none;font-weight:600;padding:12px 20px;border-radius:999px;">${escapeHtml(label)}</a>`;
}

export function addOnsTable(addOns: EmailLead["addOns"]) {
  if (!addOns.length) return "";
  const rows = addOns
    .map(
      (a) => `
      <tr>
        <td style="padding:8px 0;color:${brand.text};">• ${escapeHtml(a.label)}</td>
        <td align="right" style="padding:8px 0;color:${brand.text};white-space:nowrap;">+ ${formatTHB(a.price)}</td>
      </tr>`,
    )
    .join("");
  return `
    <table role="presentation" width="100%" style="border-top:1px solid ${brand.border};margin-top:8px;font-size:14px;">
      ${rows}
    </table>`;
}

export function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function plainTextFromLead(l: EmailLead, title: string) {
  const lines = [
    title,
    "",
    `ชื่อ: ${l.name}`,
    `เบอร์: ${l.phone}`,
    l.email ? `อีเมล: ${l.email}` : null,
    l.productName ? `แพ็กเกจ: ${l.productName}` : null,
    l.addOns.length
      ? `บริการเสริม:\n${l.addOns.map((a) => `  • ${a.label} (${formatTHB(a.price)})`).join("\n")}`
      : null,
    `ยอดรวม: ${formatTHB(l.totalPrice)}`,
    l.message ? `ข้อความ: ${l.message}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}
