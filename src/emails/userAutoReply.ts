import { formatTHB } from "@/lib/money";
import type { SiteSettings } from "@/lib/settings";
import { brand, button, addOnsTable, layout, escapeHtml, plainTextFromLead, type EmailLead } from "./shared";

export function buildUserAutoReply(lead: EmailLead, s: SiteSettings) {
  const serviceName = lead.productName || "รับทำเว็บไซต์";
  const subject = `ขอบคุณสำหรับความสนใจใน ${serviceName} | ${s.name}`;
  const preview = `เราได้รับข้อมูลของคุณแล้ว ทีมงานจะติดต่อกลับภายใน 24 ชม.`;

  const callNumber = s.mobile || s.phone || "";

  const html = layout(
    {
      preview,
      title: subject,
      children: `
      <h1 style="font-size:22px;margin:0 0 6px;color:${brand.text};">
        ขอบคุณที่สนใจ คุณ${escapeHtml(lead.name)} 🙌
      </h1>
      <p style="margin:0 0 14px;color:${brand.muted};line-height:1.6;">
        เราได้รับข้อมูลความสนใจในบริการ
        <strong style="color:${brand.text};">${escapeHtml(serviceName)}</strong>
        เรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับภายใน <strong>24 ชั่วโมง</strong>
        ทางเบอร์ที่คุณให้ไว้ (${escapeHtml(lead.phone)})
      </p>

      <div style="background:${brand.bg};border:1px solid ${brand.border};border-radius:12px;padding:16px 18px;margin:16px 0;">
        <div style="font-size:12px;color:${brand.muted};">สรุปแพ็กเกจที่คุณเลือก</div>
        <div style="font-size:16px;font-weight:600;margin-top:4px;color:${brand.text};">
          ${escapeHtml(serviceName)}
        </div>
        ${addOnsTable(lead.addOns)}
        <table role="presentation" width="100%" style="margin-top:12px;border-top:1px solid ${brand.border};padding-top:10px;">
          <tr>
            <td style="color:${brand.muted};font-size:14px;">ยอดรวมโดยประมาณ</td>
            <td align="right" style="font-weight:700;color:${brand.text};font-size:18px;">
              ${formatTHB(lead.totalPrice)}
            </td>
          </tr>
        </table>
        <p style="font-size:11px;color:${brand.muted};margin:10px 0 0;">
          * ยอดนี้เป็นราคาเริ่มต้น ทีมงานจะยืนยันใบเสนอราคาฉบับจริงอีกครั้ง
        </p>
      </div>

      <p style="color:${brand.muted};line-height:1.6;margin:16px 0;">ระหว่างรอ คุณสามารถเริ่มเตรียม:</p>
      <ul style="color:${brand.text};line-height:1.7;margin:0 0 16px 18px;padding:0;">
        <li>เนื้อหา / ข้อความที่อยากขึ้นหน้าแรก</li>
        <li>โลโก้ และรูปภาพที่ต้องการใช้ (ถ้ามี)</li>
        <li>เว็บไซต์ตัวอย่างที่ชอบ 1-3 เว็บ</li>
      </ul>

      ${
        callNumber
          ? `<div style="margin-top:20px;text-align:center;">
               ${button(`📞 โทรหาเรา ${callNumber}`, `tel:${callNumber}`)}
             </div>`
          : ""
      }
      ${
        s.lineId
          ? `<p style="text-align:center;font-size:12px;color:${brand.muted};margin-top:12px;">
               หรือแอดไลน์: <strong>${escapeHtml(s.lineId)}</strong>
             </p>`
          : ""
      }

      <p style="font-size:12px;color:${brand.muted};margin-top:24px;">
        หมายเลขอ้างอิง: <code style="background:${brand.bg};padding:2px 6px;border-radius:4px;">${escapeHtml(lead.id)}</code>
      </p>
    `,
    },
    s,
  );

  const text = [
    `สวัสดีคุณ${lead.name},`,
    "",
    `เราได้รับข้อมูลความสนใจในบริการ "${serviceName}" เรียบร้อยแล้ว`,
    `เจ้าหน้าที่จะติดต่อกลับภายใน 24 ชม. ทางเบอร์ ${lead.phone}`,
    "",
    plainTextFromLead(lead, "สรุปแพ็กเกจ:"),
    "",
    callNumber ? `ติดต่อด่วน: ${callNumber}` : null,
    s.lineId ? `LINE: ${s.lineId}` : null,
    "",
    `หมายเลขอ้างอิง: ${lead.id}`,
    `-- ${s.name}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}
