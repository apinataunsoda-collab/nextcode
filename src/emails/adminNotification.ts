import { formatTHB } from "@/lib/money";
import type { SiteSettings } from "@/lib/settings";
import { brand, addOnsTable, layout, escapeHtml, plainTextFromLead, type EmailLead } from "./shared";

export function buildAdminNotification(lead: EmailLead, s: SiteSettings) {
  const serviceName = lead.productName || "บริการทั่วไป";
  const subject = `🎯 Lead ใหม่: ${lead.name} (${serviceName}) · ${formatTHB(lead.totalPrice)}`;
  const preview = `${lead.name} · ${lead.phone} · ${serviceName} · ${formatTHB(lead.totalPrice)}`;

  const telHref = `tel:${lead.phone.replace(/[^+0-9]/g, "")}`;
  const adminUrl = `${s.url.replace(/\/$/, "")}/admin/leads`;

  const html = layout(
    {
      preview,
      title: subject,
      children: `
      <div style="background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;font-size:12px;font-weight:600;padding:8px 12px;border-radius:999px;display:inline-block;margin-bottom:12px;">
        🎯 Lead ใหม่
      </div>
      <h1 style="font-size:22px;margin:0 0 6px;color:${brand.text};">
        ${escapeHtml(lead.name)}
      </h1>
      <p style="margin:0 0 16px;color:${brand.muted};">
        สนใจ <strong style="color:${brand.text};">${escapeHtml(serviceName)}</strong> ·
        ยอดรวม <strong style="color:${brand.primary};">${formatTHB(lead.totalPrice)}</strong>
      </p>

      <table role="presentation" width="100%" style="background:${brand.bg};border:1px solid ${brand.border};border-radius:12px;padding:16px;font-size:14px;">
        <tr>
          <td width="120" style="color:${brand.muted};padding:6px 0;">เบอร์โทร</td>
          <td style="padding:6px 0;"><a href="${telHref}" style="color:${brand.primary};text-decoration:none;font-weight:600;">${escapeHtml(lead.phone)}</a></td>
        </tr>
        ${
          lead.email
            ? `<tr>
                 <td style="color:${brand.muted};padding:6px 0;">อีเมล</td>
                 <td style="padding:6px 0;"><a href="mailto:${escapeHtml(lead.email)}" style="color:${brand.primary};text-decoration:none;">${escapeHtml(lead.email)}</a></td>
               </tr>`
            : ""
        }
        <tr>
          <td style="color:${brand.muted};padding:6px 0;">แพ็กเกจ</td>
          <td style="padding:6px 0;">${escapeHtml(serviceName)}</td>
        </tr>
        <tr>
          <td style="color:${brand.muted};padding:6px 0;vertical-align:top;">บริการเสริม</td>
          <td style="padding:6px 0;">
            ${
              lead.addOns.length
                ? addOnsTable(lead.addOns)
                : `<span style="color:${brand.muted};">— ไม่มี —</span>`
            }
          </td>
        </tr>
        <tr>
          <td style="color:${brand.muted};padding:6px 0;">ยอดรวม</td>
          <td style="padding:6px 0;font-weight:700;">${formatTHB(lead.totalPrice)}</td>
        </tr>
        ${
          lead.message
            ? `<tr>
                 <td style="color:${brand.muted};padding:6px 0;vertical-align:top;">ข้อความ</td>
                 <td style="padding:6px 0;white-space:pre-line;">${escapeHtml(lead.message)}</td>
               </tr>`
            : ""
        }
        <tr>
          <td style="color:${brand.muted};padding:6px 0;">เวลา</td>
          <td style="padding:6px 0;">${escapeHtml(lead.createdAt.toLocaleString("th-TH"))}</td>
        </tr>
      </table>

      <div style="margin-top:20px;">
        <a href="${telHref}" style="display:inline-block;background:${brand.primary};color:${brand.white};text-decoration:none;font-weight:600;padding:12px 20px;border-radius:999px;margin-right:8px;">
          📞 โทรกลับ ${escapeHtml(lead.phone)}
        </a>
        <a href="${adminUrl}" style="display:inline-block;border:1px solid ${brand.border};color:${brand.text};text-decoration:none;font-weight:600;padding:12px 20px;border-radius:999px;">
          เปิดใน Admin →
        </a>
      </div>

      <p style="font-size:11px;color:${brand.muted};margin-top:24px;">
        Lead ID: <code style="background:${brand.bg};padding:2px 6px;border-radius:4px;">${escapeHtml(lead.id)}</code>
      </p>
    `,
    },
    s,
  );

  const text = plainTextFromLead(lead, subject);
  return { subject, html, text };
}
