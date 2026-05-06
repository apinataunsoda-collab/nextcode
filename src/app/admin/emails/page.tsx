import EmailTestPanel from "@/components/admin/EmailTestPanel";

export const dynamic = "force-dynamic";

export default function AdminEmailsPage() {
  const hasResend = Boolean(process.env.RESEND_API_KEY);
  const notifyTo = process.env.NOTIFY_EMAIL_TO || "";
  const from = process.env.NOTIFY_EMAIL_FROM || "";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Email Auto-Reply</h1>
        <p className="mt-1 text-sm text-slate-500">
          ทดสอบเทมเพลตอีเมลที่ส่งให้ลูกค้า (ขอบคุณ) และที่แจ้งทีม (Lead ใหม่)
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Status ok={hasResend} label="Resend API Key" value={hasResend ? "ตั้งค่าแล้ว" : "ยังไม่ได้ตั้ง"} />
        <Status
          ok={Boolean(notifyTo)}
          label="อีเมลรับแจ้งทีม (NOTIFY_EMAIL_TO)"
          value={notifyTo || "—"}
        />
        <Status ok={Boolean(from)} label="ส่งจาก (NOTIFY_EMAIL_FROM)" value={from || "—"} />
      </div>

      <EmailTestPanel />

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <h3 className="mb-2 font-semibold text-slate-900">วิธีตั้งค่า</h3>
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            สมัคร <a className="text-brand-700 hover:underline" href="https://resend.com" target="_blank" rel="noreferrer">Resend</a> และยืนยันโดเมน (เช่น nextcode.co.th)
          </li>
          <li>ตั้ง <code className="rounded bg-slate-100 px-1">RESEND_API_KEY</code> ใน <code className="rounded bg-slate-100 px-1">.env</code></li>
          <li>
            ตั้ง <code className="rounded bg-slate-100 px-1">NOTIFY_EMAIL_TO</code> เป็นอีเมลของทีม (หลายคนคั่นด้วย ,) และ
            <code className="rounded bg-slate-100 px-1"> NOTIFY_EMAIL_FROM</code> เป็น <em>"Display Name &lt;email@domain&gt;"</em>
          </li>
          <li>restart server → ทดสอบส่งในหน้านี้</li>
        </ol>
      </div>
    </div>
  );
}

function Status({ ok, label, value }: { ok: boolean; label: string; value: string }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        ok ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"
      }`}
    >
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );
}
