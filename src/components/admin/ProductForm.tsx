"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

type Category = { id: string; name: string; slug: string };
type AddOn = { id: string; code: string; label: string; price: number };

export type ProductFormValue = {
  id?: string;
  name: string;
  slug: string;
  image: string;
  basePrice: number;
  serviceType: string;
  shortDescription: string;
  isActive: boolean;
  categoryId: string;
  features: string[];
  tags: string[];
  addOnIds: string[];
};

const empty: ProductFormValue = {
  name: "",
  slug: "",
  image: "",
  basePrice: 0,
  serviceType: "ออกแบบ + ส่งมอบ",
  shortDescription: "",
  isActive: true,
  categoryId: "",
  features: [],
  tags: [],
  addOnIds: [],
};

export default function ProductForm({
  categories,
  addOns,
  product,
}: {
  categories: Category[];
  addOns: AddOn[];
  product?: ProductFormValue;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormValue>(
    product ?? { ...empty, categoryId: categories[0]?.id ?? "" },
  );
  const [featureInput, setFeatureInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof ProductFormValue>(k: K, v: ProductFormValue[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const toggleAddOn = (id: string) =>
    setForm((s) => ({
      ...s,
      addOnIds: s.addOnIds.includes(id)
        ? s.addOnIds.filter((x) => x !== id)
        : [...s.addOnIds, id],
    }));

  const addFeature = () => {
    const v = featureInput.trim();
    if (!v) return;
    update("features", [...form.features, v]);
    setFeatureInput("");
  };

  const removeFeature = (i: number) =>
    update(
      "features",
      form.features.filter((_, idx) => idx !== i),
    );

  const addTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    if (form.tags.includes(v)) return;
    update("tags", [...form.tags, v]);
    setTagInput("");
  };

  const removeTag = (t: string) =>
    update("tags", form.tags.filter((x) => x !== t));

  const onUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "อัปโหลดล้มเหลว");
      update("image", data.url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const url = product?.id ? `/api/products/${product.id}` : "/api/products";
      const method = product?.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "บันทึกไม่สำเร็จ");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!product?.id) return;
    if (!confirm("ลบสินค้านี้?")) return;
    await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <Card title="ข้อมูลสินค้า">
          <Field label="ชื่อสินค้า" required>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
              className="input"
            />
          </Field>
          <Field label="Slug (ใช้ใน URL)" required hint="เช่น restaurant, factory">
            <input
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              required
              className="input"
            />
          </Field>
          <Field label="คำอธิบายสั้น">
            <textarea
              value={form.shortDescription}
              onChange={(e) => update("shortDescription", e.target.value)}
              rows={3}
              className="input"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="หมวดหมู่" required>
              <select
                value={form.categoryId}
                onChange={(e) => update("categoryId", e.target.value)}
                required
                className="input"
              >
                <option value="">— เลือก —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="ประเภทบริการ">
              <input
                value={form.serviceType}
                onChange={(e) => update("serviceType", e.target.value)}
                className="input"
              />
            </Field>
          </div>
          <Field label="ราคาฐาน (บาท)" required>
            <input
              type="number"
              min={0}
              value={form.basePrice}
              onChange={(e) => update("basePrice", Number(e.target.value))}
              required
              className="input"
            />
          </Field>
        </Card>

        <Card title="ฟีเจอร์ (Features)">
          <div className="flex gap-2">
            <input
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
              placeholder="เช่น ระบบจองโต๊ะออนไลน์"
              className="input flex-1"
            />
            <button type="button" onClick={addFeature} className="btn-ghost">
              เพิ่ม
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {form.features.map((f, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
              >
                <span>✓ {f}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  className="text-xs text-red-600 hover:underline"
                >
                  ลบ
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="แท็ก (Tags) สำหรับฟิลเตอร์">
          <p className="-mt-2 mb-2 text-xs text-slate-500">
            เช่น "ระบบจอง", "B2B", "ตะกร้าสินค้า" — ลูกค้าจะใช้ค้นหา/กรองในหน้าแคตตาล็อก
          </p>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="พิมพ์แล้วกด Enter"
              className="input flex-1"
            />
            <button type="button" onClick={addTag} className="btn-ghost">
              เพิ่ม
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {form.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
              >
                #{t}
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  className="text-slate-400 hover:text-red-600"
                  aria-label={`ลบแท็ก ${t}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card title="รูปภาพ">
          {form.image ? (
            <img
              src={form.image}
              alt="preview"
              className="aspect-[4/3] w-full rounded-xl border border-slate-200 object-cover"
            />
          ) : (
            <div className="grid aspect-[4/3] w-full place-items-center rounded-xl border border-dashed border-slate-300 text-sm text-slate-400">
              ยังไม่มีรูป
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
            }}
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="btn-ghost flex-1"
            >
              {uploading ? "กำลังอัปโหลด..." : "อัปโหลดรูป"}
            </button>
            {form.image && (
              <button
                type="button"
                onClick={() => update("image", "")}
                className="btn-ghost"
              >
                ลบ
              </button>
            )}
          </div>
          <input
            value={form.image}
            onChange={(e) => update("image", e.target.value)}
            placeholder="หรือวางลิงก์ URL"
            className="input mt-2 text-xs"
          />
        </Card>

        <Card title="บริการเสริมที่ใช้ได้">
          <div className="space-y-2">
            {addOns.map((a) => (
              <label
                key={a.id}
                className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={form.addOnIds.includes(a.id)}
                  onChange={() => toggleAddOn(a.id)}
                  className="mt-1"
                />
                <div className="flex-1 text-sm">
                  <div className="font-medium">{a.label}</div>
                  <div className="text-xs text-slate-500">+{a.price.toLocaleString()} บาท</div>
                </div>
              </label>
            ))}
          </div>
        </Card>

        <Card title="สถานะ">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => update("isActive", e.target.checked)}
            />
            เปิดขายสินค้านี้
          </label>
        </Card>
      </div>

      <div className="lg:col-span-3">
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "กำลังบันทึก..." : product?.id ? "บันทึกการแก้ไข" : "สร้างสินค้า"}
          </button>
          {product?.id && (
            <button
              type="button"
              onClick={remove}
              className="text-sm text-red-600 hover:underline"
            >
              ลบสินค้า
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(226 232 240);
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: rgb(47 137 255);
          box-shadow: 0 0 0 3px rgb(217 236 255);
        }
      `}</style>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">{title}</h3>
      <div className="space-y-4">{children}</div>
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
