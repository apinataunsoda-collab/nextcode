import { formatTHB } from "./money";
import { sendEmail, splitEmailList } from "./mailer";
import { buildUserAutoReply } from "@/emails/userAutoReply";
import { buildAdminNotification } from "@/emails/adminNotification";
import { getSiteSettings } from "@/lib/settings";
import type { EmailLead } from "@/emails/shared";

export type LeadNotification = EmailLead;

function buildPlainText(l: LeadNotification) {
  const lines = [
    "🎯 มี Lead ใหม่!",
    `ชื่อ: ${l.name}`,
    `เบอร์: ${l.phone}`,
    l.email ? `อีเมล: ${l.email}` : null,
    l.productName ? `แพ็กเกจ: ${l.productName}` : null,
    l.addOns.length
      ? `บริการเสริม:\n${l.addOns.map((a) => `  • ${a.label} (${formatTHB(a.price)})`).join("\n")}`
      : null,
    `ยอดรวม: ${formatTHB(l.totalPrice)}`,
    l.message ? `ข้อความ: ${l.message}` : null,
    `เวลา: ${l.createdAt.toLocaleString("th-TH")}`,
  ].filter(Boolean);
  return lines.join("\n");
}

/** ส่งข้อมูล Lead ไประบบภายนอกทั้งหมดแบบ best-effort (fail แยกกัน ไม่กระทบ DB) */
export async function fanOutLead(lead: LeadNotification) {
  const text = buildPlainText(lead);
  const s = await getSiteSettings();
  const tasks: Promise<unknown>[] = [];

  if (process.env.LINE_NOTIFY_TOKEN) tasks.push(sendLineNotify(text));
  if (process.env.DISCORD_WEBHOOK_URL) tasks.push(sendDiscord(text));
  if (process.env.SLACK_WEBHOOK_URL) tasks.push(sendSlack(text));
  if (process.env.GOOGLE_SHEET_WEBHOOK_URL) tasks.push(sendGoogleSheet(lead));

  // === Auto-reply emails ===
  const adminTo = splitEmailList(process.env.NOTIFY_EMAIL_TO);
  if (adminTo.length) tasks.push(sendAdminEmail(lead, adminTo, s));
  if (lead.email) tasks.push(sendUserAutoReply(lead, s));

  const results = await Promise.allSettled(tasks);
  const failed = results
    .map((r, i) => ({ r, i }))
    .filter((x) => x.r.status === "rejected");
  if (failed.length) {
    console.warn(
      "[notifications] some integrations failed:",
      failed.map((f) => (f.r as PromiseRejectedResult).reason),
    );
  }
}

async function sendLineNotify(message: string) {
  const token = process.env.LINE_NOTIFY_TOKEN!;
  const body = new URLSearchParams({ message: "\n" + message });
  const res = await fetch("https://notify-api.line.me/api/notify", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) throw new Error(`LINE Notify failed: ${res.status}`);
}

async function sendDiscord(message: string) {
  const url = process.env.DISCORD_WEBHOOK_URL!;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ content: "```" + message + "```" }),
  });
  if (!res.ok) throw new Error(`Discord failed: ${res.status}`);
}

async function sendSlack(message: string) {
  const url = process.env.SLACK_WEBHOOK_URL!;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: message }),
  });
  if (!res.ok) throw new Error(`Slack failed: ${res.status}`);
}

async function sendGoogleSheet(lead: LeadNotification) {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL!;
  const secret = process.env.GOOGLE_SHEET_WEBHOOK_SECRET || "";
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      secret,
      createdAt: lead.createdAt.toISOString(),
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email ?? "",
      productName: lead.productName ?? "",
      productSlug: lead.productSlug ?? "",
      addOns: lead.addOns.map((a) => a.label).join(" | "),
      addOnsPrice: lead.addOns.reduce((s, a) => s + a.price, 0),
      totalPrice: lead.totalPrice,
      message: lead.message ?? "",
    }),
  });
  if (!res.ok) throw new Error(`Google Sheet webhook failed: ${res.status}`);
}

async function sendAdminEmail(
  lead: LeadNotification,
  to: string[],
  s: Awaited<ReturnType<typeof getSiteSettings>>,
) {
  const { subject, html, text } = buildAdminNotification(lead, s);
  await sendEmail({
    to,
    subject,
    html,
    text,
    replyTo: lead.email ?? undefined,
  });
}

async function sendUserAutoReply(
  lead: LeadNotification,
  s: Awaited<ReturnType<typeof getSiteSettings>>,
) {
  if (!lead.email) return;
  const { subject, html, text } = buildUserAutoReply(lead, s);
  await sendEmail({
    to: lead.email,
    subject,
    html,
    text,
    replyTo: process.env.NOTIFY_EMAIL_TO
      ? splitEmailList(process.env.NOTIFY_EMAIL_TO)
      : s.email || undefined,
  });
}
