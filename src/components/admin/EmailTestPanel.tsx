"use client";

import { useState } from "react";

type Which = "user" | "admin";

export default function EmailTestPanel() {
  const [which, setWhich] = useState<Which>("user");
  const [to, setTo] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const send = async () => {
    setMsg(null);
    if (!to) {
      setMsg({ kind: "err", text: "กรุณาใส่อีเมลปลายทาง" });
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/admin/email-test", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: which, to }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ส่งไม่สำเร็จ");
      setMsg({ kind: "ok", text: `ส่งสำเร็จไปที่ ${to}` });
    } catch (e: any) {
      setMsg({ kind: "err", text: e.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2 space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900">ส่งทดสอบ</h3>

        <div className="flex gap-2">
          <button
            onClick={() => setWhich("user")}
            className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition ${
              which === "user"
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-slate-200 text-slate-600 hover:border-brand-300"
            }`}
          >
            ให้ลูกค้า (ขอบคุณ)
          </button>
          <button
            onClick={() => setWhich("admin")}
            className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition ${
              which === "admin"
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-slate-200 text-slate-600 hover:border-brand-300"
            }`}
          >
            ให้ทีม (Lead ใหม่)
          </button>
        </div>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">ส่งไปที่</span>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>

        <button onClick={send} disabled={sending} className="btn-primary w-full disabled:opacity-60">
          {sending ? "กำลังส่ง..." : "ส่งอีเมลทดสอบ"}
        </button>

        {msg && (
          <p
            className={`rounded-xl px-3 py-2 text-sm ${
              msg.kind === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {msg.text}
          </p>
        )}

        <p className="text-xs text-slate-500">
          หมายเหตุ: ถ้ายังไม่ได้ตั้ง <code>RESEND_API_KEY</code> ปุ่มนี้จะไม่ส่งจริง —
          แต่เทมเพลตจะถูก log ลง console แทน
        </p>
      </div>

      <div className="lg:col-span-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm text-slate-500">
          <span>พรีวิวเทมเพลต: {which === "user" ? "ให้ลูกค้า" : "ให้ทีม"}</span>
          <a
            href={`/api/admin/email-preview?type=${which}`}
            target="_blank"
            rel="noreferrer"
            className="text-brand-700 hover:underline"
          >
            เปิดในแท็บใหม่ ↗
          </a>
        </div>
        <iframe
          key={which}
          src={`/api/admin/email-preview?type=${which}`}
          className="h-[640px] w-full"
          title="Email preview"
        />
      </div>
    </div>
  );
}
