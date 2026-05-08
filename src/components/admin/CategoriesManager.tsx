"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  slug: string;
  demoUrl: string;
  productCount: number;
};

export default function CategoriesManager({ initial }: { initial: Category[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial);
  const [form, setForm] = useState({ name: "", slug: "", demoUrl: "" });
  const [error, setError] = useState<string | null>(null);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.slug) {
      setError("กรุณากรอกชื่อและ slug");
      return;
    }
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "สร้างไม่สำเร็จ");
      return;
    }
    const created = await res.json();
    setCategories((s) => [...s, { ...created, demoUrl: form.demoUrl, productCount: 0 }]);
    setForm({ name: "", slug: "", demoUrl: "" });
    router.refresh();
  };

  const updateDemoUrl = async (id: string, demoUrl: string) => {
    setCategories((s) => s.map((c) => (c.id === id ? { ...c, demoUrl } : c)));
    await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ demoUrl }),
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* List */}
      <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold">รายการหมวดหมู่</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs text-slate-500">
              <tr>
                <th className="pb-2 pr-2">ชื่อ</th>
                <th className="pb-2 pr-2">Slug</th>
                <th className="pb-2 pr-2">สินค้า</th>
                <th className="pb-2 pr-2">Demo URL</th>
                <th className="pb-2">ตัวอย่าง</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="py-3 pr-2 font-medium">{c.name}</td>
                  <td className="py-3 pr-2 font-mono text-xs text-slate-500">{c.slug}</td>
                  <td className="py-3 pr-2 text-slate-600">{c.productCount}</td>
                  <td className="py-3 pr-2">
                    <input
                      defaultValue={c.demoUrl}
                      onBlur={(e) => {
                        if (e.target.value !== c.demoUrl) {
                          updateDemoUrl(c.id, e.target.value);
                        }
                      }}
                      placeholder="เช่น /demo/restaurant"
                      className="w-full rounded-lg border border-transparent px-2 py-1 text-xs hover:border-slate-200 focus:border-brand-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-3">
                    {c.demoUrl ? (
                      <Link
                        href={c.demoUrl}
                        target="_blank"
                        className="text-xs text-brand-700 hover:underline"
                      >
                        ดูตัวอย่าง ↗
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-400">ยังไม่มี</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Create form */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold">เพิ่มหมวดหมู่ใหม่</h3>
        <form onSubmit={create} className="space-y-3 text-sm">
          <input
            required
            placeholder="ชื่อหมวดหมู่ (เช่น ร้านอาหาร / คาเฟ่)"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
          />
          <input
            required
            placeholder="Slug (เช่น restaurant)"
            value={form.slug}
            onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
          />
          <input
            placeholder="Demo URL (เช่น /demo/restaurant) — เว้นว่างถ้ายังไม่มี"
            value={form.demoUrl}
            onChange={(e) => setForm((s) => ({ ...s, demoUrl: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
          />
          <p className="text-xs text-slate-500">
            ถ้าใส่ Demo URL → ลูกค้าจะเห็นปุ่ม "ดูตัวอย่างเว็บจริง" ในหน้าสินค้า<br/>
            ถ้าเว้นว่าง → ปุ่มจะไม่แสดง
          </p>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button type="submit" className="btn-primary w-full">
            เพิ่มหมวดหมู่
          </button>
        </form>
      </section>
    </div>
  );
}
