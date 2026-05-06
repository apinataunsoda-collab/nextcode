"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { NavItem, SiteSettings } from "@/lib/settings";

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [form, setForm] = useState<SiteSettings>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) =>
    setForm((s) => ({ ...s, [k]: v }));
  const setSocial = (k: keyof SiteSettings["social"], v: string) =>
    setForm((s) => ({ ...s, social: { ...s.social, [k]: v } }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setSaving(true);
    try {
      const body = {
        ...form,
        facebook: form.social.facebook,
        instagram: form.social.instagram,
        tiktok: form.social.tiktok,
        youtube: form.social.youtube,
      };
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "บันทึกไม่สำเร็จ");
      setMsg({ kind: "ok", text: "บันทึกเรียบร้อย" });
      router.refresh();
    } catch (e: any) {
      setMsg({ kind: "err", text: e.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* General */}
      <Card title="ข้อมูลทั่วไป" description="ชื่อเว็บ / tagline ที่โชว์ในหน้าแรก, OG และอีเมล">
        <Field label="ชื่อเว็บ / บริษัท" required>
          <input className="input" required value={form.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Tagline">
          <input className="input" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </Field>
        <Field label="คำอธิบายสั้น (ใช้ทำ SEO/OG)">
          <textarea rows={3} className="input" value={form.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Field label="Site URL" hint="เช่น https://nextcode.co.th — ใช้ใน canonical / sitemap">
          <input className="input" value={form.url} onChange={(e) => set("url", e.target.value)} />
        </Field>
      </Card>

      {/* Contact */}
      <Card title="ข้อมูลติดต่อ" description="แสดงใน Footer, หน้าขอบคุณ, และอีเมลอัตโนมัติ">
        <Field label="ที่อยู่">
          <textarea rows={2} className="input" value={form.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="เบอร์สำนักงาน">
            <input className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="เบอร์มือถือ">
            <input className="input" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="อีเมลติดต่อ">
            <input className="input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="LINE ID">
            <input className="input" value={form.lineId} onChange={(e) => set("lineId", e.target.value)} />
          </Field>
        </div>
      </Card>

      {/* Social */}
      <Card title="Social Media" description="ใส่ URL เต็ม เว้นว่างถ้าไม่มี">
        <Field label="Facebook URL">
          <input className="input" value={form.social.facebook} onChange={(e) => setSocial("facebook", e.target.value)} />
        </Field>
        <Field label="Instagram URL">
          <input className="input" value={form.social.instagram} onChange={(e) => setSocial("instagram", e.target.value)} />
        </Field>
        <Field label="TikTok URL">
          <input className="input" value={form.social.tiktok} onChange={(e) => setSocial("tiktok", e.target.value)} />
        </Field>
        <Field label="YouTube URL">
          <input className="input" value={form.social.youtube} onChange={(e) => setSocial("youtube", e.target.value)} />
        </Field>
      </Card>

      {/* Branding */}
      <Card title="แบรนด์ / โลโก้" description="โลโก้และ Favicon — ใช้ทั่วเว็บ + ในอีเมล + OG">
        <div className="grid gap-6 sm:grid-cols-2">
          <ImageField
            label="โลโก้"
            value={form.logoUrl}
            onChange={(v) => set("logoUrl", v)}
            hint="แนะนำ PNG โปร่ง ความสูง ~ 80-120px"
          />
          <ImageField
            label="Favicon"
            value={form.faviconUrl}
            onChange={(v) => set("faviconUrl", v)}
            hint="ควรเป็น .ico / .png 32x32 หรือ 64x64"
          />
        </div>
      </Card>

      {/* Footer */}
      <Card title="Footer" description="ข้อความที่แสดงมุมซ้ายของ Footer (รองรับหลายบรรทัด)">
        <Field label="ข้อความ Footer">
          <textarea
            rows={4}
            className="input"
            placeholder="เช่น ชื่อบริษัท เลขประจำตัวผู้เสียภาษี หรือข้อมูลอื่นๆ"
            value={form.footerText}
            onChange={(e) => set("footerText", e.target.value)}
          />
        </Field>
      </Card>

      {/* Navigation */}
      <Card title="เมนูหลัก (Header)" description="ลำดับและชื่อเมนูที่โชว์บน Header">
        <NavEditor nav={form.nav} onChange={(v) => set("nav", v)} />
      </Card>

      {/* Actions */}
      <div className="sticky bottom-4 z-10 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
        </button>
        {msg && (
          <span
            className={`rounded-xl px-3 py-1.5 text-sm ${
              msg.kind === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {msg.text}
          </span>
        )}
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(226 232 240);
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          outline: none;
          background: white;
        }
        .input:focus {
          border-color: rgb(47 137 255);
          box-shadow: 0 0 0 3px rgb(217 236 255);
        }
      `}</style>
    </form>
  );
}

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {description && <p className="mb-4 mt-1 text-xs text-slate-500">{description}</p>}
      <div className="mt-2 space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

function ImageField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const upload = async (file: File) => {
    setBusy(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "อัปโหลดล้มเหลว");
      onChange(d.url);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <div className="flex items-start gap-4">
        <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={label} className="h-full w-full object-contain" />
          ) : (
            <span className="text-xs text-slate-400">ไม่มีรูป</span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            ref={ref}
            type="file"
            accept="image/*,.ico"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
            }}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => ref.current?.click()}
              disabled={busy}
              className="btn-ghost text-xs"
            >
              {busy ? "กำลังอัปโหลด..." : "อัปโหลด"}
            </button>
            {value && (
              <button type="button" onClick={() => onChange("")} className="btn-ghost text-xs">
                ลบ
              </button>
            )}
          </div>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="หรือวาง URL"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-brand-500"
          />
          {hint && <p className="text-xs text-slate-500">{hint}</p>}
          {err && <p className="text-xs text-red-600">{err}</p>}
        </div>
      </div>
    </div>
  );
}

function NavEditor({
  nav,
  onChange,
}: {
  nav: NavItem[];
  onChange: (v: NavItem[]) => void;
}) {
  const update = (i: number, patch: Partial<NavItem>) =>
    onChange(nav.map((n, idx) => (idx === i ? { ...n, ...patch } : n)));
  const remove = (i: number) => onChange(nav.filter((_, idx) => idx !== i));
  const add = () => onChange([...nav, { label: "เมนูใหม่", href: "/" }]);
  const move = (i: number, delta: number) => {
    const next = [...nav];
    const to = i + delta;
    if (to < 0 || to >= next.length) return;
    [next[i], next[to]] = [next[to], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {nav.length === 0 && (
        <p className="text-sm text-slate-500">ยังไม่มีเมนู — กด "เพิ่มเมนู" เพื่อสร้าง</p>
      )}
      {nav.map((item, i) => (
        <div key={i} className="flex items-center gap-2 rounded-xl border border-slate-200 p-2">
          <span className="w-6 text-center text-xs text-slate-400">{i + 1}</span>
          <input
            value={item.label}
            onChange={(e) => update(i, { label: e.target.value })}
            placeholder="ชื่อเมนู"
            className="flex-1 rounded-lg border border-transparent px-2 py-1 text-sm hover:border-slate-200 focus:border-brand-500 focus:outline-none"
          />
          <input
            value={item.href}
            onChange={(e) => update(i, { href: e.target.value })}
            placeholder="/path หรือ #section"
            className="flex-1 rounded-lg border border-transparent px-2 py-1 font-mono text-sm hover:border-slate-200 focus:border-brand-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => move(i, -1)}
            className="px-1.5 text-slate-500 hover:text-brand-700"
            aria-label="ขึ้น"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => move(i, 1)}
            className="px-1.5 text-slate-500 hover:text-brand-700"
            aria-label="ลง"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => remove(i)}
            className="px-1.5 text-xs text-red-600 hover:underline"
          >
            ลบ
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="btn-ghost text-xs">
        + เพิ่มเมนู
      </button>
    </div>
  );
}
