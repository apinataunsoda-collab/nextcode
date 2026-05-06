"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { formatTHB } from "@/lib/money";
import { trackFormSubmit } from "@/lib/analytics";

type Props = {
  title?: string;
  subtitle?: string;
  defaultMessage?: string;
  totalPreview?: number;
  productSlug?: string;
  productName?: string;
  addOnCodes?: string[];
};

type FormState = {
  name: string;
  phone: string;
  email: string;
  message: string;
  /** honeypot: ต้องเว้นว่าง ถ้าถูกกรอก = bot */
  website: string;
};

const initial: FormState = { name: "", phone: "", email: "", message: "", website: "" };

export default function ContactForm({
  title = "รับคำปรึกษาและประเมินราคาฟรี",
  subtitle = "กรอกข้อมูลสั้น ๆ เจ้าหน้าที่จะติดต่อกลับภายใน 24 ชั่วโมง ไม่มีค่าใช้จ่าย",
  defaultMessage,
  totalPreview,
  productSlug,
  productName,
  addOnCodes = [],
}: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ ...initial, message: defaultMessage ?? "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((s) => ({ ...s, [key]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // validation เบื้องต้นก่อนส่ง
    if (!form.name.trim() || !form.phone.trim()) {
      setError("กรุณากรอกชื่อและเบอร์โทร");
      return;
    }

    try {
      setSubmitting(true);

      // ยิง event ก่อนส่ง (เผื่อ ad-blocker บล็อคหลัง redirect ก็ยังมี trail)
      trackFormSubmit({
        productSlug,
        productName,
        addOnCount: addOnCodes.length,
        totalPrice: totalPreview ?? 0,
      });

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          message: form.message,
          website: form.website, // honeypot
          productSlug,
          addOnCodes,
          totalPrice: totalPreview ?? 0,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "ส่งไม่สำเร็จ กรุณาลองใหม่");

      // redirect ไป Thank You page ส่ง context สำหรับ Conversion event
      const params = new URLSearchParams({
        id: String(data.leadId ?? ""),
        total: String(data.total ?? totalPreview ?? 0),
      });
      if (productSlug) params.set("product", productSlug);
      if (productName) params.set("productName", productName);
      router.push(`/thank-you?${params.toString()}`);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16">
      <div className="container-page">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-10">
          <div className="mb-6 text-center">
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{subtitle}</p>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
            {/* Honeypot — ซ่อนจากผู้ใช้จริงด้วย CSS */}
            <div aria-hidden className="hidden">
              <label>
                Website
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={onChange("website")}
                />
              </label>
            </div>

            <Field
              label="ชื่อ-นามสกุล"
              required
              value={form.name}
              onChange={onChange("name")}
              placeholder="เช่น สมชาย ใจดี"
              autoComplete="name"
            />
            <Field
              label="เบอร์โทร"
              required
              type="tel"
              value={form.phone}
              onChange={onChange("phone")}
              placeholder="08x-xxx-xxxx"
              autoComplete="tel"
            />
            <Field
              className="sm:col-span-2"
              label="อีเมล"
              type="email"
              value={form.email}
              onChange={onChange("email")}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                ข้อความเพิ่มเติม
              </label>
              <textarea
                rows={4}
                value={form.message}
                onChange={onChange("message")}
                placeholder="บอกรายละเอียดธุรกิจ / งบประมาณของคุณ"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
                {error}
              </p>
            )}

            <div className="flex flex-col items-start justify-between gap-3 sm:col-span-2 sm:flex-row sm:items-center">
              {typeof totalPreview === "number" && totalPreview > 0 ? (
                <p className="text-sm text-slate-500">
                  ยอดรวมจากแพ็กเกจที่เลือก:{" "}
                  <span className="font-semibold text-brand-700">
                    {formatTHB(totalPreview)}
                  </span>
                </p>
              ) : (
                <span />
              )}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full disabled:opacity-60 sm:w-auto"
              >
                {submitting ? "กำลังส่ง..." : "ส่งข้อมูลให้เจ้าหน้าที่ติดต่อกลับ"}
              </button>
            </div>

            <p className="text-xs text-slate-400 sm:col-span-2">
              เมื่อคุณกดส่ง แสดงว่ายอมรับให้เราติดต่อกลับเพื่อเสนอแพ็กเกจตามข้อมูลที่ให้ไว้
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  className = "",
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; required?: boolean }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...rest}
        required={required}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
    </div>
  );
}
