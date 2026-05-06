// ชั้นส่งอีเมลกลาง (Resend)
// - ถ้าไม่มี RESEND_API_KEY → log ลง console แทน (dev ใช้งานได้)
// - ถ้าส่งล้มเหลว throw เพื่อให้ Promise.allSettled จับได้

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string | string[];
  from?: string;
};

export async function sendEmail(args: SendArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  const defaultFrom =
    process.env.NOTIFY_EMAIL_FROM ||
    "NextCode <no-reply@nextcode.co.th>";

  if (!apiKey) {
    console.info("[mailer] RESEND_API_KEY not set — printing email instead", {
      to: args.to,
      subject: args.subject,
      replyTo: args.replyTo,
    });
    return { skipped: true };
  }

  const body = {
    from: args.from || defaultFrom,
    to: Array.isArray(args.to) ? args.to : [args.to],
    subject: args.subject,
    html: args.html,
    text: args.text,
    reply_to: args.replyTo,
  };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Resend failed ${res.status}: ${t}`);
  }
  return (await res.json()) as { id: string };
}

export function splitEmailList(input?: string | null) {
  if (!input) return [];
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
